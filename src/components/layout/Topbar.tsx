import { useState, useEffect, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { IconSearch, IconX } from '../icons/Icons'
import { fetchPagos } from '../../lib/pagosDb'
import type { Payment } from '../../types'

const STATUS_LABELS: Record<string, string> = {
  validado: 'Validado',
  revision: 'En revisión',
  no_encontrado: 'No encontrado',
  duplicado: 'Duplicado',
  ya_conciliado: 'Ya conciliado',
}

const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  validado:      { bg: 'rgba(79,157,107,0.12)',  color: '#2F6A47' },
  revision:      { bg: 'rgba(224,160,44,0.14)',  color: '#8a601a' },
  no_encontrado: { bg: 'rgba(200,69,58,0.10)',   color: '#8E3128' },
  duplicado:     { bg: 'rgba(24,20,15,0.06)',    color: '#6A6357' },
  ya_conciliado: { bg: 'rgba(224,160,44,0.14)',  color: '#8a601a' },
}

function useLiveClock() {
  const [now, setNow] = useState(new Date())
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30_000)
    return () => clearInterval(id)
  }, [])
  return now
}

const DAYS_ES = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
const MONTHS_ES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic']

function formatClock(d: Date) {
  const day = DAYS_ES[d.getDay()]
  const date = d.getDate()
  const month = MONTHS_ES[d.getMonth()]
  const h = String(d.getHours()).padStart(2, '0')
  const m = String(d.getMinutes()).padStart(2, '0')
  return `${day} ${date} ${month}, ${h}:${m}`
}

interface PaymentDetailModalProps {
  payment: Payment
  onClose: () => void
}

