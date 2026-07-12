import cors from "cors";
import crypto from "node:crypto";
import express from "express";
import helmet from "helmet";
import "dotenv/config";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { z } from "zod";
import { closePool, query, withTransaction } from "./db.js";
import { runBonusCalculation } from "./bonusEngine.js";
import { periodFromDate } from "./mlmRules.js";

const app = express();
const port = Number(process.env.PORT || 8080);
const corsOrigin = process.env.CORS_ORIGIN || "*";
const authSecret = process.env.AUTH_SECRET || "change-this-secret-before-production";
const tokenTtlSeconds = Number(process.env.AUTH_TOKEN_TTL_SECONDS || 60 * 60 * 12);
const allowDevOperatorHeader = process.env.DEV_ALLOW_OPERATOR_HEADER === "true" || process.env.NODE_ENV !== "production";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const frontendDir = path.resolve(__dirname, "../..");

function validateProductionEnv() {
  if (process.env.NODE_ENV !== "production") return;
  const forbiddenSecrets = new Set([
    "change-this-secret-before-production",
    "change_this_to_a_long_random_secret_before_public_access",
    "isi_rahasia_panjang",
    ""
  ]);
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL must be set in production");
  if (forbiddenSecrets.has(authSecret) || authSecret.length < 32) {
    throw new Error("AUTH_SECRET must be a unique random string with at least 32 characters in production");
  }
  if (corsOrigin === "*" || !corsOrigin.startsWith("https://")) {
    throw new Error("CORS_ORIGIN must be your HTTPS domain in production");
  }
  if (process.env.DEV_ALLOW_OPERATOR_HEADER === "true") {
    throw new Error("DEV_ALLOW_OPERATOR_HEADER must be false in production");
  }
}

validateProductionEnv();

app.use(helmet());
app.use(cors({ origin: corsOrigin }));
app.use(express.json({ limit: "1mb" }));

function asyncRoute(handler) {
  return (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next);
}

function pageLimit(value, fallback = 50, max = 200) {
  const parsed = Number(value || fallback);
  if (!Number.isFinite(parsed) || parsed < 1) return fallback;
  return Math.min(Math.floor(parsed), max);
}

function base64Url(input) {
  return Buffer.from(input).toString("base64url");
}

function signToken(payload) {
  const body = {
    ...payload,
    exp: Math.floor(Date.now() / 1000) + tokenTtlSeconds
  };
  const encoded = base64Url(JSON.stringify(body));
  const signature = crypto.createHmac("sha256", authSecret).update(encoded).digest("base64url");
  return `${encoded}.${signature}`;
}

function verifyToken(token) {
  const [encoded, signature] = String(token || "").split(".");
  if (!encoded || !signature) return null;
  const expected = crypto.createHmac("sha256", authSecret).update(encoded).digest("base64url");
  if (Buffer.byteLength(signature) !== Buffer.byteLength(expected)) return null;
  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return null;
  const payload = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8"));
  if (!payload.exp || payload.exp < Math.floor(Date.now() / 1000)) return null;
  return payload;
}

function requireOperator(req, res, next) {
  const bearer = String(req.header("authorization") || "").match(/^Bearer\s+(.+)$/i);
  const auth = bearer ? verifyToken(bearer[1]) : null;
  if (auth) {
    req.auth = auth;
    req.operatorId = auth.id;
    req.operatorRole = auth.role;
    return next();
  }

  const operatorId = req.header("x-operator-id");
  if (allowDevOperatorHeader && operatorId) {
    req.operatorId = operatorId;
    req.operatorRole = "development";
    return next();
  }
  return res.status(401).json({ error: "Login required" });
}

function memberAccessWhere(req, alias = "m", params = []) {
  const where = [];
  if (req.operatorRole === "branch" && req.auth?.area && req.auth.area !== "Semua Indonesia") {
    params.push(req.auth.area);
    where.push(`exists (select 1 from stockists s where s.id = ${alias}.stockist_id and s.area = $${params.length})`);
  }
  if (req.operatorRole === "stockist") {
    params.push(req.operatorId);
    where.push(`${alias}.stockist_id = $${params.length}`);
  }
  if (req.operatorRole === "member") {
    params.push(req.operatorId);
    where.push(`${alias}.id = $${params.length}`);
  }
  return { where, params };
}

function requireRole(req, roles) {
  if (!roles.includes(req.operatorRole)) {
    throw Object.assign(new Error("Forbidden"), { status: 403 });
  }
}

function stockistAccessWhere(req, alias = "s", params = []) {
  const where = [];
  if (req.operatorRole === "branch" && req.auth?.area && req.auth.area !== "Semua Indonesia") {
    params.push(req.auth.area);
    where.push(`${alias}.area = $${params.length}`);
  }
  if (req.operatorRole === "stockist") {
    params.push(req.operatorId);
    where.push(`${alias}.id = $${params.length}`);
  }
  return { where, params };
}

app.get("/healthz", (_req, res) => {
  res.json({ ok: true, service: "ascendia-backend" });
});

app.get("/health", asyncRoute(async (_req, res) => {
  const result = await query("select now() as now");
  res.json({ ok: true, databaseTime: result.rows[0].now });
}));

const loginSchema = z.object({
  loginId: z.string().min(2).max(64),
  password: z.string().min(1).max(200)
});

async function findLoginAccount(loginId, password) {
  const admin = await query(
    `
      select id, name, role, area
      from admins
      where lower(id) = lower($1) and password_hash = crypt($2, password_hash)
    `,
    [loginId, password]
  );
  if (admin.rowCount) {
    const row = admin.rows[0];
    return {
      id: row.id,
      name: row.name,
      role: row.role === "Admin Cabang" ? "branch" : "admin",
      area: row.area
    };
  }

  const stockist = await query(
    `
      select id, name, area, district
      from stockists
      where lower(id) = lower($1) and password_hash = crypt($2, password_hash)
    `,
    [loginId, password]
  );
  if (stockist.rowCount) {
    const row = stockist.rows[0];
    return {
      id: row.id,
      name: row.name,
      role: "stockist",
      area: row.area,
      district: row.district
    };
  }

  const member = await query(
    `
      select id, name, rank_name, stockist_id
      from members
      where lower(id) = lower($1) and password_hash = crypt($2, password_hash)
    `,
    [loginId, password]
  );
  if (member.rowCount) {
    const row = member.rows[0];
    return {
      id: row.id,
      name: row.name,
      role: "member",
      rank: row.rank_name,
      stockistId: row.stockist_id
    };
  }

  return null;
}

app.post("/api/auth/login", asyncRoute(async (req, res) => {
  const input = loginSchema.parse(req.body);
  const account = await findLoginAccount(input.loginId.trim(), input.password);
  if (!account) return res.status(401).json({ error: "Login ID atau sandi salah" });
  const token = signToken({
    id: account.id,
    role: account.role,
    name: account.name,
    area: account.area || "",
    district: account.district || "",
    stockistId: account.stockistId || ""
  });
  res.json({
    token,
    tokenType: "Bearer",
    expiresIn: tokenTtlSeconds,
    user: account
  });
}));

app.get("/api/auth/me", requireOperator, asyncRoute(async (req, res) => {
  res.json({ user: req.auth || { id: req.operatorId, role: req.operatorRole } });
}));

