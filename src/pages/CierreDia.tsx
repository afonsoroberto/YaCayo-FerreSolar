import { useState } from 'react'
import { bankDistribution } from '../lib/data'
import { IconCloseDay, IconCheck, IconInfo } from '../components/icons/Icons'

export default function CierreDia() {
  const [confirming, setConfirming] = useState(false)
  const [closed, setClosed] = useState(false)

  const handleClose = () => {
    if (!confirming) {
      setConfirming(true)
      return
    }
    setClosed(true)
    setConfirming(false)
  }

  const totalAmount = 847320.40
  const totalPayments = 142

  return (
    <div style={{ padding: '32px 32px 56px', display: 'flex', flexDirection: 'column', gap: 28 }}>
      {/* Heading */}
      <div>
        <h2 style={{ margin: 0, fontSize: 30, fontWeight: 500, letterSpacing: '-0.025em' }}>
          Cierre de <b style={{ fontWeight: 600 }}>Día</b>
        </h2>
        <div style={{ marginTop: 8, fontSize: 13.5, color: '#6A6357' }}>
          Día operativo — Lunes 23 de mayo, 2025 · Apertura 08:30
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 24, alignItems: 'start' }}>
        {/* Summary */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Status card */}
          <div style={{
            background: closed
              ? 'linear-gradient(180deg, rgba(79,157,107,0.10), transparent 60%), #FBF7EE'
              : 'linear-gradient(180deg, rgba(244,183,49,0.08), transparent 60%), #FBF7EE',
            border: closed
              ? '1px solid rgba(79,157,107,0.25)'
              : '1px solid rgba(244,183,49,0.25)',
            borderRadius: 16,
            padding: '20px 22px',
            display: 'flex',
            alignItems: 'center',
            gap: 16,
          }}>
            <div style={{
              width: 44, height: 44, borderRadius: '50%',
              background: closed
                ? 'rgba(79,157,107,0.15)'
                : 'linear-gradient(135deg,#D9402A 0%, #E97A1F 52%, #F4B731 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: closed ? '#2F6A47' : 'white',
              flexShrink: 0,
            }}>
              {closed ? <IconCheck size={22} /> : <IconCloseDay size={20} />}
            </div>
            <div>
              <b style={{ fontSize: 16, fontWeight: 600 }}>
                {closed ? 'Día cerrado exitosamente' : 'Día operativo activo'}
              </b>
              <div style={{ fontSize: 13, color: '#6A6357', marginTop: 3 }}>
                {closed
                  ? `Cierre registrado a las ${new Date().toLocaleTimeString('es-VE', { hour: '2-digit', minute: '2-digit' })}`
                  : '62% del día completado · Apertura 08:30 → Cierre estimado 17:00'
                }
              </div>
            </div>
          </div>

          {/* Summary stats */}
          <div style={{
            background: '#FBF7EE',
            border: '1px solid rgba(24,20,15,0.09)',
            borderRadius: 16,
            overflow: 'hidden',
          }}>
            <div style={{ padding: '16px 20px 12px', borderBottom: '1px solid rgba(24,20,15,0.05)' }}>
              <b style={{ fontSize: 14, fontWeight: 500 }}>Resumen del día</b>
            </div>
            <div style={{ padding: '8px 0' }}>
              <SummaryRow label="Total conciliado" value={`Bs ${totalAmount.toLocaleString('es-VE', { minimumFractionDigits: 2 })}`} bold />
              <SummaryRow label="Pagos procesados" value={`${totalPayments} de 158`} />
              <SummaryRow label="Pendientes" value="7" warn />
              <SummaryRow label="No encontrados" value="1" bad />
              <SummaryRow label="Duplicados" value="1" />
              <SummaryRow label="Hora de apertura" value="08:30" />
            </div>
          </div>

          {/* By bank */}
          <div style={{
            background: '#FBF7EE',
            border: '1px solid rgba(24,20,15,0.09)',
            borderRadius: 16,
            overflow: 'hidden',
          }}>
            <div style={{ padding: '16px 20px 12px', borderBottom: '1px solid rgba(24,20,15,0.05)' }}>
              <b style={{ fontSize: 14, fontWeight: 500 }}>Desglose por banco</b>
            </div>
            <div style={{ padding: '12px 20px 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
              {bankDistribution.map(bank => (
                <div key={bank.code} style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: 9,
                    background: bank.color,
                    color: bank.textColor || 'white',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: "'Geist Mono', monospace",
                    fontSize: 10, fontWeight: 600,
                    flexShrink: 0,
                  }}>{bank.code === 'OT' ? '+' : bank.code}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 500 }}>{bank.name}</div>
                    <div style={{ fontSize: 11, color: '#6A6357', fontFamily: "'Geist Mono', monospace", marginTop: 1 }}>
                      {bank.count} pagos · {bank.percent}%
                    </div>
                  </div>
                  <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: 12.5, fontWeight: 500, color: '#18140F' }}>
                    Bs {((bank.percent / 100) * totalAmount).toLocaleString('es-VE', { maximumFractionDigits: 0 })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Close action */}
        <div style={{
          background: 'linear-gradient(180deg, rgba(244,183,49,0.06), transparent 60%), #FBF7EE',
          border: '1px solid rgba(24,20,15,0.09)',
          borderRadius: 16,
          padding: '22px 22px 20px',
          boxShadow: '0 1px 0 rgba(24,20,15,0.04), 0 6px 18px -8px rgba(24,20,15,0.08)',
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
        }}>
          <div>
            <b style={{ fontSize: 15, fontWeight: 600 }}>Cerrar día operativo</b>
            <p style={{ fontSize: 12.5, color: '#6A6357', margin: '6px 0 0', lineHeight: 1.6 }}>
              Al cerrar el día se finalizará la conciliación automática y se generará un reporte del período operativo.
            </p>
          </div>

          {!closed ? (
            <>
              <div style={{
                background: 'rgba(224,160,44,0.08)',
                border: '1px solid rgba(224,160,44,0.24)',
                borderRadius: 10,
                padding: '10px 12px',
                display: 'flex',
                gap: 8,
                fontSize: 12,
                color: '#8a601a',
              }}>
                <IconInfo size={14} style={{ flexShrink: 0, marginTop: 1 }} />
                <span>Hay <b>7 pagos</b> pendientes de revisión. Revísalos antes de cerrar.</span>
              </div>

              {confirming && (
                <div style={{
                  background: 'rgba(200,69,58,0.08)',
                  border: '1px solid rgba(200,69,58,0.24)',
                  borderRadius: 10,
                  padding: '10px 12px',
                  fontSize: 12,
                  color: '#8E3128',
                }}>
                  ¿Confirmar cierre del día? Esta acción no se puede deshacer.
                </div>
              )}

              <button
                onClick={handleClose}
                style={{
                  height: 44, padding: '0 18px',
                  borderRadius: 12, fontSize: 14, fontWeight: 600,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  border: 'none',
                  background: confirming
                    ? '#C8453A'
                    : 'linear-gradient(135deg,#D9402A 0%, #E97A1F 52%, #F4B731 100%)',
                  color: 'white', cursor: 'pointer',
                  boxShadow: '0 1px 0 rgba(255,255,255,0.20) inset, 0 8px 20px -8px rgba(217,64,42,0.55)',
                }}>
                <IconCloseDay size={16} />
                {confirming ? 'Sí, cerrar el día' : 'Cerrar día operativo'}
              </button>

              {confirming && (
                <button
                  onClick={() => setConfirming(false)}
                  style={{
                    height: 38, padding: '0 14px',
                    borderRadius: 10, fontSize: 13, fontWeight: 500,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    border: '1px solid rgba(24,20,15,0.09)',
                    background: '#FBF7EE', color: '#18140F', cursor: 'pointer',
                  }}>Cancelar</button>
              )}
            </>
          ) : (
            <div style={{
              background: 'rgba(79,157,107,0.10)',
              border: '1px solid rgba(79,157,107,0.25)',
              borderRadius: 12, padding: '14px 16px',
              display: 'flex', alignItems: 'center', gap: 10,
              fontSize: 13, color: '#2F6A47', fontWeight: 500,
            }}>
              <IconCheck size={16} />
              Día cerrado. Reporte generado.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function SummaryRow({ label, value, bold, warn, bad }) {
  const valueColor = warn ? '#8a601a' : bad ? '#8E3128' : '#18140F'
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '9px 20px',
      borderBottom: '1px solid rgba(24,20,15,0.04)',
      fontSize: 13,
    }}>
      <span style={{ color: '#6A6357' }}>{label}</span>
      <span style={{
        fontFamily: "'Geist Mono', monospace",
        fontWeight: bold ? 600 : 400,
        color: valueColor,
        fontSize: bold ? 14 : 13,
      }}>{value}</span>
    </div>
  )
}
