import type { ValidationResult } from '../../types'
import { useValidation } from '../../hooks/useValidation'
import { useIsMobile } from '../../hooks/useIsMobile'
import { getBankConfigs } from '../../config/banks'
import {
  IconCheckShield, IconArrowDown, IconCheck,
  IconCal, IconPhone, IconId, IconInfo, IconArrowRight
} from '../icons/Icons'

interface Props {
  onSuccess?: (result: ValidationResult) => void
}

const labelStyle: React.CSSProperties = {
  fontSize: 11,
  color: '#6A6357',
  fontFamily: "'Geist Mono', monospace",
  letterSpacing: '0.04em',
  textTransform: 'uppercase',
}

const inputBase: React.CSSProperties = {
  height: 38, borderRadius: 9,
  border: '1px solid rgba(24,20,15,0.09)',
  background: '#F2ECDD',
  padding: '0 12px', fontSize: 13, color: '#18140F',
  display: 'flex', alignItems: 'center', gap: 8, position: 'relative',
}

const inputFilled: React.CSSProperties = { ...inputBase, background: '#fff' }

const inputFocus: React.CSSProperties = {
  ...inputFilled,
  borderColor: 'rgba(217,64,42,0.45)',
  boxShadow: '0 0 0 3px rgba(217,64,42,0.10)',
}

const errorText: React.CSSProperties = {
  fontSize: 10.5, color: '#C8453A',
  fontFamily: "'Geist Mono', monospace",
}

