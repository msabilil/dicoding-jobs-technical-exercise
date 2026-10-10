import { defineConfig } from "@playwright/test";
import path from "node:path";

const backendDir = path.resolve(__dirname, "../backend");
const testDatabase = path.resolve(backendDir, "database/playwright.sqlite");

export default defineConfig({
  testDir: "./tests/e2e",
  globalSetup: "./tests/global-setup.ts",
  use: { baseURL: "http://127.0.0.1:3000", browserName: "chromium" },
  webServer: [
    { command: "php artisan serve --host=127.0.0.1 --port=8000", cwd: backendDir, env: { DB_CONNECTION: "sqlite", DB_DATABASE: testDatabase }, url: "http://127.0.0.1:8000/up", reuseExistingServer: false, timeout: 120000 },
    { command: "npm run dev -- --hostname 127.0.0.1 --port 3000", url: "http://127.0.0.1:3000", reuseExistingServer: !process.env.CI, timeout: 120000 },
  ],
});
