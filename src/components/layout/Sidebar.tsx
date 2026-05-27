import { NavLink } from 'react-router-dom'
import {
  IconHome, IconCheckShield, IconList,
  IconChart, IconCog, IconSwap, IconX
} from '../icons/Icons'
import { useNewPayments } from '../../context/NewPaymentsContext'

interface SidebarProps {
  collapsed?: boolean
  onClose?: () => void
}

export default function Sidebar({ collapsed = false, onClose }: SidebarProps) {
  const { count: newCount } = useNewPayments()

  return (
    <aside style={{
      width: collapsed ? 64 : 256,
      minWidth: collapsed ? 64 : 256,
      height: '100vh',
      position: 'sticky',
      top: 0,
      background: 'linear-gradient(180deg, #1C1814 0%, #15120F 100%)',
      color: '#E9E3D5',
      padding: collapsed ? '22px 8px 18px' : '22px 16px 18px',
      display: 'flex',
      flexDirection: 'column',
      gap: 18,
      overflowY: 'auto',
      overflowX: 'hidden',
      flexShrink: 0,
    }}>
      <div style={{
        position: 'absolute', right: 0, top: 0, bottom: 0, width: 1,
        background: 'linear-gradient(180deg, transparent, rgba(244,183,49,0.18), transparent)',
        pointerEvents: 'none',
      }} />

      {/* Brand */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '4px 10px 2px' }}>
        <div style={{
          width: 28, height: 28, borderRadius: 8,
          background: 'linear-gradient(135deg,#D9402A 0%, #E97A1F 52%, #F4B731 100%)',
          boxShadow: '0 0 0 1px rgba(255,255,255,0.06), 0 4px 10px -2px rgba(217,64,42,0.45)',
          flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M3 3h5v5" stroke="rgba(255,255,255,0.85)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
            <path d="M13 13H8V8" stroke="rgba(24,20,15,0.55)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
          </svg>
        </div>
        {!collapsed && (
          <div style={{ fontSize: 17, fontWeight: 600, letterSpacing: '0.02em', color: '#F4EEDF', flex: 1 }}>
            YaCayó<span style={{ color: '#8a8378', fontWeight: 400, marginLeft: 6, fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase' }}>VE</span>
          </div>
        )}
        {onClose && (
          <button onClick={onClose} style={{
            background: 'transparent', border: 'none', cursor: 'pointer',
            color: '#6c655a', padding: 4, display: 'flex',
          }}>
            <IconX size={16} />
          </button>
        )}
      </div>

      {/* Workspace */}
      <div style={{
        marginTop: 4, borderRadius: 14, padding: '14px 14px 13px',
        background: 'linear-gradient(180deg, rgba(244,183,49,0.10), rgba(217,64,42,0.04) 60%, transparent 100%), #25201B',
        border: '1px solid rgba(244,183,49,0.16)',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04)',
        display: 'flex', alignItems: 'center', gap: 11, cursor: 'pointer',
      }}>
        <div style={{
          width: 36, height: 36, borderRadius: 10, background: '#FBF7EE',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 1px 0 rgba(0,0,0,0.25), inset 0 0 0 1px rgba(0,0,0,0.06)',
          flexShrink: 0, overflow: 'hidden',
        }}>
          <img src="/src/assets/ferre-solar.jpeg" alt="FerreSolar"
            style={{ width: 32, height: 32, objectFit: 'contain' }}
            onError={e => {
              e.currentTarget.style.display = 'none'
              e.currentTarget.parentElement!.innerHTML = `<svg width="22" height="22" viewBox="0 0 22 22"><defs><linearGradient id="fsg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#D9402A"/><stop offset="0.55" stopColor="#E97A1F"/><stop offset="1" stopColor="#F4B731"/></linearGradient></defs><circle cx="11" cy="11" r="9" fill="url(#fsg)"/><path d="M11 4.5v13M4.5 11h13M6.4 6.4l9.2 9.2M15.6 6.4l-9.2 9.2" stroke="#FBF7EE" strokeWidth="1.2" strokeLinecap="round" opacity="0.95"/><circle cx="11" cy="11" r="2.4" fill="#FBF7EE"/></svg>`
            }}
          />
        </div>
        {!collapsed && (
          <>
            <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                <b style={{ fontSize: 13.5, fontWeight: 600, color: '#F4EEDF', letterSpacing: '0.005em', flexShrink: 1, minWidth: 0 }}>FerreSolar&nbsp;C.A.</b>
                <span style={{
                  fontFamily: "'Geist Mono', monospace", fontSize: 9, letterSpacing: '0.08em',
                  textTransform: 'uppercase', color: '#F4B731', background: 'rgba(244,183,49,0.12)',
                  padding: '2px 6px', borderRadius: 4, border: '1px solid rgba(244,183,49,0.18)',
                  flexShrink: 0, lineHeight: 1.4,
                }}>Activo</span>
              </div>
              <div style={{ fontSize: 11, color: '#9C9385', display: 'flex', alignItems: 'center', gap: 5 }}>
                <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#4F9D6B', display: 'inline-block', flexShrink: 0 }}/>
                RIF J-31513818-2 · Pto. la Cruz
              </div>
            </div>
            <button style={{ background: 'transparent', border: 0, padding: 4, cursor: 'pointer', color: '#6c655a' }}>
              <IconSwap size={14} />
            </button>
          </>
        )}
      </div>

      {/* Nav */}
      <NavSection label="Operación" collapsed={collapsed}>
        <NavItem to="/dashboard" icon={<IconHome size={16}/>} label="Inicio" collapsed={collapsed} onNavigate={onClose} />
        <NavItem to="/validar" icon={<IconCheckShield size={16}/>} label="Validar Pago" kbd="V" collapsed={collapsed} onNavigate={onClose} />
        <NavItem to="/pagos" icon={<IconList size={16}/>} label="Pagos Recientes" count={newCount > 0 ? newCount : undefined} collapsed={collapsed} onNavigate={onClose} />
      </NavSection>

      <NavSection label="Análisis" collapsed={collapsed}>
        <NavItem to="/reportes" icon={<IconChart size={16}/>} label="Reportes" collapsed={collapsed} onNavigate={onClose} />
        <NavItem to="/configuracion" icon={<IconCog size={16}/>} label="Configuración" collapsed={collapsed} onNavigate={onClose} />
      </NavSection>
    </aside>
  )
}

function NavSection({ label, children, collapsed }: { label: string; children: React.ReactNode; collapsed: boolean }) {
  return (
    <div style={{ marginTop: 6, display: 'flex', flexDirection: 'column', gap: 1 }}>
      {!collapsed && (
        <div style={{
          fontFamily: "'Geist Mono', monospace", fontSize: 10, letterSpacing: '0.14em',
          textTransform: 'uppercase', color: '#6c655a', padding: '4px 12px 8px',
        }}>{label}</div>
      )}
      {children}
    </div>
  )
}

function NavItem({ to, icon, label, kbd, count, collapsed, onNavigate }: {
  to: string
  icon: React.ReactNode
  label: string
  kbd?: string
  count?: number
  collapsed: boolean
  onNavigate?: () => void
}) {
  return (
    <NavLink
      to={to}
      onClick={onNavigate}
      style={({ isActive }) => ({
        display: 'flex', alignItems: 'center', gap: 11,
        padding: collapsed ? '8px' : '8px 12px', borderRadius: 9,
        color: isActive ? '#F4EEDF' : '#B6AE9F', fontSize: 13.5,
        cursor: 'pointer', textDecoration: 'none', position: 'relative',
        background: isActive ? 'rgba(255,255,255,0.05)' : 'transparent',
        boxShadow: isActive ? 'inset 0 0 0 1px rgba(255,255,255,0.05)' : 'none',
        justifyContent: collapsed ? 'center' : 'flex-start',
        transition: 'color 0.15s, background 0.15s',
      })}
    >
      {({ isActive }) => (
        <>
          {isActive && (
            <div style={{
              position: 'absolute', left: -16, top: 7, bottom: 7, width: 2,
              background: 'linear-gradient(135deg,#D9402A 0%, #E97A1F 52%, #F4B731 100%)',
              borderRadius: '0 2px 2px 0',
            }}/>
          )}
          <span style={{ width: 16, height: 16, flexShrink: 0, opacity: 0.85, display: 'flex' }}>{icon}</span>
          {!collapsed && (
            <>
              <span style={{ flex: 1 }}>{label}</span>
              {kbd && (
                <span style={{
                  marginLeft: 'auto', fontFamily: "'Geist Mono', monospace", fontSize: 10,
                  color: '#6c655a', padding: '1px 5px', borderRadius: 4,
                  border: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)',
                }}>{kbd}</span>
              )}
              {count !== undefined && (
                <span style={{
                  marginLeft: 'auto', fontFamily: "'Geist Mono', monospace", fontSize: 10.5,
                  padding: '2px 6px', borderRadius: 999,
                  background: 'rgba(244,183,49,0.12)', color: '#F4B731',
                  border: '1px solid rgba(244,183,49,0.18)',
                }}>{count}</span>
              )}
            </>
          )}
        </>
      )}
    </NavLink>
  )
}
