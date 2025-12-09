'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { FaPaw } from 'react-icons/fa'
import styles from './cadastro-ong.module.css'

// 1. ARRAY DE ESTADOS BRASILEIROS (UFs)
const estadosBrasileiros = [
    { nome: 'Acre', uf: 'AC' }, { nome: 'Alagoas', uf: 'AL' }, { nome: 'Amapá', uf: 'AP' },
    { nome: 'Amazonas', uf: 'AM' }, { nome: 'Bahia', uf: 'BA' }, { nome: 'Ceará', uf: 'CE' },
    { nome: 'Distrito Federal', uf: 'DF' }, { nome: 'Espírito Santo', uf: 'ES' },
    { nome: 'Goiás', uf: 'GO' }, { nome: 'Maranhão', uf: 'MA' }, { nome: 'Mato Grosso', uf: 'MT' },
    { nome: 'Mato Grosso do Sul', uf: 'MS' }, { nome: 'Minas Gerais', uf: 'MG' },
    { nome: 'Pará', uf: 'PA' }, { nome: 'Paraíba', uf: 'PB' }, { nome: 'Paraná', uf: 'PR' },
    { nome: 'Pernambuco', uf: 'PE' }, { nome: 'Piauí', uf: 'PI' }, { nome: 'Rio de Janeiro', uf: 'RJ' },
    { nome: 'Rio Grande do Norte', uf: 'RN' }, { nome: 'Rio Grande do Sul', uf: 'RS' },
    { nome: 'Rondônia', uf: 'RO' }, { nome: 'Roraima', uf: 'RR' }, { nome: 'Santa Catarina', uf: 'SC' },
    { nome: 'São Paulo', uf: 'SP' }, { nome: 'Sergipe', uf: 'SE' }, { nome: 'Tocantins', uf: 'TO' }
];


// COMPONENTE FIELD (Visual inalterado)
const Field = ({ label, required, children, className = '', error = '', feedback = null }) => (
    <div className={`${styles.inputWrapper} ${className}`}>
        <label className={styles.fieldLabel}>
            <span className={styles.labelText}>{label}{required ? '*' : ''}</span>

            <div className={styles.inputInner}>
                <div className={styles.iconInside} aria-hidden>
                    <FaPaw />
                </div>
                {children}
            </div>
        </label>
        {/* Exibe o erro de validação do formulário (submit) */}
        {error && <span style={{ color: 'red', fontSize: '0.8rem', marginTop: '5px' }}>{error}</span>}
        {/* Exibe o feedback em tempo real (agora, só a mensagem de erro) */}
        {feedback}
    </div>
)

