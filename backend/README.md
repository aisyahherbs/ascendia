# Ascendia Enterprise Backend

Backend ini adalah pondasi agar sistem bisa naik dari prototype `localStorage` menjadi sistem perusahaan dengan database.

## Target skala

- Data member disimpan di PostgreSQL, bukan browser.
- Tabel besar memakai index dan pagination.
- Struktur sponsor dan placement dibuka bertahap melalui API, bukan dimuat 1 juta data sekaligus.
- Bonus periode dijalankan di backend dan hasilnya disimpan di `bonus_ledger`.

## Menjalankan lokal

1. Install PostgreSQL.
2. Buat database dan user.
3. Copy `.env.example` menjadi `.env`, lalu ubah `DATABASE_URL`.
   Untuk server publik, wajib ubah `AUTH_SECRET` dan set `DEV_ALLOW_OPERATOR_HEADER=false`.
4. Jalankan schema:

```bash
npm run db:schema
```

5. Install dependency dan start API:

```bash
npm install
npm run dev
```

6. Cek API:

```bash
curl http://localhost:8080/health
```

Atau:

```bash
npm run health -- http://localhost:8080
npm run health -- http://localhost:8080 --ready
```

`--ready` ikut mengecek koneksi database.

7. Buka frontend dari backend:

```text
http://localhost:8080
```

## Import data prototype

Di prototype lokal, klik `Backup`, lalu import file JSON itu:

```bash
npm run import:prototype -- ../ascendia-backup-2026-07-04.json
```

## Setup admin pertama

Jika database masih kosong:

```bash
npm run create:admin -- --id=ADM-001 --name="Admin Pusat" --password="SandiKuatAnda"
```

## Cek konfigurasi

```bash
npm run doctor
```

## API penting

- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/members?limit=50&cursor=ASC-1001&q=nadia&period=2026-06`
- `GET /api/members/:id/sponsor-children`
- `GET /api/members/:id/placement-children`
- `POST /api/members`
- `POST /api/periods/:period/input-ppv`
- `POST /api/periods/:period/run-bonus`
- `GET /api/periods/:period/bonus-ledger`

Endpoint produksi memakai token:

```text
Authorization: Bearer TOKEN_DARI_LOGIN
```

Header `x-operator-id` hanya boleh dipakai saat development jika `DEV_ALLOW_OPERATOR_HEADER=true`.

## Catatan produksi

- Gunakan server staging sebelum production.
- Backup database otomatis harian.
- Backup manual tersedia:

```bash
npm run backup:db
```

- Opsi PM2 tersedia di `ecosystem.config.cjs`.
- Opsi Docker tersedia lewat `../docker-compose.yml`.
- Jalankan perhitungan bonus sebagai worker/background job.
- Tambahkan test skenario bonus sebelum dipakai bayar komisi nyata.
- Jangan menampilkan seluruh member sekaligus; gunakan pagination, search server-side, dan lazy-load jaringan.
- Jangan online memakai `AUTH_SECRET` bawaan `.env.example`.
