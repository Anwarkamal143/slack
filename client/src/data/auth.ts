export const deleteSessionById = async (id: string) => {
  try {
    if (!id) {
      return null;
    }

    // const deletedId = await db
    //   .delete(session)
    //   .where(eq(session.id, id))
    //   .returning({ id: session.id });

    return "dadsf";
  } catch (e) {
    console.log("Session Delete Error", e);
    return null;
  }
};
