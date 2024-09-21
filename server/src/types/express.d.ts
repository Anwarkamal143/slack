// import { Language, User } from "../custom";

import { users } from "@db/schema";
import { Request } from "express";

type IUser = typeof users.$inferSelect;
// to make the file a module and avoid the TypeScript error
// export {};
type IRequest = Request & {
  user?: IUser;
};
// declare global {
//   namespace Express {
//     export interface Request {
//       //   language?: Language;
//       user?: IUser;
//     }
//   }
// }
