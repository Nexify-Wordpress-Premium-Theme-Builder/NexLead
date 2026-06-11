import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

import { getServerAuthSessionUser } from "@/lib/auth";

export async function GET() {
  const user = await getServerAuthSessionUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({ user });
}
