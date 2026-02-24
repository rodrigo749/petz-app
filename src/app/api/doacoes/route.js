import doacoes from "@/data/doacoesApoio.json";
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(doacoes);
}
