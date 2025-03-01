import { StatusCodeNumbers } from "@/lib/errorCodes";

type ApiResponse<T> = {
  data: T;
  cursor?: { [key: string]: string } | string | number;
  [key: string]: unknown;
};
type IPaginationMeta = {
  nextCursor?: number | string;
  previousCursor?: number | string;
  totalRecords: number;
  totalPages: number;
  hasNextPage: boolean;
  pageSize: number;
  page?: number;
  nextPage?: number;
};
type IApiResponse<T> = {
  message: String;
  data?: T;
  success?: true | false;
  status: StatusCodeNumbers;
  time: number;
  cursor?: { [key: string]: string } | string | number;
  metadata?: { [key: string]: string } | string | number;
  pagination_meta?: IPaginationMeta;
  [key: string]: unknown;
};
type ISingleApiResponse<T> = T & {
  [key: string]: unknown;
};
