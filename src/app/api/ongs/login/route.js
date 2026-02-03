import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();

    const baseUrl =
      process.env.NEXT_PUBLIC_PETZ_API_URL || process.env.PETZ_API_URL;

    const resp = await fetch(`${baseUrl}/api/ongs/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      cache: "no-store",
    });

    const data = await resp.json().catch(() => ({}));
    return NextResponse.json(data, { status: resp.status });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Erro ao conectar com a API" },
      { status: 500 }
    );
  }
}
