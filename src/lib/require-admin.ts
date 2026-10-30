import "server-only";

import { connection } from "next/server";
import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth";

export async function requireAdmin() {
  await connection();

  const session = await getAdminSession();

  if (!session) {
    redirect("/admin/login");
  }

  return session;
}