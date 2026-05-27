import { useState, useCallback } from 'react'
import { useNewPayments } from '../context/NewPaymentsContext'
import { useIsMobile } from '../hooks/useIsMobile'
import ValidationForm from '../components/dashboard/ValidationForm'
import ValidationResult from '../components/dashboard/ValidationResult'
import { IconCheck, IconShieldWarn, IconInfo } from '../components/icons/Icons'
import type { ValidationResult as VResult } from '../types'

const stateCards = [
  {
    type: 'ok',
    icon: <IconCheck size={16} />,
    title: 'Pago validado',
    desc: 'Coincidencia exacta encontrada en el extracto bancario.',
    ref: 'Ref. 013482910374 · Bs 12.480,00',
    bg: 'linear-gradient(180deg, rgba(79,157,107,0.10), rgba(79,157,107,0.04))',
    border: 'rgba(79,157,107,0.25)',
    iconBg: 'rgba(79,157,107,0.18)',
    iconColor: '#2F6A47',
  },
  {
    type: 'conciliado',
    icon: <IconInfo size={16} />,
    title: 'Ya conciliado',
    desc: 'El Pago Móvil ya fue conciliado anteriormente.',
    ref: 'Ref. 010294810263 · Bs 3.250,00',
    bg: 'linear-gradient(180deg, rgba(224,160,44,0.10), rgba(224,160,44,0.03))',
    border: 'rgba(224,160,44,0.28)',
    iconBg: 'rgba(224,160,44,0.16)',
    iconColor: '#8a601a',
  },
  {
    type: 'fail',
    icon: <IconShieldWarn size={16} />,
    title: 'No encontrado',
    desc: 'No se encontró ninguna transacción que coincida con los datos ingresados.',
    ref: 'Ref. 010519384720 · Bs 22.100,00',
    bg: 'linear-gradient(180deg, rgba(200,69,58,0.08), rgba(200,69,58,0.03))',
    border: 'rgba(200,69,58,0.24)',
    iconBg: 'rgba(200,69,58,0.14)',
    iconColor: '#8E3128',
  },
]

export default function ValidarPago() {
  const { increment } = useNewPayments()
  const isMobile = useIsMobile()
  const [result, setResult] = useState<VResult | null>(null)

  const handleSuccess = useCallback((res: VResult) => {
    setResult(res)
    increment()
  }, [increment])

  return (
    <div style={{ padding: isMobile ? '20px 16px 56px' : '32px 32px 56px', display: 'flex', flexDirection: 'column', gap: 28 }}>
      {/* Page heading */}
      <div>
        <h2 style={{ margin: 0, fontSize: isMobile ? 24 : 30, fontWeight: 500, letterSpacing: '-0.025em' }}>
          Validar <b style={{ fontWeight: 600 }}>Pago Móvil</b>
        </h2>
        <div style={{ marginTop: 8, fontSize: 13.5, color: '#6A6357' }}>
          Conciliación en tiempo real contra extracto bancario
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '1fr 400px',
        gap: 28,
        alignItems: 'start',
      }}>
        {/* Form */}
        <ValidationForm onSuccess={handleSuccess} />

        {/* States panel */}
        <div style={{
          background: '#FBF7EE',
          border: '1px solid rgba(24,20,15,0.09)',
          borderRadius: 22,
          padding: 22,
          boxShadow: '0 1px 0 rgba(24,20,15,0.04), 0 6px 18px -8px rgba(24,20,15,0.10)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <b style={{ fontSize: 15, fontWeight: 600, letterSpacing: '-0.005em' }}>Estados de validación</b>
            <span style={{ fontFamily: "'Geist Mono', monospace", fontSize: 10.5, color: '#6A6357' }}>Referencia</span>
          </div>

          {stateCards.map(card => (
            <div key={card.type} style={{
              border: `1px solid ${card.border}`,
              borderRadius: 14, padding: '12px 12px 12px 14px',
              display: 'flex', alignItems: 'center', gap: 12,
              marginBottom: 10, background: card.bg,
            }}>
              <div style={{
                width: 30, height: 30, borderRadius: 8, flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: card.iconBg, color: card.iconColor,
              }}>
                {card.icon}
              </div>
              <div style={{ flex: 1, lineHeight: 1.3, minWidth: 0 }}>
                <b style={{ fontSize: 13, fontWeight: 600, display: 'block' }}>{card.title}</b>
                <span style={{ fontSize: 11.5, color: '#6A6357' }}>{card.desc}</span>
              </div>
              {!isMobile && (
                <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: 11, color: '#2A241E', flexShrink: 0, textAlign: 'right', maxWidth: 130 }}>
                  {card.ref}
                </div>
              )}
            </div>
          ))}

          <div style={{
            marginTop: 14, padding: '12px 14px',
            background: 'rgba(24,20,15,0.03)', borderRadius: 10,
            fontSize: 12, color: '#6A6357', lineHeight: 1.5,
          }}>
            <b style={{ color: '#18140F', fontWeight: 500 }}>Tiempo promedio de validación:</b> 2.6 segundos.
            Los resultados se comparan contra el extracto bancario en tiempo real.
          </div>
        </div>
      </div>

      {/* Result overlay */}
      {result && (
        <div style={{
          position: 'fixed',
          bottom: isMobile ? 16 : 32,
          right: isMobile ? 16 : 32,
          left: isMobile ? 16 : 'auto',
          zIndex: 100,
        }}>
          <ValidationResult result={result} bankCode={result.bankCode} onClose={() => setResult(null)} />
        </div>
      )}
    </div>
  )
}