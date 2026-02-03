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
