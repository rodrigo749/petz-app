'use client'

import { useState } from "react";
import styles from "./perdidos.module.css";

export default function CadastrarPerdidos() {

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

  // ── helpers (mesmo padrão do cadastro de adoção) ──
  const getBaseUrl = () =>
    (process.env.NEXT_PUBLIC_PETZ_API_URL || `http://localhost:${process.env.PORT || 3000}`)
      .trim()
      .replace(/\/$/, "");

  // upload robusto (mesmo padrão do cadastro de adoção)
  const uploadImage = async (file) => {
    if (!file) throw new Error("Nenhum arquivo fornecido");
    if (!file.type || !file.type.startsWith("image/")) throw new Error("Arquivo não é imagem");
    const maxMB = 5;
    if (file.size > maxMB * 1024 * 1024) throw new Error(`Imagem maior que ${maxMB}MB`);

    const baseUrl = getBaseUrl();
    const configs = [
      { url: `${baseUrl}/api/upload`, field: "file" },
      { url: `${baseUrl}/api/upload`, field: "imagem" },
      { url: `${baseUrl}/upload`, field: "file" },
      { url: `${baseUrl}/upload`, field: "imagem" },
    ];

    let lastErr = null;
    for (const cfg of configs) {
      try {
        const fd = new FormData();
        fd.append(cfg.field, file);
        const res = await fetch(cfg.url, { method: "POST", body: fd });
        const text = await res.text().catch(() => "");
        let data = {};
        try { data = text ? JSON.parse(text) : {}; } catch { data = { raw: text }; }

        if (!res.ok) {
          lastErr = new Error(data?.message || data?.raw || `Upload falhou (${res.status})`);
          continue;
        }

        const returned =
          data?.url || data?.path || data?.fileUrl || data?.filename ||
          data?.file || data?.file_path || data?.filepath || null;
        if (returned && typeof returned === "string") {
          return returned.startsWith("/") ? `${baseUrl}${returned}` : returned;
        }
        if (typeof data === "string" && data) {
          return data.startsWith("/") ? `${baseUrl}${data}` : data;
        }

        lastErr = new Error("Upload OK mas resposta não contém URL");
      } catch (err) {
        lastErr = err;
      }
    }
    throw lastErr || new Error("Falha no upload da imagem");
  };

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

    setLoading(true);

    try {
      // 1. upload da imagem (se houver)
      let finalImageUrl = "/images/semfoto.jpg";
      if (file) {
        try {
          finalImageUrl = await uploadImage(file);
        } catch (uploadErr) {
          console.error("Erro upload:", uploadErr);
          setMessage("Erro ao enviar imagem. Verifique o servidor.");
          setLoading(false);
          return;
        }
      }

      // 2. montar payload conforme model Pet do backend (campos em inglês)
      const baseUrl = getBaseUrl();

      // usuário logado (desabilitado para testes)
      let usuario = { id: 1 };
      // try {
      //   const u = JSON.parse(localStorage.getItem('usuarioLogado') || 'null');
      //   if (u && u.id) usuario = u;
      // } catch {}

      const payload = {
        name: nome.trim(),
        breed: raca.trim() || null,
        gender: genero.trim() || null,
        dateLost: dataPerda || null,
        location: local.trim() || null,
        reward: recompensa ? Number(recompensa) : 0,
        description: descricao.trim() || null,
        image: finalImageUrl,
        status: "lost",
        userId: usuario.id,
      };

      // 3. enviar para /api/pets (mesma tabela, status = 'lost')
      const res = await fetch(`${baseUrl}/api/pets`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const respData = await res.json().catch(() => ({}));

      if (!res.ok) {
        const msg =
          respData?.message || respData?.error || respData?.raw ||
          `Erro ao cadastrar pet perdido (status ${res.status})`;
        setMessage(msg);
        setLoading(false);
        return;
      }

      // 4. sucesso
      console.log("[CadastroPetPerdido] resposta backend:", respData);
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
      console.error("Erro geral:", err);
      setMessage("Erro de conexão com o servidor. O backend está ligado?");
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
