import { db } from "@/db/db";
import { profile, Profile } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function createProfile(
  userId: string,
  name: string,
  image?: string
) {
  const [p] = await db
    .insert(profile)
    .values({
      userId,
      image,
      name,
    })
    .onConflictDoNothing()
    .returning();
  return p;
}

export async function updateProfile(
  userId: string,
  updateProfile: Partial<Profile>
) {
  await db.update(profile).set(updateProfile).where(eq(profile.userId, userId));
}

export async function getProfile(userId: string) {
  const userProfile = await db.query.profile.findFirst({
    where: eq(profile.userId, userId),
  });

  return userProfile;
}
