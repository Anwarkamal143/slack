import { ApiModelDataTypes, ApiModelMapping } from "@/queries/apiModelMapping";

type WithType<L extends keyof typeof ApiModelMapping, M> = [M] extends [never]
  ? ApiModelDataTypes[L]
  : ApiModelDataTypes[L] & M;

type UnionIfBPresent<A, B> = [B] extends [never] ? A : A & B;
type ApiModelKey = keyof typeof ApiModelMapping;
