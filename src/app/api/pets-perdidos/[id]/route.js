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
    // obtenha um identificador de usuário confiável da requisição
    // aceita header 'x-usuario-id' ou 'authorization: Bearer <id>' ou, como fallback, body.usuarioId
    const authHeader = req.headers.get('x-usuario-id') || req.headers.get('authorization');
    let userId = null;
    if (authHeader) {
      if (authHeader.startsWith && authHeader.startsWith('Bearer ')) {
        userId = authHeader.split(' ')[1];
      } else {
        userId = authHeader;
      }
    }
    if (!userId && body && body.usuarioId) userId = body.usuarioId;

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await readFile(filePath, 'utf-8');
    const pets = JSON.parse(data);

    const index = pets.findIndex((p) => String(p.id) === String(id));
    if (index === -1) {
      return NextResponse.json({ error: 'Pet não encontrado' }, { status: 404 });
    }

    // validação: somente o dono (pet.usuarioId) pode atualizar
    const pet = pets[index];
    if (!pet.usuarioId || String(pet.usuarioId) !== String(userId)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Mantém id e garante status "perdido"
    const atualizado = {
      ...pet,
      ...body,
      id: pet.id,
      status: 'perdido',
    };

    pets[index] = atualizado;

    await writeFile(filePath, JSON.stringify(pets, null, 2), 'utf-8');

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

    // obtenha usuário da requisição
    const authHeader = _req.headers.get('x-usuario-id') || _req.headers.get('authorization');
    let userId = null;
    if (authHeader) {
      if (authHeader.startsWith && authHeader.startsWith('Bearer ')) {
        userId = authHeader.split(' ')[1];
      } else {
        userId = authHeader;
      }
    }

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await readFile(filePath, 'utf-8');
    const pets = JSON.parse(data);

    const index = pets.findIndex((p) => String(p.id) === String(id));
    if (index === -1) {
      return NextResponse.json({ error: 'Pet não encontrado' }, { status: 404 });
    }

    const pet = pets[index];
    if (!pet.usuarioId || String(pet.usuarioId) !== String(userId)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const removido = pets.splice(index, 1)[0];

    await writeFile(filePath, JSON.stringify(pets, null, 2), 'utf-8');

    return NextResponse.json(
      { message: 'Pet removido com sucesso', removido },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erro ao remover pet perdido:", error);
    return NextResponse.json({ error: "Erro ao salvar dados" }, { status: 500 });
  }
}

