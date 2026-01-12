import { NextResponse } from "next/server";
import { readFile, writeFile } from "fs/promises";

const filePath = "src/data/petsAdocao.json";

// PUT - atualizar pet de adoção
export async function PUT(req, { params }) {
  try {
    const id = parseInt(params.id);
    const updates = await req.json();

    const data = await readFile(filePath, "utf-8");
    const pets = JSON.parse(data);

    const index = pets.findIndex((p) => p.id === id);
    if (index === -1) {
      return NextResponse.json({ error: "Pet não encontrado" }, { status: 404 });
    }

    pets[index] = { ...pets[index], ...updates };

    await writeFile(filePath, JSON.stringify(pets, null, 2));

    return NextResponse.json({ message: "Pet atualizado com sucesso" }, { status: 200 });
  } catch (error) {
    console.error("Erro no PUT:", error);
    return NextResponse.json({ error: "Erro ao atualizar dados" }, { status: 500 });
  }
}

// DELETE - remover pet de adoção
export async function DELETE(req, { params }) {
  try {
    const id = parseInt(params.id);

    const data = await readFile(filePath, "utf-8");
    let pets = JSON.parse(data);

    pets = pets.filter((p) => p.id !== id);

    await writeFile(filePath, JSON.stringify(pets, null, 2));

    return NextResponse.json({ message: "Pet removido" }, { status: 200 });
  } catch (error) {
    console.error("Erro no DELETE:", error);
    return NextResponse.json({ error: "Erro ao excluir" }, { status: 500 });
  }
}
