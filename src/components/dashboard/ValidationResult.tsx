import type { ValidationResult as VResult } from '../../types'
import { getBankByCode, getBankConfigs } from '../../config/banks'
import { IconCheck, IconX, IconShieldWarn } from '../icons/Icons'

interface Props {
  result: VResult
  bankCode: string
  onClose: () => void
}

const STATUS_CONFIG = {
  validado: {
    icon: <IconCheck size={22} />,
    iconBg: 'linear-gradient(135deg, #2F6A47 0%, #4F9D6B 100%)',
    iconColor: 'white',
    title: 'Pago validado',
    titleColor: '#1a4a30',
    headerBg: 'linear-gradient(180deg, rgba(79,157,107,0.10), transparent 70%), #FBF7EE',
  },
  ya_conciliado: {
    icon: <IconShieldWarn size={18} />,
    iconBg: 'rgba(224,160,44,0.20)',
    iconColor: '#8a601a',
    title: 'Ya conciliado anteriormente',
    titleColor: '#8a601a',
    headerBg: 'linear-gradient(180deg, rgba(224,160,44,0.10), transparent 70%), #FBF7EE',
  },
  monto_errado: {
    icon: <IconShieldWarn size={18} />,
    iconBg: 'rgba(200,69,58,0.14)',
    iconColor: '#8E3128',
    title: 'Monto no coincide',
    titleColor: '#8E3128',
    headerBg: 'linear-gradient(180deg, rgba(200,69,58,0.08), transparent 70%), #FBF7EE',
  },
  no_encontrado: {
    icon: <IconX size={18} />,
    iconBg: 'rgba(200,69,58,0.14)',
    iconColor: '#8E3128',
    title: 'Pago no encontrado',
    titleColor: '#8E3128',
    headerBg: 'linear-gradient(180deg, rgba(200,69,58,0.08), transparent 70%), #FBF7EE',
  },
  api_key_invalida: {
    icon: <IconX size={18} />,
    iconBg: 'rgba(200,69,58,0.14)',
    iconColor: '#8E3128',
    title: 'Error de autenticación',
    titleColor: '#8E3128',
    headerBg: 'linear-gradient(180deg, rgba(200,69,58,0.08), transparent 70%), #FBF7EE',
  },
  error: {
    icon: <IconX size={18} />,
    iconBg: 'rgba(106,99,87,0.12)',
    iconColor: '#6A6357',
    title: 'Error de validación',
    titleColor: '#6A6357',
    headerBg: '#FBF7EE',
  },
} satisfies Record<VResult['status'], unknown>

const kvLabel: React.CSSProperties = {
  display: 'block',
  fontFamily: "'Geist Mono', monospace",
  fontSize: 9.5, letterSpacing: '0.10em',
  textTransform: 'uppercase', color: '#6A6357', marginBottom: 3,
}