app.get("/api/members", requireOperator, asyncRoute(async (req, res) => {
  const limit = pageLimit(req.query.limit);
  const cursor = String(req.query.cursor || "");
  const search = String(req.query.q || "").trim();
  const params = [];
  const where = ["m.active = true"];

  if (cursor) {
    params.push(cursor);
    where.push(`m.id > $${params.length}`);
  }
  if (search) {
    params.push(`%${search.toLowerCase()}%`);
    where.push(`(lower(m.id) like $${params.length} or lower(m.name) like $${params.length} or lower(m.rank_name) like $${params.length})`);
  }
  if (req.operatorRole === "branch" && req.auth?.area && req.auth.area !== "Semua Indonesia") {
    params.push(req.auth.area);
    where.push(`exists (select 1 from stockists s where s.id = m.stockist_id and s.area = $${params.length})`);
  }
  if (req.operatorRole === "stockist") {
    params.push(req.operatorId);
    where.push(`m.stockist_id = $${params.length}`);
  }
  if (req.operatorRole === "member") {
    params.push(req.operatorId);
    where.push(`m.id = $${params.length}`);
  }

  params.push(limit + 1);
  const result = await query(
    `
      select m.id, m.name, m.rank_name, m.sponsor_id, m.placement_parent_id, m.placement_side,
             m.stockist_id, m.joined_at, pm.ppv, pm.appv, pm.tnpv, pm.atnpv, pm.gpv,
             (select count(*)::int from members child where child.sponsor_id = m.id and child.active = true) as sponsor_child_count,
             (select count(*)::int from members child where child.placement_parent_id = m.id and child.active = true) as placement_child_count
      from members m
      left join member_period_metrics pm on pm.member_id = m.id and pm.period_key = $${params.length + 1}
      ${where.length ? `where ${where.join(" and ")}` : ""}
      order by m.id
      limit $${params.length}
    `,
    [...params, String(req.query.period || "")]
  );

  const rows = result.rows.slice(0, limit);
  res.json({
    data: rows,
    nextCursor: result.rows.length > limit ? rows.at(-1)?.id : null
  });
}));

app.get("/api/members/:id", requireOperator, asyncRoute(async (req, res) => {
  const params = [req.params.id];
  const access = memberAccessWhere(req, "m", params);
  params.push(String(req.query.period || ""));
  const periodIndex = params.length;
  const result = await query(
    `
      select m.*, s.name as stockist_name, pm.ppv, pm.appv, pm.tnpv, pm.atnpv, pm.gpv,
             (select count(*)::int from members child where child.sponsor_id = m.id and child.active = true) as sponsor_child_count,
             (select count(*)::int from members child where child.placement_parent_id = m.id and child.active = true) as placement_child_count
      from members m
      left join stockists s on s.id = m.stockist_id
      left join member_period_metrics pm on pm.member_id = m.id and pm.period_key = $${periodIndex}
      where m.id = $1 and m.active = true ${access.where.length ? `and ${access.where.join(" and ")}` : ""}
    `,
    params
  );
  if (!result.rowCount) return res.status(404).json({ error: "Member not found" });
  res.json(result.rows[0]);
}));

app.get("/api/members/:id/sponsor-children", requireOperator, asyncRoute(async (req, res) => {
  const limit = pageLimit(req.query.limit, 100, 500);
  const params = [req.params.id];
  const where = ["m.sponsor_id = $1", "m.active = true"];
  if (req.operatorRole === "branch" && req.auth?.area && req.auth.area !== "Semua Indonesia") {
    params.push(req.auth.area);
    where.push(`exists (select 1 from stockists s where s.id = m.stockist_id and s.area = $${params.length})`);
  }
  if (req.operatorRole === "stockist") {
    params.push(req.operatorId);
    where.push(`m.stockist_id = $${params.length}`);
  }
  if (req.operatorRole === "member") {
    params.push(req.operatorId);
    where.push(`
      exists (
        with recursive visible(id) as (
          select $${params.length}::text
          union all
          select child.id from members child join visible v on child.sponsor_id = v.id where child.active = true
        )
        select 1 from visible v where v.id = $1
      )
    `);
  }
  params.push(String(req.query.period || ""));
  const periodIndex = params.length;
  params.push(limit);
  const limitIndex = params.length;
  const result = await query(
    `
      select m.id, m.name, m.rank_name, m.sponsor_id, m.stockist_id, m.joined_at,
             pm.ppv, pm.appv, pm.tnpv, pm.atnpv, pm.gpv,
             (select count(*)::int from members child where child.sponsor_id = m.id and child.active = true) as sponsor_child_count,
             (select count(*)::int from members child where child.placement_parent_id = m.id and child.active = true) as placement_child_count
      from members m
      left join member_period_metrics pm on pm.member_id = m.id and pm.period_key = $${periodIndex}
      where ${where.join(" and ")}
      order by m.joined_at, m.id
      limit $${limitIndex}
    `,
    params
  );
  res.json({ data: result.rows });
}));

app.get("/api/members/:id/placement-children", requireOperator, asyncRoute(async (req, res) => {
  const params = [req.params.id];
  const where = ["m.placement_parent_id = $1", "m.active = true"];
  if (req.operatorRole === "branch" && req.auth?.area && req.auth.area !== "Semua Indonesia") {
    params.push(req.auth.area);
    where.push(`exists (select 1 from stockists s where s.id = m.stockist_id and s.area = $${params.length})`);
  }
  if (req.operatorRole === "stockist") {
    params.push(req.operatorId);
    where.push(`m.stockist_id = $${params.length}`);
  }
  if (req.operatorRole === "member") {
    params.push(req.operatorId);
    where.push(`
      exists (
        with recursive visible(id) as (
          select $${params.length}::text
          union all
          select child.id from members child join visible v on child.placement_parent_id = v.id where child.active = true
        )
        select 1 from visible v where v.id = $1
      )
    `);
  }
  params.push(String(req.query.period || ""));
  const periodIndex = params.length;
  const result = await query(
    `
      select m.id, m.name, m.rank_name, m.sponsor_id, m.stockist_id,
             m.placement_parent_id, m.placement_side, m.joined_at,
             pm.ppv, pm.appv, pm.tnpv, pm.atnpv, pm.gpv,
             (select count(*)::int from members child where child.sponsor_id = m.id and child.active = true) as sponsor_child_count,
             (select count(*)::int from members child where child.placement_parent_id = m.id and child.active = true) as placement_child_count
      from members m
      left join member_period_metrics pm on pm.member_id = m.id and pm.period_key = $${periodIndex}
      where ${where.join(" and ")}
      order by m.placement_side, m.joined_at, m.id
    `,
    params
  );
  res.json({ data: result.rows });
}));

const createMemberSchema = z.object({
  id: z.string().min(3).max(32).regex(/^[A-Za-z0-9-]+$/),
  name: z.string().min(2).max(160),
  email: z.string().email().optional().nullable(),
  phone: z.string().max(32).optional().nullable(),
  sponsorId: z.string().min(3),
  placementParentId: z.string().min(3).optional().nullable(),
  placementSide: z.enum(["L", "R"]).optional().nullable(),
  stockistId: z.string().min(3),
  password: z.string().min(6).max(200).optional(),
  rankName: z.string().max(80).optional()
});

