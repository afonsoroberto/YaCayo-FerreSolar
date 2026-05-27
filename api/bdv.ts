import type { VercelRequest, VercelResponse } from '@vercel/node'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const apiKey = process.env.VITE_BDV_API_KEY
  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured' })
  }

  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 15000)

    const response = await fetch('https://bdvconciliacion.banvenez.com/getMovement', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': apiKey,
      },
      body: JSON.stringify(req.body),
      signal: controller.signal,
    })

    clearTimeout(timeout)

    // Leer respuesta como texto primero para evitar errores de parsing
    const text = await response.text()

    let data
    try {
      data = JSON.parse(text)
    } catch {
      // Si no es JSON válido, devolver el texto crudo
      return res.status(response.status).json({
        code: 1010,
        message: text || 'Error del servidor BDV',
        data: null,
        status: response.status,
      })
    }

    return res.status(200).json(data)
  } catch (error: unknown) {
    if (error instanceof Error && error.name === 'AbortError') {
      return res.status(504).json({
        code: 1010,
        message: 'Timeout: el servidor BDV no respondió a tiempo',
        data: null,
        status: 504,
      })
    }
    return res.status(500).json({
      code: 1010,
      message: 'Error conectando con BDV',
      data: null,
      status: 500,
    })
  }
}