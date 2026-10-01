"use server";

import { auth } from "@/auth";
import { db } from "@/db";
import { adminUsers } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

export async function changePassword(formData: FormData) {
  const session = await auth();
  
  if (!session?.user?.email) {
    return { error: "Unauthorized" };
  }

  const currentPassword = formData.get("currentPassword") as string;
  const newPassword = formData.get("newPassword") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!currentPassword || !newPassword || !confirmPassword) {
    return { error: "All fields are required" };
  }

  if (newPassword !== confirmPassword) {
    return { error: "New passwords do not match" };
  }

  if (newPassword.length < 8) {
    return { error: "New password must be at least 8 characters long" };
  }

  // Find the admin user in the DB
  const [admin] = await db
    .select()
    .from(adminUsers)
    .where(eq(adminUsers.username, session.user.email))
    .limit(1);

  if (!admin) {
    return { error: "Admin user not found in database" };
  }

  // Verify current password
  const isValid = await bcrypt.compare(currentPassword, admin.passwordHash);
  
  if (!isValid) {
    return { error: "Incorrect current password" };
  }

  // Hash new password
  const salt = await bcrypt.genSalt(10);
  const newPasswordHash = await bcrypt.hash(newPassword, salt);

  // Update password in DB
  await db
    .update(adminUsers)
    .set({ passwordHash: newPasswordHash, updatedAt: new Date() })
    .where(eq(adminUsers.id, admin.id));

  return { success: true };
}
