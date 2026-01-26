"use client";

import { useEffect, useState } from "react";
import PetCard from "@/components/PetCard/PetCard";
import styles from "./meus-pets-perdidos.module.css";

export default function MeusPetsPerdidos() {
  const [pets, setPets] = useState([]);
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("usuarioLogado"));
    setUsuario(user);
  }, []);

  useEffect(() => {
    async function carregar() {
      const res = await fetch("/api/pets-perdidos");
      const data = await res.json();
      if (usuario && usuario.id) {
        const meus = data.filter((p) => p.usuarioId === usuario.id);
        setPets(meus);
      } else {
        setPets([]);
      }
    }
    carregar();
  }, [usuario]);

  return (
    <main className={styles["pets-page"]}>
      <div className={styles["cards-wrapper-container"]}>
        <h1 className={styles.titulo}>Meus Pets Perdidos</h1>

        <section className={styles["grid-pets"]}>
          {pets.length > 0 ? (
            pets.map((pet) => (
              <PetCard key={pet.id} pet={pet} tipoPagina="usuario" />
            ))
          ) : (
            <p>Você não tem pets perdidos registrados.</p>
          )}
        </section>
      </div>
    </main>
  );
}
