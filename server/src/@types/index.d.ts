/// <reference types="lucia" />
// export {};

type DatabaseSessionAttributess = {
  provider: keyof typeof import("@db/schema").ProviderType;
};
type DatabaseUserAttributess = {
  provider: keyof typeof import("@db/schema").ProviderType;
};
// declare module "lucia" {
//   interface Register {
//     // Lucia: Awaited<ReturnType<typeof import("@utils/lucia").getLucia>>;
//     DatabaseSessionAttributes: DatabaseSessionAttributess;
//     DatabaseUserAttributes: DatabaseUserAttributess;
//   }
//   // interface DatabaseSessionAttributes extends DatabaseSessionAttributess {}
// }
declare namespace Lucia {
  type Auth = import("./lucia.js").Auth;
  type DatabaseUserAttributes = DatabaseSessionAttributess;
  type DatabaseSessionAttributes = DatabaseUserAttributess;
}
