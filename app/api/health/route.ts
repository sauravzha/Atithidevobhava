import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export async function GET() {
  const startTime = Date.now();

  try {
    const adminClient = createAdminClient();
    const { error } = await adminClient
      .from("feature_flags")
      .select("key")
      .limit(1);

    const latencyMs = Date.now() - startTime;

    if (error) {
      return NextResponse.json(
        {
          status: "degraded",
          timestamp: new Date().toISOString(),
          region: process.env.VERCEL_REGION || "bom1",
          checks: {
            database: "error",
            error: error.message,
            latencyMs,
          },
        },
        { status: 503 }
      );
    }

    return NextResponse.json(
      {
        status: "healthy",
        timestamp: new Date().toISOString(),
        service: "Atithi Devo Bhava Core API",
        version: "0.1.0",
        region: process.env.VERCEL_REGION || "bom1",
        checks: {
          database: "connected",
          latencyMs,
        },
      },
      { status: 200 }
    );
  } catch (err: unknown) {
    return NextResponse.json(
      {
        status: "unhealthy",
        timestamp: new Date().toISOString(),
        error: err instanceof Error ? err.message : "Health check exception",
      },
      { status: 503 }
    );
  }
}
