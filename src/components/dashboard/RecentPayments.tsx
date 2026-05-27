import { useNavigate } from 'react-router-dom'
import { IconFilter, IconArrowRight } from '../icons/Icons'
import type { Payment } from '../../types'
import { useIsMobile } from '../../hooks/useIsMobile'

function StatusBadge({ status }: { status: string }) {
  const configs: Record<string, { label: string; color: string; bg: string; dot: string }> = {
    validado: {
      label: 'Validado',
      color: '#2F6A47',
      bg: 'rgba(79,157,107,0.12)',
      dot: '#4F9D6B',
    },
    revision: {
      label: 'En revisión',
      color: '#8a601a',
      bg: 'rgba(224,160,44,0.14)',
      dot: '#E0A02C',
    },
    no_encontrado: {
      label: 'No encontrado',
      color: '#8E3128',
      bg: 'rgba(200,69,58,0.10)',
      dot: '#C8453A',
    },
    duplicado: {
      label: 'Duplicado',
      color: '#2A241E',
      bg: 'rgba(24,20,15,0.06)',
      dot: '#6A6357',
    },
  }

  const cfg = configs[status] || configs.duplicado

  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      fontSize: 11.5,
      padding: '3px 9px 3px 8px',
      borderRadius: 999,
      fontWeight: 500,
      color: cfg.color,
      background: cfg.bg,
      whiteSpace: 'nowrap',
    }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: cfg.dot, flexShrink: 0 }}/>
      {cfg.label}
    </span>
  )
}

function getInitials(name: string) {
  return name.split(' ').slice(0, 2).map((w: string) => w[0]).join('').toUpperCase()
}

