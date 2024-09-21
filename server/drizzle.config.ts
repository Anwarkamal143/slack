import "dotenv/config";
import { defineConfig } from "drizzle-kit";
import { DB_URL } from "./src/constants";
if (!DB_URL) {
  console.log("Cannot find database url");
}
export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./migrations",
  dialect: "postgresql", // 'postgresql' | 'mysql' | 'sqlite'
  // driver: 'pg',
  dbCredentials: {
    url: DB_URL,
    // password: DB_PASSWORD,
  },
});