function PaymentDetailModal({ payment, onClose }: PaymentDetailModalProps) {
  const bank = { color: payment.bankColor, textColor: payment.bankTextColor ?? 'white', code: payment.bankCode, name: payment.bankName }
  const sc = STATUS_COLORS[payment.status] ?? STATUS_COLORS.revision

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 200,
        background: 'rgba(15,13,11,0.45)', backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: 480, background: '#FBF7EE', borderRadius: 20,
          boxShadow: '0 1px 0 rgba(24,20,15,0.04), 0 32px 64px -24px rgba(24,20,15,0.28)',
          border: '1px solid rgba(24,20,15,0.09)', overflow: 'hidden',
        }}>

        {/* Header */}
        <div style={{
          padding: '20px 22px 16px',
          background: 'linear-gradient(180deg, rgba(244,183,49,0.10), transparent 70%), #FBF7EE',
          borderBottom: '1px solid rgba(24,20,15,0.06)',
          display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
        }}>
          <div>
            <div style={{ fontSize: 11, fontFamily: "'Geist Mono', monospace", letterSpacing: '0.1em', textTransform: 'uppercase' as const, color: '#6A6357', marginBottom: 6 }}>
              Detalle del pago
            </div>
            <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: 20, fontWeight: 600, letterSpacing: '-0.01em', color: '#18140F' }}>
              {payment.ref}
            </div>
            <div style={{ marginTop: 4, fontSize: 12, color: '#6A6357' }}>{payment.type}</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              fontSize: 12, padding: '4px 10px', borderRadius: 999, fontWeight: 500,
              background: sc.bg, color: sc.color,
            }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: sc.color, display: 'inline-block' }}/>
              {STATUS_LABELS[payment.status] ?? payment.status}
            </span>
            <button onClick={onClose} style={{
              width: 30, height: 30, borderRadius: 8, border: '1px solid rgba(24,20,15,0.09)',
              background: 'rgba(255,255,255,0.6)', display: 'flex', alignItems: 'center',
              justifyContent: 'center', cursor: 'pointer', color: '#6A6357',
            }}>
              <IconX size={14} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: '18px 22px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px 20px' }}>
          {[
            ['Monto', `Bs ${payment.amount.toLocaleString('es-VE', { minimumFractionDigits: 2 })}`],
            ['Hora', payment.time],
            ['Cliente', payment.clientName],
            ['Cédula / RIF', payment.clientId],
            ['Banco origen', null],
          ].map(([label, value], i) => (
            <div key={i}>
              <div style={{ fontSize: 9.5, fontFamily: "'Geist Mono', monospace", letterSpacing: '0.1em', textTransform: 'uppercase' as const, color: '#6A6357', marginBottom: 4 }}>{label as string}</div>
              {label === 'Banco origen' ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{
                    width: 22, height: 22, borderRadius: 6, flexShrink: 0,
                    background: bank.color, color: bank.textColor,
                    fontFamily: "'Geist Mono', monospace", fontSize: 9, fontWeight: 600,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>{bank.code}</span>
                  <span style={{ fontSize: 13, fontWeight: 500 }}>{bank.name}</span>
                </div>
              ) : (
                <div style={{ fontSize: 13, fontWeight: 500, fontFamily: ['Monto', 'Hora', 'Cédula / RIF'].includes(label as string) ? "'Geist Mono', monospace" : undefined }}>
                  {value as string}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={{
          padding: '12px 22px 18px', borderTop: '1px solid rgba(24,20,15,0.06)',
          display: 'flex', justifyContent: 'flex-end', gap: 8,
        }}>
          <button onClick={onClose} style={{
            height: 34, padding: '0 16px', borderRadius: 8, fontSize: 13, fontWeight: 500,
            border: 'none', background: 'linear-gradient(135deg,#D9402A 0%, #E97A1F 52%, #F4B731 100%)',
            color: 'white', cursor: 'pointer',
          }}>Cerrar</button>
        </div>
      </div>
    </div>
  )
}

const linkStyle: React.CSSProperties = {
  color: '#6A6357',
  textDecoration: 'none',
}

export default function Topbar({ pageTitle = 'Resumen del día', onMenuClick }: { pageTitle?: string; onMenuClick?: () => void }) {
  const now = useLiveClock()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Payment[]>([])
  const [allPayments, setAllPayments] = useState<Payment[]>([])
  const [showDropdown, setShowDropdown] = useState(false)
  const [selected, setSelected] = useState<Payment | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const wrapRef = useRef<HTMLDivElement>(null)

  // Load payments from Supabase
  useEffect(() => {
    fetchPagos(200).then(setAllPayments).catch(() => {})
  }, [])

  // Search
  useEffect(() => {
    const q = query.trim().toLowerCase()
    if (!q) { setResults([]); return }
    setResults(
      allPayments.filter(p =>
        p.ref.includes(q) ||
        p.clientName.toLowerCase().includes(q) ||
        p.clientId.toLowerCase().includes(q) ||
        p.bankName.toLowerCase().includes(q) ||
        String(p.amount).includes(q)
      ).slice(0, 6)
    )
  }, [query, allPayments])

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // ⌘K shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        inputRef.current?.focus()
        setShowDropdown(true)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  const handleSelect = useCallback((p: Payment) => {
    setSelected(p)
    setShowDropdown(false)
    setQuery('')
  }, [])

  const isHome = pageTitle === 'Resumen del día'

  return (
    <>
      <div style={{
        height: 56, padding: '0 12px',
        display: 'flex', alignItems: 'center', gap: 8,
        borderBottom: '1px solid rgba(24,20,15,0.09)',
        background: 'rgba(251,247,238,0.92)',
        backdropFilter: 'blur(8px)',
        flexShrink: 0,
        overflow: 'hidden',
        width: '100%',
        boxSizing: 'border-box',
      }}>
        {/* Hamburger — mobile only */}
        {onMenuClick && (
          <button onClick={onMenuClick} style={{
            width: 36, height: 36, borderRadius: 9, flexShrink: 0,
            border: '1px solid rgba(24,20,15,0.09)', background: 'rgba(255,255,255,0.55)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: '#18140F',
          }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M2 4h12M2 8h12M2 12h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        )}

        {/* Breadcrumb — solo desktop */}
        {!onMenuClick && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#6A6357', whiteSpace: 'nowrap', flexShrink: 0 }}>
            {isHome ? (
              <b style={{ color: '#18140F', fontWeight: 500 }}>Inicio</b>
            ) : (
              <>
                <Link
                  to="/dashboard"
                  style={linkStyle}
                  onMouseEnter={e => (e.currentTarget.style.color = '#18140F')}
                  onMouseLeave={e => (e.currentTarget.style.color = '#6A6357')}
                >Inicio</Link>
                <span style={{ color: '#9A9285' }}>›</span>
                <b style={{ color: '#18140F', fontWeight: 500 }}>{pageTitle}</b>
              </>
            )}
          </div>
        )}

        {/* Search */}
        <div ref={wrapRef} style={{ flex: 1, minWidth: 0, maxWidth: onMenuClick ? '100%' : 420, position: 'relative' }}>
          <div style={{
            height: 36, borderRadius: 10,
            background: showDropdown ? 'rgba(255,255,255,0.98)' : 'rgba(255,255,255,0.55)',
            border: showDropdown ? '1px solid rgba(217,64,42,0.35)' : '1px solid rgba(24,20,15,0.09)',
            boxShadow: showDropdown ? '0 0 0 3px rgba(217,64,42,0.08)' : 'none',
            display: 'flex', alignItems: 'center', gap: 6, padding: '0 8px',
            transition: 'border-color 0.15s, box-shadow 0.15s',
          }}>
            <IconSearch size={16} />
            <input
              ref={inputRef}
              value={query}
              onChange={e => { setQuery(e.target.value); setShowDropdown(true) }}
              onFocus={() => setShowDropdown(true)}
              placeholder="Buscar por referencia, monto, cédula o teléfono…"
              style={{
                flex: 1, border: 'none', outline: 'none', background: 'transparent',
                fontSize: 13, color: '#18140F',
              }}
            />
            {query ? (
              <button onClick={() => { setQuery(''); setShowDropdown(false) }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9A9285', display: 'flex', padding: 0 }}>
                <IconX size={14} />
              </button>
            ) : (
              !onMenuClick && (
                <span style={{ fontFamily: "'Geist Mono', monospace", fontSize: 10.5, color: '#6A6357', border: '1px solid rgba(24,20,15,0.09)', padding: '1px 5px', borderRadius: 4, background: '#FBF7EE', whiteSpace: 'nowrap' }}>⌘K</span>
              )
            )}
          </div>

          {/* Dropdown */}
          {showDropdown && results.length > 0 && (
            <div style={{
              position: 'absolute', top: 42, left: 0, right: 0, zIndex: 150,
              background: '#FBF7EE', borderRadius: 12,
              border: '1px solid rgba(24,20,15,0.09)',
              boxShadow: '0 8px 32px -8px rgba(24,20,15,0.18)',
              overflow: 'hidden',
            }}>
              {results.map((p, i) => {
                const sc = STATUS_COLORS[p.status] ?? STATUS_COLORS.revision
                return (
                  <div
                    key={p.id}
                    onClick={() => handleSelect(p)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 12,
                      padding: '10px 14px', cursor: 'pointer',
                      borderBottom: i < results.length - 1 ? '1px solid rgba(24,20,15,0.05)' : 'none',
                      transition: 'background 0.1s',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(244,183,49,0.06)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    <span style={{
                      width: 26, height: 26, borderRadius: 7, flexShrink: 0,
                      background: p.bankColor, color: p.bankTextColor ?? 'white',
                      fontFamily: "'Geist Mono', monospace", fontSize: 9, fontWeight: 600,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>{p.bankCode}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: 12, color: '#18140F', fontWeight: 500 }}>{p.ref}</div>
                      <div style={{ fontSize: 11, color: '#6A6357', marginTop: 1 }}>{p.clientName} · {p.clientId}</div>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: 12, fontWeight: 500 }}>Bs {p.amount.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</div>
                      <div style={{ fontSize: 10, marginTop: 2, color: sc.color, background: sc.bg, padding: '1px 7px', borderRadius: 999, display: 'inline-block' }}>
                        {STATUS_LABELS[p.status]}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
          {showDropdown && query.trim() && results.length === 0 && (
            <div style={{
              position: 'absolute', top: 42, left: 0, right: 0, zIndex: 150,
              background: '#FBF7EE', borderRadius: 12, border: '1px solid rgba(24,20,15,0.09)',
              padding: '16px 14px', fontSize: 13, color: '#9A9285', textAlign: 'center',
            }}>
              Sin resultados para "{query}"
            </div>
          )}
        </div>

        <div style={{ flex: 1 }} />

        {/* Live clock pill — hidden on mobile */}
        {!onMenuClick && (
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 7,
            padding: '5px 11px 5px 9px', borderRadius: 999, fontSize: 12,
            border: '1px solid rgba(24,20,15,0.09)',
            background: 'rgba(255,255,255,0.55)', color: '#2A241E', whiteSpace: 'nowrap',
          }}>
            <span className="dot-pulse-orange" style={{
              width: 7, height: 7, borderRadius: '50%', background: '#E97A1F',
              display: 'inline-block', flexShrink: 0,
            }}/>
            Día operativo · <b style={{ color: '#18140F', fontWeight: 500, marginLeft: 2 }}>{formatClock(now)}</b>
          </div>
        )}
      </div>

      {selected && <PaymentDetailModal payment={selected} onClose={() => setSelected(null)} />}
    </>
  )
}