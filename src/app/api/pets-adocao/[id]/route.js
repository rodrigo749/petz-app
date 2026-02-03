import { NextResponse } from "next/server";

const API_BASE = "http://localhost:3000";

// PUT - atualizar pet
export async function PUT(req, { params }) {
  try {
    const body = await req.json();

    const res = await fetch(`${API_BASE}/api/pets/${params.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("Erro no PUT (proxy):", error);
    return NextResponse.json({ error: "Erro ao atualizar dados" }, { status: 500 });
  }
}

// DELETE - remover pet
export async function DELETE(req, { params }) {
  try {
    const res = await fetch(`${API_BASE}/api/pets/${params.id}`, {
      method: "DELETE",
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("Erro no DELETE (proxy):", error);
    return NextResponse.json({ error: "Erro ao excluir" }, { status: 500 });
  }
}