app.post("/api/members", requireOperator, asyncRoute(async (req, res) => {
  const input = createMemberSchema.parse(req.body);
  const created = await withTransaction(async (client) => {
    const stockistId = req.operatorRole === "stockist" ? req.operatorId : input.stockistId;
    const sponsor = await client.query("select id from members where id = $1", [input.sponsorId]);
    if (!sponsor.rowCount) throw Object.assign(new Error("Sponsor not found"), { status: 400 });
    const stockist = await client.query("select id, area from stockists where id = $1", [stockistId]);
    if (!stockist.rowCount) throw Object.assign(new Error("Stockist not found"), { status: 400 });
    if (req.operatorRole === "branch" && req.auth?.area && req.auth.area !== "Semua Indonesia" && stockist.rows[0].area !== req.auth.area) {
      throw Object.assign(new Error("Stockist outside branch area"), { status: 403 });
    }

    if (input.placementParentId) {
      const placement = await client.query(
        "select count(*)::int as count from members where placement_parent_id = $1",
        [input.placementParentId]
      );
      if (placement.rows[0].count >= 2) throw Object.assign(new Error("Placement parent is full"), { status: 400 });
    }

    const result = await client.query(
      `
        insert into members (id, name, email, phone, sponsor_id, placement_parent_id, placement_side, stockist_id, rank_name, password_hash)
        values ($1, $2, $3, $4, $5, $6, $7, $8, $9, crypt($10, gen_salt('bf')))
        returning *
      `,
      [input.id, input.name, input.email || null, input.phone || null, input.sponsorId, input.placementParentId || null, input.placementSide || null, stockistId, input.rankName || "Member", input.password || "ascendia"]
    );
    await client.query(
      "insert into audit_logs (actor_id, action, entity_type, entity_id, payload) values ($1, $2, $3, $4, $5)",
      [req.operatorId, "member.create", "member", input.id, input]
    );
    return result.rows[0];
  });
  res.status(201).json(created);
}));

const updateMemberSchema = z.object({
  name: z.string().min(2).max(160).optional(),
  email: z.string().email().optional().nullable(),
  phone: z.string().max(32).optional().nullable(),
  sponsorId: z.string().min(3).optional(),
  placementParentId: z.string().min(3).optional().nullable(),
  placementSide: z.enum(["L", "R"]).optional().nullable(),
  stockistId: z.string().min(3).optional(),
  password: z.string().min(6).max(200).optional(),
  rankName: z.string().max(80).optional(),
  joinedAt: z.string().optional()
});

app.patch("/api/members/:id", requireOperator, asyncRoute(async (req, res) => {
  const input = updateMemberSchema.parse(req.body);
  const updated = await withTransaction(async (client) => {
    const accessParams = [req.params.id];
    const access = memberAccessWhere(req, "m", accessParams);
    const existing = await client.query(
      `select m.* from members m where m.id = $1 and m.active = true ${access.where.length ? `and ${access.where.join(" and ")}` : ""}`,
      accessParams
    );
    if (!existing.rowCount) throw Object.assign(new Error("Member not found or outside access"), { status: 404 });
    if (req.operatorRole === "member") throw Object.assign(new Error("Member cannot update this data"), { status: 403 });

    const nextStockistId = req.operatorRole === "stockist" ? req.operatorId : input.stockistId || existing.rows[0].stockist_id;
    const stockist = await client.query("select id, area from stockists where id = $1", [nextStockistId]);
    if (!stockist.rowCount) throw Object.assign(new Error("Stockist not found"), { status: 400 });
    if (req.operatorRole === "branch" && req.auth?.area && req.auth.area !== "Semua Indonesia" && stockist.rows[0].area !== req.auth.area) {
      throw Object.assign(new Error("Stockist outside branch area"), { status: 403 });
    }

    if (input.sponsorId) {
      const sponsor = await client.query("select id from members where id = $1 and active = true", [input.sponsorId]);
      if (!sponsor.rowCount) throw Object.assign(new Error("Sponsor not found"), { status: 400 });
    }
    if (input.placementParentId) {
      const placement = await client.query(
        "select count(*)::int as count from members where placement_parent_id = $1 and id <> $2 and active = true",
        [input.placementParentId, req.params.id]
      );
      if (placement.rows[0].count >= 2) throw Object.assign(new Error("Placement parent is full"), { status: 400 });
    }

    const result = await client.query(
      `
        update members
        set
          name = coalesce($2, name),
          email = $3,
          phone = $4,
          sponsor_id = coalesce($5, sponsor_id),
          placement_parent_id = $6,
          placement_side = $7,
          stockist_id = $8,
          rank_name = coalesce($9, rank_name),
          joined_at = coalesce($10::date, joined_at),
          password_hash = case when $11::text is null then password_hash else crypt($11, gen_salt('bf')) end,
          updated_at = now()
        where id = $1
        returning *
      `,
      [
        req.params.id,
        input.name || null,
        Object.prototype.hasOwnProperty.call(input, "email") ? input.email || null : existing.rows[0].email,
        Object.prototype.hasOwnProperty.call(input, "phone") ? input.phone || null : existing.rows[0].phone,
        input.sponsorId || null,
        Object.prototype.hasOwnProperty.call(input, "placementParentId") ? input.placementParentId || null : existing.rows[0].placement_parent_id,
        Object.prototype.hasOwnProperty.call(input, "placementSide") ? input.placementSide || null : existing.rows[0].placement_side,
        nextStockistId,
        input.rankName || null,
        input.joinedAt || null,
        input.password || null
      ]
    );
    await client.query(
      "insert into audit_logs (actor_id, action, entity_type, entity_id, payload) values ($1, $2, $3, $4, $5)",
      [req.operatorId, "member.update", "member", req.params.id, input]
    );
    return result.rows[0];
  });
  res.json(updated);
}));

app.delete("/api/members/:id", requireOperator, asyncRoute(async (req, res) => {
  if (!["admin", "branch", "stockist"].includes(req.operatorRole)) return res.status(403).json({ error: "Forbidden" });
  await withTransaction(async (client) => {
    const accessParams = [req.params.id];
    const access = memberAccessWhere(req, "m", accessParams);
    const result = await client.query(
      `update members m set active = false, deleted_at = now(), updated_at = now() where m.id = $1 and m.active = true ${access.where.length ? `and ${access.where.join(" and ")}` : ""} returning id`,
      accessParams
    );
    if (!result.rowCount) throw Object.assign(new Error("Member not found or outside access"), { status: 404 });
    await client.query(
      "insert into audit_logs (actor_id, action, entity_type, entity_id, payload) values ($1, $2, $3, $4, $5)",
      [req.operatorId, "member.archive", "member", req.params.id, { id: req.params.id }]
    );
  });
  res.json({ ok: true });
}));

app.get("/api/stockists", requireOperator, asyncRoute(async (req, res) => {
  requireRole(req, ["admin", "branch", "stockist"]);
  const limit = pageLimit(req.query.limit);
  const cursor = String(req.query.cursor || "");
  const search = String(req.query.q || "").trim();
  const params = [];
  const where = ["s.active = true"];
  if (cursor) {
    params.push(cursor);
    where.push(`s.id > $${params.length}`);
  }
  if (search) {
    params.push(`%${search.toLowerCase()}%`);
    where.push(`(lower(s.id) like $${params.length} or lower(s.name) like $${params.length} or lower(s.area) like $${params.length} or lower(s.district) like $${params.length})`);
  }
  stockistAccessWhere(req, "s", params).where.forEach((item) => where.push(item));
  params.push(limit + 1);
  const result = await query(
    `
      select s.id, s.name, s.email, s.phone, s.area, s.district, s.fee_rate,
             (select count(*)::int from members m where m.stockist_id = s.id and m.active = true) as member_count
      from stockists s
      where ${where.join(" and ")}
      order by s.id
      limit $${params.length}
    `,
    params
  );
  const rows = result.rows.slice(0, limit);
  res.json({ data: rows, nextCursor: result.rows.length > limit ? rows.at(-1)?.id : null });
}));

