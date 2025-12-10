import { NextResponse } from "next/server";
import { readFile, writeFile } from "fs/promises";

const filePath = "src/data/petsPerdidos.json";

// GET - lista pets perdidos
export async function GET() {
  try {
    const data = await readFile(filePath, "utf-8");
    const pets = JSON.parse(data);
    return NextResponse.json(pets, { status: 200 });
  } catch (error) {
    console.error("Erro ao ler petsPerdidos.json:", error);
    return NextResponse.json({ error: "Erro ao carregar dados" }, { status: 500 });
  }
}

// POST - cadastra pet perdido
export async function POST(req) {
  try {
    const newPet = await req.json();

    const data = await readFile(filePath, "utf-8");
    const pets = JSON.parse(data);

    const maiorId = pets.length > 0 ? Math.max(...pets.map((p) => p.id)) : 0;
    const novoId = maiorId + 1;

    pets.push({
      id: novoId,
      ...newPet,
      status: "perdido",
    });

    await writeFile(filePath, JSON.stringify(pets, null, 2));

    return NextResponse.json({ message: "Pet perdido cadastrado com sucesso!" }, { status: 201 });
  } catch (error) {
    console.error("Erro ao salvar no JSON:", error);
    return NextResponse.json({ error: "Erro ao salvar dados" }, { status: 500 });
  }
}
