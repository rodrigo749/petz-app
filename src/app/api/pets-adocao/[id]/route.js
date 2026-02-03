import { NextResponse } from "next/server";
import { readFile } from "fs/promises";

const API_BASE = "http://localhost:3000";

// PUT - removido - não salva mais em JSON
export async function PUT(req, { params }) {
  return NextResponse.json(
    { error: "Operação de atualização desabilitada. Use a API externa configurada." },
    { status: 501 }
  );
}

// DELETE - removido - não salva mais em JSON
export async function DELETE(req, { params }) {
  return NextResponse.json(
    { error: "Operação de exclusão desabilitada. Use a API externa configurada." },
    { status: 501 }
  );
}
