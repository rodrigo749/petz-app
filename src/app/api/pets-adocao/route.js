import { NextResponse } from "next/server";
import { readFile } from "fs/promises";

const filePath = "src/data/petsAdocao.json";

// GET - lista pets para adoção
export async function GET() {
  try {
    const data = await readFile(filePath, "utf-8");
    const pets = JSON.parse(data);
    return NextResponse.json(pets, { status: 200 });
  } catch (error) {
    console.error("Erro ao ler petsAdocao.json:", error);
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
