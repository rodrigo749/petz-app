export async function POST(req) {
  try {
    const data = await req.json()
    
    // Sempre usa a API externa - sem fallback local
    const PETZ_API_URL = process.env.PETZ_API_URL || ''
    
    if (!PETZ_API_URL) {
      return new Response(
        JSON.stringify({ message: 'API externa não configurada. Configure PETZ_API_URL no .env.local' }), 
        { status: 500 }
      )
    }

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
    try { 
      externalJson = externalText ? JSON.parse(externalText) : {} 
    } catch (e) { 
      externalJson = { message: externalText } 
    }

    // Forward external response (success or error)
    return new Response(JSON.stringify(externalJson), { status: external.status })
    
  } catch (err) {
    console.error('Erro ao enviar para PETZ API:', String(err))
    return new Response(
      JSON.stringify({ message: 'Erro ao conectar com a API', error: String(err) }), 
      { status: 500 }
    )
  }
}