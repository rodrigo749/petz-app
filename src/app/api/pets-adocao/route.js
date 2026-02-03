import { NextResponse } from "next/server";
import { readFile } from "fs/promises";

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

// POST - removido - não salva mais em JSON
export async function POST(req) {
  return NextResponse.json(
    { error: "Operação de cadastro desabilitada. Use a API externa configurada." },
    { status: 501 }
  );
}
