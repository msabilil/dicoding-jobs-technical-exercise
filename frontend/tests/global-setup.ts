import { existsSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import path from "node:path";

export default async function globalSetup() {
  const backendDir = path.resolve(__dirname, "../../backend");
  const database = path.resolve(backendDir, "database/playwright.sqlite");
  if (!existsSync(database)) writeFileSync(database, "");
  execFileSync("php", ["artisan", "migrate", "--force"], {
    cwd: backendDir,
    env: { ...process.env, DB_CONNECTION: "sqlite", DB_DATABASE: database },
    stdio: "inherit",
  });
}
