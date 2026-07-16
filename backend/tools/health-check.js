const baseUrl = process.argv[2] || process.env.ASCENDIA_URL || "http://localhost:8080";
const path = process.argv.includes("--ready") ? "/health" : "/healthz";
const url = new URL(path, baseUrl);

const response = await fetch(url, { signal: AbortSignal.timeout(5000) });
const text = await response.text();

if (!response.ok) {
  console.error(`Health check failed: ${response.status} ${text}`);
  process.exit(1);
}

console.log(`Health check OK: ${url}`);
