import { AccountType, ProviderType } from "@/db";
import { db } from "@/db/db";
import { accounts } from "@/db/schema";
import { STATUS_CODES } from "@/utils/ErrorsUtil";
// import crypto from "crypto";
import { and, eq } from "drizzle-orm";

// const ITERATIONS = 10000;

// async function hashPassword(plainTextPassword: string, salt: string) {
//   return new Promise<string>((resolve, reject) => {
//     crypto.pbkdf2(
//       plainTextPassword,
//       salt,
//       ITERATIONS,
//       64,
//       "sha512",
//       (err, derivedKey) => {
//         if (err) reject(err);
//         resolve(derivedKey.toString("hex"));
//       }
//     );
//   });
// }

export async function createAccount(userId: number) {
  try {
    const [account] = await db
      .insert(accounts)
      .values({
        userId,
        type: AccountType.email,
        provider: ProviderType.email,
      })
      .returning();
    if (!account) {
      return {
        data: null,
        error: "Account not created",
        status: STATUS_CODES.BAD_REQUEST,
      };
    }
    return {
      data: account,
      error: null,
      status: STATUS_CODES.OK,
    };
  } catch (error) {
    return {
      data: null,
      error: "Internal server error",
      status: STATUS_CODES.INTERNAL_SERVER_ERROR,
    };
  }
}

export async function createAccountViaGithub(userId: number, githubId: string) {
  try {
    const [account] = await db
      .insert(accounts)
      .values({
        userId: userId,
        provider: ProviderType.github,
        providerAccountId: githubId,
        type: AccountType.oauth,
      })
      .onConflictDoNothing()
      .returning();
    if (!account) {
      return {
        data: null,
        error: "Account not created",
        status: STATUS_CODES.BAD_REQUEST,
      };
    }
    return {
      data: account,
      error: null,
      status: STATUS_CODES.OK,
    };
  } catch (error) {
    return {
      data: null,
      error: "Internal server error",
      status: STATUS_CODES.INTERNAL_SERVER_ERROR,
    };
  }
}

export async function createAccountViaGoogle(userId: number, googleId: string) {
  try {
    const account = await db
      .insert(accounts)
      .values({
        userId: userId,
        provider: ProviderType.google,
        providerAccountId: googleId,
        type: AccountType.oauth,
      })
      .onConflictDoNothing()
      .returning();
    if (!account) {
      return {
        data: null,
        error: "Account not created",
        status: STATUS_CODES.BAD_REQUEST,
      };
    }
    return {
      data: account,
      error: null,
      status: STATUS_CODES.OK,
    };
  } catch (error) {
    return {
      data: null,
      error: "Internal server error",
      status: STATUS_CODES.INTERNAL_SERVER_ERROR,
    };
  }
}

export async function getAccountByUserId(userId: number) {
  try {
    const account = await db.query.accounts.findFirst({
      where: eq(accounts.userId, userId),
    });
    if (!account) {
      return {
        data: null,
        error: "Account not found",
        status: STATUS_CODES.BAD_REQUEST,
      };
    }
    return {
      data: account,
      error: null,
      status: STATUS_CODES.OK,
    };
  } catch (error) {
    return {
      data: null,
      error: "Internal server error",
      status: STATUS_CODES.INTERNAL_SERVER_ERROR,
    };
  }
}

// export async function updatePassword(
//   userId: number,
//   password: string,
//   trx = db
// ) {
//   // const salt = crypto.randomBytes(128).toString("base64");
//   // const hash = await hashPassword(password, salt);
//   const hashedpassword = await createArgonHash(password);

//   await trx
//     .update(user)
//     .set({
//       password: hashedpassword,
//     })
//     .where(and(eq(user.id, userId), eq(accounts.type, AccountType.email)));
// }

export async function getAccountByProviderId(
  providerId: string,
  providerType: ProviderType
) {
  try {
    const account = await db.query.accounts.findFirst({
      where: and(
        eq(accounts.providerAccountId, providerId),
        eq(accounts.provider, providerType)
      ),
    });
    if (!account) {
      return {
        data: null,
        error: "Account not found",
        status: STATUS_CODES.BAD_REQUEST,
      };
    }
    return {
      data: account,
      error: null,
      status: STATUS_CODES.OK,
    };
  } catch (error) {
    return {
      data: null,
      error: "Internal server error",
      status: STATUS_CODES.INTERNAL_SERVER_ERROR,
    };
  }
}

// export async function getAccountByGithubId(githubId: string) {
//   return await db.query.accounts.findFirst({
//     where: eq(accounts.githubId, githubId),
//   });
// }
