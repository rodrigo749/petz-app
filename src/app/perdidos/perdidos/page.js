"use client";

import { useEffect, useState } from "react";
import PetCard from "@/components/PetCard/PetCard";
import styles from "../perdidos.module.css";

export default function PetsPerdidosPage() {
  const [pets, setPets] = useState([]);

  async function carregarPets() {
    try {
      const res = await fetch("/api/pets-perdidos");
      const data = await res.json();
      const lista = Array.isArray(data) ? data.filter((p) => p.status === "perdido") : [];
      setPets(lista);
    } catch (err) {
      console.error("Erro ao carregar pets perdidos:", err);
      setPets([]);
    }
  }

  useEffect(() => {
    carregarPets();
  }, []);

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <h2 className={styles.title}>Pets Perdidos</h2>

        <section className={styles.grid}>
          {pets.length > 0 ? (
            pets.map((pet) => (
              <PetCard key={pet.id} pet={pet} tipoPagina="perdidos" />
            ))
          ) : (
            <p>Nenhum pet perdido encontrado.</p>
          )}
        </section>
      </div>
    </main>
  );
}
