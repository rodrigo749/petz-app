import { NextResponse } from "next/server";
import { readFile, writeFile } from "fs/promises";

const filePath = "src/data/pets.json";

// PUT → Atualizar pet
export async function PUT(req, { params }) {
  try {
    const id = Number(params.id);
    const body = await req.json();

    // Ler arquivo
    const data = await readFile(filePath, "utf-8");
    const pets = JSON.parse(data);

    // Encontrar pet
    const index = pets.findIndex((p) => p.id === id);
    if (index === -1) {
      return NextResponse.json({ error: "Pet não encontrado" }, { status: 404 });
    }

    // Atualizar
    pets[index] = {
      ...pets[index],
      ...body,
    };

    // Salvar
    await writeFile(filePath, JSON.stringify(pets, null, 2));

    return NextResponse.json(
      { message: "Pet atualizado com sucesso!", pet: pets[index] },
      { status: 200 }
    );

  } catch (error) {
    console.error("Erro ao atualizar pet:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

// DELETE → Remover pet
export async function DELETE(req, { params }) {
  try {
    const id = Number(params.id);

    const data = await readFile(filePath, "utf-8");
    const pets = JSON.parse(data);

    const newPets = pets.filter((p) => p.id !== id);

    await writeFile(filePath, JSON.stringify(newPets, null, 2));

    return NextResponse.json(
      { message: "Pet excluído com sucesso!" },
      { status: 200 }
    );

  } catch (error) {
    console.error("Erro ao excluir pet:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
