"use client"

import { useState, useEffect } from 'react'
import styles from './home.module.css'
import Carousel from '../../components/Carousel'

export default function HomePage() {
  const [perdidos, setPerdidos] = useState([])
  const [adocao, setAdocao] = useState([])
  const [totalEncontrados, setTotalEncontrados] = useState(0)
  const [totalAdotados, setTotalAdotados] = useState(0)
  const [nomeUsuario, setNomeUsuario] = useState("")

  useEffect(() => {
    try {
      const usuario = JSON.parse(localStorage.getItem("usuarioLogado") || "null");
      if (usuario) {
        const nome = usuario.nome || usuario.name || usuario.razaoSocial || "";
        if (nome) setNomeUsuario(nome);
      }
    } catch {}
  }, [])

  async function carregarPets() {
    // Buscar pets perdidos e encontrados a partir do endpoint de pets-perdidos
    try {
      const resPerdidos = await fetch("/api/pets-perdidos");
      const dataPerdidos = await resPerdidos.json();

      const petsPerdidos = dataPerdidos
        .filter(p => p.status === 'perdido')
        .map(pet => ({
          id: pet.id,
          name: pet.nome,
          breed: pet.raca,
          gender: pet.genero,
          location: pet.local || pet.descricao || "",
          img: pet.imagem || "https://via.placeholder.com/300x200",
          link: "/pets-perdidos"
        }));

      setPerdidos(petsPerdidos);

      // Contar pets encontrados (status: encontrado ou achado)
      const encontrados = dataPerdidos.filter(
        p => p.status === 'encontrado' || p.status === 'achado'
      );
      setTotalEncontrados(encontrados.length);
    } catch (err) {
      console.error("Erro carregando pets perdidos:", err);
      setPerdidos([]);
      setTotalEncontrados(0);
    }

    // Buscar pets adotados a partir do endpoint de pets-adocao
    try {
      const resAdocao = await fetch("/api/pets-adocao");
      const dataAdocao = await resAdocao.json();

      // Pets disponíveis para adoção (para o carrossel)
      const petsParaAdocao = dataAdocao
        .filter(p => p.status === 'adocao')
        .map(pet => ({
          id: pet.id,
          name: pet.nome,
          breed: pet.raca,
          gender: pet.genero,
          age: pet.idade || "",
          img: pet.imagem || "https://via.placeholder.com/300x200",
          link: "/pets-para-adocao"
        }));
      setAdocao(petsParaAdocao);

      // Contar pets já adotados
      const adotados = dataAdocao.filter(p => p.status === 'adotado');
      setTotalAdotados(adotados.length);
    } catch (err) {
      console.error("Erro carregando pets adotados:", err);
      setAdocao([]);
      setTotalAdotados(0);
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
          <h1>Bem Vindo{nomeUsuario ? `, ${nomeUsuario}` : ""}!</h1>
          <p>
            Cada clique transforma vidas: aqui você pode reencontrar seu pet, adotar com amor ou doar para quem precisa. 
            Juntos, criamos lindas histórias de afeto, esperança e recomeços.
          </p>
        </div>
      </section>

      {/* Carrossel de pets para adoção */}
      <section className={styles.block}>
        <h3 className={styles.title}>Pets para adoção</h3>
        <Carousel items={adocao} />
      </section>

      {/* Carrossel de perdidos */}
      <section className={styles.block}>
        <h3 className={styles.title}>Perdidos recentemente</h3>
        <Carousel items={perdidos} />
      </section>

      {/* Cards de estatísticas */}
      <section className={styles.statsSection}>
        <div className={styles.statsContainer}>
          <div className={`${styles.statCard} ${styles.statCardEncontrados}`}>
            <div className={styles.statIcon}>🐾</div>
            <div className={styles.statNumber}>{totalEncontrados}</div>
            <div className={styles.statLabel}>Pets Encontrados</div>
            <p className={styles.statDescription}>
              Pets que foram reencontrados por seus donos graças à nossa comunidade.
            </p>
          </div>

          <div className={`${styles.statCard} ${styles.statCardAdotados}`}>
            <div className={styles.statIcon}>🏠</div>
            <div className={styles.statNumber}>{totalAdotados}</div>
            <div className={styles.statLabel}>Pets Adotados</div>
            <p className={styles.statDescription}>
              Pets que encontraram um novo lar cheio de amor e carinho.
            </p>
          </div>
        </div>
      </section>

    </div>
  )
}  