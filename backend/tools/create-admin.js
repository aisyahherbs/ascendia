import { closePool, query } from "../src/db.js";

function arg(name, fallback = "") {
  const prefix = `--${name}=`;
  const found = process.argv.find((item) => item.startsWith(prefix));
  return found ? found.slice(prefix.length) : process.env[`ASCENDIA_${name.toUpperCase()}`] || fallback;
}

const id = arg("id", "ADM-001").trim();
const name = arg("name", "Admin Pusat").trim();
const email = arg("email", "").trim() || null;
const phone = arg("phone", "").trim() || null;
const password = arg("password", "").trim();

if (!id || !name || !password) {
  console.error("Usage: npm run create:admin -- --id=ADM-001 --name=\"Admin Pusat\" --password=\"sandi-kuat\"");
  process.exit(1);
}

if (password.length < 8) {
  console.error("Password admin minimal 8 karakter.");
  process.exit(1);
}

try {
  await query(
    `
      insert into admins (id, name, email, phone, role, area, password_hash, active, deleted_at)
      values ($1, $2, $3, $4, 'Admin Pusat', 'Pusat', crypt($5, gen_salt('bf')), true, null)
      on conflict (id) do update set
        name = excluded.name,
        email = excluded.email,
        phone = excluded.phone,
        role = 'Admin Pusat',
        area = 'Pusat',
        password_hash = excluded.password_hash,
        active = true,
        deleted_at = null,
        updated_at = now()
    `,
    [id, name, email, phone, password]
  );
  console.log(`Admin pusat siap: ${id}`);
} finally {
  await closePool();
}
