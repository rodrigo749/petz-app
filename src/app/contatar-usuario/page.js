'use client'

import { useEffect, useMemo, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import styles from './contatar.module.css'

export default function Page() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const initial = useMemo(() => {
    const userId = searchParams.get('userId') || ''
    const name = searchParams.get('name') || ''
    const phone = searchParams.get('phone') || ''
    const desc = searchParams.get('desc') || ''
    const chars = (searchParams.get('chars') || '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)

    return { userId, name, phone, desc, chars }
  }, [searchParams])

  const [nome, setNome] = useState(initial.name)
  const [telefone, setTelefone] = useState(initial.phone)

  useEffect(() => {
    if (!initial.userId) return

    try {
      const idStr = String(initial.userId)

      const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]')
      const byList = Array.isArray(usuarios)
        ? usuarios.find((u) => String(u?.id ?? u?._id ?? u?.userId ?? '') === idStr)
        : null

      const logged = JSON.parse(localStorage.getItem('usuarioLogado') || 'null')
      const byLogged =
        logged && String(logged?.id ?? logged?._id ?? logged?.userId ?? '') === idStr ? logged : null

      const u = byList || byLogged
      if (u) {
        setNome((prev) => prev || u?.nome || u?.name || '')
        setTelefone((prev) => prev || u?.telefone || u?.phone || u?.whatsapp || '')
      }
    } catch {
      // ignore
    }
  }, [initial.userId])

  const phoneDigits = (telefone || '').replace(/\D/g, '')

  const openWhatsApp = () => {
    if (!phoneDigits) {
      alert('Telefone do usuário não disponível.')
      return
    }
    const text = `Olá ${nome || 'usuário'}, estou entrando em contato pelo app.`
    const url = `https://wa.me/${phoneDigits}?text=${encodeURIComponent(text)}`
    window.open(url, '_blank')
  }

  if (!initial.userId && !nome && !telefone && !initial.desc && initial.chars.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.texto}>
          <h1>Contato Usuário</h1>
          <p>Dados do usuário não foram fornecidos. Volte a página anterior e tente novamente.</p>
        </div>
        <button className={styles.backBtn} onClick={() => router.back()}>
          Voltar
        </button>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <h1>Contato: {nome || 'Usuário'}</h1>

      {initial.desc && (
        <section className={styles.section}>
          <h2>Descrição</h2>
          <p>{initial.desc}</p>
        </section>
      )}

      {initial.chars.length > 0 && (
        <section className={styles.section}>
          <h2>Características</h2>
          <ul className={styles.featuresList}>
            {initial.chars.map((c, idx) => (
              <li key={idx}>{c}</li>
            ))}
          </ul>
        </section>
      )}

      <section className={styles.section}>
        <h2>Contato</h2>
        <p>Telefone: {telefone || 'Não informado'}</p>
        <button className={styles.whatsappBtn} onClick={openWhatsApp}>
          WhatsApp
        </button>
      </section>

      <button className={styles.backBtn} onClick={() => router.back()}>
        Voltar
      </button>
    </div>
  )
}
