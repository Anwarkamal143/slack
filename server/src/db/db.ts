import "dotenv/config";
import { drizzle } from "drizzle-orm/postgres-js";
// import * as dbenv from "dotenv";

import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import { DB_URL } from "../constants";
import { cLog } from "./consoleLogs";
import * as relations from "./relations";
import * as schema from "./schema";
// dbenv.config({ path: ".env.local" });
export * from "drizzle-orm";

const client = postgres(DB_URL);

export const db = drizzle(client, {
  schema: { ...schema, ...relations },
});

const migrationClient = postgres(DB_URL, { max: 1 });
const migrateDb = async () => {
  const migrationDb = drizzle(migrationClient, {
    schema,
  });
  try {
    cLog(`Migrating client`, "info");
    // await migrate(db, { migrationsFolder: "migrations" });
    await migrate(migrationDb, { migrationsFolder: "migrations" });
    cLog("Successfully Migrated", "success");
  } catch (error) {
    console.log({ error });
    cLog("Error Migrating Client", "error");
  }
};
migrateDb();
