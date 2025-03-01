import { IChannel } from "@/features/channels/schema";
import Model from ".";

class ChannelModel extends Model<IChannel> {
  constructor() {
    super("/channels", "public-1");
  }
  // async requestCredit() {
  //   const res = await request("/add-beta-credits", {
  //     method: "POST",
  //     data: {},
  //   });

  //   return res;
  // }
}

export default new ChannelModel();