export default function CadastroOngPage() {
    const router = useRouter()
    
    // VARIÁVEIS DE ESTADO
    const [nome, setNome] = useState('')
    const [email, setEmail] = useState('')
    const [telefoneFixo, setTelefoneFixo] = useState('')
    const [celular, setCelular] = useState('')
    const [senha, setSenha] = useState('')
    const [cnpj, setCnpj] = useState('')
    const [cep, setCep] = useState('')
    const [rua, setRua] = useState('')
    const [numero, setNumero] = useState('')
    const [complemento, setComplemento] = useState('')
    const [cidade, setCidade] = useState('')
    const [estado, setEstado] = useState('') // Estado deve ser a sigla (ex: 'MG', 'SP')
    const [HorarioFunc1, setHorarioFunc1] = useState('')
    const [HorarioFunc2, setHorarioFunc2] = useState('')
    const [error, setError] = useState({})

    // Estado para rastrear a validade da senha em tempo real
    const [isSenhaValid, setIsSenhaValid] = useState(false);

    // --- FUNÇÕES DE FORMATAÇÃO VISUAL ---
    
    const formatPhone = (value) => {
        const v = value.replace(/\D/g, '');
        if (v.length > 10) {
            return v.replace(/^(\d\d)(\d)(\d{4})(\d{4}).*/, '($1) $2 $3-$4'); 
        } else if (v.length > 6) {
            return v.replace(/^(\d\d)(\d{4})(\d{0,4}).*/, '($1) $2-$3'); 
        } else if (v.length > 2) {
            return v.replace(/^(\d\d)(\d{0,5}).*/, '($1) $2'); 
        }
        return v;
    }

    const formatCnpj = (value) => {
        const v = value.replace(/\D/g, '');
        return v
            .replace(/^(\d{2})(\d)/, '$1.$2')
            .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
            .replace(/\.(\d{3})(\d)/, '.$1/$2')
            .replace(/(\d{4})(\d)/, '$1-$2')
            .slice(0, 18);
    }

    const formatCep = (value) => {
        const v = value.replace(/\D/g, '');
        return v.replace(/^(\d{5})(\d)/, '$1-$2').slice(0, 9);
    }

    // --- FUNÇÃO DE CONTROLE DE INPUT NUMÉRICO ---
    const handleNumericChange = (setter, limit) => (e) => {
        const value = e.target.value.replace(/\D/g, '');
        if (value.length <= limit) {
            setter(value);
        }
    };
    
    // --- HANDLER PARA SENHA ---
    const handleSenhaChange = (e) => {
        const value = e.target.value;
        const minLength = 8;
        
        // 1. Atualiza o estado da senha
        setSenha(value); 
        
        // 2. Atualiza o estado de validade
        setIsSenhaValid(value.length >= minLength);
    };


    // FUNÇÃO DE VALIDAÇÃO MANUAL COMPLETA 
    const validateForm = () => {
        let isValid = true;
        let newErrors = {};

        // 1. NOME
        if (!nome || nome.length < 10 || nome.length > 100) {
            newErrors.nome = 'Preencha esse campo (10 a 100 caracteres).'; isValid = false;
        }
        // 2. EMAIL
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRegex.test(email)) {
            newErrors.email = 'Email inválido.'; isValid = false;
        }
        // 3. SENHA (MANTIDA A VALIDAÇÃO EXISTENTE: 8 a 20 caracteres)
        if (!senha || senha.length < 8 || senha.length > 20) {
            newErrors.senha = 'A senha deve ter entre 8 e 20 caracteres.'; isValid = false;
        }
        // 4. CELULAR (Valida os 10 ou 11 dígitos limpos)
        // O valor do estado é a string sem máscara
        if (!celular || celular.length < 10 || celular.length > 11) {
            newErrors.celular = 'Celular inválido (10 ou 11 dígitos).'; isValid = false;
        }
        // 5. FIXO (Valida os 10 ou 11 dígitos limpos)
        // O valor do estado é a string sem máscara
        if (!telefoneFixo || telefoneFixo.length < 10 || telefoneFixo.length > 11) {
            newErrors.telefoneFixo = 'Telefone fixo inválido (10 ou 11 dígitos).'; isValid = false;
        }
        // 6. CNPJ (Valida os 14 dígitos limpos)
        // O valor do estado é a string sem máscara
        if (!cnpj || cnpj.length !== 14) {
            newErrors.cnpj = 'CNPJ inválido (14 dígitos).'; isValid = false;
        }
        // 7. RUA
        if (!rua || rua.length < 5) {
            newErrors.rua = 'Rua obrigatória.'; isValid = false;
        }
        // 8. NUMERO
        if (!numero || numero.length > 10 || numero.length === 0) {
            newErrors.numero = 'Número obrigatório.'; isValid = false;
        }
        // 9. CIDADE
        if (!cidade || cidade.length < 3) {
            newErrors.cidade = 'Cidade obrigatória.'; isValid = false;
        }
        // 10. ESTADO ⬅️ VALIDAÇÃO SIMPLIFICADA
        if (!estado || estado.length !== 2) {
            newErrors.estado = 'Estado (UF) obrigatório.'; isValid = false;
        }
        // 11. CEP (Valida os 8 dígitos limpos)
        // O valor do estado é a string sem máscara
        if (!cep || cep.length !== 8) {
            newErrors.cep = 'CEP inválido (8 dígitos).'; isValid = false;
        }
        // 12. COMPLEMENTO
        if (complemento.length > 50) {
            newErrors.complemento = 'Máximo 50 caracteres.'; isValid = false;
        }
        // 13. HORARIOS
        if (!HorarioFunc1) { newErrors.HorarioFunc1 = 'Obrigatório.'; isValid = false; }
        if (!HorarioFunc2) { newErrors.HorarioFunc2 = 'Obrigatório.'; isValid = false; }

        setError(newErrors);
        return isValid;
    };

    const handleSubmit = (e) => {
        e.preventDefault()
        if (validateForm()) {
            const formData = {
                nome, email, telefoneFixo, celular, senha, cnpj, 
                cep, rua, numero, complemento, cidade, estado, 
                HorarioFunc1, HorarioFunc2
            };
            // Simulação de salvar dados
            console.log("Dados Válidos:", formData);
            router.push('/login-ong')
        }
    }
    
    // --- COMPONENTE DE FEEDBACK DA SENHA SIMPLIFICADO ---
    const PasswordFeedback = () => {
        // Se a senha estiver vazia ou for válida (>= 8 caracteres), não retorna nada (a mensagem some).
        if (senha.length === 0 || isSenhaValid) return null; 
        
        // Se a senha estiver preenchida e for inválida (< 8 caracteres), mostra o erro.
        const style = { 
            fontSize: '0.8rem', 
            marginTop: '5px', 
            color: 'red' // A cor é sempre vermelha (erro) quando a mensagem aparece
        };
        
        return (
            <span style={style}>
                ❌ A senha deve ter no mínimo 8 caracteres.
            </span>
        );
    };


