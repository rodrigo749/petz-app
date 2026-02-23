'use client'

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./perdidos.module.css";
import useSafeToast from "@/components/Toast/useSafeToast";

export default function CadastrarPerdidos() {
  const { showToast } = useSafeToast();
  const router = useRouter();

  const [formData, setFormData] = useState({
    nome: "",
    especie: "",
    raca: "",
    genero: "",
    local: "",
    dataPerda: "",
    descricao: "",
    recompensa: 0,
    imagemPreview: "",
  });

  const [imagemFile, setImagemFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  // ── helpers ──
  const getBaseUrl = () =>
    (process.env.NEXT_PUBLIC_PETZ_API_URL || `http://localhost:${process.env.PORT || 3000}`)
      .trim()
      .replace(/\/$/, "");

  // upload robusto (mesmo padrão do cadastro de usuário)
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

  // ── form handlers ──
  const handleFocus = (e) => {
    e.target.dataset.placeholder = e.target.placeholder;
    e.target.placeholder = "";
  };

  const handleBlur = (e) => {
    e.target.placeholder = e.target.dataset.placeholder || "";
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (fieldErrors[field]) setFieldErrors((prev) => ({ ...prev, [field]: null }));
  };

  const handleImagem = (e) => {
    const arquivo = e.target.files?.[0];
    if (!arquivo) return;

    const maxMB = 5;
    if (arquivo.size > maxMB * 1024 * 1024) {
      showToast(`Imagem maior que ${maxMB}MB. Escolha outra.`, "warning");
      return;
    }
    if (!arquivo.type || !arquivo.type.startsWith("image/")) {
      showToast("Formato inválido. Escolha uma imagem.", "warning");
      return;
    }

    // revoga preview anterior se blob
    if (formData.imagemPreview && formData.imagemPreview.startsWith("blob:")) {
      try { URL.revokeObjectURL(formData.imagemPreview); } catch {}
    }

    setImagemFile(arquivo);
    setFormData((prev) => ({ ...prev, imagemPreview: URL.createObjectURL(arquivo) }));
  };

  // cleanup blob ao desmontar
  useEffect(() => {
    return () => {
      if (formData.imagemPreview && formData.imagemPreview.startsWith("blob:")) {
        try { URL.revokeObjectURL(formData.imagemPreview); } catch {}
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── submit ──
  const salvarPet = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFieldErrors({});

    // validações
    if (!formData.nome.trim()) {
      setFieldErrors((prev) => ({ ...prev, nome: "Nome é obrigatório." }));
      setLoading(false);
      return;
    }
    if (!formData.especie) {
      setFieldErrors((prev) => ({ ...prev, especie: "Selecione a espécie." }));
      setLoading(false);
      return;
    }
    if (!formData.descricao.trim()) {
      setFieldErrors((prev) => ({ ...prev, descricao: "Descrição é obrigatória." }));
      setLoading(false);
      return;
    }

    // verifica usuário logado
    let usuario = null;
    try {
      usuario = JSON.parse(localStorage.getItem("usuarioLogado") || "null");
      // 1. upload da imagem (se houver)
      let finalImageUrl = "/images/semfoto.jpg";
      if (imagemFile) {
        try {
          finalImageUrl = await uploadImage(imagemFile);
        } catch (uploadErr) {
          console.error("Erro upload:", uploadErr);
          showToast("Erro ao enviar imagem. Verifique o servidor.", "error");
          setLoading(false);
          return;
        }
      }

      // 2. montar payload
      const baseUrl = getBaseUrl();
      const payload = {
        nome: formData.nome.trim(),
        especie: formData.especie,
        raca: formData.raca.trim() || null,
        genero: formData.genero.trim() || null,
        data: formData.dataPerda.trim() || null,
        local: formData.local.trim() || null,
        recompensa: formData.recompensa ? Number(formData.recompensa) : 0,
        descricao: formData.descricao.trim() || null,
        imagem: finalImageUrl,
        usuarioId: usuario?.id || null,
        usuarioNome: usuario?.nome || usuario?.razaoSocial || '',
        usuarioTipo: usuario?.tipo || '',
      };

      // 3. enviar para o backend
      const res = await fetch(`${baseUrl}/api/pets-perdidos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const respData = await res.json().catch(() => ({}));

      if (!res.ok) {
        const msg =
          respData?.message || respData?.error || respData?.raw ||
          `Erro ao cadastrar pet (status ${res.status})`;

        if (msg.toLowerCase().includes("nome")) {
          setFieldErrors((prev) => ({ ...prev, nome: msg }));
        } else if (msg.toLowerCase().includes("descrição") || msg.toLowerCase().includes("descricao")) {
          setFieldErrors((prev) => ({ ...prev, descricao: msg }));
        } else {
          showToast(msg, "error");
        }
        setLoading(false);
        return;
      }

      // 4. sucesso
      console.log("[CadastrarPetPerdido] resposta backend:", respData);
      showToast("Pet perdido cadastrado com sucesso!", "success");

      // limpar formulário
      setFormData({
        nome: "",
        especie: "",
        raca: "",
        genero: "",
        local: "",
        dataPerda: "",
        descricao: "",
        recompensa: 0,
        imagemPreview: "",
      });
      setImagemFile(null);

      // redirecionar para listagem de pets perdidos após breve delay
      setTimeout(() => router.push("/meus-pets-perdidos"), 900);
    } catch (err) {
      console.error("Erro geral:", err);
      showToast("Erro de conexão com o servidor. O backend está ligado?", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.cadastroPetContainer}>
      <div className={styles.adocaoContainer}>

        {/* COLUNA ESQUERDA */}
        <section className={styles.leftSide}>
          <div className={styles.uploadImagem}>
            <label htmlFor="pet-imagem">
              <div className={styles.uploadBox}>
                {formData.imagemPreview ? (
                  <img
                    src={formData.imagemPreview}
                    alt="Pré-visualização"
                    className={styles.previewImagem}
                  />
                ) : (
                  <>
                    <img
                      src="/images/iconephoto.png"
                      alt="Adicionar"
                      className={styles.iconeAddImg}
                    />
                    <span>Adicionar imagem</span>
                  </>
                )}
              </div>
            </label>

            <input
              type="file"
              id="pet-imagem"
              accept="image/*"
              hidden
              onChange={handleImagem}
              disabled={loading}
            />
          </div>

          <div className={styles.campoDescricao}>
            <img
              src="/images/patinha.png"
              alt="patinha"
              className={styles.iconeDescricao}
            />

            <textarea
              className={styles.descricaoTextarea}
              placeholder="Descreva o pet aqui..."
              value={formData.descricao}
              onChange={(e) => handleChange("descricao", e.target.value)}
              onFocus={handleFocus}
              onBlur={handleBlur}
              style={fieldErrors.descricao ? { borderColor: "red" } : {}}
            ></textarea>
            {fieldErrors.descricao && <span className={styles.errorText}>{fieldErrors.descricao}</span>}
          </div>
        </section>

        {/* COLUNA DIREITA */}
        <section className={styles.rightSide}>
          <h2 className={styles.tituloCadastro}>Cadastrar Pet Perdido</h2>

          <form className={styles.formCadastro} onSubmit={salvarPet}>

            <div className={styles.campo} style={fieldErrors.nome ? { borderColor: "red" } : {}}>
              <img src="/images/patinha.png" className={styles.iconeInput} />
              <input
                type="text"
                placeholder="Nome"
                value={formData.nome}
                onChange={(e) => handleChange("nome", e.target.value)}
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
            </div>
            {fieldErrors.nome && <span className={styles.errorText}>{fieldErrors.nome}</span>}

            <div className={styles.campo} style={fieldErrors.especie ? { borderColor: "red" } : {}}>
              <img src="/images/patinha.png" className={styles.iconeInput} />
              <select
                value={formData.especie}
                onChange={(e) => handleChange("especie", e.target.value)}
                className={!formData.especie ? styles.selectPlaceholder : ""}
              >
                <option value="" disabled>Selecione a espécie</option>
                <option value="dog">Cachorro</option>
                <option value="cat">Gato</option>
              </select>
            </div>
            {fieldErrors.especie && <span className={styles.errorText}>{fieldErrors.especie}</span>}

            <div className={styles.campo}>
              <img src="/images/patinha.png" className={styles.iconeInput} />
              <input
                type="text"
                placeholder="Raça"
                value={formData.raca}
                onChange={(e) => handleChange("raca", e.target.value)}
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
            </div>

            <div className={styles.campo}>
              <img src="/images/patinha.png" className={styles.iconeInput} />
              <input
                type="text"
                placeholder="Gênero"
                value={formData.genero}
                onChange={(e) => handleChange("genero", e.target.value)}
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
            </div>

            <div className={styles.campo}>
              <img src="/images/patinha.png" className={styles.iconeInput} />
              <input
                type="text"
                placeholder="Local"
                value={formData.local}
                onChange={(e) => handleChange("local", e.target.value)}
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
            </div>

            <div className={styles.campo}>
              <img src="/images/patinha.png" className={styles.iconeInput} />
              <input
                type="text"
                placeholder="Data da perda"
                value={formData.dataPerda}
                onChange={(e) => handleChange("dataPerda", e.target.value)}
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
            </div>

            {/* RECOMPENSA - Same styling as input fields */}
            <div className={styles.campoRecompensa}>
              <img src="/images/patinha.png" className={styles.iconeInput} />
              <div className={styles.sliderContainer}>
                <input
                  type="range"
                  min="0"
                  max="1000"
                  value={formData.recompensa}
                  onChange={(e) => handleChange("recompensa", e.target.value)}
                  className={styles.slider}
                />
                <input
                  type="number"
                  min="0"
                  max="1000"
                  value={formData.recompensa}
                  onChange={(e) => {
                    let value = e.target.value;
                    // Allow empty input while typing
                    if (value === "") {
                      handleChange("recompensa", "0");
                      return;
                    }
                    // Parse the value
                    const numValue = parseInt(value, 10);
                    // Validate: no negative, only numeric values
                    if (isNaN(numValue) || numValue < 0) {
                      handleChange("recompensa", "0");
                    } else if (numValue > 1000) {
                      handleChange("recompensa", "1000");
                    } else {
                      handleChange("recompensa", String(numValue));
                    }
                  }}
                  onBlur={(e) => {
                    // Ensure valid value on blur
                    let value = e.target.value;
                    if (value === "" || isNaN(parseInt(value, 10)) || parseInt(value, 10) < 0) {
                      handleChange("recompensa", "0");
                    } else if (parseInt(value, 10) > 1000) {
                      handleChange("recompensa", "1000");
                    }
                  }}
                  className={styles.inputRecompensa}
                  placeholder="0"
                />
                <span className={styles.valorRecompensa}>R$ {formData.recompensa}</span>
              </div>
            </div>

            <button
              type="submit"
              className={styles.btnCadastrar}
              disabled={loading}
              style={{ opacity: loading ? 0.7 : 1, cursor: loading ? "not-allowed" : "pointer" }}
            >
              {loading ? "Cadastrando..." : "Cadastrar"}
            </button>
          </form>
        </section>

      </div>
    </main>
  );
}
