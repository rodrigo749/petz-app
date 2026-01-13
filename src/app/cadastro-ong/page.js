'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { FaPaw } from 'react-icons/fa'
import styles from './cadastro-ong.module.css'
import useSafeToast from '@/components/Toast/useSafeToast'

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
  const [imagem, setImagem] = useState('')
  const [imageFile, setImageFile] = useState(null)
  const [error, setError] = useState('')

  // upload que seta `imagem`
  const handleImageUpload = (e) => {
    const file = e.target.files && e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onloadend = () => {
      setImagem(reader.result) // Base64 preview
    }
    reader.readAsDataURL(file)
    setImageFile(file)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!nome || !email || !telefone || !celular || !senha || !cnpj || !rua || !numero || !cidade || !estado || !cep) {
      const msg = 'Por favor, preencha todos os campos obrigatórios.'
      setError(msg)
      showToast(msg, 'warning')
      return
    }

    try {
      const payload = {
        nome,
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
        imagem,
        tipo: 'ong'
      }

      const res = await fetch('/api/ongs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      const data = await res.json().catch(() => ({}))

      if (!res.ok) {
        const msg = data?.message || 'Erro ao cadastrar ONG'
        setError(msg)
        showToast(msg, 'error')
        return
      }

      showToast('Cadastro realizado com sucesso!', 'success')
      localStorage.setItem('usuarioLogado', JSON.stringify(data))
      // pequeno delay para ver o toast
      setTimeout(() => router.push('/perfil-ong'), 900)
    } catch (err) {
      console.error(err)
      const msg = 'Erro de rede. Tente novamente.'
      setError(msg)
      showToast(msg, 'error')
    }
  }

  const formatCNPJ = (value) => {
    const digits = (value || '').replace(/\D/g, '').slice(0, 14)
    return digits
      .replace(/^(\d{2})(\d)/, '$1.$2')
      .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
      .replace(/^(\d{2})\.(\d{3})\.(\d{3})(\d)/, '$1.$2.$3/$4')
      .replace(/^(\d{2})\.(\d{3})\.(\d{3})\/(\d{4})(\d)/, '$1.$2.$3/$4-$5')
  }

  const formatCEP = (value) => {
    const digits = (value || '').replace(/\D/g, '').slice(0, 8)
    return digits.replace(/^(\d{5})(\d)/, '$1-$2')
  }

  const formatTelefonePadrao = (value) => {
    const digits = (value || '').replace(/\D/g, '').slice(0, 10)
    if (digits.length <= 2) return `(${digits}`
    if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`
  }

  const formatCelular = (value) => {
    const digits = (value || '').replace(/\D/g, '').slice(0, 11)
    if (digits.length <= 2) return `(${digits}`
    if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
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
                onChange={(e) => {
                  setNome(e.target.value)
                  if (error) setError('')
                }}
                placeholder="Nome da organização"
                required
              />
            </Field>

            <Field label="Email de contato" required>
              <input
                className={styles.input}
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  if (error) setError('')
                }}
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
                  onChange={(e) => {
                    setTelefone(formatTelefonePadrao(e.target.value))
                    if (error) setError('')
                  }}
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
                  onChange={(e) => {
                    setCelular(formatCelular(e.target.value))
                    if (error) setError('')
                  }}
                  placeholder="(31) 9 0000-0000"
                  required
                />
              </Field>
            </div>

            <Field label="Senha" required className={styles.half}>
              <input
                className={styles.input}
                type="password"
                value={senha}
                onChange={(e) => {
                  setSenha(e.target.value)
                  if (error) setError('')
                }}
                placeholder="Mínimo 8 caracteres"
                required
              />
            </Field>

            <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
              <Field label="CNPJ" required className={styles.half}>
                <input
                  className={styles.input}
                  type="text"
                  inputMode="numeric"
                  value={cnpj}
                  onChange={(e) => {
                    setCnpj(formatCNPJ(e.target.value))
                    if (error) setError('')
                  }}
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
                onChange={(e) => {
                  setRua(e.target.value)
                  if (error) setError('')
                }}
                placeholder="Nome da rua"
                required
              />
            </Field>

            <Field label="Complemento">
              <input
                className={styles.input}
                type="text"
                value={complemento}
                onChange={(e) => {
                  setComplemento(e.target.value)
                  if (error) setError('')
                }}
                placeholder="Apto / sala / complemento"
              />
            </Field>

            <Field label="Cidade" required>
              <input
                className={styles.input}
                type="text"
                value={cidade}
                onChange={(e) => {
                  setCidade(e.target.value)
                  if (error) setError('')
                }}
                placeholder="Cidade"
                required
              />
            </Field>

            <Field label="Estado" required>
              <input
                className={styles.input}
                type="text"
                value={estado}
                onChange={(e) => {
                  setEstado(e.target.value)
                  if (error) setError('')
                }}
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
                  onChange={(e) => {
                    setCep(formatCEP(e.target.value))
                    if (error) setError('')
                  }}
                  placeholder="00000-000"
                  required
                />
              </Field>

              <Field label="Número" required className={styles.half}>
                <input
                  className={styles.input}
                  type="text"
                  value={numero}
                  onChange={(e) => {
                    setNumero(e.target.value)
                    if (error) setError('')
                  }}
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
                onChange={(e) => {
                  setHorarioFunc1(e.target.value)
                  if (error) setError('')
                }}
                required
              />
            </Field>

            <span className={styles.separador}>até</span>

            <Field label="Horário de funcionamento (fim)" required className={styles.half}>
              <input
                className={styles.input}
                type="time"
                value={HorarioFunc2}
                onChange={(e) => {
                  setHorarioFunc2(e.target.value)
                  if (error) setError('')
                }}
                required
              />
            </Field>
          </div>
        </div>

        <button className={styles.button} type="submit">
          Cadastrar ONG
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
