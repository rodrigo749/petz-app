"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    localStorage.removeItem("usuarioLogado");

    // 🔔 avisa o Header que o auth mudou
    window.dispatchEvent(new Event("auth-changed"));

    router.replace("/");
  }, [router]);

  return (
    <main style={{ padding: 24 }}>
      <h1>Saindo...</h1>
      <p>Você será redirecionado.</p>
    </main>
  );
}

