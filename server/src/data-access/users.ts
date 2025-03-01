import { IGoogleUser } from "@/@types/ISocial";
import { db, eq } from "@/db/db";
import { user as users } from "@/db/schema";
import { IUser } from "@/schemas/User";
import { createAccountViaGoogle } from "./accounts";

import { getAccountByProviderId } from "@/data-access/accounts";
import { ProviderType } from "@/db";
import { toUTC } from "@/utils/dateUtils";
import { STATUS_CODES } from "@/utils/ErrorsUtil";

export async function createUser(
  data: { email: string; name: string } & Partial<Omit<IUser, "email">>
) {
  try {
    const [user] = await db
      .insert(users)
      .values({
        ...data,
      })
      .returning();
    if (!user) {
      return {
        data: null,
        error: "User not created",
        status: STATUS_CODES.BAD_REQUEST,
      };
    }
    return { data: user, status: STATUS_CODES.OK, error: null };
  } catch (error) {
    return {
      data: null,
      error: "Internal server error",
      status: STATUS_CODES.INTERNAL_SERVER_ERROR,
    };
  }
}
export async function createGoogleUserUseCase(googleUser: IGoogleUser) {
  try {
    let existingUser = await getUserByEmail(googleUser.email);
    let user = existingUser.data;
    if (!user) {
      const { data } = await createUser({
        email: googleUser.email,
        emailVerified: toUTC(new Date(), false),
        name: googleUser.name,
        image: googleUser.picture,
      });
      user = data;
    }
    // const user = existingUser.user;
    if (!user) {
      return {
        data: null,
        error: "User not created",
        status: STATUS_CODES.BAD_REQUEST,
      };
    }

    await createAccountViaGoogle(user.id, googleUser.sub);

    return { data: user, status: STATUS_CODES.OK, error: null };
  } catch (error) {
    return {
      data: null,
      status: STATUS_CODES.INTERNAL_SERVER_ERROR,
      error: "Internal server error",
    };
  }
}

export async function getAccountByGoogleIdUseCase(googleId: string) {
  return await getAccountByProviderId(googleId, ProviderType.google);
}

export async function getAccountByGithubIdUseCase(githubId: string) {
  return await getAccountByProviderId(githubId, ProviderType.github);
}

export const getUserByEmail = async (email: string) => {
  try {
    if (!email) {
      return {
        data: null,
        error: "Email is required",
        status: STATUS_CODES.BAD_REQUEST,
      };
    }
    const user = await db.query.user.findFirst({
      where: (fields) => eq(fields.email, email),
    });
    if (!user) {
      return {
        data: null,
        error: "User not found",
        status: STATUS_CODES.NOT_FOUND,
      };
    }
    return { data: user, error: null, status: STATUS_CODES.OK };
  } catch (e) {
    console.log("getUserByEmail Error", e);
    return {
      data: null,
      error: "Internal server error",
      status: STATUS_CODES.INTERNAL_SERVER_ERROR,
    };
  }
};

export const getUserById = async (id: number) => {
  try {
    if (!id) {
      return {
        data: null,
        error: "User Id is required",
        status: STATUS_CODES.BAD_REQUEST,
      };
    }
    const user = await db.query.user.findFirst({
      where: (fields) => eq(fields.id, id),
      // where: (fields, { eq }) => {
      //   return eq(fields.id, id);
      // },
    });
    if (!user) {
      return {
        data: null,
        error: "User not found",
        status: STATUS_CODES.NOT_FOUND,
      };
    }
    return { data: user, error: null, status: STATUS_CODES.OK };
  } catch (e) {
    console.log("getUserById Error", e);
    return {
      data: null,
      error: "Internal server error",
      status: STATUS_CODES.INTERNAL_SERVER_ERROR,
    };
  }
};
export const getUser_Profile_Account_ById = async (id: number) => {
  try {
    if (!id) {
      return {
        data: null,
        error: "User Id is required",
        status: STATUS_CODES.BAD_REQUEST,
      };
    }
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
    if (!user) {
      return {
        data: null,
        error: "User not found",
        status: STATUS_CODES.NOT_FOUND,
      };
    }
    return { data: user, error: null, status: STATUS_CODES.OK };
  } catch (e) {
    return {
      data: null,
      error: "Internal server error",
      status: STATUS_CODES.INTERNAL_SERVER_ERROR,
    };
  }
};
export const updateUserById = async (data: Partial<IUser>) => {
  try {
    if (!data.id) {
      return {
        data: null,
        error: "User Id is required",
        status: STATUS_CODES.BAD_REQUEST,
      };
    }
    const [user] = await db
      .update(users)
      .set(data)
      .where(eq(users.id, data.id))
      .returning();
    if (!user) {
      return {
        data: null,
        error: "User not updated",
        status: STATUS_CODES.BAD_REQUEST,
      };
    }

    return { data: user, status: STATUS_CODES.OK, error: null };
  } catch (e) {
    console.log("updateUser Error", e);
    return {
      data: null,
      error: "Internal server error",
      status: STATUS_CODES.BAD_REQUEST,
    };
  }
};
