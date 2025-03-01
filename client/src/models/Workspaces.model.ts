import { IWorkSpace } from "@/features/workspaces/schemas";
import Model from ".";

class WorkSpacesModel extends Model<IWorkSpace> {
  constructor() {
    super("/workspaces", "public-1");
  }
}

export default new WorkSpacesModel();
