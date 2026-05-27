import { useState, useEffect, useRef } from 'react'
import { usePayments } from '../hooks/usePayments'
import { useNewPayments } from '../context/NewPaymentsContext'
import { useIsMobile } from '../hooks/useIsMobile'
import RecentPayments from '../components/dashboard/RecentPayments'
import { IconFilter, IconSearch } from '../components/icons/Icons'

const DAYS_ES = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
const MONTHS_ES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre']

function formatToday() {
  const d = new Date()
  return `${DAYS_ES[d.getDay()]} ${d.getDate()} de ${MONTHS_ES[d.getMonth()]}, ${d.getFullYear()}`
}

const STATUS_OPTIONS = [
  { value: '', label: 'Todos los estados' },
  { value: 'validado', label: 'Validado' },
  { value: 'no_encontrado', label: 'No encontrado' },
  { value: 'ya_conciliado', label: 'Ya conciliado' },
  { value: 'monto_errado', label: 'Monto errado' },
]

const STATUS_COLORS: Record<string, string> = {
  validado: '#2F6A47',
  revision: '#8a601a',
  no_encontrado: '#8E3128',
  duplicado: '#6A6357',
  ya_conciliado: '#8a601a',
  monto_errado: '#8E3128',
}

export default function PagosRecientes() {
  const { data: payments, loading } = usePayments()
  const { reset } = useNewPayments()
  const isMobile = useIsMobile()
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [showFilter, setShowFilter] = useState(false)
  const filterRef = useRef<HTMLDivElement>(null)

  useEffect(() => { reset() }, [])

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setShowFilter(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const filtered = (payments || []).filter(p => {
    const matchSearch = !search ||
      p.clientName.toLowerCase().includes(search.toLowerCase()) ||
      p.ref.includes(search) ||
      p.clientId.toLowerCase().includes(search.toLowerCase())
    const matchStatus = !filterStatus || p.status === filterStatus
    return matchSearch && matchStatus
  })

  const totalValidado = (payments || []).filter(p => p.status === 'validado').reduce((s, p) => s + p.amount, 0)
  const totalConciliado = (payments || []).filter(p => p.status === 'ya_conciliado').length
  const totalNoEncontrado = (payments || []).filter(p => p.status === 'no_encontrado').length

  return (
    <div style={{ padding: isMobile ? '20px 16px 56px' : '32px 32px 56px', display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Heading */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: isMobile ? 24 : 30, fontWeight: 500, letterSpacing: '-0.025em' }}>
            Pagos <b style={{ fontWeight: 600 }}>Recientes</b>
          </h2>
          {!isMobile && (
            <div style={{ marginTop: 8, fontSize: 13.5, color: '#6A6357' }}>
              Actividad del día operativo — {formatToday()}
            </div>
          )}
        </div>

        {/* Filter button */}
        <div ref={filterRef} style={{ position: 'relative' }}>
          <button
            style={{
              ...btnStyle,
              ...(showFilter || filterStatus ? {
                borderColor: 'rgba(217,64,42,0.4)',
                background: 'rgba(217,64,42,0.06)',
                color: '#D9402A',
              } : {}),
            }}
            onClick={() => setShowFilter(s => !s)}
          >
            <IconFilter size={16} />
            Filtrar
            {filterStatus && (
              <span style={{
                width: 16, height: 16, borderRadius: '50%',
                background: '#D9402A', color: 'white',
                fontSize: 9, fontWeight: 700,
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                marginLeft: 2,
              }}>1</span>
            )}
          </button>

          {showFilter && (
            <div style={{
              position: 'absolute', top: 44, right: 0, zIndex: 100,
              background: '#FBF7EE', borderRadius: 12,
              border: '1px solid rgba(24,20,15,0.09)',
              boxShadow: '0 8px 32px -8px rgba(24,20,15,0.18)',
              minWidth: 200, overflow: 'hidden',
            }}>
              <div style={{ padding: '8px 12px 6px', fontSize: 10, fontFamily: "'Geist Mono', monospace", letterSpacing: '0.1em', textTransform: 'uppercase', color: '#9A9285' }}>
                Filtrar por estado
              </div>
              {STATUS_OPTIONS.map(opt => (
                <div
                  key={opt.value}
                  onClick={() => { setFilterStatus(opt.value); setShowFilter(false) }}
                  style={{
                    padding: '9px 14px', fontSize: 13, cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: 10,
                    background: filterStatus === opt.value ? 'rgba(217,64,42,0.06)' : 'transparent',
                    color: opt.value ? STATUS_COLORS[opt.value] ?? '#18140F' : '#18140F',
                    borderBottom: '1px solid rgba(24,20,15,0.04)',
                  }}
                  onMouseEnter={e => { if (filterStatus !== opt.value) (e.currentTarget as HTMLDivElement).style.background = 'rgba(244,183,49,0.06)' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = filterStatus === opt.value ? 'rgba(217,64,42,0.06)' : 'transparent' }}
                >
                  {opt.value && <span style={{ width: 7, height: 7, borderRadius: '50%', background: STATUS_COLORS[opt.value], display: 'inline-block', flexShrink: 0 }}/>}
                  {opt.label}
                  {filterStatus === opt.value && <span style={{ marginLeft: 'auto', fontSize: 11, color: '#D9402A' }}>✓</span>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: isMobile ? 10 : 14 }}>
        <StatMini label="Total validado" value={`Bs ${totalValidado.toLocaleString('es-VE', { minimumFractionDigits: 2 })}`} color="#2F6A47" isMobile={isMobile} />
        <StatMini label="Ya conciliado" value={String(totalConciliado)} color="#8a601a" isMobile={isMobile} />
        <StatMini label="No encontrado" value={String(totalNoEncontrado)} color="#8E3128" isMobile={isMobile} />
      </div>

      {/* Search */}
      <div style={{
        height: 42, borderRadius: 10,
        background: 'rgba(255,255,255,0.7)',
        border: '1px solid rgba(24,20,15,0.09)',
        display: 'flex', alignItems: 'center', gap: 10, padding: '0 14px',
        maxWidth: isMobile ? '100%' : 480,
      }}>
        <IconSearch size={16} />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Buscar por referencia, cédula…"
          style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontSize: 13, color: '#18140F' }}
        />
      </div>

      {/* Active filter chip */}
      {filterStatus && (
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <span style={{ fontSize: 12.5, color: '#6A6357' }}>Mostrando:</span>
          <span
            onClick={() => setFilterStatus('')}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '3px 10px', borderRadius: 999, fontSize: 12, cursor: 'pointer',
              background: 'rgba(217,64,42,0.08)', color: '#D9402A',
              border: '1px solid rgba(217,64,42,0.2)',
            }}
          >
            {STATUS_OPTIONS.find(o => o.value === filterStatus)?.label}
            <span style={{ fontSize: 14, lineHeight: 1 }}>×</span>
          </span>
        </div>
      )}

      {/* Table */}
      <RecentPayments payments={filtered} loading={loading} />
    </div>
  )
}

function StatMini({ label, value, color, isMobile }: { label: string; value: string; color: string; isMobile: boolean }) {
  return (
    <div style={{
      background: '#FBF7EE', border: '1px solid rgba(24,20,15,0.09)',
      borderRadius: 12, padding: isMobile ? '10px 12px' : '14px 16px',
      display: 'flex', flexDirection: 'column', gap: 4,
    }}>
      <div style={{ fontSize: isMobile ? 10.5 : 12, color: '#6A6357' }}>{label}</div>
      <div style={{ fontSize: isMobile ? 16 : 22, fontWeight: 500, letterSpacing: '-0.02em', color }}>{value}</div>
    </div>
  )
}

const btnStyle: React.CSSProperties = {
  height: 38, padding: '0 14px', borderRadius: 10,
  fontSize: 13, fontWeight: 500,
  display: 'inline-flex', alignItems: 'center', gap: 8,
  border: '1px solid rgba(24,20,15,0.09)',
  background: '#FBF7EE', color: '#18140F', cursor: 'pointer',
}