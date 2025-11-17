"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaPaw } from "react-icons/fa";
import styles from "./page.module.css";

export default function CadastroPage() {
  const router = useRouter();
  const [Nome, setNome] = useState("");
  const [Email, setEmail] = useState("");
  const [Senha, setSenha] = useState("");
  const [telefone, setTelefone] = useState("");
  const [cpf, setCpf] = useState("");

  const [error, setError] = useState("");

  const formatCPF = (value) => {
    const digits = (value || "").replace(/\D/g, "").slice(0, 11);
    return digits
      .replace(/^(\d{3})(\d)/, "$1.$2")
      .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
      .replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d)/, "$1.$2.$3-$4");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    if (!Nome || !Email || !Senha || !telefone || !cpf) {
      setError("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(Email)) {
      setError("Por favor, insira um endereço de email válido.");
      return;
    }

    const user = {
      Nome,
      Email: Email.toLowerCase().trim(),
      Senha,
      telefone,
      cpf,
    };

    const users = JSON.parse(localStorage.getItem("users") || "[]");
    users.push(user);
    localStorage.setItem("users", JSON.stringify(users));

    console.log("user cadastrado:", user);
    router.push("/login");
  };

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h1 className={styles.title}>faça seu cadastro</h1>
        {error && <div className={styles.error}>{error}</div>}

        <div className={styles.inputWrapper}>
          <span className={styles.icon} aria-hidden="true">
            <FaPaw />
          </span>

          <label className={styles.fieldLabel}>
            Nome:
            <input
              className={styles.input}
              type="text"
              inputMode="text"
              name="nome"
              autoComplete="name"
              placeholder="Digite seu nome"
              value={Nome}
              onChange={(e) => setNome(e.target.value)}
              aria-label="Nome"
            />
          </label>
        </div>

        <div className={styles.inputWrapper}>
          <span className={styles.icon} aria-hidden="true">
            <FaPaw />
          </span>

          <label className={styles.fieldLabel}>
            Email:
            <input
              className={styles.input}
              type="email"
              inputMode="email"
              name="email"
              autoComplete="email"
              placeholder="Digite seu email"
              value={Email}
              onChange={(e) => setEmail(e.target.value)}
              aria-label="email"
            />
          </label>
        </div>

        <div className={styles.inputWrapper}>
          <span className={styles.icon} aria-hidden="true">
            <FaPaw />
          </span>
          <label className={styles.fieldLabel}>
            Senha:
            <input
              className={styles.input}
              type="password"
              value={Senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="Digite sua senha"
              aria-label="senha"
              required
            />
          </label>
        </div>

        <div className={styles.inputWrapper}>
          <span className={styles.icon} aria-hidden="true">
            <FaPaw />
          </span>
          <label className={styles.fieldLabel}>
            Telefone:
            <input
              className={styles.input}
              type="tel"
              inputMode="tel"
              name="telefone"
              autoComplete="tel"
              placeholder="Digite seu telefone"
              value={telefone}
              required
              onChange={(e) => setTelefone(e.target.value)}
              aria-label="telefone"
            />
          </label>
        </div>

        <div className={styles.inputWrapper}>
          <span className={styles.icon} aria-hidden="true">
            <FaPaw />
          </span>
          <label className={styles.fieldLabel}>
            CPF:
            <input
              className={styles.input}
              type="text"
              inputMode="numeric"
              placeholder="000.000.000-00"
              value={cpf}
              required
              onChange={(e) => setCpf(formatCPF(e.target.value))}
              aria-label="cpf"
            />
          </label>
        </div>

        <button className={styles.button} type="submit">
          cadastrar
        </button>
      </form>
    </div>
  );
}