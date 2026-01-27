"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DevLoginSim() {
  const router = useRouter();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tipo = params.get("tipo") || "usuario";
    const payload =
      tipo === "ong"
        ? { id: 2, tipo: "ong", nome: "Minha ONG", imagem: "" }
        : { id: 1, tipo: "usuario", nome: "Teste", imagem: "" };

    localStorage.setItem("usuarioLogado", JSON.stringify(payload));
    // redireciona para home após definir o usuário
    setTimeout(() => router.push("/"), 150);
  }, [router]);

  return (
    <div style={{ padding: 20 }}>
      <h2>Simulando login...</h2>
      <p>Redirecionando para a home com usuário simulado.</p>
    </div>
  );
}
