"use client";
import { safeParseBigInt } from "@/lib";
import { useParams } from "next/navigation";

const useWorkSpaceId = (): number | undefined => {
  const paramsIds = useParams<{ workspaceId: string }>();

  const workspaceId = safeParseBigInt(paramsIds.workspaceId, undefined) as any;
  return workspaceId;
};

export default useWorkSpaceId;
