import { useState } from 'react'
import { getBankConfigs, saveTelefonoDestino } from '../config/banks'
import type { BankConfig } from '../types'
import { IconBank, IconCheck, IconInfo } from '../components/icons/Icons'

export default function Configuracion() {
  const [banks, setBanks] = useState<BankConfig[]>(getBankConfigs)
  const [editing, setEditing] = useState<Record<string, string>>({})
  const [saved, setSaved] = useState<Record<string, boolean>>({})

  const handleSave = (code: string) => {
    const phone = editing[code]
    if (!phone) return
    saveTelefonoDestino(code, phone)
    setSaved(prev => ({ ...prev, [code]: true }))
    setBanks(getBankConfigs())
    setTimeout(() => setSaved(prev => ({ ...prev, [code]: false })), 2000)
  }

  const inputStyle: React.CSSProperties = {
    height: 36, borderRadius: 8, fontSize: 13,
    border: '1px solid rgba(24,20,15,0.09)',
    background: '#fff', padding: '0 10px',
    fontFamily: "'Geist Mono', monospace", color: '#18140F',
    outline: 'none', flex: 1,
  }

  const apiKey = (import.meta.env.VITE_BDV_API_KEY as string) ?? ''

  return (
    <div style={{ padding: '32px 32px 56px', display: 'flex', flexDirection: 'column', gap: 28, maxWidth: 860 }}>
      <div>
        <h2 style={{ margin: 0, fontSize: 28, fontWeight: 500, letterSpacing: '-0.025em' }}>Configuración</h2>
        <p style={{ margin: '8px 0 0', fontSize: 13.5, color: '#6A6357' }}>
          Teléfonos receptores por banco y parámetros de la API de conciliación.
        </p>
      </div>

      {/* Workspace */}
      <div style={{ background: '#FBF7EE', border: '1px solid rgba(24,20,15,0.09)', borderRadius: 16, padding: '20px 22px' }}>
        <div style={{ fontSize: 11, fontFamily: "'Geist Mono', monospace", letterSpacing: '0.1em', textTransform: 'uppercase' as const, color: '#6A6357', marginBottom: 12 }}>
          Empresa activa
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: 'linear-gradient(135deg,#D9402A,#E97A1F,#F4B731)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg width="22" height="22" viewBox="0 0 22 22">
              <circle cx="11" cy="11" r="9" fill="rgba(255,255,255,0.2)"/>
              <path d="M11 4.5v13M4.5 11h13" stroke="#FBF7EE" strokeWidth="1.5" strokeLinecap="round"/>
              <circle cx="11" cy="11" r="2.4" fill="#FBF7EE"/>
            </svg>
          </div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 600 }}>FerreSolar C.A.</div>
            <div style={{ fontSize: 12, color: '#6A6357', fontFamily: "'Geist Mono', monospace", marginTop: 2 }}>RIF J-31513818-2 · Sede Pto. la Cruz</div>
          </div>
          <span style={{ marginLeft: 'auto', fontSize: 10, fontFamily: "'Geist Mono', monospace", color: '#2F6A47', background: 'rgba(79,157,107,0.12)', padding: '3px 10px', borderRadius: 999, border: '1px solid rgba(79,157,107,0.22)', letterSpacing: '0.08em', textTransform: 'uppercase' as const }}>Activo</span>
        </div>
      </div>

      {/* API Config */}
      <div style={{ background: '#FBF7EE', border: '1px solid rgba(24,20,15,0.09)', borderRadius: 16, padding: '20px 22px' }}>
        <div style={{ fontSize: 11, fontFamily: "'Geist Mono', monospace", letterSpacing: '0.1em', textTransform: 'uppercase' as const, color: '#6A6357', marginBottom: 14 }}>
          API BDV — Ambiente Calidad
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <span style={{ fontSize: 11, color: '#6A6357', fontFamily: "'Geist Mono', monospace", flexShrink: 0 }}>X-API-Key</span>
          <div style={{ flex: 1, height: 36, borderRadius: 8, border: '1px solid rgba(24,20,15,0.09)', background: 'rgba(24,20,15,0.02)', padding: '0 12px', display: 'flex', alignItems: 'center', fontFamily: "'Geist Mono', monospace", fontSize: 12, color: '#6A6357', letterSpacing: '0.04em' }}>
            {'•'.repeat(16)} {apiKey.slice(-6)}
          </div>
        </div>
        <div style={{ padding: '10px 12px', borderRadius: 10, background: 'rgba(244,183,49,0.06)', border: '1px solid rgba(244,183,49,0.18)', fontSize: 12, color: '#8a601a', lineHeight: 1.6 }}>
          <b>Endpoint:</b>{' '}
          <span style={{ fontFamily: "'Geist Mono', monospace", fontSize: 11 }}>
            https://bdvconciliacionqa.banvenez.com:444/getMovement/v2
          </span>
          <br/>
          Proxied en desarrollo via <code style={{ fontSize: 11 }}>/api/bdv</code> (Vite) · Configura en <code style={{ fontSize: 11 }}>.env</code>
        </div>
      </div>

      {/* Bank phones */}
      <div style={{ background: '#FBF7EE', border: '1px solid rgba(24,20,15,0.09)', borderRadius: 16, overflow: 'hidden' }}>
        <div style={{ padding: '16px 22px 14px', borderBottom: '1px solid rgba(24,20,15,0.05)', display: 'flex', alignItems: 'center', gap: 10 }}>
          <IconBank size={15} />
          <div>
            <b style={{ fontSize: 14, fontWeight: 600 }}>Teléfonos receptores por banco</b>
            <div style={{ fontSize: 12, color: '#6A6357', marginTop: 2 }}>
              Número de Pago Móvil de FerreSolar para cada entidad · campo <code style={{ fontSize: 11 }}>telefonoDestino</code> de la API
            </div>
          </div>
        </div>

        {banks.map((bank, i) => (
          <div key={bank.code} style={{ padding: '14px 22px', borderBottom: i < banks.length - 1 ? '1px solid rgba(24,20,15,0.05)' : undefined, display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, flexShrink: 0, background: bank.color, color: bank.textColor ?? 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Geist Mono', monospace", fontSize: 11, fontWeight: 600, opacity: bank.active ? 1 : 0.45 }}>
              {bank.shortCode}
            </div>
            <div style={{ minWidth: 160, flexShrink: 0 }}>
              <div style={{ fontSize: 13.5, fontWeight: 500, color: bank.active ? '#18140F' : '#9A9285' }}>{bank.name}</div>
              <div style={{ fontSize: 11, fontFamily: "'Geist Mono', monospace", color: '#9A9285', marginTop: 1 }}>{bank.code}</div>
            </div>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontFamily: "'Geist Mono', monospace", fontSize: 12, color: '#6A6357', flexShrink: 0 }}>+58</span>
              <input
                type="tel"
                placeholder={bank.active ? '04XX XXX XXXX' : 'Banco inactivo'}
                disabled={!bank.active}
                defaultValue={bank.telefonoDestino}
                onChange={e => setEditing(prev => ({ ...prev, [bank.code]: e.target.value }))}
                style={{ ...inputStyle, opacity: bank.active ? 1 : 0.4, background: bank.active ? '#fff' : 'rgba(24,20,15,0.02)' }}
              />
              <button
                disabled={!bank.active || !editing[bank.code]}
                onClick={() => handleSave(bank.code)}
                style={{
                  height: 36, padding: '0 14px', borderRadius: 8, fontSize: 12.5, fontWeight: 500, flexShrink: 0,
                  border: 'none', cursor: (bank.active && editing[bank.code]) ? 'pointer' : 'not-allowed',
                  background: saved[bank.code]
                    ? 'rgba(79,157,107,0.15)'
                    : (bank.active && editing[bank.code])
                      ? 'linear-gradient(135deg,#D9402A 0%, #E97A1F 52%, #F4B731 100%)'
                      : 'rgba(24,20,15,0.05)',
                  color: saved[bank.code] ? '#2F6A47' : (bank.active && editing[bank.code]) ? 'white' : '#9A9285',
                  display: 'flex', alignItems: 'center', gap: 6, transition: 'all 0.15s',
                }}>
                {saved[bank.code] ? <><IconCheck size={13} /> Guardado</> : 'Guardar'}
              </button>
            </div>
            {bank.reqCedDefault && (
              <span style={{ fontSize: 9.5, fontFamily: "'Geist Mono', monospace", color: '#8a601a', background: 'rgba(224,160,44,0.14)', padding: '2px 8px', borderRadius: 999, border: '1px solid rgba(224,160,44,0.22)', letterSpacing: '0.06em', textTransform: 'uppercase' as const, flexShrink: 0 }}>
                reqCed
              </span>
            )}
          </div>
        ))}
      </div>

      <div style={{ fontSize: 12, color: '#9A9285', lineHeight: 1.6, display: 'flex', gap: 8, alignItems: 'flex-start' }}>
        <IconInfo size={14} />
        <span>
          Los teléfonos se persisten en <code>localStorage</code>. Para configuración permanente usa <code>VITE_TELEFONO_DESTINO_XXXX</code> en el archivo <code>.env</code>.
        </span>
      </div>
    </div>
  )
}
