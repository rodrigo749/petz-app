"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import styles from "../editarpetperdidos.module.css";
import { convertBlobToImageUrl, revokeImageUrl } from '@/lib/blobUtils';

const getBaseUrl = () =>
  (process.env.NEXT_PUBLIC_PETZ_API_URL || "http://localhost:3000")
    .trim()
    .replace(/\/$/, "");

export default function EditarPetPerdidosId() {
  const router = useRouter();
  const { id } = useParams();

  // Nota: acesso público permitido — não exige login para editar (controle de permissão removido)

  const [formData, setFormData] = useState({
    nome: "",
    raca: "",
    genero: "",
    local: "",
    data: "",
    descricao: "",
    recompensa: 0,
    image: "",
  });

  const [imagemFile, setImagemFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  useEffect(() => {
    async function carregarPet() {
      if (!id) return;
      try {
        const res = await fetch(`${getBaseUrl()}/api/pets/${id}`, {
          cache: "no-store",
        });
        if (!res.ok) {
          console.error("Erro ao buscar pet perdido:", res.status);
          setCarregando(false);
          return;
        }
        const pet = await res.json();
  // Permitir edição por qualquer visitante; não há bloqueio client-side de dono

        const petImage = pet.imagem || pet.image || "";
        setFormData({
          nome: pet.nome || pet.name || "",
          raca: pet.raca || pet.breed || "",
          genero: pet.genero || pet.gender || "",
          local: pet.local || pet.location || "",
          data: pet.data || pet.dateLost || "",
          descricao: pet.descricao || pet.description || "",
          recompensa: pet.recompensa || pet.reward || 0,
          image: petImage,
        });
        setPreview(convertBlobToImageUrl(petImage, 'image/jpeg') || petImage || null);
      } catch (err) {
        console.error("Erro ao carregar pet:", err);
      } finally {
        setCarregando(false);
      }
    }

    carregarPet();
  }, [id]);

  const handleFocus = (e) => {
    e.target.dataset.placeholder = e.target.placeholder;
    e.target.placeholder = "";
  };

  const handleBlur = (e) => {
    e.target.placeholder = e.target.dataset.placeholder;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImagem = (e) => {
    const arquivo = e.target.files?.[0] || null;
    setImagemFile(arquivo);
    if (arquivo) {
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result);
      reader.readAsDataURL(arquivo);
    } else {
      setPreview(null);
    }
  };

  const uploadImage = async (file) => {
    // Validações
    if (!file) throw new Error("Nenhum arquivo fornecido");
    if (!file.type?.startsWith("image/")) throw new Error("Arquivo não é imagem");
    if (file.size > 5 * 1024 * 1024) throw new Error("Imagem maior que 5MB");

    const baseUrl = getBaseUrl();
    const fd = new FormData();
    fd.append('file', file);

    try {
      const res = await fetch(`${baseUrl}/api/upload`, {
        method: "POST",
        body: fd
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Erro no upload");
      }

      // ✅ Agora retorna objeto com blob e mimeType
      if (data.blob && data.mimeType) {
        return {
          blob: data.blob,        // String base64 da imagem
          mimeType: data.mimeType // Tipo MIME (ex: "image/jpeg")
        };
      }

      throw new Error("Resposta do servidor sem blob");
    } catch (error) {
      throw new Error(`Falha no upload: ${error.message}`);
    }
  };

  const salvarEdicao = async (e) => {
    e?.preventDefault?.();
    if (!id) {
      setStatusMessage("ID não disponível");
      return;
    }

    try {
      setLoading(true);

      let imageBlob = null;
      if (imagemFile) {
        const uploadedImage = await uploadImage(imagemFile);
        imageBlob = uploadedImage.blob;
      }

      const payload = {
        name: formData.nome,
        breed: formData.raca,
        gender: formData.genero,
        location: formData.local,
        dateLost: formData.data,
        description: formData.descricao,
        reward: Number(formData.recompensa) || 0,
        image: imageBlob || formData.image || null,
      };

      const logged = JSON.parse(localStorage.getItem('usuarioLogado') || 'null');
      const headers = { "Content-Type": "application/json" };
      if (logged && logged.id) headers['x-usuario-id'] = String(logged.id);
      const token = localStorage.getItem("token") || "";
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch(`${getBaseUrl()}/api/pets/${id}`, {
        method: "PUT",
        headers,
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Falha ao salvar");

      setStatusMessage("Pet atualizado com sucesso!");
      setTimeout(() => setStatusMessage(""), 1800);
      // redireciona para a listagem pública de perdidos
      router.push("/perdidos");
    } catch (err) {
      console.error(err);
      setStatusMessage(err.message || "Erro ao salvar");
      setTimeout(() => setStatusMessage(""), 2200);
    } finally {
      setLoading(false);
    }
  };

  const excluirPet = async () => {
    if (!id) return setStatusMessage("ID não disponível");
    if (!confirm("Tem certeza que deseja excluir este pet?")) return;

    try {
      setLoading(true);
  const logged = JSON.parse(localStorage.getItem('usuarioLogado') || 'null');
  const delHeaders = {};
  if (logged && logged.id) delHeaders['x-usuario-id'] = String(logged.id);
  const token = localStorage.getItem("token") || "";
  if (token) delHeaders['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${getBaseUrl()}/api/pets/${id}`, { method: "DELETE", headers: delHeaders });
      if (!res.ok) throw new Error("Falha ao remover");
      setStatusMessage("Pet excluído com sucesso!");
      setTimeout(() => router.push("/perdidos"), 1000);
    } catch (err) {
      console.error(err);
      setStatusMessage(err.message || "Erro ao excluir");
      setTimeout(() => setStatusMessage(""), 2000);
    } finally {
      setLoading(false);
    }
  };

  if (carregando) return <p style={{ color: '#fff', textAlign: 'center' }}>Carregando pet...</p>;

  return (
    <main className={styles.cadastroPetContainer}>
      <div className={styles.cadastroWrapper}>

        <section className={styles.colEsquerda}>
          <div className={styles.uploadImagem}>
            <label htmlFor="pet-imagem">
              <div className={styles.uploadBox}>
                {preview ? (
                  <img src={preview} alt="preview" className={styles.uploadPreview} />
                ) : (
                  <>
                    <img src="/images/iconephoto.png" className={styles.iconeAddImg} />
                    <span className={styles.uploadText}>Adicionar imagem</span>
                  </>
                )}
              </div>
            </label>
            <input type="file" id="pet-imagem" hidden accept="image/*" onChange={handleImagem} />
          </div>

          <div className={styles.descricaoBox}>
            <label className={styles.descLabel}>
              <img src="/images/patinha.png" className={styles.descIcon} />
              Descrição:
            </label>
            <textarea
              name="descricao"
              className={styles.descricaoTextarea}
              placeholder="Descreva o pet aqui..."
              rows="8"
              value={formData.descricao}
              onFocus={handleFocus}
              onBlur={handleBlur}
              onChange={handleChange}
            ></textarea>
          </div>
        </section>

        <section className={styles.colDireita}>
          <div className={styles.tituloArea}>
            <h2 className={styles.tituloCadastro}>Editar Pet Perdido</h2>
          </div>

          <form className={styles.formCadastro} onSubmit={salvarEdicao}>
            <div className={styles.campo}>
              <img src="/images/patinha.png" className={styles.iconeInput} />
              <input
                type="text"
                name="nome"
                placeholder="Nome"
                value={formData.nome}
                onFocus={handleFocus}
                onBlur={handleBlur}
                onChange={handleChange}
              />
            </div>

            <div className={styles.campo}>
              <img src="/images/patinha.png" className={styles.iconeInput} />
              <input
                type="text"
                name="raca"
                placeholder="Raça"
                value={formData.raca}
                onFocus={handleFocus}
                onBlur={handleBlur}
                onChange={handleChange}
              />
            </div>

            <div className={styles.campo}>
              <img src="/images/patinha.png" className={styles.iconeInput} />
              <input
                type="text"
                name="genero"
                placeholder="Gênero"
                value={formData.genero}
                onFocus={handleFocus}
                onBlur={handleBlur}
                onChange={handleChange}
              />
            </div>

            <div className={styles.campo}>
              <img src="/images/patinha.png" className={styles.iconeInput} />
              <input
                type="text"
                name="local"
                placeholder="Local"
                value={formData.local}
                onFocus={handleFocus}
                onBlur={handleBlur}
                onChange={handleChange}
              />
            </div>

            <div className={styles.campo}>
              <img src="/images/patinha.png" className={styles.iconeInput} />
              <input
                type="date"
                name="data"
                placeholder="Data"
                value={formData.data}
                onFocus={handleFocus}
                onBlur={handleBlur}
                onChange={handleChange}
              />
            </div>

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
                    name="recompensa"
                    value={formData.recompensa}
                    onChange={(e) => setFormData((p) => ({ ...p, recompensa: Number(e.target.value) }))}
                    className={styles.slider}
                  />
                  <span className={styles.valorRecompensa}>R$ {formData.recompensa}</span>
                </div>
              </div>
            </div>

            {statusMessage && (
              <div style={{ textAlign: 'center', color: '#285a78', fontWeight: 700, marginTop: 8 }}>{statusMessage}</div>
            )}

            <div className={styles.actionsRow}>
              <button type="submit" className={styles.btnEditar} disabled={loading}>{loading ? 'Salvando...' : 'Salvar'}</button>
              <button type="button" className={styles.btnExcluir} onClick={excluirPet} disabled={loading}>{loading ? '...' : 'Excluir'}</button>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}
