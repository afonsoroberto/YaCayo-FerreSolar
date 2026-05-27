import { supabase } from './supabase'
import { getBankByCode } from '../config/banks'
import type { ValidationResult } from '../types'
import type { Payment } from '../types'

// ─── Guardar pago tras validación ────────────────────────────────────────────

export async function savePago(result: ValidationResult, cedula: string, telefono: string): Promise<void> {
  const bank = getBankByCode(result.bankCode)
  await supabase.from('pagos').insert({
    referencia:       result.ref,
    banco_codigo:     result.bankCode,
    banco_nombre:     bank?.name ?? result.bankCode,
    monto:            result.amount,
    cedula_pagador:   cedula,
    telefono_pagador: telefono,
    estado:           result.status,
    bdv_message:      result.bdvMessage,
    time_ms:          result.timeMs,
  })
}

// ─── Leer pagos recientes ─────────────────────────────────────────────────────

export async function fetchPagos(limit = 50): Promise<Payment[]> {
  const { data, error } = await supabase
    .from('pagos')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error || !data) return []

  return data.map(row => {
    const bank = getBankByCode(row.banco_codigo)
    const hora = new Date(row.created_at).toLocaleTimeString('es-VE', { hour: '2-digit', minute: '2-digit' })
    return {
      id:           row.id,
      ref:          row.referencia,
      type:         'Pago Móvil',
      bankCode:     bank?.shortCode ?? row.banco_codigo,
      bankName:     row.banco_nombre,
      bankColor:    bank?.color ?? '#6A6357',
      bankTextColor: bank?.textColor,
      clientName:   row.cedula_pagador ?? '—',
      clientId:     row.telefono_pagador ?? '—',
      amount:       parseFloat(row.monto ?? '0'),
      status:       mapStatus(row.estado),
      time:         hora,
    }
  })
}

function mapStatus(estado: string): Payment['status'] {
  if (estado === 'validado')     return 'validado'
  if (estado === 'ya_conciliado') return 'ya_conciliado'
  if (estado === 'monto_errado') return 'revision'
  if (estado === 'no_encontrado') return 'no_encontrado'
  return 'no_encontrado'
}

// ─── Stats del día desde Supabase ─────────────────────────────────────────────

export async function fetchStatsToday() {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const { data, error } = await supabase
    .from('pagos')
    .select('monto, estado, created_at')
    .gte('created_at', today.toISOString())

  if (error || !data) return {
    totalValidated: 0,
    paymentsProcessed: 0,
    paymentsTotal: 0,
    pending: 0,
    banksConnected: 1,
    banksTotal: 1,
    avgTimeSeconds: 0,
    changePercent: 0,
  }

  const validados = data.filter(p => p.estado === 'validado')
  const pendientes = data.filter(p => p.estado === 'monto_errado')
  const totalValidated = validados.reduce((s, p) => s + parseFloat(p.monto ?? '0'), 0)

  return {
    totalValidated,
    paymentsProcessed: validados.length,
    paymentsTotal: data.length,
    pending: pendientes.length,
    banksConnected: 1,
    banksTotal: 1,
    avgTimeSeconds: 0,
    changePercent: 0,
  }
}

// ─── Datos de volumen por día (últimos 7 días) ────────────────────────────────

export async function fetchVolumeData() {
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (6 - i))
    d.setHours(0, 0, 0, 0)
    return d
  })

  const since = days[0].toISOString()
  const { data, error } = await supabase
    .from('pagos')
    .select('monto, estado, created_at')
    .gte('created_at', since)
    .eq('estado', 'validado')

  if (error || !data) return days.map(d => ({
    date: d.toLocaleDateString('es-VE', { weekday: 'short' }),
    amount: 0,
    prevAmount: 0,
  }))

  return days.map(d => {
    const nextDay = new Date(d)
    nextDay.setDate(nextDay.getDate() + 1)
    const dayPayments = data.filter(p => {
      const t = new Date(p.created_at)
      return t >= d && t < nextDay
    })
    const amount = dayPayments.reduce((s, p) => s + parseFloat(p.monto ?? '0'), 0)
    return {
      date: d.toLocaleDateString('es-VE', { weekday: 'short' }),
      amount,
      prevAmount: 0,
    }
  })
}