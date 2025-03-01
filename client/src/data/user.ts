import { db, eq } from "@/lib/drizzle";
import { user } from "@/lib/drizzle/schema/schema";

import { IInsertUser, IUser, RegisterSchema } from "@/schema/user";

export const getUser_AccountByEmail = async (email: string) => {
  try {
    const user = await db.query.user.findFirst({
      where: (fields, { eq }) => {
        return eq(fields.email, email);
      },
      with: {
        accounts: {
          columns: {
            accessToken: false,
            refreshToken: false,
          },
        },
      },
    });

    return user;
  } catch (e) {
    console.log("createUser Error", e);
    return null;
  }
};
export const getUserByEmail = async (email: string) => {
  try {
    const user = await db.query.user.findFirst({
      where: (fields, { eq }) => {
        return eq(fields.email, email);
      },
    });

    return user;
  } catch (e) {
    console.log("createUser Error", e);
    return null;
  }
};

export const getUserById = async (id: string) => {
  try {
    const user = await db.query.user.findFirst({
      where: (fields, { eq }) => {
        return eq(fields.id, id);
      },
    });

    return user;
  } catch (e) {
    console.log("createUser Error", e);
    return null;
  }
};
export const updateUser = async (data: Partial<IUser>) => {
  try {
    if (!data.id) {
      return null;
    }
    const updatedUser = await db
      .update(user)
      .set(data)
      .where(eq(user.id, data.id))
      .returning();

    return updatedUser[0];
  } catch (e) {
    console.log("createUser Error", e);
    return null;
  }
};
export const createUser = async (data: IInsertUser) => {
  try {
    if (data.id) {
      return { error: `User with ${data.id} already exist!`, data: null };
    }
    const validations = RegisterSchema.safeParse(data);
    if (!validations.success) {
      return { error: validations.error.errors, data: null };
    }
    const validateddata = validations.data;
    const createdUser = await db
      .insert(user)
      .values(validateddata as any)
      .returning();

    return { error: null, data: createdUser[0] };
  } catch (e) {
    console.log("createUser Error", e);
    return { error: `Something went wrong Please try again`, data: null };
  }
};
