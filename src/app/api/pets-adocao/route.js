import { NextResponse } from "next/server";

const API_BASE = "http://localhost:3000";

// GET - lista pets (vem do backend)
export async function GET() {
  try {
    const res = await fetch(`${API_BASE}/api/pets`, { cache: "no-store" });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("Erro no GET /pets-adocao (proxy):", error);
    return NextResponse.json({ error: "Erro ao carregar dados" }, { status: 500 });
  }
}

// POST - cadastra pet (vai pro backend)
export async function POST(req) {
  try {
    const body = await req.json();

    const res = await fetch(`${API_BASE}/api/pets`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("Erro no POST /pets-adocao (proxy):", error);
    return NextResponse.json({ error: "Erro ao salvar dados" }, { status: 500 });
  }
}
