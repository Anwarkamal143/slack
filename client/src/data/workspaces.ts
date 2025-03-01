import { db } from "@/lib/drizzle";

export const getWorkspaceByID = async (id: string) => {
  try {
    const workSpace = await db.query.workSpaces.findFirst({
      where: (fields, { eq }) => {
        return eq(fields.id, id);
      },
    });

    return workSpace;
  } catch (e) {
    console.log("getWorkspace Error Error", e);
    return null;
  }
};
