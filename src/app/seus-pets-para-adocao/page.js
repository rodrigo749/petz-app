"use client";

import { useEffect, useState } from "react";
import PetCard from "@/components/PetCard/PetCard";
import styles from "./seusPets.module.css";

export default function SeusPetsParaAdocao() {
  const [pets, setPets] = useState([]);
  const [usuarioLogado, setUsuarioLogado] = useState(null);

  async function carregarPets() {
    try {
      // Recuperar usuário logado do localStorage
      const user = JSON.parse(localStorage.getItem("usuarioLogado"));
      setUsuarioLogado(user);

      if (!user) {
        setPets([]);
        return;
      }

      // Buscar todos os pets na API
      const res = await fetch("/api/pets-adocao");
      const data = await res.json();

      // Filtrar somente pets:
      // - do tipo adoção
      // - cadastrados pelo usuário logado
      const meusPets = data.filter(
        (pet) => pet.status === "adocao" && pet.usuarioId === user.id
      );

      setPets(meusPets);
    } catch (error) {
      console.error("Erro ao carregar pets:", error);
    }
  }

  useEffect(() => {
    carregarPets();
  }, []);

  return (
    <main className={styles["pets-page"]}>
      <div className={styles["cards-wrapper-container"]}>
        <h1 className={styles.titulo}>Meus Pets para Adoção</h1>

        <section className={styles["grid-pets"]}>
          {pets.length > 0 ? (
            pets.map((pet) => <PetCard key={pet.id} pet={pet} tipoPagina="usuario" />)
          ) : (
            <p>Você ainda não cadastrou nenhum pet para adoção.</p>
          )}
        </section>
      </div>
    </main>
  );
}
