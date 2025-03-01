import { IAppUser } from "@/schema/user";
import Model from ".";

class UserModel extends Model<IAppUser> {
  constructor() {
    super("/users", "public-1");
  }
  // async requestCredit() {
  //   const res = await request("/add-beta-credits", {
  //     method: "POST",
  //     data: {},
  //   });

  //   return res;
  // }
}

export default new UserModel();
