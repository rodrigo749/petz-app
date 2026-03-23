import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const data = await request.formData();
    const file = data.get("file") || data.get("imagem");

    if (!file) {
      return NextResponse.json({ message: "Nenhum arquivo enviado." }, { status: 400 });
    }

    if (!file.type || !file.type.startsWith("image/")) {
      return NextResponse.json({ message: "Apenas imagens são permitidas!" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Image = buffer.toString("base64");
    const mimeType = file.type;

    return NextResponse.json({
      message: "Upload realizado com sucesso!",
      blob: base64Image,
      mimeType: mimeType,
      filename: file.name,
      size: file.size,
    });
  } catch (error) {
    console.error("Erro no upload:", error);
    return NextResponse.json({ message: error.message || "Erro ao fazer upload." }, { status: 500 });
  }
}