export default function ValidationForm({ onSuccess }: Props) {
  const { form, setField, errors, submitting, submit, reset } = useValidation(onSuccess)
  const isMobile = useIsMobile()
  const banks = getBankConfigs().filter(b => b.active)
  const selectedBank = banks.find(b => b.code === form.bankCode) ?? banks[0]

  return (
    <div style={{
      background: 'linear-gradient(180deg, rgba(244,183,49,0.08), transparent 80px), #FBF7EE',
      border: '1px solid rgba(24,20,15,0.09)',
      borderRadius: 16,
      boxShadow: '0 1px 0 rgba(24,20,15,0.04), 0 1px 2px rgba(24,20,15,0.04)',
      overflow: 'hidden',
    }}>

      {/* Header */}
      <div style={{
        padding: '16px 20px 14px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        borderBottom: '1px solid rgba(24,20,15,0.05)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 28, height: 28, borderRadius: 8,
            background: 'linear-gradient(135deg,#D9402A 0%, #E97A1F 52%, #F4B731 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white', boxShadow: '0 4px 10px -3px rgba(217,64,42,0.5)',
          }}>
            <IconCheckShield size={14} />
          </div>
          <div>
            <b style={{ fontSize: 14, fontWeight: 600, letterSpacing: '-0.005em' }}>Validar Pago Móvil</b>
            <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: 10.5, color: '#6A6357' }}>Conciliación en tiempo real · API BDV</div>
          </div>
        </div>
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: 7,
          padding: '3px 8px', borderRadius: 999, fontSize: 10.5,
          border: '1px solid rgba(24,20,15,0.09)',
          background: 'rgba(255,255,255,0.55)', color: '#2A241E',
        }}>
          <span style={{
            width: 6, height: 6, borderRadius: '50%', background: '#4F9D6B',
            boxShadow: '0 0 0 2px rgba(79,157,107,0.14)', display: 'inline-block',
          }}/>
          En vivo
        </span>
      </div>

      {/* Fields */}
      <div style={{ padding: '16px 20px 4px', display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '12px 14px' }}>

        {/* Bank selector */}
        <div style={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', gap: 5 }}>
          <label style={labelStyle}>Banco emisor</label>
          <div style={{ ...inputFilled, cursor: 'pointer' }}>
            <span style={{
              width: 22, height: 22, borderRadius: 6, flexShrink: 0,
              color: selectedBank.textColor ?? 'white', background: selectedBank.color,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: "'Geist Mono', monospace", fontSize: 9, fontWeight: 600,
            }}>{selectedBank.shortCode}</span>
            <span style={{ fontSize: 13, fontWeight: 500, flex: 1 }}>{selectedBank.name}</span>
            <span style={{ color: '#6A6357', fontFamily: "'Geist Mono', monospace", fontSize: 11 }}>{selectedBank.code}</span>
            <select
              value={form.bankCode}
              onChange={e => setField('bankCode', e.target.value)}
              style={{ position: 'absolute', opacity: 0, inset: 0, cursor: 'pointer', width: '100%', height: '100%' }}
            >
              {banks.map(b => <option key={b.code} value={b.code}>{b.name} ({b.code})</option>)}
            </select>
            <IconArrowDown size={16} />
          </div>
        </div>

        {/* Reference */}
        <div style={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', gap: 5 }}>
          <label style={labelStyle}>Número de referencia</label>
          <div style={form.ref ? inputFocus : inputBase}>
            <span style={{ fontFamily: "'Geist Mono', monospace", color: '#6A6357', fontSize: 12, flexShrink: 0 }}>Ref.</span>
            <input
              type="text"
              value={form.ref}
              onChange={e => setField('ref', e.target.value.replace(/\D/g, '').slice(0, 8))}
              placeholder="Últimos 4-8 dígitos"
              maxLength={8}
              style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontFamily: "'Geist Mono', monospace", fontSize: 13, color: '#18140F' }}
            />
            {form.ref && <IconCheck size={16} />}
          </div>
          <span style={{ fontSize: 10.5, color: '#9A9285', fontFamily: "'Geist Mono', monospace" }}>
            Puedes ingresar solo los últimos 4 dígitos
          </span>
          {errors.ref && <span style={errorText}>{errors.ref}</span>}
        </div>

        {/* Amount */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          <label style={labelStyle}>Monto (Bs)</label>
          <div style={form.amount ? inputFilled : inputBase}>
            <span style={{ fontFamily: "'Geist Mono', monospace", color: '#6A6357', fontSize: 12, flexShrink: 0 }}>Bs</span>
            <input
              type="text"
              value={form.amount}
              onChange={e => setField('amount', e.target.value)}
              placeholder="0.00"
              style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontFamily: "'Geist Mono', monospace", fontSize: 13, color: '#18140F' }}
            />
          </div>
          {errors.amount && <span style={errorText}>{errors.amount}</span>}
        </div>

        {/* Date */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          <label style={labelStyle}>Fecha del pago</label>
          <div style={form.date ? inputFilled : inputBase}>
            <input
              type="date"
              value={form.date}
              onChange={e => setField('date', e.target.value)}
              style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontSize: 13, color: form.date ? '#18140F' : '#9A9285', fontFamily: "'Geist Mono', monospace" }}
            />
            <IconCal size={14} />
          </div>
          {errors.date && <span style={errorText}>{errors.date}</span>}
        </div>

        {/* Phone — opcional */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          <label style={labelStyle}>
            Teléfono pagador
            <span style={{ marginLeft: 6, fontSize: 9.5, color: '#9A9285', fontWeight: 400, letterSpacing: '0.02em', textTransform: 'none' }}>opcional</span>
          </label>
          <div style={form.phone ? inputFilled : inputBase}>
            <span style={{ fontFamily: "'Geist Mono', monospace", color: '#6A6357', fontSize: 12, flexShrink: 0 }}>+58</span>
            <input
              type="tel"
              value={form.phone}
              onChange={e => setField('phone', e.target.value)}
              placeholder="Opcional"
              style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontFamily: "'Geist Mono', monospace", fontSize: 13, color: '#18140F' }}
            />
            <IconPhone size={14} />
          </div>
          {errors.phone && <span style={errorText}>{errors.phone}</span>}
        </div>

        {/* Cedula */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          <label style={labelStyle}>Cédula / RIF</label>
          <div style={form.cedula ? inputFilled : inputBase}>
            <span style={{ fontFamily: "'Geist Mono', monospace", color: '#6A6357', fontSize: 12, flexShrink: 0 }}>V/J</span>
            <input
              type="text"
              value={form.cedula}
              onChange={e => setField('cedula', e.target.value)}
              placeholder="27037606"
              style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontFamily: "'Geist Mono', monospace", fontSize: 13, color: '#18140F' }}
            />
            <IconId size={14} />
          </div>
          {errors.cedula && <span style={errorText}>{errors.cedula}</span>}
        </div>

      </div>

      {/* Footer */}
      <div style={{ padding: '14px 20px 18px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ fontSize: 11.5, color: '#6A6357', display: 'flex', alignItems: 'center', gap: 8, flex: 1 }}>
          <IconInfo size={14} />
          Datos comparados contra el extracto BDV en vivo.
        </div>
        <button
          onClick={reset}
          style={{
            height: 38, padding: '0 14px', borderRadius: 10, fontSize: 13, fontWeight: 500,
            display: 'inline-flex', alignItems: 'center', gap: 8,
            border: '1px solid rgba(24,20,15,0.09)',
            background: '#FBF7EE', color: '#18140F', cursor: 'pointer',
          }}>Limpiar</button>
        <button
          onClick={submit}
          disabled={submitting}
          style={{
            height: 38, padding: '0 16px', borderRadius: 10, fontSize: 13, fontWeight: 500,
            display: 'inline-flex', alignItems: 'center', gap: 8,
            border: 'none',
            background: submitting
              ? 'rgba(217,64,42,0.7)'
              : 'linear-gradient(135deg,#D9402A 0%, #E97A1F 52%, #F4B731 100%)',
            color: 'white', cursor: submitting ? 'not-allowed' : 'pointer',
            boxShadow: '0 1px 0 rgba(255,255,255,0.25) inset, 0 8px 18px -8px rgba(217,64,42,0.55)',
            opacity: submitting ? 0.8 : 1,
          }}>
          {submitting ? 'Validando…' : <><span>Validar pago</span><IconArrowRight size={16}/></>}
        </button>
      </div>

      {errors.submit && (
        <div style={{ padding: '0 20px 14px', fontSize: 12, color: '#C8453A', fontFamily: "'Geist Mono', monospace" }}>
          ⚠ {errors.submit}
        </div>
      )}
    </div>
  )
}