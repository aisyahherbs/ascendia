import fs from "node:fs";
import { withTransaction } from "../src/db.js";

const backupPath = process.argv[2];
if (!backupPath) {
  console.error("Usage: npm run import:prototype -- path/to/ascendia-backup.json");
  process.exit(1);
}

const raw = JSON.parse(fs.readFileSync(backupPath, "utf8"));
const data = raw.data || raw;

await withTransaction(async (client) => {
  for (const stockist of data.stockists || []) {
    await client.query(
      `
        insert into stockists (id, name, email, phone, area, district, fee_rate, password_hash)
        values ($1, $2, $3, $4, $5, $6, $7, crypt($8, gen_salt('bf')))
        on conflict (id) do update set
          name = excluded.name,
          email = excluded.email,
          phone = excluded.phone,
          area = excluded.area,
          district = excluded.district,
          fee_rate = excluded.fee_rate,
          password_hash = excluded.password_hash
      `,
      [
        stockist.id,
        stockist.name,
        stockist.email || null,
        stockist.phone || null,
        stockist.area || "",
        stockist.district || stockist.city || stockist.area || "",
        Number(stockist.feeRate || stockist.fee_rate || 5),
        stockist.password || "ascendia"
      ]
    );
  }

  for (const admin of data.admins || []) {
    await client.query(
      `
        insert into admins (id, name, email, phone, role, area, password_hash)
        values ($1, $2, $3, $4, $5, $6, crypt($7, gen_salt('bf')))
        on conflict (id) do update set name = excluded.name, email = excluded.email, phone = excluded.phone, role = excluded.role, area = excluded.area
      `,
      [admin.id, admin.name, admin.email || null, admin.phone || null, admin.role || "Admin Cabang", admin.area || "", admin.password || "ascendia"]
    );
  }

  for (const announcement of data.announcements || []) {
    await client.query(
      `
        insert into announcements (id, title, body, audience, status, published_at)
        values ($1, $2, $3, $4, $5, coalesce($6::date, current_date))
        on conflict (id) do update set
          title = excluded.title,
          body = excluded.body,
          audience = excluded.audience,
          status = excluded.status,
          published_at = excluded.published_at,
          updated_at = now()
      `,
      [
        announcement.id,
        announcement.title || "Pengumuman",
        announcement.body || "",
        announcement.audience || "Semua Member",
        announcement.status || "Aktif",
        announcement.date || null
      ]
    );
  }

  for (const member of data.members || []) {
    await client.query(
      `
        insert into members (id, name, email, phone, sponsor_id, placement_parent_id, rank_name, manual_rank, tupo_done, stockist_id, joined_at, password_hash)
        values ($1, $2, $3, $4, nullif($5, 'Pusat'), $6, $7, $8, $9, $10, $11, crypt($12, gen_salt('bf')))
        on conflict (id) do update set
          name = excluded.name,
          email = excluded.email,
          phone = excluded.phone,
          sponsor_id = excluded.sponsor_id,
          placement_parent_id = excluded.placement_parent_id,
          rank_name = excluded.rank_name,
          manual_rank = excluded.manual_rank,
          tupo_done = excluded.tupo_done,
          stockist_id = excluded.stockist_id,
          joined_at = excluded.joined_at
      `,
      [
        member.id,
        member.name,
        member.email || null,
        member.phone || null,
        member.sponsor || "Pusat",
        member.parent || null,
        member.rank || "Member",
        Boolean(member.manualRank),
        Boolean(member.tupoDone),
        member.stockist,
        member.joinedAt || new Date().toISOString().slice(0, 10),
        member.password || "ascendia"
      ]
    );
    await client.query(
      `
        insert into member_period_metrics (period_key, member_id, ppv, appv, tnpv, atnpv, gpv, left_pv, right_pv, carry_pv, carry_age, rank_name)
        values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        on conflict (period_key, member_id) do update set
          ppv = excluded.ppv,
          appv = excluded.appv,
          tnpv = excluded.tnpv,
          atnpv = excluded.atnpv,
          gpv = excluded.gpv,
          left_pv = excluded.left_pv,
          right_pv = excluded.right_pv,
          carry_pv = excluded.carry_pv,
          carry_age = excluded.carry_age,
          rank_name = excluded.rank_name,
          updated_at = now()
      `,
      [
        data.selectedMonth || "2026-06",
        member.id,
        Number(member.ppv || 0),
        Number(member.cpv || member.appv || 0),
        Number(member.tnpv || 0),
        Number(member.atnpv || 0),
        Number(member.gpv || 0),
        Number(member.leftPv || 0),
        Number(member.rightPv || 0),
        Number(member.carry || 0),
        Number(member.carryAge || 0),
        member.rank || "Member"
      ]
    );
  }

  for (const [periodKey, periodRows] of Object.entries(data.periods || {})) {
    for (const [memberId, record] of Object.entries(periodRows || {})) {
      if (memberId.startsWith("_")) continue;
      const ppv = Object.prototype.hasOwnProperty.call(record, "ppvP1") || Object.prototype.hasOwnProperty.call(record, "ppvP2")
        ? Number(record.ppvP1 || 0) + Number(record.ppvP2 || 0)
        : Number(record.ppv || 0);
      await client.query(
        `
          insert into member_period_metrics (period_key, member_id, ppv)
          values ($1, $2, $3)
          on conflict (period_key, member_id) do update set
            ppv = excluded.ppv,
            updated_at = now()
        `,
        [periodKey, memberId, ppv]
      );
    }
  }
});

console.log(`Imported prototype backup: ${backupPath}`);
