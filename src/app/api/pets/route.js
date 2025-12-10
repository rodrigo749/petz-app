import { NextResponse } from "next/server";
import { readFile, writeFile } from "fs/promises";

const filePath = "src/data/pets.json";

// GET → retorna todos os pets
export async function GET() {
  try {
    const data = await readFile(filePath, "utf-8");
    const pets = JSON.parse(data);
    return NextResponse.json(pets, { status: 200 });
  } catch (error) {
    console.error("Erro ao ler pets.json:", error);
    return NextResponse.json(
      { error: "Erro ao carregar dados" },
      { status: 500 }
    );
  }
}

// POST → salva um novo pet
export async function POST(req) {
  try {
    const newPet = await req.json();

    const data = await readFile(filePath, "utf-8");
    const pets = JSON.parse(data);

    pets.push({
      id: pets.length + 1,
      ...newPet,
      status: "adocao" // GARANTE que todo pet cadastrado aparece na página
    });

    await writeFile(filePath, JSON.stringify(pets, null, 2));

    return NextResponse.json(
      { message: "Pet salvo com sucesso!" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erro ao salvar no JSON:", error);
    return NextResponse.json(
      { error: "Erro ao salvar dados" },
      { status: 500 }
    );
  }
}
