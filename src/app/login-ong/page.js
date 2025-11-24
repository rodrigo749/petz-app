"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaPaw } from "react-icons/fa";
import styles from "./login-ong.module.css";

export default function LoginPage() {
  const router = useRouter();
const [cnpj, setCnpj] = useState("");
const [password, setPassword] = useState("");
const [error, setError] = useState("");

const handleSubmit = (e) => {
  e.preventDefault();
  setError("");
  if (!cnpj || !password) {
    setError("Por favor, preencha CNPJ e senha.");
    return;
  }

  const usuarios = JSON.parse(localStorage.getItem("usuarios") || "[]");
  
  const usuarioEncontrado = usuarios.find(
    u => u.cnpj === cnpj && u.password === password
  );

  if (!usuarioEncontrado) {
    setError("CNPJ ou senha incorretos, caso vc não tenha um cadastro clique em se cadastrar.");
    return;
  }

    localStorage.setItem("usuarioLogado", JSON.stringify(usuarioEncontrado));
    router.push("/");
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
    onChange={(e) => setCnpj(formatCNPJ(e.target.value))}
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder=""
              aria-label="Senha"
            />
          </label>
        </div>

        <button className={styles.button} type="submit">Entrar</button>

        <div className={styles.bottomLink}>
          Cadastre-se <a href="/cadastro">aqui</a>.
        </div>
      </form>
    </div>
  );
}