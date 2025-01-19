import { db, eq } from "@/db/db";
import { ProviderType, user as users } from "@/db/schema";
import { IUser } from "@/schemas/User";
import { IGoogleUser } from "@/types/ISocial";
import { createAccountViaGoogle } from "./accounts";

import { getAccountByProviderId } from "@/data-access/accounts";
import { toUTC } from "@/utils/dateUtils";

export async function createUser(
  data: { email: string; name: string } & Partial<Omit<IUser, "email">>
) {
  const [user] = await db
    .insert(users)
    .values({
      ...data,
    })
    .returning();
  return user;
}
export async function createGoogleUserUseCase(googleUser: IGoogleUser) {
  let existingUser = await getUserByEmail(googleUser.email);

  if (!existingUser?.user) {
    existingUser.user = await createUser({
      email: googleUser.email,
      emailVerified: toUTC(new Date(), false),
      name: googleUser.name,
      image: googleUser.picture,
    });
  }
  const user = existingUser.user;
  await createAccountViaGoogle(user.id, googleUser.sub);

  return user;
}

export async function getAccountByGoogleIdUseCase(googleId: string) {
  return await getAccountByProviderId(googleId, ProviderType.google);
}

export async function getAccountByGithubIdUseCase(githubId: string) {
  return await getAccountByProviderId(githubId, ProviderType.github);
}

export const getUserByEmail = async (email: string) => {
  try {
    const user = await db.query.user.findFirst({
      where: (fields) => eq(fields.email, email),
    });

    return { user: user, error: null };
  } catch (e) {
    console.log("getUserByEmail Error", e);
    return { user: null, error: e };
  }
};

export const getUserById = async (id: string) => {
  try {
    const user = await db.query.user.findFirst({
      where: (fields) => eq(fields.id, id),
      // where: (fields, { eq }) => {
      //   return eq(fields.id, id);
      // },
    });

    return { user, error: null };
  } catch (e) {
    console.log("getUserById Error", e);
    return { user: null, error: e };
  }
};
export const getUser_Profile_Account_ById = async (id: string) => {
  try {
    const user = await db.query.user.findFirst({
      where: (fields) => eq(fields.id, id),

      // where: (fields, { eq }) => {
      //   return eq(fields.id, id);
      // },
      columns: {
        password: false,
      },
      with: {
        accounts: {
          where: (fields) => eq(fields.userId, id),
          // where: (fields, { eq }) =>  {
          //   return eq(fields.userId, id);
          // },
          limit: 1,
        },
      },
    });

    return { user, error: null };
  } catch (e) {
    return { user: null, error: e };
  }
};
export const updateUserById = async (data: Partial<IUser>) => {
  try {
    if (!data.id) {
      return null;
    }
    const updatedUser = await db
      .update(users)
      .set(data)
      .where(eq(users.id, data.id))
      .returning();
    if (!updatedUser?.[0]) {
      return {
        user: null,
        error: new Error("Error occured while updating the record!"),
      };
    }
    const responseUsers = updatedUser[0];

    return { user: responseUsers, error: null };
  } catch (e) {
    console.log("updateUser Error", e);
    return { user: null, error: e };
  }
};
