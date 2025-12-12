import { promises as fs } from 'fs'
import path from 'path'

export async function POST(req) {
  try {
    const data = await req.json()
    const filePath = path.join(process.cwd(), 'src', 'data', 'users.json')
    const raw = await fs.readFile(filePath, 'utf8').catch(() => '[]')
    const users = JSON.parse(raw || '[]')

    // valida duplicados por CPF ou email
    const exists = users.some(u => u.cpf === data.cpf || u.email === data.email)
    if (exists) {
      return new Response(JSON.stringify({ message: 'Usuário já existe' }), { status: 409 })
    }

    const newUser = { id: Date.now(), ...data }
    users.push(newUser)
    await fs.writeFile(filePath, JSON.stringify(users, null, 2), 'utf8')

    return new Response(JSON.stringify(newUser), { status: 201 })
  } catch (err) {
    return new Response(JSON.stringify({ message: 'Erro interno', error: String(err) }), { status: 500 })
  }
}