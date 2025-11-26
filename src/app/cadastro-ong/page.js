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
    const [cnpj, setCnpj] = useState('')
    const [cep, setCep] = useState('')
    const [rua, setRua] = useState('')
    const [numero, setNumero] = useState('')
    const [complemento, setComplemento] = useState('')
    const [cidade, setCidade] = useState('')
    const [estado, setEstado] = useState('')
    const [HorarioFunc1, setHorarioFunc1] = useState('')
    const [HorarioFunc2, setHorarioFunc2] = useState('')
    const [error, setError] = useState('')

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

      <div className={styles.gridContainer}>

        {/* ---- ESQUERDA ---- */}
        <div className={styles.colEsquerda}>
          <Field label="Nome da ONG" required>
            <input
              className={styles.input}
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Nome da organização"
              required
            />
          </Field>

          <Field label="Email de contato" required>
            <input
              className={styles.input}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="contato@ong.com"
              required
            />
          </Field>
           <div style={{display: 'flex', gap: '16px'}}>
             <Field label="Telefone fixo" required className={styles.half}>
               <input
                 className={styles.input}
                 type="tel"
                 value={telefone}
                 onChange={(e) => setTelefone(e.target.value)}
                 placeholder="(31) 0000-0000"
                 required
               />
             </Field>
     
             <Field label="Celular" required className={styles.half}>
               <input
                 className={styles.input}
                 type="tel"
                 value={celular}
                 onChange={(e) => setCelular(e.target.value)}
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
              onChange={(e) => setSenha(e.target.value)}
              placeholder="Mínimo 8 caracteres"
              required
            />
          </Field>

          <Field label="CNPJ" required className={styles.half}>
            <input
              className={styles.input}
              type="text"
              value={cnpj}
              onChange={(e) => setCnpj(e.target.value)}
              placeholder="00.000.000/0000-00"
              required
            />
          </Field>
        </div>

        {/* ---- DIREITA ---- */}
        <div className={styles.colDireita}>
            
          <Field label="Rua" required>
            <input
              className={styles.input}
              type="text"
              value={rua}
              onChange={(e) => setRua(e.target.value)}
              placeholder="Nome da rua"
              required
            />
          </Field>

          <Field label="Complemento">
            <input
              className={styles.input}
              type="text"
              value={complemento}
              onChange={(e) => setComplemento(e.target.value)}
              placeholder="Apto / sala / complemento"
            />
          </Field>


          <Field label="Cidade" required>
            <input
              className={styles.input}
              type="text"
              value={cidade}
              onChange={(e) => setCidade(e.target.value)}
              placeholder="Cidade"
              required
            />
          </Field>

          <Field label="Estado" required>
            <input
              className={styles.input}
              type="text"
              value={estado}
              onChange={(e) => setEstado(e.target.value)}
              placeholder="UF"
              required
            />
          </Field>
          <div style={{display: 'flex', gap: '16px'}}> 
                <Field label="CEP" required className={styles.half}>
                  <input
                    className={styles.input}
                    type="text"
                    value={cep}
                    onChange={(e) => setCep(e.target.value)}
                    placeholder="00000-000"
                    required
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
                  />
                </Field>
            </div>
        </div>

        {/* ---- BAIXO ---- */}
        <div className={styles.colBaixo}>
          <Field label="Horário de funcionamento (início)" required className={styles.half}>
            <input
              className={styles.input}
              type="time"
              value={HorarioFunc1}
              onChange={(e) => setHorarioFunc1(e.target.value)}
              required
            />
          </Field>

          <aspan className={styles.separador}>até</aspan>

          <Field label="Horário de funcionamento (fim)" required className={styles.half}>
            <input
              className={styles.input}
              type="time"
              value={HorarioFunc2}
              onChange={(e) => setHorarioFunc2(e.target.value)}
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