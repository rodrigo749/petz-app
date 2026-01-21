import doacoes from "@/data/doacoesApoio.json";
import { NextResponse } from "next/server";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const ongId = searchParams.get("ongId");

  const lista = ongId
    ? doacoes.filter((d) => String(d.ongId) === String(ongId))
    : doacoes;

  return NextResponse.json(lista);
}
