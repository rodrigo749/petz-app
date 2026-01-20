'use client'

import { useMemo } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import styles from './contatar.module.css'

export default function Page() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const ong = useMemo(() => {
    const name = searchParams.get('name') || ''
    const phone = searchParams.get('phone') || ''
    const desc = searchParams.get('desc') || ''
    const chars = (searchParams.get('chars') || '')
      .split(',')
      .map(s => s.trim())
      .filter(Boolean)

    const phoneDigits = phone.replace(/\D/g, '') // só números para wa.me

    return { name, phone, phoneDigits, desc, chars }
  }, [searchParams])

  const openWhatsApp = () => {
    if (!ong.phoneDigits) {
      alert('Telefone da ONG não disponível.')
      return
    }
    const text = `Olá ${ong.name || 'ONG'}, estou entrando em contato pelo app.`
    const url = `https://wa.me/${ong.phoneDigits}?text=${encodeURIComponent(text)}`
    window.open(url, '_blank')
  }

  if (!ong.name && !ong.phone && !ong.desc && ong.chars.length === 0) {
    return (
      <div className={styles.container}>
        <h1>Contato ONG</h1>
        <p>Dados da ONG não foram fornecidos. Volte a página anterior e tente novamente.</p>
        <button onClick={() => router.back()}>Voltar</button>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <h1>Contato: {ong.name}</h1>

      {ong.desc && (
        <section className={styles.section}>
          <h2>Descrição</h2>
          <p>{ong.desc}</p>
        </section>
      )}

      {ong.chars.length > 0 && (
        <section className={styles.section}>
          <h2>Características</h2>
          <ul>
            {ong.chars.map((c, idx) => (
              <li key={idx}>{c}</li>
            ))}
          </ul>
        </section>
      )}

      <section className={styles.section}>
        <h2>Contato</h2>
        <p>Telefone: {ong.phone || 'Não informado'}</p>
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