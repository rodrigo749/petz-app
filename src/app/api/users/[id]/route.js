import { promises as fs } from 'fs'
import path from 'path'

const filePath = path.join(process.cwd(), 'src', 'data', 'users.json')

async function readUsers() {
  const raw = await fs.readFile(filePath, 'utf8').catch(() => '[]')
  return JSON.parse(raw || '[]')
}

export async function GET(req, { params }) {
  const { id } = params
  const users = await readUsers()
  const u = users.find(x => String(x.id) === String(id))
  if (!u) return new Response(JSON.stringify({ message: 'Not found' }), { status: 404 })
  return new Response(JSON.stringify(u), { status: 200 })
}

export async function PUT(req, { params }) {
  return new Response(
    JSON.stringify({ error: 'Operação de atualização desabilitada. Use a API externa configurada.' }),
    { status: 501 }
  )
}

export async function DELETE(req, { params }) {
  return new Response(
    JSON.stringify({ error: 'Operação de exclusão desabilitada. Use a API externa configurada.' }),
    { status: 501 }
  )
}
