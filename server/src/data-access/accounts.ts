import { db } from "@/db/db";
import { accounts, AccountType, ProviderType, user } from "@/db/schema";
import { createArgonHash } from "@/utils";
import crypto from "crypto";
import { and, eq } from "drizzle-orm";

const ITERATIONS = 10000;

async function hashPassword(plainTextPassword: string, salt: string) {
  return new Promise<string>((resolve, reject) => {
    crypto.pbkdf2(
      plainTextPassword,
      salt,
      ITERATIONS,
      64,
      "sha512",
      (err, derivedKey) => {
        if (err) reject(err);
        resolve(derivedKey.toString("hex"));
      }
    );
  });
}

export async function createAccount(userId: string) {
  const [account] = await db
    .insert(accounts)
    .values({
      userId,
      type: AccountType.email,
      provider: ProviderType.email,
    })
    .returning();
  return account;
}

export async function createAccountViaGithub(userId: string, githubId: string) {
  await db
    .insert(accounts)
    .values({
      userId: userId,
      provider: ProviderType.github,
      providerAccountId: githubId,
      type: AccountType.oauth,
    })
    .onConflictDoNothing()
    .returning();
}

export async function createAccountViaGoogle(userId: string, googleId: string) {
  await db
    .insert(accounts)
    .values({
      userId: userId,
      provider: ProviderType.google,
      providerAccountId: googleId,
      type: AccountType.oauth,
    })
    .onConflictDoNothing()
    .returning();
}

export async function getAccountByUserId(userId: string) {
  const account = await db.query.accounts.findFirst({
    where: eq(accounts.userId, userId),
  });

  return account;
}

export async function updatePassword(
  userId: string,
  password: string,
  trx = db
) {
  // const salt = crypto.randomBytes(128).toString("base64");
  // const hash = await hashPassword(password, salt);
  const hashedpassword = await createArgonHash(password);

  await trx
    .update(user)
    .set({
      password: hashedpassword,
    })
    .where(and(eq(user.id, userId), eq(accounts.type, AccountType.email)));
}

export async function getAccountByProviderId(
  providerId: string,
  providerType: ProviderType
) {
  return await db.query.accounts.findFirst({
    where: and(
      eq(accounts.providerAccountId, providerId),
      eq(accounts.provider, providerType)
    ),
  });
}

// export async function getAccountByGithubId(githubId: string) {
//   return await db.query.accounts.findFirst({
//     where: eq(accounts.githubId, githubId),
//   });
// }
