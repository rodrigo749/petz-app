"use client"

import { useState } from 'react'
import styles from './home.module.css'
import Carousel from '../../components/Carousel'

export default function HomePage() {
  const [dummy, setDummy] = useState(false) // placeholder to keep this as a client component

  const perdidos = [
    { id: 1, name: "Mingau", breed: "Abissínio", gender: "Fêmea", location: "Avenida Vicente Simões, 715 - Centro", img: "https://placekitten.com/300/200" },
    { id: 2, name: "Lola", breed: "Leonberger", gender: "Fêmea", location: "Rua A, 212 - Fátima 1 - Pouso Alegre", img: "https://place-puppy.com/320/220" },
    { id: 3, name: "Pom Pom", breed: "Persa", gender: "Macho", location: "Avenida Doutor Lisboa, 05 - Centro", img: "https://placekitten.com/320/220" },
    { id: 4, name: "Buddy", breed: "SRD", gender: "Macho", location: "Bairro Jardim", img: "https://place-puppy.com/330/220" },
    { id: 5, name: "Nina", breed: "Siamês", gender: "Fêmea", location: "Centro", img: "https://placekitten.com/310/210" }
  ]

  const adotados = [
    { id: 6, name: "Pulga", breed: "Vira-lata", gender: "Macho", age: "Adulto", location: "XXXXXX", ong: "XXXXXX", img: "https://place-puppy.com/300/200" },
    { id: 7, name: "Lola", breed: "Vira-lata", gender: "Fêmea", age: "Filhote", location: "XXXXXX", ong: "XXXXXX", img: "https://placekitten.com/320/220" },
    { id: 8, name: "Lolô", breed: "Vira-lata", gender: "Macho", age: "1 ano", location: "XXXXXX", ong: "XXXXXX", img: "https://place-puppy.com/320/220" },
    { id: 9, name: "Max", breed: "SRD", gender: "Macho", age: "2 anos", location: "XXXXXX", ong: "XXXXXX", img: "https://place-puppy.com/330/220" }
  ]

  return (
    <div className={styles.pageWrap}>
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

      <section className={styles.block}>
        <h3 className={styles.title}>Perdidos recentemente</h3>
        <Carousel items={perdidos} />
      </section>

      <section className={styles.block}>
        <h3 className={styles.title}>Adotados recentemente</h3>
        <Carousel items={adotados} />
      </section>
    </div>
  )
}