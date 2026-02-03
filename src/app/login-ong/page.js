"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaPaw } from "react-icons/fa";
import styles from "./login-ong.module.css";
import useSafeToast from "@/components/Toast/useSafeToast";

export default function LoginPage() {
  const router = useRouter();
  const { showToast } = useSafeToast();

  const [cnpj, setCnpj] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!cnpj || !senha) {
      const msg = "Por favor, preencha CNPJ e senha.";
      setError(msg);
      showToast(msg, "warning");
      return;
    }

    try {
      const res = await fetch("/api/ongs/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cnpj: cnpj.replace(/\D/g, ""), // ✅ normaliza antes de enviar
          senha,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        const msg =
          data?.message ||
          "CNPJ ou senha incorretos, caso você não tenha um cadastro clique em se cadastrar.";
        setError(msg);
        showToast(msg, "error");
        return;
      }

      // ✅ PADRÃO ÚNICO DE SESSÃO
      const usuarioLogado = {
        user: data.user,
        token: data.token || null,
        role: "ong",
      };

      localStorage.setItem(
        "usuarioLogado",
        JSON.stringify(usuarioLogado)
      );

      showToast("Login realizado com sucesso!", "success");
      setTimeout(() => router.push("/perfil-ong"), 700);

    } catch (err) {
      console.error(err);
      const msg = "Erro ao conectar com a API. Tente novamente.";
      setError(msg);
      showToast(msg, "error");
    }
  };

  const formatCNPJ = (value) => {
    const digits = (value || "").replace(/\D/g, "").slice(0, 14);
    return digits
      .replace(/^(\d{2})(\d)/, "$1.$2")
      .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
      .replace(/^(\d{2})\.(\d{3})\.(\d{3})(\d)/, "$1.$2.$3/$4")
      .replace(/^(\d{2})\.(\d{3})\.(\d{3})\/(\d{4})(\d)/, "$1.$2.$3/$4-$5");
  };

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h1 className={styles.title}>Faça o login ou crie uma conta</h1>

        {error && <div className={styles.error}>{error}</div>}

        <div className={styles.inputWrapper}>
          <span className={styles.icon} aria-hidden>
            <FaPaw />
          </span>

          <label className={styles.fieldLabel}>
            CNPJ:
            <input
              className={styles.input}
              type="text"
              inputMode="numeric"
              value={cnpj}
              onChange={(e) => {
                setCnpj(formatCNPJ(e.target.value));
                if (error) setError("");
              }}
              placeholder="00.000.000/0000-00"
              aria-label="CNPJ"
            />
          </label>
        </div>

        <div className={styles.inputWrapper}>
          <span className={styles.icon} aria-hidden>
            <FaPaw />
          </span>

          <label className={styles.fieldLabel}>
            Senha:
            <input
              className={styles.input}
              type="password"
              value={senha}
              onChange={(e) => {
                setSenha(e.target.value);
                if (error) setError("");
              }}
              aria-label="Senha"
            />
          </label>
        </div>

        <button className={styles.button} type="submit">
          Entrar
        </button>

        <div className={styles.bottomLink}>
          Cadastre-se <a href="/cadastro-ong">aqui</a>.
        </div>
      </form>
    </div>
  );
}
