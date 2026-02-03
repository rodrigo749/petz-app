import { NextResponse } from "next/server";
import { readFile } from "fs/promises";

const filePath = "src/data/petsPerdidos.json";

// GET → retorna um pet perdido por ID
export async function GET(_req, { params }) {
  try {
    const { id } = params;

    const data = await readFile(filePath, "utf-8");
    const pets = JSON.parse(data);

    const pet = pets.find((p) => String(p.id) === String(id));

    if (!pet) {
      return NextResponse.json({ error: "Pet não encontrado" }, { status: 404 });
    }

    return NextResponse.json(pet, { status: 200 });
  } catch (error) {
    console.error("Erro ao ler petsPerdidos.json:", error);
    return NextResponse.json({ error: "Erro ao carregar dados" }, { status: 500 });
  }
}

// PUT - removido - não salva mais em JSON
export async function PUT(req, { params }) {
  return NextResponse.json(
    { error: "Operação de atualização desabilitada. Use a API externa configurada." },
    { status: 501 }
  );
}

// DELETE - removido - não salva mais em JSON
export async function DELETE(_req, { params }) {
  return NextResponse.json(
    { error: "Operação de exclusão desabilitada. Use a API externa configurada." },
    { status: 501 }
  );
}

