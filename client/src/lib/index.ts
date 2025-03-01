import { IWorkspaceMember } from "@/features/workspaces/schemas";
import _omit from "lodash.omit";
export const isArray = (args: any) => Array.isArray(args);

export const wait = async (time: number = 0) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};
export const normalizeObjectForAPI = <T>(
  object: T,
  omit: (keyof T)[] = [],
  ignore: (keyof T)[] = []
): Partial<T> => {
  return _omit(
    object as any,
    ["created_at", "slug", "updated_at", "id", "is_deleted", ...omit].filter(
      (item) => !ignore.includes(item as keyof T)
    )
  ) as Partial<T>;
};

export function safeParseBigInt(str: string | number, defaultValue = 0) {
  if (str === null || str === undefined) return defaultValue;
  if (typeof str !== "string" && typeof str !== "number") return defaultValue;

  try {
    const trimmed = String(str).trim(); // Convert to string & trim spaces
    if (!/^-?\d+$/.test(trimmed)) return defaultValue; // Ensure it's a valid integer string
    return parseInt(trimmed);
  } catch {
    return defaultValue;
  }
}

export const canAdminAccess = (member?: IWorkspaceMember) => {
  return member?.role === "admin";
};
