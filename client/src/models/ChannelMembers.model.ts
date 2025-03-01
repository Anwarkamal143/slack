import { IChannelMember } from "@/features/channels/schema";
import Model from ".";

class ChannelMembersModel extends Model<IChannelMember> {
  constructor() {
    super("/members", "public-1");
  }
  // async requestCredit() {
  //   const res = await request("/add-beta-credits", {
  //     method: "POST",
  //     data: {},
  //   });

  //   return res;
  // }
}

export default new ChannelMembersModel();
