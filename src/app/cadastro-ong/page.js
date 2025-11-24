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

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    // validar e salvar...
    // após sucesso, redirecione para /login/ong
    router.push('/login/ong')
  }

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <h1 className={styles.title}>Cadastro de ONG</h1>

        <div className={styles.inputGroup}>

          <span className={styles.icon} aria-hidden>
            <FaPaw />
          </span>
          <label className={styles.label}>
            Nome da ONG*
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
          </label>

          <span className={styles.icon} aria-hidden>
            <FaPaw />
          </span>
          <label className={styles.label}>
            Email de contato*
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
          </label>

          <span className={styles.icon} aria-hidden>
            <FaPaw />
          </span>
          <label className={styles.label}>
            Telefone fixo*
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
          </label>

          <span className={styles.icon} aria-hidden>
            <FaPaw />
          </span>
          <label className={styles.label}>
            Celular*
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
          </label>

          <span className={styles.icon} aria-hidden>
            <FaPaw />
          </span>
          <label className={styles.label}>
            Senha*
            <input
              className={styles.input}
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="Mínimo 8 caracteres"
              required
              aria-label="Senha"
            />
          </label>

          <span className={styles.icon} aria-hidden>
            <FaPaw />
          </span>
          <label className={styles.label}>
            Confirmar senha*
            <input
              className={styles.input}
              type="password"
              value={confirmSenha}
              onChange={(e) => setConfirmSenha(e.target.value)}
              placeholder="Repita a senha"
              required
              aria-label="Confirmar senha"
            />
          </label>

          <span className={styles.icon} aria-hidden>
            <FaPaw />
          </span>
          <label className={styles.label}>
            CNPJ*
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
          </label>

          <span className={styles.icon} aria-hidden>
            <FaPaw />
          </span>
          <label className={styles.label}>
            CEP*
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
          </label>

          <span className={styles.icon} aria-hidden>
            <FaPaw />
          </span>
          <label className={styles.label}>
            Rua*
            <input
              className={styles.input}
              type="text"
              value={rua}
              onChange={(e) => setRua(e.target.value)}
              placeholder="Nome da rua"
              required
              aria-label="Rua"
            />
          </label>

          <span className={styles.icon} aria-hidden>
            <FaPaw />
          </span>
          <label className={styles.label}>
            Número*
            <input
              className={styles.input}
              type="text"
              value={numero}
              onChange={(e) => setNumero(e.target.value)}
              placeholder="Número"
              required
              aria-label="Número"
            />
          </label>

          <span className={styles.icon} aria-hidden>
            <FaPaw />
          </span>
          <label className={styles.label}>
            Complemento
            <input
              className={styles.input}
              type="text"
              value={complemento}
              onChange={(e) => setComplemento(e.target.value)}
              placeholder="Apto / sala / complemento"
              aria-label="Complemento"
            />
          </label>

          <span className={styles.icon} aria-hidden>
            <FaPaw />
          </span>
          <label className={styles.label}>
            Bairro*
            <input
              className={styles.input}
              type="text"
              value={bairro}
              onChange={(e) => setBairro(e.target.value)}
              placeholder="Bairro"
              required
              aria-label="Bairro"
            />
          </label>

          <span className={styles.icon} aria-hidden>
            <FaPaw />
          </span>
          <label className={styles.label}>
            Cidade*
            <input
              className={styles.input}
              type="text"
              value={cidade}
              onChange={(e) => setCidade(e.target.value)}
              placeholder="Cidade"
              required
              aria-label="Cidade"
            />
          </label>

          <span className={styles.icon} aria-hidden>
            <FaPaw />
          </span>
          <label className={styles.label}>
            Estado*
            <input
              className={styles.input}
              type="text"
              value={estado}
              onChange={(e) => setEstado(e.target.value)}
              placeholder="UF"
              required
              aria-label="Estado"
            />
          </label>

          {/* Adicionado: horários de funcionamento (início e fim) */}
          <span className={styles.icon} aria-hidden>
            <FaPaw />
          </span>
          <label className={styles.label}>
            Horário de funcionamento (início)*
            <input
              className={styles.input}
              type="time"
              value={HorarioFunc1}
              onChange={(e) => setHorarioFunc1(e.target.value)}
              required
              aria-label="Horário de funcionamento início"
            />
          </label>

          <span className={styles.icon} aria-hidden>
            <FaPaw />
          </span>
          <label className={styles.label}>
            Horário de funcionamento (até)*
            <input
              className={styles.input}
              type="time"
              value={HorarioFunc2}
              onChange={(e) => setHorarioFunc2(e.target.value)}
              required
              aria-label="Horário de funcionamento fim"
            />
          </label>
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