// import * as dbenv from "dotenv";
import { DB_URL } from "@/config";
import type { Config } from "drizzle-kit";
// dbenv.config({ path: ".env.local" });

// const newpath = path.resolve(__dirname, "src", "lib", "supabase", "schemas");
// const files = fs.readdirSync(newpath);
if (!DB_URL) {
  console.log("Cannot find database url");
}
// const paths = files.map((f) => `./src/lib/supabase/schemas/${f}/*.ts`);

// console.log({
//   paths,
// });
export default {
  schema: "./src/lib/drizzle/schema.ts",
  //   schema: paths,
  out: "./src/lib/drizzle/schema",

  dialect: "postgresql",
  introspect: {
    casing: "camel",
  },

  dbCredentials: {
    url: DB_URL,
    // password: DB_PASSWORD,
  },
} satisfies Config;