const stockistSchema = z.object({
  id: z.string().min(3).max(32).regex(/^[A-Za-z0-9-]+$/),
  name: z.string().min(2).max(160),
  email: z.string().email().optional().nullable(),
  phone: z.string().max(32).optional().nullable(),
  area: z.string().min(2).max(100),
  district: z.string().min(1).max(120),
  feeRate: z.number().min(0).max(100).optional(),
  password: z.string().min(6).max(200).optional()
});

app.post("/api/stockists", requireOperator, asyncRoute(async (req, res) => {
  requireRole(req, ["admin", "branch"]);
  const input = stockistSchema.parse(req.body);
  const area = req.operatorRole === "branch" && req.auth?.area !== "Semua Indonesia" ? req.auth.area : input.area;
  const result = await withTransaction(async (client) => {
    const created = await client.query(
      `
        insert into stockists (id, name, email, phone, area, district, fee_rate, password_hash)
        values ($1, $2, $3, $4, $5, $6, $7, crypt($8, gen_salt('bf')))
        returning id, name, email, phone, area, district, fee_rate
      `,
      [input.id, input.name, input.email || null, input.phone || null, area, input.district, input.feeRate ?? 5, input.password || "ascendia"]
    );
    await client.query(
      "insert into audit_logs (actor_id, action, entity_type, entity_id, payload) values ($1, $2, $3, $4, $5)",
      [req.operatorId, "stockist.create", "stockist", input.id, { ...input, password: undefined, area }]
    );
    return created.rows[0];
  });
  res.status(201).json(result);
}));

const updateStockistSchema = stockistSchema.partial().omit({ id: true });

app.patch("/api/stockists/:id", requireOperator, asyncRoute(async (req, res) => {
  requireRole(req, ["admin", "branch"]);
  const input = updateStockistSchema.parse(req.body);
  const updated = await withTransaction(async (client) => {
    const accessParams = [req.params.id];
    const access = stockistAccessWhere(req, "s", accessParams);
    const existing = await client.query(
      `select s.* from stockists s where s.id = $1 and s.active = true ${access.where.length ? `and ${access.where.join(" and ")}` : ""}`,
      accessParams
    );
    if (!existing.rowCount) throw Object.assign(new Error("Stockist not found or outside access"), { status: 404 });
    const area = req.operatorRole === "branch" && req.auth?.area !== "Semua Indonesia" ? existing.rows[0].area : input.area || existing.rows[0].area;
    const result = await client.query(
      `
        update stockists
        set name = coalesce($2, name),
            email = $3,
            phone = $4,
            area = $5,
            district = coalesce($6, district),
            fee_rate = coalesce($7, fee_rate),
            password_hash = case when $8::text is null then password_hash else crypt($8, gen_salt('bf')) end,
            updated_at = now()
        where id = $1
        returning id, name, email, phone, area, district, fee_rate
      `,
      [
        req.params.id,
        input.name || null,
        Object.prototype.hasOwnProperty.call(input, "email") ? input.email || null : existing.rows[0].email,
        Object.prototype.hasOwnProperty.call(input, "phone") ? input.phone || null : existing.rows[0].phone,
        area,
        input.district || null,
        input.feeRate ?? null,
        input.password || null
      ]
    );
    await client.query(
      "insert into audit_logs (actor_id, action, entity_type, entity_id, payload) values ($1, $2, $3, $4, $5)",
      [req.operatorId, "stockist.update", "stockist", req.params.id, { ...input, password: undefined }]
    );
    return result.rows[0];
  });
  res.json(updated);
}));

app.delete("/api/stockists/:id", requireOperator, asyncRoute(async (req, res) => {
  requireRole(req, ["admin"]);
  await withTransaction(async (client) => {
    const memberCount = await client.query("select count(*)::int as count from members where stockist_id = $1 and active = true", [req.params.id]);
    if (memberCount.rows[0].count > 0) throw Object.assign(new Error("Stockist still has active members"), { status: 400 });
    const result = await client.query("update stockists set active = false, deleted_at = now(), updated_at = now() where id = $1 and active = true returning id", [req.params.id]);
    if (!result.rowCount) throw Object.assign(new Error("Stockist not found"), { status: 404 });
    await client.query(
      "insert into audit_logs (actor_id, action, entity_type, entity_id, payload) values ($1, $2, $3, $4, $5)",
      [req.operatorId, "stockist.archive", "stockist", req.params.id, { id: req.params.id }]
    );
  });
  res.json({ ok: true });
}));

app.get("/api/admins", requireOperator, asyncRoute(async (req, res) => {
  requireRole(req, ["admin"]);
  const limit = pageLimit(req.query.limit);
  const cursor = String(req.query.cursor || "");
  const search = String(req.query.q || "").trim();
  const params = [];
  const where = ["active = true"];
  if (cursor) {
    params.push(cursor);
    where.push(`id > $${params.length}`);
  }
  if (search) {
    params.push(`%${search.toLowerCase()}%`);
    where.push(`(lower(id) like $${params.length} or lower(name) like $${params.length} or lower(role) like $${params.length} or lower(area) like $${params.length})`);
  }
  params.push(limit + 1);
  const result = await query(
    `select id, name, email, phone, role, area from admins where ${where.join(" and ")} order by id limit $${params.length}`,
    params
  );
  const rows = result.rows.slice(0, limit);
  res.json({ data: rows, nextCursor: result.rows.length > limit ? rows.at(-1)?.id : null });
}));

const adminSchema = z.object({
  id: z.string().min(3).max(32).regex(/^[A-Za-z0-9-]+$/),
  name: z.string().min(2).max(160),
  email: z.string().email().optional().nullable(),
  phone: z.string().max(32).optional().nullable(),
  role: z.enum(["Admin Pusat", "Admin Cabang"]),
  area: z.string().min(2).max(100),
  password: z.string().min(6).max(200).optional()
});

app.post("/api/admins", requireOperator, asyncRoute(async (req, res) => {
  requireRole(req, ["admin"]);
  const input = adminSchema.parse(req.body);
  const area = input.role === "Admin Pusat" ? "Pusat" : input.area;
  const result = await withTransaction(async (client) => {
    const created = await client.query(
      `
        insert into admins (id, name, email, phone, role, area, password_hash)
        values ($1, $2, $3, $4, $5, $6, crypt($7, gen_salt('bf')))
        returning id, name, email, phone, role, area
      `,
      [input.id, input.name, input.email || null, input.phone || null, input.role, area, input.password || "ascendia"]
    );
    await client.query(
      "insert into audit_logs (actor_id, action, entity_type, entity_id, payload) values ($1, $2, $3, $4, $5)",
      [req.operatorId, "admin.create", "admin", input.id, { ...input, password: undefined, area }]
    );
    return created.rows[0];
  });
  res.status(201).json(result);
}));

const updateAdminSchema = adminSchema.partial().omit({ id: true });

