import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase";

export const dynamic = "force-dynamic";

function supabaseHost(): string | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) return null;
  try {
    return new URL(url).host;
  } catch {
    return null;
  }
}

export async function GET(request: Request) {
  const expectedToken = process.env.DIAGNOSTIC_TOKEN;
  if (!expectedToken) {
    return NextResponse.json({ error: "not configured" }, { status: 404 });
  }
  if (request.headers.get("authorization") !== `Bearer ${expectedToken}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const host = supabaseHost();
  const supabase = createServiceClient();

  const { error: writeError } = await supabase
    .from("diagnostic_checks")
    .insert({ note: "health-check" });
  if (writeError) {
    return NextResponse.json(
      { ok: false, host, stage: "write", error: writeError.message },
      { status: 500 },
    );
  }

  const { error: readError } = await supabase
    .from("diagnostic_checks")
    .select("id")
    .limit(1);
  if (readError) {
    return NextResponse.json(
      { ok: false, host, stage: "read", error: readError.message },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true, host });
}
