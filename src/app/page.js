'use client'

import { useRef } from 'react'
import styles from './page.module.css'

export default function Home() {
  const carouselRef = useRef(null)

  const scroll = (dir = 'next') => {
    const el = carouselRef.current
    if (!el) return
    const delta = dir === 'next' ? 320 : -320
    el.scrollBy({ left: delta, behavior: 'smooth' })
  }

  return (
    <div className={styles.pageWrap}>
      <section className={styles.hero}>
        <img className={styles.leftImg} src="https://i.imgur.com/4AiXzf8.png" alt="" />
        <img className={styles.rightImg} src="https://i.imgur.com/3WQbQbG.png" alt="" />
        <div className={styles.inner}>
          <h1>Bem Vindo!</h1>
          <p>Cada clique transforma vidas: aqui você pode reencontrar seu pet, adotar com amor ou doar para quem precisa. Juntos, criamos lindas histórias de afeto, esperança e recomeços.</p>
        </div>
      </section>

      <section className={styles.block}>
        <h3 className={styles.title}>Resgatados recentemente</h3>

        <div className={styles.carouselWrap}>
          <button className={styles.arrow} onClick={() => scroll('prev')} aria-label="anterior">&#8249;</button>

          <div ref={carouselRef} className={styles.carousel} role="list" tabIndex={0}>
            <article className={styles.card}>
              <img src="https://place-puppy.com/300x200" alt="Mingau" />
              <div className={styles.info}>
                <div className={styles.name}>Mingau</div>
                <div className={styles.meta}>Raça: Abissínio<br/>Gênero: Fêmea<br/>Local: Avenida Vicente Simões, 715 - Centro</div>
              </div>
            </article>

            <article className={`${styles.card} ${styles.highlight}`}>
              <img src="https://place-puppy.com/320x220" alt="Lola" />
              <div className={styles.info}>
                <div className={styles.name}>Lola</div>
                <div className={styles.meta}>Raça: Leonberger<br/>Gênero: Fêmea<br/>Local: Rua A, 212 - Pouso Alegre</div>
              </div>
            </article>

            <article className={styles.card}>
              <img src="https://placekitten.com/320/220" alt="Pom Pom" />
              <div className={styles.info}>
                <div className={styles.name}>Pom Pom</div>
                <div className={styles.meta}>Raça: Persa<br/>Gênero: Macho<br/>Local: Avenida Doutor Lisboa, 05 - Centro</div>
              </div>
            </article>

            <article className={styles.card}>
              <img src="https://place-puppy.com/330x220" alt="Buddy" />
              <div className={styles.info}>
                <div className={styles.name}>Buddy</div>
                <div className={styles.meta}>Raça: SRD<br/>Gênero: Macho<br/>Local: Bairro Jardim</div>
              </div>
            </article>
          </div>

          <button className={styles.arrow} onClick={() => scroll('next')} aria-label="próximo">&#8250;</button>
        </div>
      </section>
    </div>
  )
}
