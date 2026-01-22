"use client";

import { useEffect, useState } from "react";
import styles from "./historicoapoio.module.css";

const apoiosMock = [
  { id: 1, nome: "Remy Oliveira", valor: 35.0, data: "01/11/2025" },
  { id: 2, nome: "Mônica Santos", valor: 20.0, data: "26/10/2025" },
  { id: 3, nome: "Jennifer", valor: 25.0, data: "01/11/2025" },
  { id: 4, nome: "Mateus de Paula", valor: 150.0, data: "25/10/2025" },
];

// ===== MOCK ONG (simula backend) =====
const ONG_MOCK = {
  id: 1,
  nome: "Desabandone Focinhos",
  descricao:
    "Nosso trabalho é atender quem mais precisa em Pouso Alegre e região. Quando ouvir falar em Desabandone Focinhos, saiba que em cada ação está impressa a compaixão e o cuidado com os animais abandonados.",
  cnpj: "25.313.327/0001-53",
  pix: {
    cnpj: "25.313.327/0001-53",
    descricao:
      "Nosso trabalho é atender quem mais precisa em Pouso Alegre e região. Quando ouvir falar em Desabandone Focinhos, saiba que em cada ação está impressa a compaixão e o cuidado com os animais abandonados.",
    qrImage: "/images/qrcode.png",
  },
};

