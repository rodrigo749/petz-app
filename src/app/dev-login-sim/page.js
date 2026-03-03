"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DevLoginSim() {
  const router = useRouter();

  useEffect(() => {
    const payload = { id: 1, tipo: "usuario", nome: "Teste", imagem: "" };

    localStorage.setItem("usuarioLogado", JSON.stringify(payload));

    // Dispara evento para o Header atualizar imediatamente
    window.dispatchEvent(new Event("auth-changed"));

    // redireciona para home após definir o usuário
    router.push("/home");
  }, [router]);

  return (
    <div style={{ padding: 20 }}>
      <h2>Simulando login...</h2>
      <p>Redirecionando para a home com usuário simulado.</p>
    </div>
  );
}
