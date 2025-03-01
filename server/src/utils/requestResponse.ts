import { Response } from "express";
import { StatusCodeNumbers } from "./ErrorsUtil";
import { toUTC } from "./dateUtils";

type IResponseType = {
  message: String;
  data?: any;
  success?: true | false;
  statusCode?: StatusCodeNumbers;
  status?: "success" | "fail" | "error";
  [Key: string]: any;
};
export const response = (res: Response, props: IResponseType) => {
  const {
    message = "",
    data,
    success = true,
    statusCode = 200,
    status = "success",
    ...rest
  } = props;
  return res.status(statusCode).json({
    message,
    success,
    data,
    status,
    time: toUTC(new Date()),
    ...rest,
  });
};
