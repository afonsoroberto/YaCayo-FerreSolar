import type {
  BDVRequest, BDVResponse, ValidationResult,
  Payment, StatsToday, BankDistributionItem, VolumeDataPoint,
} from '../types'
import { mockPayments, statsToday, bankDistribution, volumeData } from './data'

// ─── Helpers ─────────────────────────────────────────────────────────────────

const delay = (ms: number) => new Promise(res => setTimeout(res, ms))
const randomDelay = (min = 200, max = 400) =>
  delay(Math.floor(Math.random() * (max - min + 1)) + min)

// ─── Mock data endpoints (stats, payments, charts) ───────────────────────────

export async function getPayments(): Promise<Payment[]> {
  await randomDelay()
  return [...mockPayments]
}

export async function getStats(): Promise<StatsToday> {
  await randomDelay()
  return { ...statsToday }
}

export async function getBankDistribution(): Promise<BankDistributionItem[]> {
  await randomDelay()
  return [...bankDistribution]
}

export async function getVolumeData(): Promise<VolumeDataPoint[]> {
  await randomDelay()
  return [...volumeData]
}

// ─── BDV Conciliación API ─────────────────────────────────────────────────────
//
//  Endpoint producción: https://bdvconciliacion.banvenez.com/getMovement
//  Proxied via Vite to avoid CORS: /api/bdv/getMovement
//
//  Códigos:
//    1000 → Pago conciliado exitosamente
//    1010 → Datos errados / monto errado / ya conciliado / campo inválido

function classifyBDVResponse(res: BDVResponse): ValidationResult['status'] {
  if (res.code === 1000) return 'validado'

  const msg  = res.message?.toLowerCase() ?? ''
  const data = typeof res.data === 'string' ? (res.data as string).toLowerCase() : ''

  // Ya conciliado anteriormente
  if (msg.includes('ya fue conciliado') || msg.includes('anteriormente')) return 'ya_conciliado'

  // API Key inválida
  if (msg.includes('no afiliado')) return 'api_key_invalida'

  // Monto errado — producción devuelve data con "Campo Importe invalido"
  // o mensaje con "monto : X.XX - estatus : Transacción realizada"
  if (
    data.includes('importe') ||
    (msg.includes('monto') && msg.includes('transacción realizada'))
  ) return 'monto_errado'

  return 'no_encontrado'
}

export async function validatePayment(payload: BDVRequest): Promise<ValidationResult> {
  const apiKey = import.meta.env.VITE_BDV_API_KEY as string
  const startTime = Date.now()

  const response = await fetch('/api/bdv/getMovement', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': apiKey,
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    throw new Error(`Error HTTP ${response.status}: ${response.statusText}`)
  }

  const bdv: BDVResponse = await response.json()
  const timeMs = Date.now() - startTime
  const status = classifyBDVResponse(bdv)

  return {
    status,
    ref: payload.referencia,
    amount: bdv.data?.amount ?? payload.importe,
    reason: bdv.data?.reason ?? bdv.message,
    bdvMessage: bdv.message,
    timeMs,
    data: bdv.data,
    bankCode: payload.bancoOrigen,
  }
}