return (
    <div className={styles.container}>
        <form className={styles.form} onSubmit={handleSubmit} noValidate>
            <h1 className={styles.title}>Cadastro de ONG</h1>

            <div className={styles.gridContainer}>

                {/* ---- ESQUERDA ---- */}
                <div className={styles.colEsquerda}>
                    <Field label="Nome da ONG" required error={error.nome}>
                        <input
                            className={styles.input}
                            type="text"
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                            placeholder="Nome da organização"
                            required
                        />
                    </Field>

                    <Field label="Email de contato" required error={error.email}>
                        <input
                            className={styles.input}
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="contato@ong.com"
                            required
                        />
                    </Field>
                    <div style={{display: 'flex', gap: '16px'}}>
                        
                        {/* CAMPO TELEFONE FIXO COM MÁSCARA */}
                        <Field label="Telefone fixo" required className={styles.half} error={error.telefoneFixo}> 
                            <input
                                className={styles.input}
                                type="tel"
                                value={formatPhone(telefoneFixo)}
                                onChange={handleNumericChange(setTelefoneFixo, 10)}
                                placeholder="(31) 0000-0000"
                                required
                                maxLength={14}
                            />
                        </Field>
                    
                        {/* CAMPO CELULAR COM MÁSCARA */}
                        <Field label="Celular" required className={styles.half} error={error.celular}>
                            <input
                                className={styles.input}
                                type="tel"
                                value={formatPhone(celular)}
                                onChange={handleNumericChange(setCelular, 11)}
                                placeholder="(31) 9 0000-0000"
                                required
                                maxLength={16}
                            />
                        </Field>
                    </div>
                    
                    {/* CAMPO SENHA COM FEEDBACK SIMPLIFICADO */}
                    <Field 
                        label="Senha" 
                        required 
                        className={styles.half} 
                        error={error.senha}
                        feedback={<PasswordFeedback />} // ⬅️ Feedback simplificado
                    >
                        <input
                            className={styles.input}
                            type="password"
                            value={senha}
                            onChange={handleSenhaChange} // Handler com verificação de validade
                            placeholder="Insira sua senha (min 8 caracteres)"
                            required
                            maxLength={20}
                            minLength={8}
                        />
                    </Field>

                    {/* CAMPO CNPJ COM MÁSCARA */}
                    <Field label="CNPJ" required className={styles.half} error={error.cnpj}>
                        <input
                            className={styles.input}
                            type="text"
                            value={formatCnpj(cnpj)}
                            onChange={handleNumericChange(setCnpj, 14)}
                            placeholder="00.000.000/0000-00"
                            required
                            maxLength={18}
                        />
                    </Field>
                </div>

                {/* ---- DIREITA ---- */}
                <div className={styles.colDireita}>
                    
                    <Field label="Rua" required error={error.rua}>
                        <input
                            className={styles.input}
                            type="text"
                            value={rua}
                            onChange={(e) => setRua(e.target.value)}
                            placeholder="Nome da rua"
                            required
                        />
                    </Field>

                    <Field label="Complemento" error={error.complemento}>
                        <input
                            className={styles.input}
                            type="text"
                            value={complemento}
                            onChange={(e) => setComplemento(e.target.value)}
                            placeholder="Apto / sala / complemento"
                        />
                    </Field>


                    <Field label="Cidade" required error={error.cidade}>
                        <input
                            className={styles.input}
                            type="text"
                            value={cidade}
                            onChange={(e) => setCidade(e.target.value)}
                            placeholder="Cidade"
                            required
                        />
                    </Field>

                    {/* 3. CAMPO ESTADO AGORA É UM SELECT */}
                    <Field label="Estado" required error={error.estado}>
                        <select
                            className={styles.input}
                            value={estado}
                            onChange={(e) => setEstado(e.target.value)}
                            required
                        >
                            <option value="" disabled>Selecione a UF</option>
                            {estadosBrasileiros.map((uf) => (
                                <option key={uf.uf} value={uf.uf}>
                                    {uf.uf} - {uf.nome}
                                </option>
                            ))}
                        </select>
                    </Field>
                    <div style={{display: 'flex', gap: '16px'}}> 
                        
                        {/* CAMPO CEP COM MÁSCARA */}
                        <Field label="CEP" required className={styles.half} error={error.cep}>
                            <input
                                className={styles.input}
                                type="text"
                                value={formatCep(cep)}
                                onChange={handleNumericChange(setCep, 8)}
                                placeholder="00000-000"
                                required
                                maxLength={9}
                            />
                        </Field>

                        <Field label="Número" required className={styles.half} error={error.numero}>
                            <input
                                className={styles.input}
                                type="text"
                                value={numero}
                                onChange={handleNumericChange(setNumero, 10)}
                                placeholder="Número"
                                required
                            />
                        </Field>
                    </div>
                </div>

                {/* ---- BAIXO ---- */}
                <div className={styles.colBaixo}>
                    <Field label="Horário de funcionamento (início)" required className={styles.half} error={error.HorarioFunc1}>
                        <input
                            className={styles.input}
                            type="time"
                            value={HorarioFunc1}
                            onChange={(e) => setHorarioFunc1(e.target.value)}
                            required
                        />
                    </Field>

                    <span className={styles.separador}>até</span>

                    <Field label="Horário de funcionamento (fim)" required className={styles.half} error={error.HorarioFunc2}>
                        <input
                            className={styles.input}
                            type="time"
                            value={HorarioFunc2}
                            onChange={(e) => setHorarioFunc2(e.target.value)}
                            required
                        />
                    </Field>
                </div>

            </div>

            <button className={styles.button} type="submit">
                Cadastrar ONG
            </button>

            <div className={styles.note}>
                Campos com * são obrigatórios.
            </div>
            <div className={styles.bottomLink}>
                Já tem conta? <a href="/login-ong">Faça login aqui</a>.
            </div>
        </form>
    </div>
)
}