export default function HistoricoDeApoioPage() {
  const [usuarioLogado, setUsuarioLogado] = useState(null);
  const [doacoes, setDoacoes] = useState([]);
  const [carregando, setCarregando] = useState(true);

  // ===== V1: modal cadastrar pix =====
  const [modalPixAberto, setModalPixAberto] = useState(false);

  useEffect(() => {
    
    setUsuarioLogado(ONG_MOCK);
  }, []);

  useEffect(() => {
    async function carregar() {
      if (!usuarioLogado?.id) {
        setDoacoes([]);
        setCarregando(false);
        return;
      }

      try {
        setCarregando(true);

        
        const res = await fetch(`/api/doacoes?ongId=${usuarioLogado.id}`);
        const data = await res.json();
        setDoacoes(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error("Erro ao carregar doações:", e);
        setDoacoes([]);
      } finally {
        setCarregando(false);
      }
    }

    carregar();
  }, [usuarioLogado]);

  // ===== V1/V2: pix vindo do usuário =====
  const pix = usuarioLogado?.pix ?? null;

  // dados do modal (vem do cadastro)
  const ongNome = usuarioLogado?.nome || usuarioLogado?.razaoSocial || "ONG";
  const ongDescricao = usuarioLogado?.descricao || "";
  const ongCnpj = usuarioLogado?.cnpj || "";

 
  const doacoesDaTela = pix ? apoiosMock : [];

  // ===== handlers =====
  const handleCadastrarPix = () => setModalPixAberto(true);
  const handleFecharModal = () => setModalPixAberto(false);

  const handleAdicionarPix = async () => {
    alert(`Pix cadastrado com CNPJ: ${ongCnpj} (próximo passo: salvar no backend)`);
    setModalPixAberto(false);
  };

  const handleEditarPix = () => alert("Editar Pix (próximo passo).");
  const handleExcluirPix = () => alert("Excluir Pix (próximo passo).");

  const handleCopiarCnpj = async () => {
    try {
      const texto = String(pix?.cnpj || ongCnpj || "");
      if (!texto) return;
      await navigator.clipboard.writeText(texto);
      alert("CNPJ copiado!");
    } catch (e) {
      console.error("Falha ao copiar:", e);
      alert("Não consegui copiar automaticamente. Copie manualmente.");
    }
  };

  return (
    <main className={styles.page}>
      {/* ===================== TOP BAR V1 ===================== */}
      {!pix && (
        <section className={styles.topBar}>
          <div className={styles.patinhasLeft}>
            <img src="/images/patinhahistorico.png" alt="" className={styles.patinha} />
            <img src="/images/patinhahistorico02.png" alt="" className={styles.patinha2} />
          </div>

          <button className={styles.btnCadastrarPix} onClick={handleCadastrarPix}>
            Cadastrar Pix para Apoio
          </button>

          <div className={styles.patinhasRight}>
            <img src="/images/patinhahistorico02.png" alt="" className={styles.patinha2} />
            <img src="/images/patinhahistorico.png" alt="" className={styles.patinha} />
          </div>
        </section>
      )}

      {/* ===================== TOP BAR V2 ===================== */}
      {pix && (
        <section className={styles.topBarV2}>
          <div className={styles.topBarV2Left}>
            <img
              src={pix.qrImage || "/images/qrcode.png"}
              alt="QR Code Pix"
              className={styles.topBarV2Qr}
            />
          </div>

          <div className={styles.topBarV2Middle}>
            <div className={styles.topBarV2InfoRow}>
              <div className={styles.topBarV2DescricaoBox}>
                <span className={styles.topBarV2DescricaoLabel}>Descrição:</span>
                <span className={styles.topBarV2DescricaoTexto}>
                  {pix.descricao || ongDescricao}
                </span>
              </div>

              <div className={styles.topBarV2CnpjBox}>
                <span className={styles.topBarV2Cnpj}>{pix.cnpj || ongCnpj}</span>
                <button
                  className={styles.topBarV2BtnCopiar}
                  onClick={handleCopiarCnpj}
                  aria-label="Copiar CNPJ"
                  title="Copiar"
                >
                  <img
                    src="/images/copiarpix.png"
                    alt="Copiar CNPJ"
                    className={styles.topBarV2IconCopiar}
                  />
                </button>
              </div>
            </div>
          </div>

          <div className={styles.topBarV2Right}>
            <button className={styles.btnExcluir} onClick={handleExcluirPix}>
              Excluir
            </button>
            <button className={styles.btnEditar} onClick={handleEditarPix}>
              Editar
            </button>
          </div>
        </section>
      )}

      {/* ===================== MODAL (V1) ===================== */}
      {modalPixAberto && (
        <div className={styles.overlay} onClick={handleFecharModal}>
          <div
            className={styles.modalPix}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <button className={styles.btnFechar} onClick={handleFecharModal} aria-label="Fechar">
              ✕
            </button>

            <h2 className={styles.modalTitulo}>{ongNome}</h2>

            <p className={styles.modalDescricao}>
              <strong>Descrição:</strong> {ongDescricao}
            </p>

            <div className={styles.cnpjBox}>
              <span className={styles.modalCnpjLabel}>CNPJ:</span>
              <input value={ongCnpj} readOnly />
            </div>

            <button className={styles.btnAdicionar} onClick={handleAdicionarPix}>
              Adicionar
            </button>
          </div>
        </div>
      )}

      {/* ===================== CONTAINER ===================== */}
      <section className={styles.container}>
        <div className={styles.headerContainer}>
          <h1 className={styles.titulo}>Histórico de Apoio</h1>
        </div>

        {/* HISTÓRICO */}
        {carregando ? (
          <p className={styles.loading}>Carregando...</p>
        ) : doacoesDaTela.length === 0 ? (
          <div className={styles.emptyState}>Você não tem nenhum histórico de apoio</div>
        ) : (
          <div className={styles.apoiosGrid}>
            {doacoesDaTela.map((d) => (
              <article key={d.id} className={styles.apoioCard}>
                <p className={styles.apoioLinha}>
                  <span className={styles.apoioLabel}>Nome:</span>
                  <span className={styles.apoioValorTexto}>{d.nome}</span>
                </p>

                <p className={styles.apoioLinha}>
                  <span className={styles.apoioLabel}>Valor:</span>
                  <span className={styles.apoioValorTexto}>
                    {Number(d.valor).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </span>
                </p>

                <p className={styles.apoioLinha}>
                  <span className={styles.apoioLabel}>Data:</span>
                  <span className={styles.apoioValorTexto}>{d.data}</span>
                </p>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