export default function ValidationResult({ result, bankCode, onClose }: Props) {
  const cfg = STATUS_CONFIG[result.status]
  const timeSeconds = (result.timeMs / 1000).toFixed(1)

  const allBanks = getBankConfigs()
  const bank = getBankByCode(bankCode) ?? allBanks.find(b => b.shortCode === bankCode)

  const handleCopy = () => {
    const text = [
      `Estado: ${result.status}`,
      `Referencia: ${result.ref}`,
      `Monto: Bs ${result.amount}`,
      `Banco: ${bank?.name ?? bankCode}`,
      `Mensaje: ${result.bdvMessage}`,
      `Tiempo: ${timeSeconds}s`,
    ].join('\n')
    navigator.clipboard?.writeText(text).catch(() => {})
  }

  const isSuccess = result.status === 'validado'

  return (
    <div style={{
      width: 348, background: '#FBF7EE', borderRadius: 18,
      boxShadow: '0 1px 0 rgba(24,20,15,0.04), 0 18px 40px -16px rgba(24,20,15,0.18), 0 60px 100px -40px rgba(24,20,15,0.20)',
      border: '1px solid rgba(24,20,15,0.09)', overflow: 'hidden',
    }}>

      {/* Header */}
      <div style={{
        padding: '18px 20px 14px',
        background: cfg.headerBg,
        display: 'flex', alignItems: 'center', gap: 12,
        borderBottom: '1px solid rgba(24,20,15,0.05)',
      }}>
        <div style={{
          width: 38, height: 38, borderRadius: '50%', flexShrink: 0,
          background: cfg.iconBg,
          color: cfg.iconColor,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: isSuccess
            ? '0 6px 18px -6px rgba(47,106,71,0.55), inset 0 0 0 4px rgba(255,255,255,0.18)'
            : undefined,
        }}>
          {cfg.icon}
        </div>
        <div style={{ flex: 1 }}>
          <b style={{ fontSize: 15, fontWeight: 600, color: cfg.titleColor }}>{cfg.title}</b>
          <span style={{ fontSize: 12, color: '#6A6357', display: 'block', marginTop: 2 }}>
            {bank?.name ?? bankCode} · {timeSeconds}&nbsp;s
          </span>
        </div>
        <button onClick={onClose} style={{
          width: 28, height: 28, borderRadius: 7, flexShrink: 0,
          border: '1px solid rgba(24,20,15,0.09)', background: 'rgba(255,255,255,0.6)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', color: '#6A6357',
        }}>
          <IconX size={14} />
        </button>
      </div>

      {/* Body */}
      <div style={{ padding: '14px 20px 8px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 14px' }}>

        <div style={{ gridColumn: '1 / -1' }}>
          <label style={kvLabel}>Referencia</label>
          <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: 12.5, color: '#18140F' }}>{result.ref}</div>
        </div>

        <div>
          <label style={kvLabel}>Monto</label>
          <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: 12.5, color: '#18140F' }}>Bs {result.amount}</div>
        </div>

        <div>
          <label style={kvLabel}>Banco</label>
          <div style={{ fontSize: 13, display: 'flex', alignItems: 'center', gap: 7 }}>
            {bank && (
              <span style={{
                width: 18, height: 18, borderRadius: 5, flexShrink: 0,
                background: bank.color, color: bank.textColor ?? 'white',
                fontFamily: "'Geist Mono', monospace", fontSize: 8.5, fontWeight: 600,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>{bank.shortCode}</span>
            )}
            {bank?.name ?? bankCode}
          </div>
        </div>

        <div style={{ gridColumn: '1 / -1' }}>
          <label style={kvLabel}>Respuesta del banco</label>
          <div style={{
            fontSize: 12, color: '#2A241E', lineHeight: 1.5,
            fontFamily: "'Geist Mono', monospace",
            background: 'rgba(24,20,15,0.03)', borderRadius: 8,
            padding: '8px 10px', border: '1px solid rgba(24,20,15,0.06)',
          }}>
            {result.bdvMessage}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{
        padding: '12px 20px 16px', display: 'flex', alignItems: 'center', gap: 10,
        borderTop: '1px solid rgba(24,20,15,0.05)',
      }}>
        <span style={{ flex: 1, fontFamily: "'Geist Mono', monospace", fontSize: 10.5, color: '#6A6357' }}>
          {timeSeconds}s · {new Date().toLocaleTimeString('es-VE', { hour: '2-digit', minute: '2-digit' })}
        </span>
        <button onClick={handleCopy} style={{
          height: 32, padding: '0 10px', borderRadius: 8, fontSize: 12, fontWeight: 500,
          display: 'inline-flex', alignItems: 'center', gap: 6,
          border: '1px solid rgba(24,20,15,0.09)',
          background: '#FBF7EE', color: '#18140F', cursor: 'pointer',
        }}>Copiar</button>
        <button onClick={onClose} style={{
          height: 32, padding: '0 12px', borderRadius: 8, fontSize: 12, fontWeight: 500,
          display: 'inline-flex', alignItems: 'center', gap: 6, border: 'none',
          background: isSuccess ? '#2F6A47' : '#1C1814',
          color: 'white', cursor: 'pointer',
          boxShadow: '0 1px 0 rgba(255,255,255,0.25) inset',
        }}>Listo</button>
      </div>
    </div>
  )
}