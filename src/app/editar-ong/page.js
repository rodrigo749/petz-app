"use client"

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { FaPaw } from 'react-icons/fa'
import styles from './editar-ong.module.css'
import useSafeToast from '@/components/Toast/useSafeToast'
import { uploadImage } from '@/lib/apiPets'

const Field = ({ label, required, children, className = '' }) => (
  <div className={`${styles.inputWrapper} ${className}`}>
    <label className={styles.fieldLabel}>
      <div className={styles.inputInner}>
        <div className={styles.iconInside} aria-hidden>
          <img src="/images/patinha.png" alt="" className={styles.pawIcon} />
        </div>

  {/* label removed to avoid duplicating text with dynamic placeholder */}
        {children}
      </div>
    </label>
  </div>
)

export default function EditarOngPage() {
  const router = useRouter()
  const { showToast } = useSafeToast()
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState(null)
  const [imageFile, setImageFile] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    try {
      const u = JSON.parse(localStorage.getItem('usuarioLogado') || 'null')
      if (!u || u.tipo !== 'ong' || !u.id) {
        router.push('/login-ong')
        return
      }
      // preenche formulário com dados do localStorage inicialmente
      setData({ ...u })
    } catch (err) {
      setError('Erro ao carregar dados')
    } finally {
      setLoading(false)
    }
  }, [router])

  const handleImageUpload = (e) => {
    const file = e.target.files && e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onloadend = () => setData((p) => ({ ...p, imagem: reader.result }))
    reader.readAsDataURL(file)
    setImageFile(file)
  }

  const handleChange = (field, value) => setData((p) => ({ ...p, [field]: value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!data || !data.id) return setError('ID da ONG não encontrado')

    try {
      let imagemUrl = data.imagem || ''
      if (imageFile) {
        imagemUrl = await uploadImage(imageFile)
      }

      const payload = { ...data, imagem: imagemUrl, tipo: 'ong' }

      const res = await fetch(`/api/ongs/${data.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      const resp = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError(resp.message || 'Erro ao salvar alterações')
        showToast(resp.message || 'Erro ao salvar', 'error')
        return
      }

      localStorage.setItem('usuarioLogado', JSON.stringify(resp))
      showToast('Dados da ONG atualizados', 'success')
      router.push('/perfil-ong')
    } catch (err) {
      console.error(err)
      setError('Erro de rede')
    }
  }

  if (loading) return <div style={{ padding: 40, textAlign: 'center' }}>Carregando...</div>
  if (!data) return <div style={{ padding: 40, textAlign: 'center' }}>{error || 'Dados não disponíveis'}</div>

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <h1 className={styles.title}>Editar ONG</h1>
        {error && <div className={styles.error}>{error}</div>}

        <div className={styles.gridContainer}>
          <div className={styles.colEsquerda}>
            <Field label="Nome da ONG" required>
              <input
                className={styles.input}
                type="text"
                value={data.nome || ''}
                onChange={(e) => handleChange('nome', e.target.value)}
                placeholder={`Nome: ${data.nome || ''}`}
                required
              />
            </Field>

            <Field label="Email de contato" required>
              <input
                className={styles.input}
                type="email"
                value={data.email || ''}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder={`Email: ${data.email || ''}`}
                required
              />
            </Field>

            <div style={{ display: 'flex', gap: '16px' }}>
              <Field label="Telefone fixo" required className={styles.half}>
                <input
                  className={styles.input}
                  type="tel"
                  value={data.telefone || ''}
                  onChange={(e) => handleChange('telefone', e.target.value)}
                  placeholder={`Telefone: ${data.telefone || ''}`}
                  required
                />
              </Field>

              <Field label="Celular" required className={styles.half}>
                <input
                  className={styles.input}
                  type="tel"
                  value={data.celular || ''}
                  onChange={(e) => handleChange('celular', e.target.value)}
                  placeholder={`Celular: ${data.celular || ''}`}
                  required
                />
              </Field>
            </div>

            <Field label="Senha" required className={styles.half}>
              <input
                className={styles.input}
                type="password"
                value={data.senha || ''}
                onChange={(e) => handleChange('senha', e.target.value)}
                placeholder={`Senha: ${data.senha || ''}`}
                required
              />
            </Field>

            <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
              <Field label="CNPJ" required className={styles.half}>
                <input
                  className={styles.input}
                  type="text"
                  value={data.cnpj || ''}
                  onChange={(e) => handleChange('cnpj', e.target.value)}
                  placeholder={`CNPJ: ${data.cnpj || ''}`}
                  required
                />
              </Field>

              <div className={styles.half}>
                <div className={styles.uploadImagem}>
                  <label htmlFor="ong-imagem">
                    <div className={styles.uploadBox}>
                      {data.imagem ? (
                        <img src={data.imagem} alt="Preview" className={styles.uploadPreview} />
                      ) : (
                        <>
                          <img src="/images/iconephoto.png" className={styles.iconeAddImg} alt="Adicionar" />
                          <span className={styles.uploadText}>Adicionar imagem</span>
                        </>
                      )}
                    </div>
                  </label>
                  <input id="ong-imagem" type="file" accept="image/*" onChange={handleImageUpload} hidden />
                </div>
              </div>
            </div>
          </div>

          <div className={styles.colDireita}>
            <Field label="Rua" required>
              <input
                className={styles.input}
                type="text"
                value={data.rua || ''}
                onChange={(e) => handleChange('rua', e.target.value)}
                placeholder={`Rua: ${data.rua || ''}`}
                required
              />
            </Field>

            <Field label="Complemento">
              <input
                className={styles.input}
                type="text"
                value={data.complemento || ''}
                onChange={(e) => handleChange('complemento', e.target.value)}
                placeholder={`Complemento: ${data.complemento || ''}`}
              />
            </Field>

            <Field label="Cidade" required>
              <input
                className={styles.input}
                type="text"
                value={data.cidade || ''}
                onChange={(e) => handleChange('cidade', e.target.value)}
                placeholder={`Cidade: ${data.cidade || ''}`}
                required
              />
            </Field>

            <Field label="Estado" required>
              <input
                className={styles.input}
                type="text"
                value={data.estado || ''}
                onChange={(e) => handleChange('estado', e.target.value)}
                placeholder={`Estado: ${data.estado || ''}`}
                required
              />
            </Field>

            <div style={{ display: 'flex', gap: '16px' }}>
              <Field label="CEP" required className={styles.half}>
                <input
                  className={styles.input}
                  type="text"
                  value={data.cep || ''}
                  onChange={(e) => handleChange('cep', e.target.value)}
                  placeholder={`CEP: ${data.cep || ''}`}
                  required
                />
              </Field>

              <Field label="Número" required className={styles.half}>
                <input
                  className={styles.input}
                  type="text"
                  value={data.numero || ''}
                  onChange={(e) => handleChange('numero', e.target.value)}
                  placeholder={`Número: ${data.numero || ''}`}
                  required
                />
              </Field>
            </div>
          </div>

          <div className={styles.colBaixo}>
            <Field label="Horário de funcionamento (início)" required className={styles.half}>
              <input
                className={styles.input}
                type="time"
                value={data.HorarioFunc1 || ''}
                onChange={(e) => handleChange('HorarioFunc1', e.target.value)}
                required
              />
            </Field>

            <span className={styles.separador}>até</span>

            <Field label="Horário de funcionamento (fim)" required className={styles.half}>
              <input
                className={styles.input}
                type="time"
                value={data.HorarioFunc2 || ''}
                onChange={(e) => handleChange('HorarioFunc2', e.target.value)}
                required
              />
            </Field>
          </div>
        </div>

        <button className={styles.button} type="submit">Salvar alterações</button>
      </form>
    </div>
  )
}
