import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

import { getServerAuthSessionUser } from "@/lib/auth";

export default async function HomePage() {
  const user = await getServerAuthSessionUser();
  redirect(user ? "/dashboard" : "/login");
}
