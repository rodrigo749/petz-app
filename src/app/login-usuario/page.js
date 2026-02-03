"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { FaPaw, FaEye, FaEyeSlash } from "react-icons/fa";
import styles from "./login.module.css";
import useSafeToast from "@/components/Toast/useSafeToast";

export default function LoginPage() {
  const router = useRouter();
  const { showToast } = useSafeToast();
  const [cpf, setCpf] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!cpf || !password) {
      const msg = "Por favor, preencha CPF e senha.";
      setError(msg);
      showToast(msg, "warning");
      return;
    }

    try {
      const usuarios = JSON.parse(localStorage.getItem("usuarios") || "[]");

      const usuarioEncontrado = usuarios.find(
        (u) => (u.cpf || "").replace(/\D/g, "") === cpf.replace(/\D/g, "") && u.password === password
      );

      if (!usuarioEncontrado) {
        const msg = "CPF ou senha incorretos. Caso não tenha cadastro, clique em cadastrar.";
        setError(msg);
        showToast(msg, "error");
        return;
      }

      localStorage.setItem("usuarioLogado", JSON.stringify(usuarioEncontrado));
      showToast("Login realizado com sucesso!", "success");
      setTimeout(() => router.push("/"), 700);
    } catch (err) {
      console.error(err);
      const msg = "Erro ao processar o login. Tente novamente.";
      setError(msg);
      showToast(msg, "error");
    }
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
              onChange={(e) => {
                setCpf(formatCPF(e.target.value));
                if (error) setError("");
              }}
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
              type={showPassword ? "text" : "password"} 
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) setError("");
              }}
              aria-label="Senha"
              placeholder="Digite sua senha"
            />
          </label>
          <button
            type="button"
            className={styles.togglePassword}
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>

        <button className={styles.button} type="submit">Entrar</button>

        <div className={styles.bottomLink}>
          Cadastre-se <a href="/cadastro-usuario">aqui</a>.
        </div>
      </form>
    </div>
  );
}