import { StatusCodeNumbers } from "@/lib/errorCodes";

type IResponseType<T> = {
  message: String;
  data?: T;
  success?: true | false;
  status: StatusCodeNumbers;
  time: number;
};
