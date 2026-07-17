import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { closePool, query } from "../src/db.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const defaultDir = path.resolve(__dirname, "../backups");
const backupDir = process.argv[2] ? path.resolve(process.argv[2]) : defaultDir;
const stamp = new Date().toISOString().replace(/[:.]/g, "-");
const filePath = path.join(backupDir, `ascendia-backup-${stamp}.json`);

const tables = [
  "stockists",
  "admins",
  "announcements",
  "members",
  "pv_transactions",
  "member_period_metrics",
  "bonus_settings",
  "bonus_runs",
  "bonus_ledger",
  "member_bonus_payments",
  "stockist_payouts",
  "audit_logs"
];

fs.mkdirSync(backupDir, { recursive: true });

const backup = {
  createdAt: new Date().toISOString(),
  tables: {}
};

try {
  for (const table of tables) {
    const result = await query(`select * from ${table}`);
    backup.tables[table] = result.rows;
  }

  fs.writeFileSync(filePath, JSON.stringify(backup, null, 2));
  console.log(`Backup saved: ${filePath}`);
} finally {
  await closePool();
}
