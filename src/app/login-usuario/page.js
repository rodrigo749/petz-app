"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaPaw } from "react-icons/fa";
import styles from "./login.module.css";

export default function LoginPage() {
  const router = useRouter();
  const [cpf, setCpf] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    if (!cpf || !password) {
      setError("Por favor, preencha CPF e senha.");
      return;
    }

    const usuarios = JSON.parse(localStorage.getItem("usuarios") || "[]");
    
    const usuarioEncontrado = usuarios.find(
      u => u.cpf === cpf && u.password === password
    );

    if (!usuarioEncontrado) {
      setError("CPF ou senha incorretos, caso vc não tenha um cadastro clique em se cadastrar.");
      return;
    }

    localStorage.setItem("usuarioLogado", JSON.stringify(usuarioEncontrado));
    router.push("/");
  };

  const formatCPF = (value) => {
    const digits = (value || "").replace(/\D/g, "").slice(0, 11);
    return digits
      .replace(/^(\d{3})(\d)/, "$1.$2")
      .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
      .replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d)/, "$1.$2.$3-$4");
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
            CPF:
            <input
              className={styles.input}
              type="text"
              inputMode="numeric"
              value={cpf}
              onChange={(e) => setCpf(formatCPF(e.target.value))}
              placeholder="000.000.000-00"
              aria-label="CPF"
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder=""
              aria-label="Senha"
            />
          </label>
        </div>

        <button className={styles.button} type="submit">Entrar</button>

        <div className={styles.bottomLink}>
          Cadastre-se <a href="/cadastro-usuario">aqui</a>.
        </div>
      </form>
    </div>
  );
}