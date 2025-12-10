import { promises as fs } from 'fs'
import path from 'path'

export async function POST(req) {
  try {
    const data = await req.json()
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