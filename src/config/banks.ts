import type { BankConfig } from '../types'

// Teléfonos receptores vienen de .env — editables también desde Configuración (localStorage override)
function getTelefonoDestino(bankCode: string): string {
  const lsKey = `yacayo_tel_destino_${bankCode}`
  return (
    localStorage.getItem(lsKey) ||
    import.meta.env[`VITE_TELEFONO_DESTINO_${bankCode}`] ||
    ''
  )
}

export const BASE_BANK_CONFIGS: Omit<BankConfig, 'telefonoDestino'>[] = [
  {
    code: '0102',
    name: 'Banco de Venezuela',
    shortCode: 'BV',
    color: '#F4B731',
    textColor: '#3a2410',
    reqCedDefault: true,   // BDV–BDV: valida cédula por defecto
    active: true,
  },
  {
    code: '0134',
    name: 'Banesco',
    shortCode: 'BN',
    color: '#D9402A',
    reqCedDefault: false,
    active: true,
  },
  {
    code: '0105',
    name: 'Mercantil',
    shortCode: 'MC',
    color: '#E97A1F',
    reqCedDefault: false,
    active: true,
  },
  {
    code: '0191',
    name: 'BNC',
    shortCode: 'BC',
    color: '#6A6357',
    reqCedDefault: false,
    active: false,
  },
  {
    code: '0108',
    name: 'Provincial',
    shortCode: 'PR',
    color: '#4F9D6B',
    reqCedDefault: false,
    active: false,
  },
]

export function getBankConfigs(): BankConfig[] {
  return BASE_BANK_CONFIGS.map(b => ({
    ...b,
    telefonoDestino: getTelefonoDestino(b.code),
  }))
}

export function getBankByCode(code: string): BankConfig | undefined {
  return getBankConfigs().find(b => b.code === code)
}

export function saveTelefonoDestino(bankCode: string, phone: string): void {
  localStorage.setItem(`yacayo_tel_destino_${bankCode}`, phone)
}