app.patch("/api/admins/:id", requireOperator, asyncRoute(async (req, res) => {
  requireRole(req, ["admin"]);
  const input = updateAdminSchema.parse(req.body);
  const updated = await withTransaction(async (client) => {
    const existing = await client.query("select * from admins where id = $1 and active = true", [req.params.id]);
    if (!existing.rowCount) throw Object.assign(new Error("Admin not found"), { status: 404 });
    const role = input.role || existing.rows[0].role;
    const area = role === "Admin Pusat" ? "Pusat" : input.area || existing.rows[0].area;
    const result = await client.query(
      `
        update admins
        set name = coalesce($2, name),
            email = $3,
            phone = $4,
            role = $5,
            area = $6,
            password_hash = case when $7::text is null then password_hash else crypt($7, gen_salt('bf')) end,
            updated_at = now()
        where id = $1
        returning id, name, email, phone, role, area
      `,
      [
        req.params.id,
        input.name || null,
        Object.prototype.hasOwnProperty.call(input, "email") ? input.email || null : existing.rows[0].email,
        Object.prototype.hasOwnProperty.call(input, "phone") ? input.phone || null : existing.rows[0].phone,
        role,
        area,
        input.password || null
      ]
    );
    await client.query(
      "insert into audit_logs (actor_id, action, entity_type, entity_id, payload) values ($1, $2, $3, $4, $5)",
      [req.operatorId, "admin.update", "admin", req.params.id, { ...input, password: undefined }]
    );
    return result.rows[0];
  });
  res.json(updated);
}));

app.delete("/api/admins/:id", requireOperator, asyncRoute(async (req, res) => {
  requireRole(req, ["admin"]);
  if (req.params.id === req.operatorId) return res.status(400).json({ error: "Active admin cannot archive itself" });
  await withTransaction(async (client) => {
    const result = await client.query("update admins set active = false, deleted_at = now(), updated_at = now() where id = $1 and active = true returning id", [req.params.id]);
    if (!result.rowCount) throw Object.assign(new Error("Admin not found"), { status: 404 });
    await client.query(
      "insert into audit_logs (actor_id, action, entity_type, entity_id, payload) values ($1, $2, $3, $4, $5)",
      [req.operatorId, "admin.archive", "admin", req.params.id, { id: req.params.id }]
    );
  });
  res.json({ ok: true });
}));

app.get("/api/announcements", requireOperator, asyncRoute(async (req, res) => {
  const limit = pageLimit(req.query.limit);
  const cursor = String(req.query.cursor || "");
  const search = String(req.query.q || "").trim();
  const params = [];
  const where = ["active = true"];
  if (req.operatorRole !== "admin") where.push("status = 'Aktif'");
  if (cursor) {
    params.push(cursor);
    where.push(`id > $${params.length}`);
  }
  if (search) {
    params.push(`%${search.toLowerCase()}%`);
    where.push(`(lower(id) like $${params.length} or lower(title) like $${params.length} or lower(body) like $${params.length} or lower(audience) like $${params.length})`);
  }
  params.push(limit + 1);
  const result = await query(
    `
      select id, title, body, audience, status, published_at
      from announcements
      where ${where.join(" and ")}
      order by published_at desc, id
      limit $${params.length}
    `,
    params
  );
  const rows = result.rows.slice(0, limit);
  res.json({ data: rows, nextCursor: result.rows.length > limit ? rows.at(-1)?.id : null });
}));

const announcementSchema = z.object({
  id: z.string().min(3).max(32).regex(/^[A-Za-z0-9-]+$/),
  title: z.string().min(2).max(200),
  body: z.string().max(5000).default(""),
  audience: z.string().min(2).max(120).default("Semua Member"),
  status: z.enum(["Aktif", "Draft", "Selesai"]).default("Aktif"),
  date: z.string().optional()
});

app.post("/api/announcements", requireOperator, asyncRoute(async (req, res) => {
  requireRole(req, ["admin"]);
  const input = announcementSchema.parse(req.body);
  const result = await withTransaction(async (client) => {
    const created = await client.query(
      `
        insert into announcements (id, title, body, audience, status, published_at)
        values ($1, $2, $3, $4, $5, coalesce($6::date, current_date))
        returning id, title, body, audience, status, published_at
      `,
      [input.id, input.title, input.body || "", input.audience, input.status, input.date || null]
    );
    await client.query(
      "insert into audit_logs (actor_id, action, entity_type, entity_id, payload) values ($1, $2, $3, $4, $5)",
      [req.operatorId, "announcement.create", "announcement", input.id, input]
    );
    return created.rows[0];
  });
  res.status(201).json(result);
}));

const updateAnnouncementSchema = announcementSchema.partial().omit({ id: true });

app.patch("/api/announcements/:id", requireOperator, asyncRoute(async (req, res) => {
  requireRole(req, ["admin"]);
  const input = updateAnnouncementSchema.parse(req.body);
  const updated = await withTransaction(async (client) => {
    const existing = await client.query("select * from announcements where id = $1 and active = true", [req.params.id]);
    if (!existing.rowCount) throw Object.assign(new Error("Announcement not found"), { status: 404 });
    const result = await client.query(
      `
        update announcements
        set title = coalesce($2, title),
            body = coalesce($3, body),
            audience = coalesce($4, audience),
            status = coalesce($5, status),
            published_at = coalesce($6::date, published_at),
            updated_at = now()
        where id = $1
        returning id, title, body, audience, status, published_at
      `,
      [req.params.id, input.title || null, input.body ?? null, input.audience || null, input.status || null, input.date || null]
    );
    await client.query(
      "insert into audit_logs (actor_id, action, entity_type, entity_id, payload) values ($1, $2, $3, $4, $5)",
      [req.operatorId, "announcement.update", "announcement", req.params.id, input]
    );
    return result.rows[0];
  });
  res.json(updated);
}));

app.delete("/api/announcements/:id", requireOperator, asyncRoute(async (req, res) => {
  requireRole(req, ["admin"]);
  await withTransaction(async (client) => {
    const result = await client.query("update announcements set active = false, deleted_at = now(), updated_at = now() where id = $1 and active = true returning id", [req.params.id]);
    if (!result.rowCount) throw Object.assign(new Error("Announcement not found"), { status: 404 });
    await client.query(
      "insert into audit_logs (actor_id, action, entity_type, entity_id, payload) values ($1, $2, $3, $4, $5)",
      [req.operatorId, "announcement.archive", "announcement", req.params.id, { id: req.params.id }]
    );
  });
  res.json({ ok: true });
}));

const ppvSchema = z.object({
  memberId: z.string().min(3),
  pv: z.number().nonnegative(),
  transactionDate: z.string().datetime().optional()
});

app.post("/api/periods/:period/input-ppv", requireOperator, asyncRoute(async (req, res) => {
  const input = ppvSchema.parse(req.body);
  const periodKey = req.params.period || periodFromDate(input.transactionDate || new Date().toISOString());
  await withTransaction(async (client) => {
    const accessParams = [input.memberId];
    const access = memberAccessWhere(req, "m", accessParams);
    const member = await client.query(
      `select m.id from members m where m.id = $1 ${access.where.length ? `and ${access.where.join(" and ")}` : ""}`,
      accessParams
    );
    if (!member.rowCount) throw Object.assign(new Error("Member not found or outside access"), { status: 404 });
    await client.query(
      `
        insert into pv_transactions (period_key, member_id, pv, source_type, created_by)
        values ($1, $2, $3, 'manual', $4)
      `,
      [periodKey, input.memberId, input.pv, req.operatorId]
    );
    await client.query(
      `
        insert into member_period_metrics (period_key, member_id, ppv)
        values ($1, $2, $3)
        on conflict (period_key, member_id)
        do update set ppv = member_period_metrics.ppv + excluded.ppv, updated_at = now()
      `,
      [periodKey, input.memberId, input.pv]
    );
  });
  res.status(202).json({ ok: true, periodKey });
}));

