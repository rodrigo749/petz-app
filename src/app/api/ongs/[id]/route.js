import fs from 'fs/promises'
import path from 'path'

const filePath = path.join(process.cwd(), 'src', 'data', 'ongs.json')

export async function GET(req, { params }) {
  try {
    const id = String(params.id)
    const raw = await fs.readFile(filePath, 'utf8')
    const ongs = JSON.parse(raw || '[]')
    const found = ongs.find(o => String(o.id) === id)
    if (!found) return new Response(JSON.stringify({ message: 'ONG não encontrada' }), { status: 404 })
    return new Response(JSON.stringify(found), { status: 200 })
  } catch (err) {
    return new Response(JSON.stringify({ message: 'Erro interno' }), { status: 500 })
  }
}

export async function PUT(req, { params }) {
  try {
    const id = String(params.id)
    const body = await req.json()
    const raw = await fs.readFile(filePath, 'utf8')
    const ongs = JSON.parse(raw || '[]')
    const idx = ongs.findIndex(o => String(o.id) === id)
    if (idx === -1) return new Response(JSON.stringify({ message: 'ONG não encontrada' }), { status: 404 })
    const updated = { ...ongs[idx], ...body, id: ongs[idx].id }
    ongs[idx] = updated
    await fs.writeFile(filePath, JSON.stringify(ongs, null, 2), 'utf8')
    return new Response(JSON.stringify(updated), { status: 200 })
  } catch (err) {
    console.error(err)
    return new Response(JSON.stringify({ message: 'Erro ao atualizar' }), { status: 500 })
  }
}

export async function DELETE(req, { params }) {
  try {
    const id = String(params.id)
    const raw = await fs.readFile(filePath, 'utf8')
    let ongs = JSON.parse(raw || '[]')
    const exists = ongs.some(o => String(o.id) === id)
    if (!exists) return new Response(JSON.stringify({ message: 'ONG não encontrada' }), { status: 404 })
    ongs = ongs.filter(o => String(o.id) !== id)
    await fs.writeFile(filePath, JSON.stringify(ongs, null, 2), 'utf8')
    return new Response(null, { status: 204 })
  } catch (err) {
    console.error(err)
    return new Response(JSON.stringify({ message: 'Erro ao excluir' }), { status: 500 })
  }
}
