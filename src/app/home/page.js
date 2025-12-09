"use client"

import { useState, useEffect } from 'react'
import styles from './home.module.css'
import Carousel from '../../components/Carousel'

export default function HomePage() {
  const [perdidos, setPerdidos] = useState([])
  const [adotados, setAdotados] = useState([])

  async function carregarPets() {
    const res = await fetch("/api/pets");
    const data = await res.json();
    
    // Filtrar pets perdidos
    const petsPerdidos = data
      .filter(pet => pet.status === 'perdido')
      .map(pet => ({
        id: pet.id,
        name: pet.nome,
        breed: pet.raca,
        gender: pet.genero,
        location: pet.descricao,
        img: pet.imagem || "https://via.placeholder.com/300x200"
      }))
    
    // Filtrar pets para adoção
    const petsAdocao = data
      .filter(pet => pet.status === 'adocao')
      .map(pet => ({
        id: pet.id,
        name: pet.nome,
        breed: pet.raca,
        gender: pet.genero,
        age: pet.idade,
        location: pet.descricao,
        img: pet.imagem || "https://via.placeholder.com/300x200"
      }))
    
    setPerdidos(petsPerdidos)
    setAdotados(petsAdocao)
  }

  useEffect(() => {
    carregarPets()
  }, [])

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