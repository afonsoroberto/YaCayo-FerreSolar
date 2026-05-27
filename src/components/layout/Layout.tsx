import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
import { useIsMobile } from '../../hooks/useIsMobile'
import { IconX } from '../icons/Icons'

const pageTitles: Record<string, string> = {
  '/dashboard': 'Resumen del día',
  '/validar': 'Validar Pago',
  '/pagos': 'Pagos Recientes',
  '/cierre': 'Cierre de Día',
  '/reportes': 'Reportes',
  '/usuarios': 'Usuarios',
  '/configuracion': 'Configuración',
}

export default function Layout() {
  const location = useLocation()
  const pageTitle = pageTitles[location.pathname] || 'Dashboard'
  const isMobile = useIsMobile()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      background: 'radial-gradient(1200px 700px at 12% -10%, rgba(244,183,49,0.10), transparent 60%), radial-gradient(1100px 700px at 95% 18%, rgba(217,64,42,0.05), transparent 65%), #ECE5D6',
    }}>

      {/* Mobile sidebar overlay */}
      {isMobile && sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: 'fixed', inset: 0, zIndex: 40,
            background: 'rgba(15,13,11,0.5)', backdropFilter: 'blur(4px)',
          }}
        />
      )}

      {/* Sidebar */}
      {isMobile ? (
        <div style={{
          position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 50,
          transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.25s ease',
          height: '100%',
          display: 'flex',
        }}>
          <Sidebar onClose={() => setSidebarOpen(false)} />
        </div>
      ) : (
        <Sidebar />
      )}

      {/* Main area */}
      <div style={{
        flex: 1,
        minWidth: 0,
        maxWidth: '100%',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        isolation: 'isolate',
      }}>
        {/* Gradient overlay */}
        <div style={{
          position: 'fixed',
          inset: 0,
          left: isMobile ? 0 : 256,
          background: 'radial-gradient(720px 360px at 18% 0%, rgba(244,183,49,0.10), transparent 60%), radial-gradient(540px 360px at 90% 6%, rgba(217,64,42,0.06), transparent 60%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}/>

        <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', flex: 1 }}>
          <Topbar
            pageTitle={pageTitle}
            onMenuClick={isMobile ? () => setSidebarOpen(true) : undefined}
          />
          <main style={{ flex: 1, padding: 0 }}>
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}