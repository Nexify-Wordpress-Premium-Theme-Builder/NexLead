import { NextResponse } from "next/server";

import { checkWebSupabaseConnection } from "@/lib/supabase";

export async function GET() {
  const supabase = await checkWebSupabaseConnection();

  return NextResponse.json({
    status: "ok",
    service: "web",
    checks: {
      supabase,
    },
  });
}
