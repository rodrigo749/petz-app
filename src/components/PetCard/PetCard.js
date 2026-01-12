"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ModalPet from "@/components/ModalPet/ModalPet";
import styles from "./PetCard.module.css";

export default function PetCard({ pet, tipoPagina }) {
  const [open, setOpen] = useState(false);
  const [usuarioLogado, setUsuarioLogado] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("usuarioLogado"));
    setUsuarioLogado(user);
  }, []);

  const ehDoUsuario = usuarioLogado && pet.usuarioId === usuarioLogado.id;

  async function marcarComoAdotado() {
    try {
      await fetch(`/api/pets/${pet.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "adotado" }),
      });

      window.location.reload();
    } catch (error) {
      console.error("Erro ao marcar como adotado:", error);
    }
  }

  return (
    <>
      <div className={styles["card-pet"]}>
        <div className={styles["card-image-wrapper"]}>
          <img
            src={pet.imagem || "/images/default.png"}
            alt={pet.nome}
            className={styles["card-image"]}
          />
        </div>

        <div className={styles["content-column"]}>
          <div className={styles["card-text-box"]}>
            <h3>{pet.nome}</h3>
            <p>Raça: {pet.raca}</p>
            <p>Gênero: {pet.genero}</p>
            <p>Idade: {pet.idade}</p>
            <p>Descrição: {pet.descricao}</p>
          </div>

          {tipoPagina === "publica" && (
            <button className={styles["btn-adotar"]} onClick={() => setOpen(true)}>
              Adotar
            </button>
          )}

          {tipoPagina === "usuario" && ehDoUsuario && (
            <div className={styles["actions-wrapper"]}>
              <button className={styles["btn-adotado"]} onClick={marcarComoAdotado}>
                Adotado
              </button>

              <Link href={`/editar-pet/${pet.id}`}>
                <button className={styles["btn-editar"]}>Editar</button>
              </Link>
            </div>
          )}
        </div>
      </div>

      {open && tipoPagina === "publica" && (
        <ModalPet pet={pet} onClose={() => setOpen(false)} />
      )}
    </>
  );
}
