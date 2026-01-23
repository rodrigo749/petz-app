"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { FaPaw } from "react-icons/fa";
import { cpf } from "cpf-cnpj-validator";
import styles from "./cadastro.module.css";
import useSafeToast from "@/components/Toast/useSafeToast";

export default function CadastroPage() {
  const { showToast } = useSafeToast();
  const router = useRouter();

  // state
  const [formData, setFormData] = useState({
    nome: "",
    cpf: "",
    email: "",
    telefone: "",
    password: "",
    confirmPassword: "",
    imagem: ""
  });
  const [imageFile, setImageFile] = useState(null);
  const [error, setError] = useState("");
  const [cpfError, setCpfError] = useState("");

  // helpers
  const getBaseUrl = () =>
    (process.env.NEXT_PUBLIC_PETZ_API_URL || "http://localhost:5000").trim().replace(/\/$/, "");

  async function uploadImage(file) {
    const baseUrl = getBaseUrl()
    const maxSizeMB = 5
    if (!file) throw new Error('Nenhum arquivo fornecido')
    if (!file.type.startsWith('image/')) throw new Error('O arquivo precisa ser uma imagem')
    if (file.size > maxSizeMB * 1024 * 1024) throw new Error(`Imagem maior que ${maxSizeMB}MB`)

    const fd = new FormData()
    // backend geralmente espera "file" ou "imagem" — usamos "file"
    fd.append('file', file)

    const tryEndpoints = [
      `${baseUrl}/api/upload`,
      `${baseUrl}/upload`
    ]

    let lastErr = null
    for (const url of tryEndpoints) {
      try {
        const res = await fetch(url, { method: 'POST', body: fd }) // NÃO setar Content-Type
        const text = await res.text().catch(() => '')
        let data = {}
        try { data = text ? JSON.parse(text) : {} } catch { data = { raw: text } }

        if (!res.ok) {
          lastErr = new Error(`Upload falhou ${res.status}: ${data?.message || data?.raw || text}`)
          continue
        }

        // backend pode retornar { url } | { path } | { fileUrl } | { filename }
        const urlReturn = data?.url || data?.path || data?.fileUrl || data?.filename || null
        if (!urlReturn) {
          // se retornou objeto simples com caminho em outra chave, devolve raw
          if (typeof data === 'string' && data) return data
          lastErr = new Error('Upload OK mas resposta não contém URL')
          continue
        }

        // normaliza retornando URL absoluta quando necessário
        if (urlReturn.startsWith('/')) return `${baseUrl}${urlReturn}`
        return urlReturn
      } catch (err) {
        lastErr = err
        console.warn('[uploadImage] tentativa falhou em', url, err)
      }
    }

    throw lastErr || new Error('Falha no upload da imagem')
  }

  const formatCPF = (value) => {
    const digits = (value || "").replace(/\D/g, "").slice(0, 11);
    return digits
      .replace(/^(\d{3})(\d)/, "$1.$2")
      .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
      .replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d)/, "$1.$2.$3-$4");
  };

  const formatTelefone = (value) => {
    const digits = (value || "").replace(/\D/g, "").slice(0, 11);
    if (digits.length <= 2) return `(${digits}`;
    if (digits.length <= 6) return `(${digits.slice(0,2)}) ${digits.slice(2)}`;
    if (digits.length <= 10) return `(${digits.slice(0,2)}) ${digits.slice(2,6)}-${digits.slice(6)}`;
    return `(${digits.slice(0,2)}) ${digits.slice(2,7)}-${digits.slice(7,11)}`;
  };

  // handlers
  const handleChange = (field, value) => {
    if (field === "cpf") value = formatCPF(value);
    if (field === "telefone") value = formatTelefone(value);
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // preview local (base64) apenas para mostrar ao usuário
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({ ...prev, imagem: reader.result }));
    };
    reader.readAsDataURL(file);
    setImageFile(file);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { email, password } = formData;
      const baseUrl = getBaseUrl();
      const res = await fetch(`${baseUrl}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        localStorage.setItem("token", data.token || "");
        localStorage.setItem("usuarioLogado", JSON.stringify(data.user || data));
        showToast("Bem-vindo!", "success");
        router.push("/dashboard");
      } else {
        setError(data.message || "Erro ao fazer login");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Erro de conexão com o servidor");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setCpfError("");

    // validações cliente
    if (!formData.nome || !formData.cpf || !formData.email || !formData.telefone || !formData.password || !formData.confirmPassword) {
      showToast("Por favor, preencha todos os campos obrigatórios.", "warning");
      return;
    }
    const cpfLimpo = (formData.cpf || "").replace(/\D/g, "");
    if (!cpf.isValid(cpfLimpo)) {
      setCpfError("CPF inválido.");
      return;
    }
    if (formData.password.length < 6) {
      setError("Senha deve ter pelo menos 6 caracteres.");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    try {
      let imagemUrl = '' // vazio por padrão
      if (imageFile) {
        try {
          imagemUrl = await uploadImage(imageFile)
          console.log('[CadastroUsuario] uploadImage retornou:', imagemUrl)
        } catch (err) {
          console.error('[CadastroUsuario] uploadImage erro:', err)
          // optar por abortar para garantir integridade dos dados
          setError('Falha ao enviar a foto. Tente novamente.')
          showToast('Falha ao enviar a foto. Tente novamente.', 'error')
          return
        }
      }

      const payload = {
        nome: formData.nome,
        cpf: formData.cpf,
        email: formData.email,
        telefone: formData.telefone,
        password: formData.password,
        imagem: imagemUrl, // somente URL, sem base64
        tipo: 'usuario'
      };

      const baseUrl = getBaseUrl();
      const res = await fetch(`${baseUrl}/api/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.message || "Erro ao cadastrar usuário.");
        showToast(data.message || "Erro ao cadastrar usuário.", "error");
        return;
      }

      showToast("Cadastro realizado com sucesso!", "success");
      setTimeout(() => router.push("/login-usuario"), 1200);
    } catch (err) {
      console.error("Erro no submit:", err);
      setError("Erro de conexão com o servidor. Verifique se o backend está ativo na porta 5000.");
      showToast("Erro de conexão com o servidor.", "error");
    }
  };

  // JSX
  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h1 className={styles.title}>Criar nova conta</h1>
        {error && <div className={styles.error}>{error}</div>}

        <div className={styles.inputWrapper}>
          <span className={styles.icon} aria-hidden><FaPaw /></span>
          <label className={styles.fieldLabel}>
            Nome:
            <input className={styles.input} type="text" value={formData.nome} onChange={(e) => handleChange("nome", e.target.value)} placeholder="Seu nome completo" />
          </label>
        </div>

        <div className={styles.inputWrapper}>
          <span className={styles.icon} aria-hidden><FaPaw /></span>
          <label className={styles.fieldLabel}>
            CPF:
            <input className={styles.input} type="text" inputMode="numeric" value={formData.cpf} onChange={(e) => handleChange("cpf", e.target.value)} placeholder="000.000.000-00" />
          </label>
          {cpfError && <div style={{ backgroundColor: '#ffe6e6', color: '#cc0000', fontSize: '12px', padding: '8px 12px', borderRadius: '4px', marginTop: '8px' }}>{cpfError}</div>}
        </div>

        <div className={styles.inputWrapper}>
          <span className={styles.icon} aria-hidden><FaPaw /></span>
          <label className={styles.fieldLabel}>
            Email:
            <input className={styles.input} type="email" value={formData.email} onChange={(e) => handleChange("email", e.target.value)} placeholder="seu@email.com" />
          </label>
        </div>

        <div className={styles.inputWrapper}>
          <span className={styles.icon} aria-hidden><FaPaw /></span>
          <label className={styles.fieldLabel}>
            Telefone:
            <input className={styles.input} type="tel" value={formData.telefone} onChange={(e) => handleChange("telefone", e.target.value)} placeholder="(35) 0000-0000" />
          </label>
        </div>

        <div className={styles.inputWrapper}>
          <span className={styles.icon} aria-hidden><FaPaw /></span>
          <label className={styles.fieldLabel}>
            Senha:
            <input className={styles.input} type="password" value={formData.password} onChange={(e) => handleChange("password", e.target.value)} placeholder="Sua senha" />
          </label>
        </div>

        <div className={styles.inputWrapper}>
          <span className={styles.icon} aria-hidden><FaPaw /></span>
          <label className={styles.fieldLabel}>
            Confirmar Senha:
            <input className={styles.input} type="password" value={formData.confirmPassword} onChange={(e) => handleChange("confirmPassword", e.target.value)} placeholder="Confirme sua senha" />
          </label>
        </div>

        <div className={styles.uploadWrapper}>
          <label className={styles.uploadBox}>
            {formData.imagem ? (
              <img src={formData.imagem} alt="Preview" className={styles.uploadPreview} />
            ) : (
              <>
                <span className={styles.uploadIcon}>＋</span>
                <span className={styles.uploadText}>Adicionar foto de perfil</span>
              </>
            )}
            <input type="file" accept="image/*" onChange={handleImageUpload} hidden />
          </label>
        </div>

        <button className={styles.button} type="submit">Cadastrar</button>

        <div className={styles.bottomLink}>
          Já tem conta? <a href="/login-usuario">Faça login aqui</a>.
        </div>
      </form>
    </div>
  );
}
