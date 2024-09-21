import { IRequest } from "@/types/express";
import { NextFunction, Response } from "express";

export default function <T>(
  fn: (req: IRequest, res: Response, next: NextFunction) => Promise<T>
) {
  return (req: IRequest, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
    // fn(req, res, next).catch(err => next(err));
  };
}
