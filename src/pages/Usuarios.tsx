import { IconUsers, IconPlus } from '../components/icons/Icons'

const users = [
  {
    id: 1,
    name: 'Andrés Salazar',
    initials: 'AS',
    email: 'a.salazar@ferresolar.ve',
    role: 'Administrador',
    roleColor: '#D9402A',
    roleBg: 'rgba(217,64,42,0.10)',
    lastActive: 'Hace 2 min',
    status: 'active',
  },
  {
    id: 2,
    name: 'María García',
    initials: 'MG',
    email: 'm.garcia@ferresolar.ve',
    role: 'Operador',
    roleColor: '#E97A1F',
    roleBg: 'rgba(233,122,31,0.10)',
    lastActive: 'Hace 15 min',
    status: 'active',
  },
  {
    id: 3,
    name: 'Carlos Mendez',
    initials: 'CM',
    email: 'c.mendez@ferresolar.ve',
    role: 'Validador',
    roleColor: '#2F6A47',
    roleBg: 'rgba(79,157,107,0.10)',
    lastActive: 'Hace 1 hora',
    status: 'idle',
  },
]

export default function Usuarios() {
  return (
    <div style={{ padding: '32px 32px 56px', display: 'flex', flexDirection: 'column', gap: 28 }}>
      {/* Heading */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 30, fontWeight: 500, letterSpacing: '-0.025em' }}>
            <b style={{ fontWeight: 600 }}>Usuarios</b>
          </h2>
          <div style={{ marginTop: 8, fontSize: 13.5, color: '#6A6357' }}>
            Gestión de acceso — FerreSolar C.A.
          </div>
        </div>
        <button style={{
          height: 38, padding: '0 14px', borderRadius: 10,
          fontSize: 13, fontWeight: 500,
          display: 'inline-flex', alignItems: 'center', gap: 8,
          border: 'none',
          background: 'linear-gradient(135deg,#D9402A 0%, #E97A1F 52%, #F4B731 100%)',
          color: 'white', cursor: 'pointer',
          boxShadow: '0 1px 0 rgba(255,255,255,0.25) inset, 0 8px 18px -8px rgba(217,64,42,0.55)',
        }}>
          <IconPlus size={16} />
          Invitar usuario
        </button>
      </div>

      {/* Users table */}
      <div style={{
        background: '#FBF7EE',
        border: '1px solid rgba(24,20,15,0.09)',
        borderRadius: 16,
        overflow: 'hidden',
        boxShadow: '0 1px 0 rgba(24,20,15,0.04), 0 1px 2px rgba(24,20,15,0.04)',
      }}>
        <div style={{
          padding: '16px 20px 12px',
          borderBottom: '1px solid rgba(24,20,15,0.05)',
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <IconUsers size={16} style={{ color: '#6A6357' }} />
          <b style={{ fontSize: 14, fontWeight: 500 }}>Miembros del equipo</b>
          <span style={{
            fontFamily: "'Geist Mono', monospace",
            fontSize: 10.5, padding: '2px 7px', borderRadius: 999,
            background: 'rgba(24,20,15,0.05)', color: '#6A6357',
          }}>{users.length}</span>
        </div>

        <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0 }}>
          <thead>
            <tr>
              {['Usuario', 'Rol', 'Última actividad', 'Estado', ''].map((h, i) => (
                <th key={i} style={{
                  fontFamily: "'Geist Mono', monospace",
                  fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase',
                  color: '#6A6357', fontWeight: 500, textAlign: 'left',
                  padding: '10px 20px',
                  borderBottom: '1px solid rgba(24,20,15,0.05)',
                  background: 'linear-gradient(180deg, rgba(236,229,214,0.4), transparent)',
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td style={{ padding: '14px 20px', borderBottom: '1px solid rgba(24,20,15,0.05)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{
                      width: 34, height: 34, borderRadius: '50%',
                      background: 'linear-gradient(135deg,#3a2f25,#1a1612)',
                      color: '#F4EEDF',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 12, fontWeight: 500,
                      flexShrink: 0,
                    }}>{user.initials}</div>
                    <div>
                      <div style={{ fontSize: 13.5, fontWeight: 500 }}>{user.name}</div>
                      <div style={{ fontSize: 11.5, color: '#6A6357', marginTop: 1 }}>{user.email}</div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '14px 20px', borderBottom: '1px solid rgba(24,20,15,0.05)' }}>
                  <span style={{
                    display: 'inline-flex', alignItems: 'center',
                    padding: '3px 9px', borderRadius: 999,
                    fontSize: 12, fontWeight: 500,
                    color: user.roleColor,
                    background: user.roleBg,
                  }}>{user.role}</span>
                </td>
                <td style={{ padding: '14px 20px', borderBottom: '1px solid rgba(24,20,15,0.05)', fontSize: 13, color: '#6A6357', fontFamily: "'Geist Mono', monospace" }}>
                  {user.lastActive}
                </td>
                <td style={{ padding: '14px 20px', borderBottom: '1px solid rgba(24,20,15,0.05)' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
                    <span style={{
                      width: 7, height: 7, borderRadius: '50%',
                      background: user.status === 'active' ? '#4F9D6B' : '#9A9285',
                      boxShadow: user.status === 'active' ? '0 0 0 2.5px rgba(79,157,107,0.18)' : 'none',
                    }}/>
                    {user.status === 'active' ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td style={{ padding: '14px 20px', borderBottom: '1px solid rgba(24,20,15,0.05)', textAlign: 'right' }}>
                  <button style={{
                    height: 30, padding: '0 10px', borderRadius: 7,
                    fontSize: 11.5, fontWeight: 500,
                    border: '1px solid rgba(24,20,15,0.09)',
                    background: 'rgba(255,255,255,0.7)',
                    color: '#18140F', cursor: 'pointer',
                  }}>Editar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
