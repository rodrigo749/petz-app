'use client'

import { useState, useEffect } from "react";
import styles from "./perdidos.module.css";
import { uploadImage, savePet } from "@/lib/apiPets";

export default function CadastrarPerdidos() {
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('usuarioLogado') || 'null');
    if (!user) {
      window.location.href = '/login-usuario';
    }
  }, []);

  const [nome, setNome] = useState("");
  const [raca, setRaca] = useState("");
  const [genero, setGenero] = useState("");
  const [local, setLocal] = useState("");
  const [dataPerda, setDataPerda] = useState("");
  const [descricao, setDescricao] = useState("");
  const [recompensa, setRecompensa] = useState(0);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleFocus = (e) => {
    e.target.dataset.placeholder = e.target.placeholder;
    e.target.placeholder = "";
  };

  const handleBlur = (e) => {
    e.target.placeholder = e.target.dataset.placeholder;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    // validação mínima
    if (!nome.trim() || !descricao.trim()) {
      setMessage("Por favor preencha pelo menos o nome e a descrição.");
      return;
    }

    const body = {
      nome,
      raca,
      genero,
      data: dataPerda,
      local,
      recompensa,
      descricao,
      imagem: "/images/semfoto.jpg",
    };
    // adicionar informação do usuário logado, se houver
    try {
      const u = JSON.parse(localStorage.getItem('usuarioLogado') || 'null');
      if (u && u.id) {
        // garante que o cadastro contenha o id do dono (pode ser usuário ou ONG)
        body.usuarioId = u.id;
        // tenta preencher nome tanto para usuário quanto para ONG
        body.usuarioNome = u.nome || u.razaoSocial || '';
        // armazena também o tipo (usuario ou ong) para possibilidades futuras
        body.usuarioTipo = u.tipo || '';
      }
    } catch (err) { }

    try {
      setLoading(true);
      if (file) {
        body.imagem = await uploadImage(file);
      }
      // enviar para endpoint de pets perdidos
      await fetch('/api/pets-perdidos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      setMessage("Pet cadastrado com sucesso!");
      // limpar formulário
      setNome("");
      setRaca("");
      setGenero("");
      setLocal("");
      setDataPerda("");
      setDescricao("");
      setRecompensa(0);
      setFile(null);
      setPreview(null);
    } catch (err) {
      console.error(err);
      setMessage(err.message || "Erro ao salvar");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const f = e.target.files?.[0] || null;
    setFile(f);
    if (f) {
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result);
      reader.readAsDataURL(f);
    } else setPreview(null);
  }

  return (
    <main className={styles.cadastroPetContainer}>
      <div className={styles.cadastroWrapper}>

        {/* COLUNA ESQUERDA */}
        <section className={styles.colEsquerda}>

          {/* UPLOAD */}
          <div className={styles.uploadImagem}>
            <label htmlFor="pet-imagem">
              <div className={styles.uploadBox}>
                {preview ? (
                  <img src={preview} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 12 }} />
                ) : (
                  <>
                    <img src="/images/iconephoto.png" className={styles.iconeAddImg} />
                    <span>Adicionar imagem</span>
                  </>
                )}
              </div>
            </label>
            <input type="file" id="pet-imagem" hidden accept="image/*" onChange={handleFileChange} />
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
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              onFocus={handleFocus}
              onBlur={handleBlur}
            ></textarea>
          </div>
        </section>

  {/* COLUNA DIREITA */}
        <section className={styles.colDireita}>
          <div className={styles.tituloArea}>
            <h2 className={styles.tituloCadastro}>Cadastrar Pet Perdido</h2>
           
          </div>

          <form className={styles.formCadastro} onSubmit={handleSubmit}>

            <div className={styles.campo}>
              <img src="/images/patinha.png" className={styles.iconeInput} />
              <input
                type="text"
                placeholder="Nome:"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
            </div>

            <div className={styles.campo}>
              <img src="/images/patinha.png" className={styles.iconeInput} />
              <input
                type="text"
                placeholder="Raça:"
                value={raca}
                onChange={(e) => setRaca(e.target.value)}
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
            </div>

            <div className={styles.campo}>
              <img src="/images/patinha.png" className={styles.iconeInput} />
              <input
                type="text"
                placeholder="Gênero:"
                value={genero}
                onChange={(e) => setGenero(e.target.value)}
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
            </div>

            <div className={styles.campo}>
              <img src="/images/patinha.png" className={styles.iconeInput} />
              <input
                type="text"
                placeholder="Local:"
                value={local}
                onChange={(e) => setLocal(e.target.value)}
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
            </div>

            <div className={styles.campo}>
              <img src="/images/patinha.png" className={styles.iconeInput} />
              <input
                type="text"
                placeholder="Data:"
                value={dataPerda}
                onChange={(e) => setDataPerda(e.target.value)}
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
            </div>

            {/* right-column description removed — use the left description box */}

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
                    onChange={(e) => setRecompensa(e.target.value)}
                    className={styles.slider}
                  />
                  <span className={styles.valorRecompensa}>R$ {recompensa}</span>
                </div>
              </div>
            </div>

            <div>
              <button type="submit" className={styles.btnCadastrar} disabled={loading}>{loading ? 'Salvando...' : 'Cadastrar'}</button>
            </div>

            {message && (
              <div style={{ marginTop: 12, color: message.includes('sucesso') ? 'green' : 'red' }}>{message}</div>
            )}

          </form>
        </section>
      </div>
    </main>
  );
}
