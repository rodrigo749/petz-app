"use client";

import { useEffect, useState } from "react";
import PetCard from "@/components/PetCard/PetCard";
import styles from "./seusPets.module.css";

export default function SeusPetsParaAdocao() {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);

  async function carregarPets() {
    try {
      setLoading(true);

      // Recuperar ONG logada do localStorage
      const user = JSON.parse(localStorage.getItem("usuarioLogado"));

      if (!user) {
        setPets([]);
        return;
      }

      const token = localStorage.getItem("token");

      // ✅ Buscar na API REAL (porta 3000) - rota existente no seu app.js
      const res = await fetch("http://localhost:3000/api/pets", {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      const data = await res.json();

      // (opcional, mas ajuda muito no debug)
      console.log("RETORNO /api/pets (primeiro item):", Array.isArray(data) ? data[0] : data);

      // ✅ Filtrar somente pets:
      // - status "adocao"
      // - cadastrados pela ONG logada
      const meusPets = (Array.isArray(data) ? data : []).filter(
        (pet) => pet.status === "adocao" && pet.ongId === user.id
      );

      setPets(meusPets);
    } catch (error) {
      console.error("Erro ao carregar pets:", error);
      setPets([]);
    } finally {
      setLoading(false);
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
          {loading ? (
            <p>Carregando...</p>
          ) : pets.length > 0 ? (
            pets.map((pet) => (
              <PetCard key={pet.id} pet={pet} tipoPagina="usuario" />
            ))
          ) : (
            <p>Você ainda não cadastrou nenhum pet para adoção.</p>
          )}
        </section>
      </div>
    </main>
  );
}
