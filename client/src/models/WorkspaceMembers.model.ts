import { IWorkspaceMember } from "@/features/workspaces/schemas";
import Model from ".";

class WorkspaceMembersModel extends Model<IWorkspaceMember> {
  constructor() {
    super("/workspace-members", "public-1");
  }
  // async requestCredit() {
  //   const res = await request("/add-beta-credits", {
  //     method: "POST",
  //     data: {},
  //   });

  //   return res;
  // }
}

export default new WorkspaceMembersModel();
