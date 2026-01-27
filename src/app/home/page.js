"use client"

import { useState, useEffect } from 'react'
import styles from './home.module.css'
import Carousel from '../../components/Carousel'

export default function HomePage() {
  const [perdidos, setPerdidos] = useState([])
  const [adotados, setAdotados] = useState([])
  const [resgatados, setResgatados] = useState([])

  async function carregarPets() {
    // Buscar pets perdidos diretamente do endpoint específico
    try {
      const resPerdidos = await fetch("/api/pets-perdidos");
      const dataPerdidos = await resPerdidos.json();

      const petsPerdidos = dataPerdidos.map(pet => ({
        id: pet.id,
        name: pet.nome,
        breed: pet.raca,
        gender: pet.genero,
        location: pet.local || pet.descricao || "",
        img: pet.imagem || "https://via.placeholder.com/300x200"
      }));

      setPerdidos(petsPerdidos);
    } catch (err) {
      console.error("Erro carregando pets perdidos:", err);
      setPerdidos([]);
    }

    // Buscar pets resgatados (encontrados/achados) a partir do mesmo endpoint de pets-perdidos
    try {
      const resResgatados = await fetch("/api/pets-perdidos");
      const dataResgatados = await resResgatados.json();
      const encontrados = dataResgatados
        .filter(p => p.status === 'encontrado' || p.status === 'achado')
        .map(pet => ({
          id: pet.id,
          name: pet.nome,
          breed: pet.raca,
          gender: pet.genero,
          location: pet.local || pet.descricao || "",
          img: pet.imagem || "https://via.placeholder.com/300x200"
        }));

      setResgatados(encontrados);
    } catch (err) {
      console.error("Erro carregando pets resgatados:", err);
      setResgatados([]);
    }
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
        <h3 className={styles.title}>Resgatados recentemente</h3>
        <Carousel items={resgatados} />
      </section>

      <section className={styles.block}>
        <h3 className={styles.title}>Adotados recentemente</h3>
        <Carousel items={adotados} />
      </section>
    </div>
  )
}