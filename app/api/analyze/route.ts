import { NextResponse } from "next/server";
import { analyzePitch } from "@/lib/analyzePitch";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { pitch?: string };
    const pitch = body.pitch;

    if (typeof pitch !== "string") {
      return NextResponse.json({ error: "Payload invalide." }, { status: 400 });
    }

    const result = await analyzePitch(pitch);
    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Analyse impossible.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
