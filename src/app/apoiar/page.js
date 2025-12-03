"use client";

import styles from './apoiar.module.css';

const ongs = [
  { id: 1, nome: 'Desabandone Focinhos', descricao: 'Nosso trabalho é atender quem mais precisa em Pouso Alegre e região. Em cada ação está impressa a compaixão e o cuidado com os animais abandonados.', imagem: '/images/icone-baiacu.jpg' },
  { id: 2, nome: 'Cão Sem Dono', descricao: 'O Cão Sem Dono é uma ONG que nasceu do sonho de tirar o maior número possível de animais das ruas e oferecer tratamento e adoção.', imagem: '/images/icone-baiacu.jpg' },
  { id: 3, nome: 'Toca Segura', descricao: 'Temos como missão oferecer um ambiente acolhedor para os pets abandonados: eles ganham um lar e um companheiro.', imagem: '/images/icone-baiacu.jpg' },
  { id: 4, nome: 'Projeto Mi&Au', descricao: 'ONG que atende os pets da região e ajuda encontrar pets perdidos e conectar pessoas que adotam.', imagem: '/images/icone-baiacu.jpg' },
  { id: 5, nome: 'Amigos de Patas', descricao: 'Voluntários que resgatam cães e gatos feridos e buscam lares temporários.', imagem: '/images/icone-baiacu.jpg' },
  { id: 6, nome: 'Lar dos Bichos', descricao: 'Abrigo que oferece cuidados veterinários e abrigo para animais de rua.', imagem: '/images/icone-baiacu.jpg' },
  { id: 7, nome: 'Protetores Unidos', descricao: 'Rede de protetores que trabalham com castração e reabilitação.', imagem: '/images/icone-baiacu.jpg' },
  { id: 8, nome: 'Patinhas Solidárias', descricao: 'Projeto comunitário para alimentar e cuidar de animais vulneráveis.', imagem: '/images/icone-baiacu.jpg' },
  { id: 9, nome: 'Coração Animal', descricao: 'ONG focada em adoção responsável e campanhas de saúde.', imagem: '/images/icone-baiacu.jpg' },
  { id: 10, nome: 'Refúgio Feliz', descricao: 'Casa de passagem que acolhe animais até encontrarem novo lar.', imagem: '/images/icone-baiacu.jpg' },
  { id: 11, nome: 'SOS Peludos', descricao: 'Atuação em resgates e ações de conscientização sobre abandono.', imagem: '/images/icone-baiacu.jpg' },
  { id: 12, nome: 'Brigada Animal', descricao: 'Equipe de voluntários para resgate em áreas urbanas e rurais.', imagem: '/images/icone-baiacu.jpg' },
  { id: 13, nome: 'Mãos que Ajudam', descricao: 'Rede de apoio para transporte e cuidados emergenciais.', imagem: '/images/icone-baiacu.jpg' },
  { id: 14, nome: 'Adoção Já', descricao: 'Plataforma local que conecta adotantes e ONGs.', imagem: '/images/icone-baiacu.jpg' },
  { id: 15, nome: 'Cuidar e Amar', descricao: 'Projeto educacional sobre bem-estar animal em escolas.', imagem: '/images/icone-baiacu.jpg' },
  { id: 16, nome: 'Ampara Bichos', descricao: 'Campanhas de arrecadação e apoio a abrigos pequenos.', imagem: '/images/icone-baiacu.jpg' }
];

export default function ApoiarPage() {
  const handleApoiar = (ong) => {
    alert('Obrigado por apoiar: ' + ong.nome);
  }

  return (
    <main className={styles['apoiar-page']}>
      <div className={styles['cards-wrapper-container']}>
        <h1 className={styles.titulo}>Apoiar</h1>


        <section className={styles['grid-ongs']}>
          {ongs.map(ong => (
            <div className={styles['card-ong']} key={ong.id}>
                <div className={styles['card-title']}><h3>{ong.nome}</h3></div>
                <div><button className={styles['apoiar-btn']} onClick={() => handleApoiar(ong)}>Apoiar</button>
                </div>
        
              <div className={styles['card-image-wrapper']}>
                <img src={ong.imagem} className={styles['card-image']} alt={ong.nome} />
              </div>
              <div className={styles['card-text-box']}>
                  <p><strong><span className={styles.descricao}>Descrição:</span></strong> {ong.descricao}</p>


              </div>

            </div>
          ))}
        </section>
      </div>
    </main>
  );
}
