"use client"

import { useRef, useState, useEffect } from 'react'
import styles from './carousel.module.css'

export default function Carousel({ items = [] }) {
  const carouselRef = useRef(null)
  const [centerIndex, setCenterIndex] = useState(0)

  useEffect(() => {
    const centerCard = (ref, index) => {
      if (ref.current) {
        const cards = ref.current.querySelectorAll('article')
        if (cards[index]) {
          cards[index].scrollIntoView({ block: 'nearest', inline: 'center' })
        }
      }
    }
    centerCard(carouselRef, centerIndex)
  }, [centerIndex])

  const scroll = (dir) => {
    if (!items || items.length === 0) return
    const maxLength = items.length
    let newIndex
    if (dir === 'next') {
      newIndex = (centerIndex + 1) % maxLength
    } else {
      newIndex = (centerIndex - 1 + maxLength) % maxLength
    }

    setCenterIndex(newIndex)
    setTimeout(() => {
      const el = carouselRef.current
      if (el) {
        const cards = el.querySelectorAll('article')
        if (cards[newIndex]) {
          cards[newIndex].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
        }
      }
    }, 0)
  }

  const renderDefaultCard = (pet) => (
    <>
      <img src={pet.img} alt={pet.name} />
      <div className={styles.info}>
        <div className={styles.name}>{pet.name}</div>
        <div className={styles.meta}>
          Raça: {pet.breed}<br />
          Gênero: {pet.gender}<br />
          {pet.location && <>Local: {pet.location}<br/></>}
          {pet.age && <>Idade: {pet.age}<br/></>}
          {pet.ong && <>ONG: {pet.ong}</>}
        </div>
      </div>
    </>
  )

  return (
    <div className={styles.carouselWrap}>
      <button
        className={styles.arrow}
        onClick={() => scroll('prev')}
        aria-label="anterior"
      >
        &#8249;
      </button>

      <div ref={carouselRef} className={styles.carousel}>
        <div className={styles.cards}>
          {items.map((pet, index) => (
            <article key={pet.id ?? index} className={`${styles.card} ${index === centerIndex ? styles.highlight : ''}`}>
              {renderDefaultCard(pet)}
            </article>
          ))}
        </div>
      </div>

      <button
        className={styles.arrow}
        onClick={() => scroll('next')}
        aria-label="próximo"
      >
        &#8250;
      </button>
    </div>
  )
}