app.post("/api/periods/:period/run-bonus", requireOperator, asyncRoute(async (req, res) => {
  requireRole(req, ["admin"]);
  const summary = await withTransaction(async (client) => {
    await client.query("select pg_advisory_xact_lock(hashtext($1))", [`bonus:${req.params.period}`]);
    const run = await client.query(
      "insert into bonus_runs (period_key, status, requested_by, started_at) values ($1, 'running', $2, now()) returning id",
      [req.params.period, req.operatorId]
    );
    try {
      const result = await runBonusCalculation(client, req.params.period, req.operatorId);
      await client.query(
        "update bonus_runs set status = 'done', finished_at = now() where id = $1",
        [run.rows[0].id]
      );
      return { runId: run.rows[0].id, ...result };
    } catch (error) {
      await client.query(
        "update bonus_runs set status = 'failed', finished_at = now(), error_message = $2 where id = $1",
        [run.rows[0].id, error.message]
      );
      throw error;
    }
  });
  res.status(200).json({ ok: true, message: "Bonus calculation completed", ...summary });
}));

app.get("/api/periods/:period/bonus-ledger", requireOperator, asyncRoute(async (req, res) => {
  const limit = pageLimit(req.query.limit, 100, 500);
  const params = [req.params.period, limit];
  const memberFilter = req.query.memberId ? "and member_id = $3" : "";
  if (req.query.memberId) params.push(String(req.query.memberId));
  const result = await query(
    `
      select period_key, member_id, bonus_type, bv, rupiah, source_member_id, note
      from bonus_ledger
      where period_key = $1 ${memberFilter}
      order by member_id, bonus_type, source_member_id nulls first
      limit $2
    `,
    params
  );
  res.json({ data: result.rows });
}));

app.get("/api/periods/:period/bonus-summary", requireOperator, asyncRoute(async (req, res) => {
  const limit = pageLimit(req.query.limit, 50, 200);
  const cursor = String(req.query.cursor || "");
  const search = String(req.query.q || "").trim();
  const paymentMonth = String(req.query.paymentMonth || req.params.period).slice(0, 7);
  const paymentPeriod = String(req.query.paymentPeriod || "month");
  const params = [req.params.period, paymentMonth, paymentPeriod];
  const where = ["m.active = true"];

  if (cursor) {
    params.push(cursor);
    where.push(`m.id > $${params.length}`);
  }
  if (search) {
    params.push(`%${search.toLowerCase()}%`);
    where.push(`(lower(m.id) like $${params.length} or lower(m.name) like $${params.length} or lower(m.rank_name) like $${params.length})`);
  }
  memberAccessWhere(req, "m", params).where.forEach((item) => where.push(item));

  params.push(limit + 1);
  const limitIndex = params.length;
  const result = await query(
    `
      with member_bonus as (
        select member_id,
               coalesce(sum(rupiah), 0) as total_rupiah,
               coalesce(sum(rupiah) filter (where bonus_type = 'performance'), 0) as performance_rupiah,
               coalesce(sum(rupiah) filter (where bonus_type = 'pair'), 0) as pair_rupiah,
               coalesce(sum(rupiah) filter (where bonus_type = 'leadership'), 0) as leadership_rupiah,
               coalesce(sum(rupiah) filter (where bonus_type = 'mentoring'), 0) as mentoring_rupiah,
               coalesce(sum(rupiah) filter (where bonus_type = 'sharing_profit'), 0) as sharing_rupiah
        from bonus_ledger
        where period_key = $1
        group by member_id
      )
      select m.id, m.name, m.rank_name, m.stockist_id, s.name as stockist_name,
             pm.ppv, pm.appv, pm.tnpv, pm.atnpv, pm.gpv,
             coalesce(b.total_rupiah, 0) as total_rupiah,
             coalesce(b.performance_rupiah, 0) as performance_rupiah,
             coalesce(b.pair_rupiah, 0) as pair_rupiah,
             coalesce(b.leadership_rupiah, 0) as leadership_rupiah,
             coalesce(b.mentoring_rupiah, 0) as mentoring_rupiah,
             coalesce(b.sharing_rupiah, 0) as sharing_rupiah,
             coalesce(pay.paid, false) as paid_done
      from members m
      left join stockists s on s.id = m.stockist_id
      left join member_period_metrics pm on pm.member_id = m.id and pm.period_key = $1
      left join member_bonus b on b.member_id = m.id
      left join member_bonus_payments pay
        on pay.member_id = m.id and pay.period_key = $1 and pay.payment_month = $2 and pay.payment_period = $3
      where ${where.join(" and ")}
      order by m.id
      limit $${limitIndex}
    `,
    params
  );
  const rows = result.rows.slice(0, limit);
  res.json({ data: rows, nextCursor: result.rows.length > limit ? rows.at(-1)?.id : null });
}));

app.get("/api/periods/:period/stockist-payouts", requireOperator, asyncRoute(async (req, res) => {
  requireRole(req, ["admin", "branch", "stockist"]);
  const paymentMonth = String(req.query.paymentMonth || req.params.period).slice(0, 7);
  const paymentPeriod = String(req.query.paymentPeriod || "month");
  const params = [req.params.period, paymentMonth, paymentPeriod];
  const where = ["s.active = true"];
  stockistAccessWhere(req, "s", params).where.forEach((item) => where.push(item));
  const result = await query(
    `
      with member_bonus as (
        select member_id, coalesce(sum(rupiah), 0) as total_rupiah
        from bonus_ledger
        where period_key = $1
        group by member_id
      ),
      visible_members as (
        select m.id, m.stockist_id, coalesce(pm.ppv, 0) as ppv, coalesce(b.total_rupiah, 0) as bonus_rupiah,
               coalesce(pay.paid, false) as paid_done
        from members m
        left join member_period_metrics pm on pm.member_id = m.id and pm.period_key = $1
        left join member_bonus b on b.member_id = m.id
        left join member_bonus_payments pay
          on pay.member_id = m.id and pay.period_key = $1 and pay.payment_month = $2 and pay.payment_period = $3
        where m.active = true
      )
      select s.id, s.name, s.area, s.district, s.fee_rate,
             coalesce(sum(vm.ppv), 0) * 1000 as sales_rupiah,
             coalesce(sum(vm.ppv), 0) * 1000 * coalesce(s.fee_rate, 0) / 100 as fee_rupiah,
             coalesce(sum(vm.bonus_rupiah), 0) as member_bonus_rupiah,
             count(vm.id)::int as member_count,
             count(vm.id) filter (where vm.bonus_rupiah > 0)::int as payable_count,
             count(vm.id) filter (where vm.bonus_rupiah > 0 and vm.paid_done)::int as paid_count,
             coalesce(sp.status, 'draft') as transfer_status
      from stockists s
      left join visible_members vm on vm.stockist_id = s.id
      left join stockist_payouts sp
        on sp.stockist_id = s.id and sp.period_key = $1 and sp.payment_month = $2 and sp.payment_period = $3
      where ${where.join(" and ")}
      group by s.id, s.name, s.area, s.district, s.fee_rate, sp.status
      order by s.id
    `,
    params
  );
  res.json({ data: result.rows });
}));

