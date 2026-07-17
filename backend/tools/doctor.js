import { closePool, query } from "../src/db.js";

const requiredTables = [
  "stockists",
  "admins",
  "announcements",
  "members",
  "pv_transactions",
  "member_period_metrics",
  "bonus_settings",
  "bonus_ledger",
  "member_bonus_payments",
  "stockist_payouts",
  "audit_logs"
];

const checks = [];

function check(name, ok, note = "") {
  checks.push({ name, ok, note });
}

function secretLooksSafe(value) {
  return typeof value === "string"
    && value.length >= 32
    && ![
      "change-this-secret-before-production",
      "change_this_to_a_long_random_secret_before_public_access",
      "isi_rahasia_panjang"
    ].includes(value);
}

check("DATABASE_URL terisi", Boolean(process.env.DATABASE_URL));
check("AUTH_SECRET kuat", secretLooksSafe(process.env.AUTH_SECRET || ""), "minimal 32 karakter acak");
check("DEV_ALLOW_OPERATOR_HEADER mati saat production", process.env.NODE_ENV !== "production" || process.env.DEV_ALLOW_OPERATOR_HEADER !== "true");
check("CORS_ORIGIN production HTTPS", process.env.NODE_ENV !== "production" || String(process.env.CORS_ORIGIN || "").startsWith("https://"));

try {
  await query("select 1");
  check("Database terkoneksi", true);

  const tableResult = await query(
    `
      select table_name
      from information_schema.tables
      where table_schema = 'public' and table_name = any($1)
    `,
    [requiredTables]
  );
  const existingTables = new Set(tableResult.rows.map((row) => row.table_name));
  requiredTables.forEach((table) => check(`Tabel ${table}`, existingTables.has(table)));

  const adminResult = await query("select count(*)::int as count from admins where active = true and role = 'Admin Pusat'");
  check("Admin pusat aktif tersedia", Number(adminResult.rows[0]?.count || 0) > 0, "buat dengan npm run create:admin");

  const bonusSettings = await query("select count(*)::int as count from bonus_settings");
  check("Bonus settings lengkap", Number(bonusSettings.rows[0]?.count || 0) >= 5);
} catch (error) {
  check("Database terkoneksi", false, error.message);
} finally {
  await closePool();
}

let failed = 0;
checks.forEach((item) => {
  if (!item.ok) failed += 1;
  console.log(`${item.ok ? "OK" : "FAIL"} - ${item.name}${item.note ? ` (${item.note})` : ""}`);
});

if (failed) {
  console.error(`Doctor selesai: ${failed} masalah perlu diperbaiki.`);
  process.exit(1);
}

console.log("Doctor selesai: konfigurasi dasar siap.");
