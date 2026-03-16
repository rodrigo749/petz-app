"use client";

import { useEffect, useState } from "react";
import PetCard from "@/components/PetCard/PetCard";
import styles from "./meus-pets-perdidos.module.css";

const getBaseUrl = () =>
  (process.env.NEXT_PUBLIC_PETZ_API_URL || "http://localhost:3000")
    .trim()
    .replace(/\/$/, "");

export default function MeusPetsPerdidos() {
  const [pets, setPets] = useState([]);
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("usuarioLogado"));
    setUsuario(user);
  }, []);

  useEffect(() => {
    async function carregarPets() {
      if (!usuario || !usuario.id) {
        setPets([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setErro("");

        const res = await fetch(`${getBaseUrl()}/api/pets`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          cache: "no-store",
        });

        if (!res.ok) {
          throw new Error("Erro ao buscar pets");
        }

        const data = await res.json();
        const listaPets = Array.isArray(data.pets) ? data.pets : [];

        console.log("pet:", pet);
        console.log("donoDoPet:", donoDoPet, "usuario.id:", usuario.id, "status:", statusPet);

        const meusPetsPerdidos = listaPets.filter((pet) => {
        const donoDoPet = pet.userId ?? pet.usuarioId;
        const statusPet = pet.status;
        
        console.log("pet:", pet);
        console.log("donoDoPet:", donoDoPet, "usuario.id:", usuario.id, "status:", statusPet);
        
        return (
          Number(donoDoPet) === Number(usuario.id) &&
          (statusPet === "lost" || statusPet === "perdido")
          );
        });
        setPets(meusPetsPerdidos);
      } catch (error) {
        console.error("Erro ao carregar meus pets perdidos:", error);
        setErro("Não foi possível carregar seus pets perdidos.");
      } finally {
        setLoading(false);
      }
    }

    carregarPets();
  }, [usuario]);
  


  return (
    <main className={styles["pets-page"]}>
      <div className={styles["cards-wrapper-container"]}>
        <h1 className={styles.titulo}>Meus Pets Perdidos</h1>

        {loading && <p>Carregando pets...</p>}
        {erro && <p>{erro}</p>}

        {!loading && !erro && (
          <section className={styles["grid-pets"]}>
            {pets.length > 0 ? (
              pets.map((pet) => (
                <PetCard key={pet.id} pet={pet} tipoPagina="usuario" />
              ))
            ) : (
              <p>Você não tem pets perdidos registrados.</p>
            )}
          </section>
        )}
      </div>
    </main>
  );
}