const paymentStatusSchema = z.object({
  paid: z.boolean()
});

app.patch("/api/periods/:period/member-payments/:memberId", requireOperator, asyncRoute(async (req, res) => {
  requireRole(req, ["admin", "branch", "stockist"]);
  const input = paymentStatusSchema.parse(req.body);
  const paymentMonth = String(req.query.paymentMonth || req.params.period).slice(0, 7);
  const paymentPeriod = String(req.query.paymentPeriod || "month");
  await withTransaction(async (client) => {
    const accessParams = [req.params.memberId];
    const access = memberAccessWhere(req, "m", accessParams);
    const member = await client.query(
      `select m.id from members m where m.id = $1 and m.active = true ${access.where.length ? `and ${access.where.join(" and ")}` : ""}`,
      accessParams
    );
    if (!member.rowCount) throw Object.assign(new Error("Member not found or outside access"), { status: 404 });
    await client.query(
      `
        insert into member_bonus_payments (period_key, payment_month, payment_period, member_id, paid, paid_by, paid_at, updated_at)
        values ($1, $2, $3, $4, $5, $6, case when $5 then now() else null end, now())
        on conflict (period_key, payment_month, payment_period, member_id)
        do update set paid = excluded.paid,
                      paid_by = excluded.paid_by,
                      paid_at = excluded.paid_at,
                      updated_at = now()
      `,
      [req.params.period, paymentMonth, paymentPeriod, req.params.memberId, input.paid, req.operatorId]
    );
    await client.query(
      "insert into audit_logs (actor_id, action, entity_type, entity_id, payload) values ($1, $2, $3, $4, $5)",
      [req.operatorId, "member_payment.update", "member", req.params.memberId, { periodKey: req.params.period, paymentMonth, paymentPeriod, paid: input.paid }]
    );
  });
  res.json({ ok: true });
}));

const stockistPayoutStatusSchema = z.object({
  paid: z.boolean(),
  salesRupiah: z.number().nonnegative().optional(),
  feeRupiah: z.number().nonnegative().optional(),
  memberBonusRupiah: z.number().nonnegative().optional()
});

app.patch("/api/periods/:period/stockist-payouts/:stockistId", requireOperator, asyncRoute(async (req, res) => {
  requireRole(req, ["admin", "branch"]);
  const input = stockistPayoutStatusSchema.parse(req.body);
  const paymentMonth = String(req.query.paymentMonth || req.params.period).slice(0, 7);
  const paymentPeriod = String(req.query.paymentPeriod || "month");
  await withTransaction(async (client) => {
    const accessParams = [req.params.stockistId];
    const access = stockistAccessWhere(req, "s", accessParams);
    const stockist = await client.query(
      `select s.id from stockists s where s.id = $1 and s.active = true ${access.where.length ? `and ${access.where.join(" and ")}` : ""}`,
      accessParams
    );
    if (!stockist.rowCount) throw Object.assign(new Error("Stockist not found or outside access"), { status: 404 });
    await client.query(
      `
        insert into stockist_payouts (period_key, payment_month, payment_period, stockist_id, sales_rupiah, fee_rupiah, member_bonus_rupiah, status)
        values ($1, $2, $3, $4, $5, $6, $7, $8)
        on conflict (period_key, payment_month, payment_period, stockist_id)
        do update set sales_rupiah = excluded.sales_rupiah,
                      fee_rupiah = excluded.fee_rupiah,
                      member_bonus_rupiah = excluded.member_bonus_rupiah,
                      status = excluded.status
      `,
      [
        req.params.period,
        paymentMonth,
        paymentPeriod,
        req.params.stockistId,
        input.salesRupiah || 0,
        input.feeRupiah || 0,
        input.memberBonusRupiah || 0,
        input.paid ? "paid" : "draft"
      ]
    );
    await client.query(
      "insert into audit_logs (actor_id, action, entity_type, entity_id, payload) values ($1, $2, $3, $4, $5)",
      [req.operatorId, "stockist_payout.update", "stockist", req.params.stockistId, { periodKey: req.params.period, paymentMonth, paymentPeriod, paid: input.paid }]
    );
  });
  res.json({ ok: true });
}));

app.get("/api/bonus-settings", requireOperator, asyncRoute(async (_req, res) => {
  const result = await query("select bonus_type, active from bonus_settings order by bonus_type");
  res.json({ data: result.rows });
}));

const bonusSettingSchema = z.object({
  active: z.boolean()
});

app.patch("/api/bonus-settings/:type", requireOperator, asyncRoute(async (req, res) => {
  requireRole(req, ["admin"]);
  const type = String(req.params.type || "");
  if (!["performance", "pair", "leadership", "mentoring", "sharing"].includes(type)) {
    return res.status(400).json({ error: "Invalid bonus type" });
  }
  const input = bonusSettingSchema.parse(req.body);
  const result = await withTransaction(async (client) => {
    const updated = await client.query(
      `
        insert into bonus_settings (bonus_type, active, updated_by, updated_at)
        values ($1, $2, $3, now())
        on conflict (bonus_type) do update set active = excluded.active, updated_by = excluded.updated_by, updated_at = now()
        returning bonus_type, active
      `,
      [type, input.active, req.operatorId]
    );
    await client.query(
      "insert into audit_logs (actor_id, action, entity_type, entity_id, payload) values ($1, $2, $3, $4, $5)",
      [req.operatorId, "bonus_setting.update", "bonus_setting", type, input]
    );
    return updated.rows[0];
  });
  res.json(result);
}));

