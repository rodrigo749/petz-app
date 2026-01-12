import { NextResponse } from "next/server";
import { readFile, writeFile } from "fs/promises";

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

// PUT → atualiza um pet perdido por ID
export async function PUT(req, { params }) {
  try {
    const { id } = params;
    const body = await req.json();

    const data = await readFile(filePath, "utf-8");
    const pets = JSON.parse(data);

    const index = pets.findIndex((p) => String(p.id) === String(id));
    if (index === -1) {
      return NextResponse.json({ error: "Pet não encontrado" }, { status: 404 });
    }

    // Mantém id e garante status "perdido"
    const atualizado = {
      ...pets[index],
      ...body,
      id: pets[index].id,
      status: "perdido",
    };

    pets[index] = atualizado;

    await writeFile(filePath, JSON.stringify(pets, null, 2), "utf-8");

    return NextResponse.json(atualizado, { status: 200 });
  } catch (error) {
    console.error("Erro ao atualizar pet perdido:", error);
    return NextResponse.json({ error: "Erro ao salvar dados" }, { status: 500 });
  }
}

// DELETE → remove um pet perdido por ID
export async function DELETE(_req, { params }) {
  try {
    const { id } = params;

    const data = await readFile(filePath, "utf-8");
    const pets = JSON.parse(data);

    const index = pets.findIndex((p) => String(p.id) === String(id));
    if (index === -1) {
      return NextResponse.json({ error: "Pet não encontrado" }, { status: 404 });
    }

    const removido = pets.splice(index, 1)[0];

    await writeFile(filePath, JSON.stringify(pets, null, 2), "utf-8");

    return NextResponse.json(
      { message: "Pet removido com sucesso", removido },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erro ao remover pet perdido:", error);
    return NextResponse.json({ error: "Erro ao salvar dados" }, { status: 500 });
  }
}

