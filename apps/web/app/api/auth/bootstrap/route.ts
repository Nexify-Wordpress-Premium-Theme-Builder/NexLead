import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

import { getServerAuthSessionUser, getServerBootstrapStatus, getServerAccessToken } from "@/lib/auth";

function getApiBaseUrl(): string {
  return process.env.NEXT_PUBLIC_API_URL?.trim() || "http://localhost:4000";
}

export async function GET() {
  const user = await getServerAuthSessionUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const bootstrap = await getServerBootstrapStatus(user.id);
  return NextResponse.json({ user, bootstrap });
}

export async function POST() {
  const user = await getServerAuthSessionUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const accessToken = await getServerAccessToken();

  if (!accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const response = await fetch(`${getApiBaseUrl()}/auth/bootstrap`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });

  const payload: unknown = await response.json();
  return NextResponse.json(payload, { status: response.status });
}
