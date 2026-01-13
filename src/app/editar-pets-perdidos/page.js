"use client";

import { useState, useEffect } from "react";
import styles from "./encontrados.module.css";

export default function Encontrados({ id }) {

  const [recompensa, setRecompensa] = useState(0);
  const [statusMessage, setStatusMessage] = useState("");

  // pet fields
  const [nome, setNome] = useState("");
  const [raca, setRaca] = useState("");
  const [genero, setGenero] = useState("");
  const [local, setLocal] = useState("");
  const [dataPerda, setDataPerda] = useState("");
  const [descricao, setDescricao] = useState("");
  const [imagem, setImagem] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFocus = (e) => {
    e.target.dataset.placeholder = e.target.placeholder;
    e.target.placeholder = "";
  };

  const handleBlur = (e) => {
    e.target.placeholder = e.target.dataset.placeholder;
  };

  // fetch pet by id to prefill fields
  async function carregarPet() {
    if (!id) return;
    try {
      const res = await fetch(`/api/pets/${id}`);
      if (!res.ok) return;
      const pet = await res.json();
      setNome(pet.nome || "");
      setRaca(pet.raca || "");
      setGenero(pet.genero || "");
      setLocal(pet.local || "");
      setDataPerda(pet.data || "");
      setDescricao(pet.descricao || "");
      setRecompensa(pet.recompensa || 0);
      setImagem(pet.imagem || "");
    } catch (err) {
      console.error('Erro ao carregar pet:', err);
    }
  }

  useEffect(() => { carregarPet(); }, [id]);

  return (
    <main className={styles.cadastroPetContainer}>
      <div className={styles.cadastroWrapper}>

        {/* COLUNA ESQUERDA */}
        <section className={styles.colEsquerda}>

          {/* UPLOAD */}
          <div className={styles.uploadImagem}>
            <label htmlFor="pet-imagem">
              <div className={styles.uploadBox}>
                <img src="/images/iconephoto.png" className={styles.iconeAddImg} />
                <span>Adicionar imagem</span>
              </div>
            </label>
            <input type="file" id="pet-imagem" hidden accept="image/*" />
          </div>

          {/* DESCRIÇÃO */}
          <div className={styles.descricaoBox}>
            <label className={styles.descLabel}>
              <img src="/images/patinha.png" className={styles.descIcon} />
              Descrição:
            </label>

            <textarea
              className={styles.descricaoTextarea}
              placeholder="Descreva o pet aqui..."
              rows="8"
              onFocus={handleFocus}
              onBlur={handleBlur}
            ></textarea>
          </div>
        </section>

        {/* COLUNA DIREITA */}
        <section className={styles.colDireita}>
          <div className={styles.tituloArea}>
            <h2 className={styles.tituloCadastro}>Editar Pet Perdido</h2>
          </div>

          <form className={styles.formCadastro}>

            {/* Campo padrão */}
            {["Nome", "Raça", "Gênero", "Local", "Data"].map((campo) => (
              <div className={styles.campo} key={campo}>
                <img src="/images/patinha.png" className={styles.iconeInput} />
                <input
                  type="text"
                  placeholder={campo + ":"}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                />
              </div>
            ))}

            {/* Encontrado button removed */}

            {/* SLIDER RECOMPENSA */}
            <div className={styles.recompensaBox}>
              <div className={styles.recompensaWrapper}>
                <div className={styles.recompensaLabelWrapper}>
                  <label className={styles.recompensaLabel}>Recompensa</label>
                </div>
                <div className={styles.recompensaRow}>
                  <img src="/images/patinha.png" className={styles.iconeRecompensa} />
                  <input
                    type="range"
                    min="0"
                    max="500"
                    value={recompensa}
                    onChange={(e) => setRecompensa(Number(e.target.value))}
                    className={styles.slider}
                  />
                  <span className={styles.valorRecompensa}>R$ {recompensa}</span>
                </div>
              </div>
            </div>

            {statusMessage && (
              <div style={{ textAlign: 'center', color: '#285a78', fontWeight: 700, marginTop: 8 }}>{statusMessage}</div>
            )}

            {/* Editar / Excluir handlers */}
            <div style={{ display: 'none' }}>
              {/* keep placeholder for layout tools if needed */}
            </div>

            <div className={styles.actionsRow}>
              <button type="button" className={styles.btnEditar} onClick={async () => {
                if (!id) return setStatusMessage('ID não disponível');
                try {
                  setLoading(true);
                  const payload = {
                    nome, raca, genero, local, data: dataPerda, descricao, recompensa, imagem
                  };
                  const res = await fetch(`/api/pets/${id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                  });
                  if (!res.ok) throw new Error('Falha ao editar');
                  setStatusMessage('Dados atualizados');
                  setTimeout(() => setStatusMessage(''), 2000);
                } catch (err) {
                  console.error(err);
                  setStatusMessage(err.message || 'Erro ao editar');
                  setTimeout(() => setStatusMessage(''), 2500);
                } finally { setLoading(false); }
              }}>Editar</button>

              <button type="button" className={styles.btnExcluir} onClick={async () => {
                if (!id) return setStatusMessage('ID não disponível');
                if (!confirm('Confirma remoção do pet?')) return;
                try {
                  setLoading(true);
                  const res = await fetch(`/api/pets/${id}`, { method: 'DELETE' });
                  if (!res.ok) throw new Error('Falha ao remover');
                  setStatusMessage('Pet removido');
                  setTimeout(() => { setStatusMessage(''); window.location.href = '/perdidos'; }, 1200);
                } catch (err) {
                  console.error(err);
                  setStatusMessage(err.message || 'Erro ao remover');
                  setTimeout(() => setStatusMessage(''), 2500);
                } finally { setLoading(false); }
              }}>Excluir</button>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}
