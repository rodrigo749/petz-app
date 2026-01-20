import { promises as fs } from 'fs'
import path from 'path'

export async function POST(req) {
  try {
    const data = await req.json()
    // If PETZ_API_URL is set, forward the request to the external API.
    // Falls back to local file storage if the external call fails or is not set.
    const PETZ_API_URL = process.env.PETZ_API_URL || ''
    if (PETZ_API_URL) {
      try {
        // map local fields to petz-api expected payload
        const payload = {
          nome: data.nome,
          email: data.email,
          senha: data.senha,
          telefone: data.telefone,
          celular: data.celular,
          cnpj: data.cnpj,
          cep: data.cep,
          rua: data.rua,
          numero: data.numero,
          complemento: data.complemento,
          cidade: data.cidade,
          estado: data.estado,
          HorarioFunc1: data.HorarioFunc1,
          HorarioFunc2: data.HorarioFunc2,
          imagem: data.imagem,
        }

        const headers = { 'Content-Type': 'application/json' }
        // Prefer forwarding incoming Authorization header from the client
        const incomingAuth = req.headers.get('authorization') || ''
        if (incomingAuth) {
          headers['Authorization'] = incomingAuth
        } else if (process.env.PETZ_API_TOKEN) {
          // optional token header if provided via env
          headers['Authorization'] = `Bearer ${process.env.PETZ_API_TOKEN}`
        }

  const external = await fetch(`${PETZ_API_URL.replace(/\/$/, '')}/api/ongs`, {
          method: 'POST',
          headers,
          body: JSON.stringify(payload)
        })

        const externalText = await external.text().catch(() => '')
        let externalJson = {}
        try { externalJson = externalText ? JSON.parse(externalText) : {} } catch (e) { externalJson = { message: externalText } }

        if (external.ok) {
          // Forward external success response
          return new Response(JSON.stringify(externalJson), { status: external.status })
        }

        // External returned error status: log and fall back to local storage
        console.error('PETZ API returned error', { status: external.status, body: externalJson })
        // continue to local fallback
      } catch (err) {
        // log and continue to local fallback
        console.error('Erro ao enviar para PETZ API:', String(err))
      }
    }
    const filePath = path.join(process.cwd(), 'src', 'data', 'ongs.json')
    const raw = await fs.readFile(filePath, 'utf8').catch(() => '[]')
    const ongs = JSON.parse(raw || '[]')

    // valida duplicados por CNPJ ou email
    const exists = ongs.some(o => o.cnpj === data.cnpj || o.email === data.email)
    if (exists) {
      return new Response(JSON.stringify({ message: 'ONG já existe' }), { status: 409 })
    }

    const newOng = { id: Date.now(), ...data }
    ongs.push(newOng)
    await fs.writeFile(filePath, JSON.stringify(ongs, null, 2), 'utf8')

    return new Response(JSON.stringify(newOng), { status: 201 })
  } catch (err) {
    return new Response(JSON.stringify({ message: 'Erro interno', error: String(err) }), { status: 500 })
  }
}