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

// POST - cadastra novo pet perdido
export async function POST(req) {
  try {
    const body = await req.json();

    // validação mínima
    if (!body.nome || !body.nome.trim()) {
      return NextResponse.json({ error: "Nome é obrigatório." }, { status: 400 });
    }

    // ler pets existentes
    let pets = [];
    try {
      const data = await readFile(filePath, "utf-8");
      pets = JSON.parse(data);
    } catch {
      pets = [];
    }

    // gerar próximo id
    const maxId = pets.reduce((max, p) => Math.max(max, Number(p.id) || 0), 0);

    const novoPet = {
      id: maxId + 1,
      nome: body.nome.trim(),
      raca: body.raca || "",
      genero: body.genero || "",
      data: body.data || "",
      local: body.local || "",
      recompensa: body.recompensa || 0,
      descricao: body.descricao || "",
      imagem: body.imagem || "/images/semfoto.jpg",
      status: body.status || "perdido",
      usuarioId: body.usuarioId || null,
    };

    pets.push(novoPet);

    await writeFile(filePath, JSON.stringify(pets, null, 2), "utf-8");

    return NextResponse.json(novoPet, { status: 201 });
  } catch (error) {
    console.error("Erro ao salvar pet perdido:", error);
    return NextResponse.json({ error: "Erro ao salvar pet perdido" }, { status: 500 });
  }
}

