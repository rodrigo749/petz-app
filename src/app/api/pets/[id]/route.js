import { NextResponse } from "next/server";
import { readFile, writeFile } from "fs/promises";

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
  try {
    const id = Number(params.id);
    const body = await req.json();
    const data = await readFile(filePath, "utf-8");
    const pets = JSON.parse(data || "[]");
    const idx = pets.findIndex((p) => Number(p.id) === id);
    if (idx === -1) return NextResponse.json({ error: "Pet não encontrado" }, { status: 404 });

    pets[idx] = { ...pets[idx], ...body, id: pets[idx].id };
    await writeFile(filePath, JSON.stringify(pets, null, 2), "utf-8");
    return NextResponse.json({ message: "Atualizado" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erro ao atualizar" }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const id = Number(params.id);
    const data = await readFile(filePath, "utf-8");
    const pets = JSON.parse(data || "[]");
    const idx = pets.findIndex((p) => Number(p.id) === id);
    if (idx === -1) return NextResponse.json({ error: "Pet não encontrado" }, { status: 404 });
    pets.splice(idx, 1);
    await writeFile(filePath, JSON.stringify(pets, null, 2), "utf-8");
    return NextResponse.json({ message: "Removido" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erro ao remover" }, { status: 500 });
  }
}
