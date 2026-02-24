'use client'

import { useRef, useState, useEffect } from 'react'
import styles from './homePage.module.css'

/**
 * Componente HomePage - Página inicial da aplicação
 * Exibe carrosséis de pets perdidos e disponíveis para adoção
 * 
 * @component
 * @returns {JSX.Element} Página inicial com hero section e carrosséis
 */
export default function HomePage() {
  const carouselRef1 = useRef(null)
  const carouselRef2 = useRef(null)
  const [centerIndex1, setCenterIndex1] = useState(0)
  const [centerIndex2, setCenterIndex2] = useState(0)

  // Dados mockados - Pets perdidos
  const perdidos = [
    { id: 1, name: "Mingau", breed: "Abissínio", gender: "Fêmea", location: "Avenida Vicente Simões, 715 - Centro", img: "https://placekitten.com/300/200" },
    { id: 2, name: "Lola", breed: "Leonberger", gender: "Fêmea", location: "Rua A, 212 - Fátima 1 - Pouso Alegre", img: "https://place-puppy.com/320/220" },
    { id: 3, name: "Pom Pom", breed: "Persa", gender: "Macho", location: "Avenida Doutor Lisboa, 05 - Centro", img: "https://placekitten.com/320/220" },
    { id: 4, name: "Buddy", breed: "SRD", gender: "Macho", location: "Bairro Jardim", img: "https://place-puppy.com/330/220" },
    { id: 5, name: "Nina", breed: "Siamês", gender: "Fêmea", location: "Centro", img: "https://placekitten.com/310/210" }
  ]

  // Dados mockados - Pets para adoção
  const adotados = [
    { id: 6, name: "Pulga", breed: "Vira-lata", gender: "Macho", age: "Adulto", location: "XXXXXX", img: "https://place-puppy.com/300/200" },
    { id: 7, name: "Lola", breed: "Vira-lata", gender: "Fêmea", age: "Filhote", location: "XXXXXX", img: "https://placekitten.com/320/220" },
    { id: 8, name: "Lolô", breed: "Vira-lata", gender: "Macho", age: "1 ano", location: "XXXXXX", img: "https://place-puppy.com/320/220" },
    { id: 9, name: "Max", breed: "SRD", gender: "Macho", age: "2 anos", location: "XXXXXX", img: "https://place-puppy.com/330/220" }
  ]

  /**
   * Centraliza o primeiro card ao montar o componente
   */
  useEffect(() => {
    const centerCard = (ref, index) => {
      if (ref.current) {
        const cards = ref.current.querySelectorAll('article')
        if (cards[index]) {
          cards[index].scrollIntoView({ block: 'nearest', inline: 'center' })
        }
      }
    }
    centerCard(carouselRef1, centerIndex1)
    centerCard(carouselRef2, centerIndex2)
  }, [centerIndex1, centerIndex2])

  /**
   * Navega pelo carrossel (próximo/anterior)
   * 
   * @param {'next' | 'prev'} dir - Direção da navegação
   * @param {React.RefObject} carouselRef - Referência do carrossel
   * @param {number} currentIndex - Índice atual
   * @param {Function} setIndex - Função para atualizar o índice
   * @param {number} maxLength - Quantidade total de itens
   */
  const scroll = (dir, carouselRef, currentIndex, setIndex, maxLength) => {
    let newIndex
    if (dir === 'next') {
      newIndex = (currentIndex + 1) % maxLength
    } else {
      newIndex = (currentIndex - 1 + maxLength) % maxLength
    }
    
    setIndex(newIndex)
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

  return (
    <div className={styles.pageWrap}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <img className={styles.leftImg} src="/images/cachorro-pagina-principal%202.png" alt="" />
        <img className={styles.rightImg} src="/images/cachorro-pagina-principal.png" alt="" />
        <div className={styles.inner}>
          <h1>Bem Vindo!</h1>
          <p>
            Cada clique transforma vidas: aqui você pode reencontrar seu pet, adotar com amor ou doar para quem precisa. 
            Juntos, criamos lindas histórias de afeto, esperança e recomeços.
          </p>
        </div>
      </section>

      {/* Carrossel de Pets Perdidos */}
      <section className={styles.block}>
        <h3 className={styles.title}>Perdidos recentemente</h3>
        <div className={styles.carouselWrap}>
          <button 
            className={styles.arrow} 
            onClick={() => scroll('prev', carouselRef1, centerIndex1, setCenterIndex1, perdidos.length)} 
            aria-label="anterior"
          >
            &#8249;
          </button>
          
          <div ref={carouselRef1} className={styles.carousel}>
            <div className={styles.cards}>
              {perdidos.map((pet, index) => (
                <article key={pet.id} className={`${styles.card} ${index === centerIndex1 ? styles.highlight : ''}`}>
                  <img src={pet.img} alt={pet.name} />
                  <div className={styles.info}>
                    <div className={styles.name}>{pet.name}</div>
                    <div className={styles.meta}>
                      Raça: {pet.breed}<br/>
                      Gênero: {pet.gender}<br/>
                      Local: {pet.location}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
          
          <button 
            className={styles.arrow} 
            onClick={() => scroll('next', carouselRef1, centerIndex1, setCenterIndex1, perdidos.length)} 
            aria-label="próximo"
          >
            &#8250;
          </button>
        </div>
      </section>

      {/* Carrossel de Pets para Adoção */}
      <section className={styles.block}>
        <h3 className={styles.title}>Adotados recentemente</h3>
        <div className={styles.carouselWrap}>
          <button 
            className={styles.arrow} 
            onClick={() => scroll('prev', carouselRef2, centerIndex2, setCenterIndex2, adotados.length)} 
            aria-label="anterior"
          >
            &#8249;
          </button>
          
          <div ref={carouselRef2} className={styles.carousel}>
            <div className={styles.cards}>
              {adotados.map((pet, index) => (
                <article key={pet.id} className={`${styles.card} ${index === centerIndex2 ? styles.highlight : ''}`}>
                  <img src={pet.img} alt={pet.name} />
                  <div className={styles.info}>
                    <div className={styles.name}>{pet.name}</div>
                    <div className={styles.meta}>
                      Raça: {pet.breed}<br/>
                      Gênero: {pet.gender}<br/>
                      {pet.age && <>Idade: {pet.age}<br/></>}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
          
          <button 
            className={styles.arrow} 
            onClick={() => scroll('next', carouselRef2, centerIndex2, setCenterIndex2, adotados.length)} 
            aria-label="próximo"
          >
            &#8250;
          </button>
        </div>
      </section>
    </div>
  )
}