app.get("/api/reports/dashboard", requireOperator, asyncRoute(async (req, res) => {
  requireRole(req, ["admin", "branch", "stockist", "member"]);
  const periodKey = String(req.query.period || "").slice(0, 10);
  if (!periodKey) return res.status(400).json({ error: "period is required" });
  const params = [periodKey];
  const where = ["m.active = true"];
  if (req.operatorRole === "branch" && req.auth?.area && req.auth.area !== "Semua Indonesia") {
    params.push(req.auth.area);
    where.push(`exists (select 1 from stockists s where s.id = m.stockist_id and s.area = $${params.length})`);
  }
  if (req.operatorRole === "stockist") {
    params.push(req.operatorId);
    where.push(`m.stockist_id = $${params.length}`);
  }
  if (req.operatorRole === "member") {
    params.push(req.operatorId);
    where.push(`m.id = $${params.length}`);
  }

  const metrics = await query(
    `
      select
        count(*)::int as member_count,
        count(*) filter (where coalesce(pm.ppv, 0) > 0)::int as active_member_count,
        coalesce(sum(pm.ppv), 0) as ppv,
        coalesce(sum(pm.appv), 0) as appv,
        coalesce(sum(pm.tnpv), 0) as tnpv,
        coalesce(sum(pm.atnpv), 0) as atnpv,
        coalesce(sum(pm.gpv), 0) as gpv,
        coalesce(sum(pm.ppv * 1000 * coalesce(s.fee_rate, 0) / 100), 0) as stockist_fee_rupiah
      from members m
      left join member_period_metrics pm on pm.member_id = m.id and pm.period_key = $1
      left join stockists s on s.id = m.stockist_id
      where ${where.join(" and ")}
    `,
    params
  );

  const bonusParams = [periodKey];
  const bonusWhere = ["bl.period_key = $1"];
  if (req.operatorRole === "branch" && req.auth?.area && req.auth.area !== "Semua Indonesia") {
    bonusParams.push(req.auth.area);
    bonusWhere.push(`exists (select 1 from members m join stockists s on s.id = m.stockist_id where m.id = bl.member_id and s.area = $${bonusParams.length})`);
  }
  if (req.operatorRole === "stockist") {
    bonusParams.push(req.operatorId);
    bonusWhere.push(`exists (select 1 from members m where m.id = bl.member_id and m.stockist_id = $${bonusParams.length})`);
  }
  if (req.operatorRole === "member") {
    bonusParams.push(req.operatorId);
    bonusWhere.push(`bl.member_id = $${bonusParams.length}`);
  }
  const bonus = await query(
    `
      select bonus_type, coalesce(sum(rupiah), 0) as rupiah
      from bonus_ledger bl
      where ${bonusWhere.join(" and ")}
      group by bonus_type
    `,
    bonusParams
  );
  const bonusTotals = Object.fromEntries(bonus.rows.map((row) => [row.bonus_type, Number(row.rupiah || 0)]));
  const memberBonusRupiah = Object.values(bonusTotals).reduce((sum, value) => sum + Number(value || 0), 0);
  const metricRow = metrics.rows[0] || {};
  const stockistFeeRupiah = Number(metricRow.stockist_fee_rupiah || 0);
  const revenueRupiah = Number(metricRow.ppv || 0) * 1000;
  const totalPayoutRupiah = memberBonusRupiah + stockistFeeRupiah;

  res.json({
    periodKey,
    memberCount: Number(metricRow.member_count || 0),
    activeMemberCount: Number(metricRow.active_member_count || 0),
    ppv: Number(metricRow.ppv || 0),
    appv: Number(metricRow.appv || 0),
    tnpv: Number(metricRow.tnpv || 0),
    atnpv: Number(metricRow.atnpv || 0),
    gpv: Number(metricRow.gpv || 0),
    revenueRupiah,
    memberBonusRupiah,
    stockistFeeRupiah,
    totalPayoutRupiah,
    payoutRatio: revenueRupiah ? totalPayoutRupiah / revenueRupiah : 0,
    bonusTotals
  });
}));

app.get("/api/reports/company-funds", requireOperator, asyncRoute(async (req, res) => {
  requireRole(req, ["admin"]);
  const periodKey = String(req.query.period || "").slice(0, 7);
  if (!periodKey) return res.status(400).json({ error: "period is required" });
  const metrics = await query(
    `
      select
        coalesce(sum(pm.ppv), 0) as ppv,
        coalesce(sum(pm.tnpv), 0) as tnpv,
        coalesce(sum(pm.ppv * 1000 * coalesce(s.fee_rate, 0) / 100), 0) as stockist_fee_rupiah
      from members m
      left join member_period_metrics pm on pm.member_id = m.id and pm.period_key = $1
      left join stockists s on s.id = m.stockist_id
      where m.active = true
    `,
    [periodKey]
  );
  const bonus = await query(
    `
      select bonus_type, coalesce(sum(rupiah), 0) as rupiah
      from bonus_ledger
      where period_key = $1
      group by bonus_type
    `,
    [periodKey]
  );
  const unpaid = await query(
    `
      select coalesce(sum(bl.rupiah), 0) as rupiah
      from bonus_ledger bl
      left join member_bonus_payments pay
        on pay.member_id = bl.member_id and pay.period_key = bl.period_key
      where bl.period_key = $1 and coalesce(pay.paid, false) = false
    `,
    [periodKey]
  );
  const inactive = await query("select bonus_type, active from bonus_settings where active = false order by bonus_type");
  const metric = metrics.rows[0] || {};
  const companyTnpvPv = Number(metric.tnpv || 0) || Number(metric.ppv || 0);
  const companyTnpvRupiah = companyTnpvPv * 1000;
  const companyBaseRupiah = Math.round(companyTnpvRupiah * 0.45);
  const designRows = [
    { key: "performance", label: "Bonus Prestasi", rate: 0.30, basis: companyTnpvRupiah },
    { key: "pair", label: "Bonus Pasangan", rate: 0.15, basis: companyTnpvRupiah },
    { key: "leadership", label: "Bonus Kepemimpinan", rate: 0.08, basis: companyTnpvRupiah },
    { key: "mentoring", label: "Bonus Bimbingan", rate: 0.12, basis: Number((bonus.rows.find((row) => row.bonus_type === "pair") || {}).rupiah || 0) },
    { key: "sharing_profit", label: "Sharing Profit", rate: 0.03, basis: companyTnpvRupiah }
  ];
  const bonusTotals = Object.fromEntries(bonus.rows.map((row) => [row.bonus_type, Number(row.rupiah || 0)]));
  const poolRows = designRows.map((row) => {
    const target = Math.round(row.basis * row.rate);
    const paid = Number(bonusTotals[row.key] || 0);
    return {
      key: row.key,
      label: row.label,
      rate: row.rate,
      basis: row.basis,
      target,
      paid,
      managed: Math.max(0, target - paid)
    };
  });
  const managedRupiah = poolRows.reduce((sum, row) => sum + row.managed, 0);
  const memberBonusRupiah = Object.values(bonusTotals).reduce((sum, value) => sum + Number(value || 0), 0);
  const stockistFeeRupiah = Number(metric.stockist_fee_rupiah || 0);
  const totalPaidOrOwedRupiah = memberBonusRupiah + stockistFeeRupiah;
  res.json({
    periodKey,
    companyTnpvRupiah,
    companyBaseRupiah,
    managedRupiah,
    totalCompanyRupiah: companyBaseRupiah + managedRupiah,
    memberBonusRupiah,
    stockistFeeRupiah,
    totalPaidOrOwedRupiah,
    payoutRatio: companyTnpvRupiah ? totalPaidOrOwedRupiah / companyTnpvRupiah : 0,
    unpaidMemberBonusRupiah: Number(unpaid.rows[0]?.rupiah || 0),
    inactiveBonusTypes: inactive.rows.map((row) => row.bonus_type),
    poolRows
  });
}));

app.get(["/", "/index.html"], (_req, res) => {
  res.sendFile(path.join(frontendDir, "index.html"));
});

app.get(["/app.js", "/styles.css"], (req, res) => {
  res.sendFile(path.join(frontendDir, path.basename(req.path)));
});

app.use((error, _req, res, _next) => {
  const status = error.status || (error.name === "ZodError" ? 400 : 500);
  res.status(status).json({
    error: status === 500 ? "Internal server error" : error.message,
    details: error.name === "ZodError" ? error.errors : undefined
  });
});

const server = app.listen(port, () => {
  console.log(`Ascendia backend listening on http://localhost:${port}`);
});

async function shutdown(signal) {
  console.log(`${signal} received, shutting down Ascendia backend...`);
  server.close(async () => {
    try {
      await closePool();
      process.exit(0);
    } catch (error) {
      console.error("Shutdown failed", error);
      process.exit(1);
    }
  });
}

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
