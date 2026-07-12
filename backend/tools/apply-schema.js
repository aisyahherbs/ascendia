import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { closePool, query } from "../src/db.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const schemaPath = path.resolve(__dirname, "../db/schema.sql");
const schema = fs.readFileSync(schemaPath, "utf8");

try {
  await query(schema);
  console.log(`Schema applied: ${schemaPath}`);
} finally {
  await closePool();
}
