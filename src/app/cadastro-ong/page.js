"use client"

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { FaPaw, FaEye, FaEyeSlash } from 'react-icons/fa'
import styles from './cadastro-ong.module.css'
import useSafeToast from '@/components/Toast/useSafeToast'

// Componente auxiliar de campo
const Field = ({ label, required, children, className = '' }) => (
  <div className={`${styles.inputWrapper} ${className}`}>
    <label className={styles.fieldLabel}>
      <span className={styles.labelText}>{label}{required ? '*' : ''}</span>
      <div className={styles.inputInner}>
        <div className={styles.iconInside} aria-hidden>
          <FaPaw />
        </div>
        {children}
      </div>
    </label>
  </div>
)

export default function CadastroOngPage() {
  const router = useRouter()
  const { showToast } = useSafeToast()

  // estados do formulário
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [telefone, setTelefone] = useState('')
  const [celular, setCelular] = useState('')
  const [senha, setSenha] = useState('')
  const [cnpj, setCnpj] = useState('')
  const [cep, setCep] = useState('')
  const [rua, setRua] = useState('')
  const [numero, setNumero] = useState('')
  const [complemento, setComplemento] = useState('')
  const [cidade, setCidade] = useState('')
  const [estado, setEstado] = useState('')
  const [HorarioFunc1, setHorarioFunc1] = useState('')
  const [HorarioFunc2, setHorarioFunc2] = useState('')
  const [imagem, setImagem] = useState('')         // preview base64/url
  const [imageFile, setImageFile] = useState(null) // File para upload
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showSenha, setShowSenha] = useState(false)

  // base URL do backend (use NEXT_PUBLIC_PETZ_API_URL)
  const getBaseUrl = () =>
    (process.env.NEXT_PUBLIC_PETZ_API_URL || `http://localhost:3000`).trim().replace(/\/$/, "")

  // upload robusto (FormData) -> retorna URL absoluta
  const uploadImage = async (file) => {
    if (!file) throw new Error("Nenhum arquivo fornecido")
    if (!file.type || !file.type.startsWith("image/")) throw new Error("Arquivo não é imagem")
    const maxMB = 5
    if (file.size > maxMB * 1024 * 1024) throw new Error(`Imagem maior que ${maxMB}MB`)

    const baseUrl = getBaseUrl()
    const configs = [
      { url: `${baseUrl}/api/upload`, field: "file" },
      { url: `${baseUrl}/api/upload`, field: "imagem" },
      { url: `${baseUrl}/upload`, field: "file" },
      { url: `${baseUrl}/upload`, field: "imagem" }
    ]

    let lastErr = null
    for (const cfg of configs) {
      try {
        const fd = new FormData()
        fd.append(cfg.field, file)
        const res = await fetch(cfg.url, { method: "POST", body: fd })
        const text = await res.text().catch(() => "")
        let data = {}
        try { data = text ? JSON.parse(text) : {} } catch { data = { raw: text } }

        if (!res.ok) {
          lastErr = new Error(data?.message || data?.raw || `Upload falhou (${res.status})`)
          continue
        }

        const returned = data?.url || data?.path || data?.fileUrl || data?.filename || data?.file || data?.file_path || data?.filepath || null
        if (returned && typeof returned === "string") {
          return returned.startsWith("/") ? `${baseUrl}${returned}` : returned
        }

        if (typeof data === "string" && data) {
          return data.startsWith("/") ? `${baseUrl}${data}` : data
        }

        lastErr = new Error("Upload OK mas resposta não contém URL")
      } catch (err) {
        lastErr = err
        // tenta próximo endpoint
      }
    }

    throw lastErr || new Error("Falha no upload da imagem")
  }

  // handler do input de arquivo (preview base64)
  const handleImageUpload = (e) => {
    const file = e.target.files && e.target.files[0]
    if (!file) return

    const maxMB = 5
    if (file.size > maxMB * 1024 * 1024) {
      showToast(`Imagem maior que ${maxMB}MB. Escolha outra.`, "warning")
      return
    }
    if (!file.type || !file.type.startsWith("image/")) {
      showToast("Formato inválido. Escolha uma imagem.", "warning")
      return
    }

    const reader = new FileReader()
    reader.onloadend = () => {
      setImagem(reader.result)
    }
    reader.readAsDataURL(file)
    setImageFile(file)
  }

  // Limpeza do preview ao desmontar
  useEffect(() => {
    return () => {
      // não há URL.createObjectURL usado aqui, mas se usar, revogar aqui
    }
  }, [])

  // SUBMIT: cria ONG, salva token/ong_data e redireciona para perfil
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      // validações mínimas (exemplo)
      if (!nome || !email || !senha) {
        setError("Preencha nome, email e senha.")
        setLoading(false)
        return
      }

      let imagemUrl = imagem // pode ser base64 ou URL
      if (imageFile) {
        try {
          imagemUrl = await uploadImage(imageFile)
        } catch (err) {
          console.error("Erro no upload:", err)
          showToast("Erro ao enviar imagem. Verifique o servidor.", "error")
          setLoading(false)
          return
        }
      }

      // monta payload (garante compatibilidade com backend: senha + password)
      const payload = {
        nome ,
        email,
        telefone,
        celular,
        senha,
        cnpj,
        cep,
        rua,
        numero,
        complemento,
        cidade,
        estado,
        HorarioFunc1,
        HorarioFunc2,
        imagem: imagemUrl,
        role: 'ong',
        tipo: 'ong'
      }

      const baseUrl = getBaseUrl()
      const url = `${baseUrl}/api/ongs`

      console.log('[DEBUG] POST para:', url)
      console.log('[DEBUG] payload (sem imagem):', { ...payload, imagem: payload.imagem ? '[URL]' : '' })

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      const raw = await res.text().catch(() => '')
      let data = {}
      try { data = raw ? JSON.parse(raw) : {} } catch { data = { raw } }

      console.log('[DEBUG] resposta do backend:', res.status, data)

      if (!res.ok) {
        const statusText = res.statusText || ''
        const msg = data?.message || data?.error || data?.raw || `Erro ao cadastrar ONG (status ${res.status} ${statusText})`
        showToast(msg, 'error')
        console.error('[DEBUG] erro cadastro-ong:', {
          status: res.status,
          statusText,
          body: data,
          raw,
          requestUrl: url,
          requestPayloadPreview: { nome, email, cnpj } // sem imagem
        })
        setLoading(false)
        return
      }

      // salva token e dados da ONG (normalize)
      if (data.token) {
        localStorage.setItem('petz_token', data.token)
        localStorage.setItem('token', data.token)
      }
      const ongObj = data.ong || data.user || data.user || data
      localStorage.setItem('ong_data', JSON.stringify(ongObj))
      localStorage.setItem('usuarioLogado', JSON.stringify(ongObj)) // compatibilidade

      showToast('Cadastro realizado! Redirecionando...', 'success')
      router.push('/perfil-ong')
    } catch (err) {
      console.error('Erro de rede:', err)
      showToast('Erro ao conectar com o servidor.', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <h1 className={styles.title}>Cadastro de ONG</h1>
        {error && <div className={styles.error}>{error}</div>}

        <div className={styles.gridContainer}>
          <div className={styles.colEsquerda}>
            <Field label="Nome da ONG" required>
              <input
                className={styles.input}
                type="text"
                value={nome}
                onChange={(e) => { setNome(e.target.value); if (error) setError('') }}
                placeholder="Nome da organização"
                required
              />
            </Field>

            <Field label="Email de contato" required>
              <input
                className={styles.input}
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); if (error) setError('') }}
                placeholder="contato@ong.com"
                required
              />
            </Field>

            <div style={{ display: 'flex', gap: '16px' }}>
              <Field label="Telefone fixo" required className={styles.half}>
                <input
                  className={styles.input}
                  type="tel"
                  inputMode="numeric"
                  value={telefone}
                  onChange={(e) => { setTelefone(typeof formatTelefonePadrao === 'function' ? formatTelefonePadrao(e.target.value) : e.target.value); if (error) setError('') }}
                  placeholder="(31) 0000-0000"
                  required
                />
              </Field>

              <Field label="Celular" required className={styles.half}>
                <input
                  className={styles.input}
                  type="tel"
                  inputMode="numeric"
                  value={celular}
                  onChange={(e) => { setCelular(typeof formatCelular === 'function' ? formatCelular(e.target.value) : e.target.value); if (error) setError('') }}
                  placeholder="(31) 9 0000-0000"
                  required
                />
              </Field>
            </div>

            <Field label="Senha" required className={styles.half}>
              <div className={styles.passwordInputWrapper}>
                <input
                  className={styles.input}
                  type={showSenha ? "text" : "password"}
                  value={senha}
                  onChange={(e) => { setSenha(e.target.value); if (error) setError('') }}
                  placeholder="Mínimo 8 caracteres"
                  required
                />
                <button
                  type="button"
                  className={styles.togglePassword}
                  onClick={() => setShowSenha(!showSenha)}
                  aria-label={showSenha ? "Ocultar senha" : "Mostrar senha"}
                >
                  {showSenha ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </Field>

            <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
              <Field label="CNPJ" required className={styles.half}>
                <input
                  className={styles.input}
                  type="text"
                  inputMode="numeric"
                  value={cnpj}
                  onChange={(e) => { setCnpj(typeof formatCNPJ === 'function' ? formatCNPJ(e.target.value) : e.target.value); if (error) setError('') }}
                  placeholder="00.000.000/0000-00"
                  required
                />
              </Field>

              <div className={styles.half}>
                <label className={styles.uploadBox}>
                  {imagem ? (
                    <img src={imagem} alt="Preview" className={styles.uploadPreview} />
                  ) : (
                    <>
                      <span className={styles.uploadIcon}>＋</span>
                      <span className={styles.uploadText}>Adicionar foto de perfil</span>
                    </>
                  )}
                  <input type="file" accept="image/*" onChange={handleImageUpload} hidden />
                </label>
              </div>
            </div>
          </div>

          <div className={styles.colDireita}>
            <Field label="Rua" required>
              <input
                className={styles.input}
                type="text"
                value={rua}
                onChange={(e) => { setRua(e.target.value); if (error) setError('') }}
                placeholder="Nome da rua"
                required
              />
            </Field>

            <Field label="Complemento">
              <input
                className={styles.input}
                type="text"
                value={complemento}
                onChange={(e) => { setComplemento(e.target.value); if (error) setError('') }}
                placeholder="Apto / sala / complemento"
              />
            </Field>

            <Field label="Cidade" required>
              <input
                className={styles.input}
                type="text"
                value={cidade}
                onChange={(e) => { setCidade(e.target.value); if (error) setError('') }}
                placeholder="Cidade"
                required
              />
            </Field>

            <Field label="Estado" required>
              <input
                className={styles.input}
                type="text"
                value={estado}
                onChange={(e) => { setEstado(e.target.value); if (error) setError('') }}
                placeholder="UF"
                required
              />
            </Field>

            <div style={{ display: 'flex', gap: '16px' }}>
              <Field label="CEP" required className={styles.half}>
                <input
                  className={styles.input}
                  type="text"
                  inputMode="numeric"
                  value={cep}
                  onChange={(e) => { setCep(typeof formatCEP === 'function' ? formatCEP(e.target.value) : e.target.value); if (error) setError('') }}
                  placeholder="00000-000"
                  required
                />
              </Field>

              <Field label="Número" required className={styles.half}>
                <input
                  className={styles.input}
                  type="text"
                  value={numero}
                  onChange={(e) => { setNumero(e.target.value); if (error) setError('') }}
                  placeholder="Número"
                  required
                />
              </Field>
            </div>
          </div>

          <div className={styles.colBaixo}>
            <Field label="Horário de funcionamento (início)" required className={styles.half}>
              <input
                className={styles.input}
                type="time"
                value={HorarioFunc1}
                onChange={(e) => { setHorarioFunc1(e.target.value); if (error) setError('') }}
                required
              />
            </Field>

            <span className={styles.separador}>até</span>

            <Field label="Horário de funcionamento (fim)" required className={styles.half}>
              <input
                className={styles.input}
                type="time"
                value={HorarioFunc2}
                onChange={(e) => { setHorarioFunc2(e.target.value); if (error) setError('') }}
                required
              />
            </Field>
          </div>
        </div>

        <button className={styles.button} type="submit" disabled={loading} style={{ opacity: loading ? 0.7 : 1 }}>
          {loading ? "Cadastrando..." : "Cadastrar ONG"}
        </button>

        <div className={styles.note}>
          Campos com * são obrigatórios.
        </div>

        <div className={styles.bottomLink}>
          Já tem conta? <a href="/login-ong">Faça login aqui</a>.
        </div>
      </form>
    </div>
  )
}
