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
  try {
    const { id } = params
    const body = await req.json()
    const users = await readUsers()
    const idx = users.findIndex(x => String(x.id) === String(id))
    if (idx === -1) return new Response(JSON.stringify({ message: 'Not found' }), { status: 404 })
    users[idx] = { ...users[idx], ...body }
    await fs.writeFile(filePath, JSON.stringify(users, null, 2), 'utf8')
    return new Response(JSON.stringify(users[idx]), { status: 200 })
  } catch (err) {
    return new Response(JSON.stringify({ message: 'Erro interno', error: String(err) }), { status: 500 })
  }
}

export async function DELETE(req, { params }) {
  try {
    const { id } = params
    const users = await readUsers()
    const idx = users.findIndex(x => String(x.id) === String(id))
    if (idx === -1) return new Response(JSON.stringify({ message: 'Not found' }), { status: 404 })
    users.splice(idx, 1)
    await fs.writeFile(filePath, JSON.stringify(users, null, 2), 'utf8')
    return new Response(JSON.stringify({ message: 'Deleted' }), { status: 200 })
  } catch (err) {
    return new Response(JSON.stringify({ message: 'Erro interno', error: String(err) }), { status: 500 })
  }
}