export default function RecentPayments({ payments = [], loading = false }: { payments: Payment[]; loading?: boolean }) {
  const isMobile = useIsMobile()
  const navigate = useNavigate()

  return (
    <div style={{
      background: '#FBF7EE',
      border: '1px solid rgba(24,20,15,0.09)',
      borderRadius: 16,
      boxShadow: '0 1px 0 rgba(24,20,15,0.04), 0 1px 2px rgba(24,20,15,0.04)',
      overflow: 'hidden',
    }}>
      {/* Card head */}
      <div style={{
        padding: '16px 20px 12px',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        gap: 16,
        borderBottom: '1px solid rgba(24,20,15,0.05)',
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <b style={{ fontSize: 14, fontWeight: 500, letterSpacing: '-0.005em' }}>Actividad reciente</b>
          <span style={{ fontSize: 12, color: '#6A6357' }}>Últimos 8 pagos · actualizado en vivo</span>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button style={{
            height: 32, padding: '0 10px',
            borderRadius: 10, fontSize: 12, fontWeight: 500,
            display: 'inline-flex', alignItems: 'center', gap: 6,
            border: '1px solid rgba(24,20,15,0.09)',
            background: '#FBF7EE',
            color: '#18140F',
            cursor: 'pointer',
          }}>
            <IconFilter size={14} />
            Filtrar
          </button>
          <button
            onClick={() => navigate('/pagos')}
            style={{
              height: 32, padding: '0 10px',
              borderRadius: 10, fontSize: 12, fontWeight: 500,
              display: 'inline-flex', alignItems: 'center', gap: 6,
              border: '1px solid rgba(24,20,15,0.09)',
              background: '#FBF7EE',
              color: '#18140F',
              cursor: 'pointer',
            }}>
            Ver todos
            <IconArrowRight size={14} />
          </button>
        </div>
      </div>

      {loading ? (
        <div style={{ padding: 40, textAlign: 'center', color: '#6A6357', fontSize: 13 }}>
          Cargando pagos…
        </div>
      ) : (
        isMobile ? (
          // Mobile: card list
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {payments.map((p, i) => (
              <div key={p.id} style={{
                padding: '12px 14px',
                borderBottom: i < payments.length - 1 ? '1px solid rgba(24,20,15,0.05)' : 'none',
                display: 'flex', alignItems: 'center', gap: 12,
              }}>
                <span style={{
                  width: 32, height: 32, borderRadius: 8, flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: "'Geist Mono', monospace", fontSize: 10, fontWeight: 600,
                  color: p.bankTextColor || 'white', background: p.bankColor,
                }}>{p.bankCode}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                    <span style={{ fontFamily: "'Geist Mono', monospace", fontSize: 12, color: '#2A241E', fontWeight: 500 }}>{p.ref}</span>
                    <span style={{ fontFamily: "'Geist Mono', monospace", fontSize: 12, fontWeight: 500, flexShrink: 0 }}>
                      Bs {p.amount.toLocaleString('es-VE', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 }}>
                    <span style={{ fontSize: 11, color: '#6A6357' }}>{p.clientId} · {p.time}</span>
                    <StatusBadge status={p.status} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Desktop: full table
          <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0 }}>
            <thead>
              <tr>
                {['Referencia', 'Banco', 'Cliente', 'Monto', 'Estado', 'Hora'].map((h, i) => (
                  <th key={h} style={{
                    fontFamily: "'Geist Mono', monospace",
                    fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase',
                    color: '#6A6357', fontWeight: 500,
                    textAlign: i === 3 || i === 5 ? 'right' : 'left',
                    padding: '10px 14px', borderBottom: '1px solid rgba(24,20,15,0.05)',
                    background: 'linear-gradient(180deg, rgba(236,229,214,0.4), transparent)',
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {payments.map(p => (
                <tr key={p.id} style={{ cursor: 'default' }}
                  onMouseEnter={e => Array.from(e.currentTarget.cells).forEach(td => { td.style.background = 'rgba(244,183,49,0.04)' })}
                  onMouseLeave={e => Array.from(e.currentTarget.cells).forEach(td => { td.style.background = '' })}
                >
                  <td style={{ padding: '12px 14px', fontSize: 13, borderBottom: '1px solid rgba(24,20,15,0.05)', verticalAlign: 'middle' }}>
                    <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: 12, color: '#2A241E' }}>{p.ref}</div>
                    <div style={{ color: '#6A6357', fontSize: 10.5, fontFamily: "'Geist Mono', monospace", marginTop: 2 }}>{p.type}</div>
                  </td>
                  <td style={{ padding: '12px 14px', fontSize: 13, borderBottom: '1px solid rgba(24,20,15,0.05)', verticalAlign: 'middle' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12.5 }}>
                      <span style={{
                        width: 20, height: 20, borderRadius: 5, flexShrink: 0,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontFamily: "'Geist Mono', monospace", fontSize: 9, fontWeight: 600,
                        color: p.bankTextColor || 'white', background: p.bankColor,
                      }}>{p.bankCode}</span>
                      {p.bankName}
                    </div>
                  </td>
                  <td style={{ padding: '12px 14px', fontSize: 13, borderBottom: '1px solid rgba(24,20,15,0.05)', verticalAlign: 'middle' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{
                        width: 26, height: 26, borderRadius: '50%', flexShrink: 0,
                        background: 'linear-gradient(135deg,#e0d6c1,#bfb39a)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 10.5, color: '#2A241E', fontWeight: 500,
                      }}>{getInitials(p.clientName)}</div>
                      <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.2 }}>
                        <b style={{ fontSize: 12.5, fontWeight: 500 }}>{p.clientName}</b>
                        <small style={{ color: '#6A6357', fontSize: 10.5, fontFamily: "'Geist Mono', monospace" }}>{p.clientId}</small>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '12px 14px', fontSize: 13, borderBottom: '1px solid rgba(24,20,15,0.05)', verticalAlign: 'middle', textAlign: 'right' }}>
                    <span style={{ fontFamily: "'Geist Mono', monospace", fontWeight: 500 }}>
                      Bs {p.amount.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </td>
                  <td style={{ padding: '12px 14px', fontSize: 13, borderBottom: '1px solid rgba(24,20,15,0.05)', verticalAlign: 'middle' }}>
                    <StatusBadge status={p.status} />
                  </td>
                  <td style={{ padding: '12px 14px', fontSize: 13, borderBottom: '1px solid rgba(24,20,15,0.05)', verticalAlign: 'middle', textAlign: 'right' }}>
                    <span style={{ color: '#6A6357', fontSize: 10.5, fontFamily: "'Geist Mono', monospace" }}>{p.time}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )
      )}
    </div>
  )
}