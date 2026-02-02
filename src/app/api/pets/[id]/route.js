import { NextResponse } from "next/server";
import { readFile } from "fs/promises";

const filePath = "src/data/pets.json";

export async function GET(req, { params }) {
  try {
    const id = Number(params.id);
    const data = await readFile(filePath, "utf-8");
    const pets = JSON.parse(data || "[]");
    const pet = pets.find((p) => Number(p.id) === id);
    if (!pet) return NextResponse.json({ error: "Pet não encontrado" }, { status: 404 });
    return NextResponse.json(pet, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erro ao ler dados" }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  return NextResponse.json(
    { error: "Operação de atualização desabilitada. Use a API externa configurada." },
    { status: 501 }
  );
}

export async function DELETE(req, { params }) {
  return NextResponse.json(
    { error: "Operação de exclusão desabilitada. Use a API externa configurada." },
    { status: 501 }
  );
}
