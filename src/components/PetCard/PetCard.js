"use client";

import { useState, useEffect } from "react";
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

  // verifica se o pet pertence à ONG logada
  // (ajuste aqui se no backend vier como ong_id ao invés de ongId)
  const ehDaOng = usuarioLogado && pet.ongId === usuarioLogado.id;

  async function marcarComoAdotado() {
    try {
      const token = localStorage.getItem("token");

      await fetch(`http://localhost:3000/api/pets/${pet.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ status: "adotado" }),
      });

      // recarrega a página para atualizar a listagem
      window.location.reload();
    } catch (error) {
      console.error("Erro ao marcar como adotado:", error);
    }
  }

  return (
    <>
      <div className={styles["card-pet"]}>
        {/* IMAGEM */}
        <div className={styles["card-image-wrapper"]}>
          <img
            src={pet.imagem || "/images/default.png"}
            alt={pet.nome}
            className={styles["card-image"]}
          />
        </div>

        {/* CONTEÚDO */}
        <div className={styles["content-column"]}>
          <div className={styles["card-text-box"]}>
            <h3>{pet.nome}</h3>
            <p>Raça: {pet.raca}</p>
            <p>Gênero: {pet.genero}</p>
            <p>Idade: {pet.idade}</p>
            <p>Descrição: {pet.descricao}</p>
          </div>

          {/* BOTÕES */}

          {/* PÁGINA PÚBLICA → apenas ADOTAR */}
          {tipoPagina === "publica" && (
            <button
              className={styles["btn-adotar"]}
              onClick={() => setOpen(true)}
            >
              Adotar
            </button>
          )}

          {/* PÁGINA DE PETS PERDIDOS → apenas VER */}
          {tipoPagina === "perdidos" && (
            <button
              className={styles["btn-adotar"]}
              onClick={() => setOpen(true)}
            >
              Ver
            </button>
          )}

          {/* PÁGINA DA ONG/ÁREA LOGADA → ADOTADO + EDITAR (somente se for dono) */}
          {tipoPagina === "usuario" && ehDaOng && (
            <div className={styles["actions-wrapper"]}>
              <button
                className={styles["btn-adotado"]}
                onClick={marcarComoAdotado}
              >
                Adotado
              </button>

              <Link href={`/editar-cadastro-adocao/${pet.id}`}>
                <button className={styles["btn-editar"]}>Editar</button>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* MODAL – existe na página pública e também para pets perdidos (ver) */}
      {open && (tipoPagina === "publica" || tipoPagina === "perdidos") && (
        <ModalPet pet={pet} onClose={() => setOpen(false)} />
      )}
    </>
  );
}
