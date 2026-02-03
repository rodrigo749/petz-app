import { promises as fs } from 'fs'
import path from 'path'

export async function POST(req) {
  return new Response(
    JSON.stringify({ error: 'Operação de cadastro desabilitada. Use a API externa configurada.' }),
    { status: 501 }
  )
}