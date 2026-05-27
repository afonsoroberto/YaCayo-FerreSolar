// ─── BDV API ─────────────────────────────────────────────────────────────────

export interface BDVRequest {
  cedulaPagador: string
  telefonoPagador: string
  telefonoDestino: string
  referencia: string
  fechaPago: string        // YYYY-MM-DD
  importe: string          // decimals with "."  e.g. "120.00"
  bancoOrigen: string      // "0102", "0134", "0105"...
  reqCed: boolean
}

export interface BDVResponseData {
  status: string
  amount: string
  reason: string
  referencia: string
}

export interface BDVResponse {
  code: 1000 | 1010
  message: string
  data: BDVResponseData | string | null
  status: number
}

// ─── Validation result (app-level) ───────────────────────────────────────────

export type ValidationStatus =
  | 'validado'
  | 'no_encontrado'
  | 'monto_errado'
  | 'ya_conciliado'
  | 'api_key_invalida'
  | 'error'

export interface ValidationResult {
  status: ValidationStatus
  ref: string
  amount: string
  reason: string
  bdvMessage: string
  timeMs: number
  data: BDVResponseData | string | null
  bankCode: string
}

// ─── Bank config ──────────────────────────────────────────────────────────────

export interface BankConfig {
  code: string            // "0102"
  name: string            // "Banco de Venezuela"
  shortCode: string       // "BV"
  color: string           // "#F4B731"
  textColor?: string      // for light text-on-color
  telefonoDestino: string // receiver phone for this bank
  reqCedDefault: boolean  // auto-enable reqCed for BDV-BDV
  active: boolean
}

// ─── Payments ────────────────────────────────────────────────────────────────

export type PaymentStatus = 'validado' | 'revision' | 'no_encontrado' | 'duplicado' | 'ya_conciliado'

export interface Payment {
  id: string
  ref: string
  type: string
  bankCode: string
  bankName: string
  bankColor: string
  bankTextColor?: string
  clientName: string
  clientId: string
  amount: number
  status: PaymentStatus
  time: string
}

// ─── Stats ────────────────────────────────────────────────────────────────────

export interface StatsToday {
  totalValidated: number
  paymentsProcessed: number
  paymentsTotal: number
  pending: number
  banksConnected: number
  banksTotal: number
  avgTimeSeconds: number
  changePercent: number
}

export interface BankDistributionItem {
  code: string
  name: string
  color: string
  textColor?: string
  percent: number
  count: number
}

export interface VolumeDataPoint {
  date: string
  amount: number
  prevAmount: number
}

// ─── Validation form ─────────────────────────────────────────────────────────

export interface ValidationForm {
  bankCode: string
  ref: string
  amount: string
  date: string
  phone: string
  cedula: string
  reqCed: boolean
}

export type ValidationFormErrors = Partial<Record<keyof ValidationForm | 'submit', string>>
