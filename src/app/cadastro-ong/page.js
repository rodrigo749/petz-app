'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { FaPaw } from 'react-icons/fa'
import styles from './cadastro-ong.module.css'

export default function CadastroOngPage() {
  const router = useRouter()
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [telefone, setTelefone] = useState('')
  const [celular, setCelular] = useState('')
  const [senha, setSenha] = useState('')
  const [confirmSenha, setConfirmSenha] = useState('')
  const [cnpj, setCnpj] = useState('')
  const [cep, setCep] = useState('')
  const [rua, setRua] = useState('')
  const [numero, setNumero] = useState('')
  const [complemento, setComplemento] = useState('')
  const [bairro, setBairro] = useState('')
  const [cidade, setCidade] = useState('')
  const [estado, setEstado] = useState('')
  const [HorarioFunc1, setHorarioFunc1] = useState('')
  const [HorarioFunc2, setHorarioFunc2] = useState('')
  const [error, setError] = useState('')

  // Field aceita className para controlar span/posição no grid
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

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    // salvar/validar...
    router.push('/login/ong')
  }

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <h1 className={styles.title}>Cadastro de ONG</h1>

        <div className={styles.inputGroup}>
          {/* Nome (ocupa 2 colunas) */}
          <Field label="Nome da ONG" required className={styles.full}>
            <input
              className={styles.input}
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Nome da organização"
              required
              autoComplete="organization"
              aria-label="Nome da ONG"
            />
          </Field>

          {/* Email ocupa 2 colunas */}
          <Field label="Email de contato" required className={styles.full}>
            <input
              className={styles.input}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="contato@ong.com"
              required
              autoComplete="email"
              aria-label="Email de contato"
            />
          </Field>

          {/* Telefone e Celular — cada um ocupa 1 coluna (lado a lado) */}
          <Field label="Telefone fixo" required className={styles.half}>
            <input
              className={styles.input}
              type="tel"
              inputMode="tel"
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
              placeholder="(31) 0000-0000"
              required
              autoComplete="tel"
              aria-label="Telefone fixo"
            />
          </Field>

          <Field label="Celular" required className={styles.half}>
            <input
              className={styles.input}
              type="tel"
              inputMode="tel"
              value={celular}
              onChange={(e) => setCelular(e.target.value)}
              placeholder="(31) 9 0000-0000"
              required
              autoComplete="tel"
              aria-label="Celular"
            />
          </Field>

          {/* Senha ocupa 1 coluna — pode ocupar 2 se preferir, ajuste className */}
          <Field label="Senha" required className={styles.full}>
            <input
              className={styles.input}
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="Mínimo 8 caracteres"
              required
              aria-label="Senha"
            />
          </Field>

          {/* CNPJ ocupa 1 coluna */}
          <Field label="CNPJ" required className={styles.half}>
            <input
              className={styles.input}
              type="text"
              inputMode="numeric"
              value={cnpj}
              onChange={(e) => setCnpj(e.target.value)}
              placeholder="00.000.000/0000-00"
              required
              aria-label="CNPJ"
            />
          </Field>

          {/* CEP e Número lado a lado */}
          <Field label="CEP" required className={styles.half}>
            <input
              className={styles.input}
              type="text"
              inputMode="numeric"
              value={cep}
              onChange={(e) => setCep(e.target.value)}
              placeholder="00000-000"
              required
              aria-label="CEP"
            />
          </Field>

          <Field label="Número" required className={styles.half}>
            <input
              className={styles.input}
              type="text"
              value={numero}
              onChange={(e) => setNumero(e.target.value)}
              placeholder="Número"
              required
              aria-label="Número"
            />
          </Field>

          {/* Rua, Complemento, Bairro, Cidade, Estado */}
          <Field label="Rua" required className={styles.full}>
            <input
              className={styles.input}
              type="text"
              value={rua}
              onChange={(e) => setRua(e.target.value)}
              placeholder="Nome da rua"
              required
              aria-label="Rua"
            />
          </Field>

          <Field label="Complemento" className={styles.full}>
            <input
              className={styles.input}
              type="text"
              value={complemento}
              onChange={(e) => setComplemento(e.target.value)}
              placeholder="Apto / sala / complemento"
              aria-label="Complemento"
            />
          </Field>

          <Field label="Bairro" required className={styles.half}>
            <input
              className={styles.input}
              type="text"
              value={bairro}
              onChange={(e) => setBairro(e.target.value)}
              placeholder="Bairro"
              required
              aria-label="Bairro"
            />
          </Field>

          <Field label="Cidade" required className={styles.half}>
            <input
              className={styles.input}
              type="text"
              value={cidade}
              onChange={(e) => setCidade(e.target.value)}
              placeholder="Cidade"
              required
              aria-label="Cidade"
            />
          </Field>

          <Field label="Estado" required className={styles.half}>
            <input
              className={styles.input}
              type="text"
              value={estado}
              onChange={(e) => setEstado(e.target.value)}
              placeholder="UF"
              required
              aria-label="Estado"
            />
          </Field>

          {/* Horários: centralizados em uma linha — cada um meia largura */}
          <Field label="Horário de funcionamento (início)" required className={styles.time}>
            <input
              className={styles.input}
              type="time"
              value={HorarioFunc1}
              onChange={(e) => setHorarioFunc1(e.target.value)}
              required
              aria-label="Horário de funcionamento início"
            />
          </Field>

          <Field label="Horário de funcionamento (até)" required className={styles.time}>
            <input
              className={styles.input}
              type="time"
              value={HorarioFunc2}
              onChange={(e) => setHorarioFunc2(e.target.value)}
              required  
              aria-label="Horário de funcionamento fim"
            />
          </Field>
        </div>

        <button className={styles.button} type="submit">
          Cadastrar ONG
        </button>

        <div className={styles.note}>
          Campos com * são obrigatórios.
        </div>
      </form>
    </div>
  )
}