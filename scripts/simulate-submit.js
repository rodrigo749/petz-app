// Simulate form submit to /api/ongs
// Usage: node scripts/simulate-submit.js
// Optional env vars:
//   TARGET - URL to POST to (default http://localhost:3000/api/ongs)
//   TOKEN  - optional Authorization Bearer token to include

const TARGET = process.env.TARGET || 'http://localhost:3000/api/ongs'
const TOKEN = process.env.TOKEN || ''

const payload = {
  nome: 'ONG de Teste',
  email: `teste_${Date.now()}@example.com`,
  senha: 'senhaTeste123',
  telefone: '(31) 1234-5678',
  celular: '(31) 91234-5678',
  cnpj: '12.345.678/0001-90',
  cep: '30123-456',
  rua: 'Rua de Teste',
  numero: '123',
  complemento: 'Sala 1',
  cidade: 'Belo Horizonte',
  estado: 'MG',
  HorarioFunc1: '09:00',
  HorarioFunc2: '17:00',
  imagem: '/uploads/test.jpg',
  tipo: 'ong'
}

;(async () => {
  try {
    const headers = { 'Content-Type': 'application/json' }
    if (TOKEN) headers['Authorization'] = `Bearer ${TOKEN}`

    console.log('POST', TARGET)
    console.log('Payload:', payload)

    const res = await fetch(TARGET, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    })

    const text = await res.text()
    let body
    try { body = JSON.parse(text) } catch (e) { body = text }

    console.log('Status:', res.status)
    console.log('Response body:', body)
  } catch (err) {
    console.error('Erro no request:', err)
    process.exit(1)
  }
})()
