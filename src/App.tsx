import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { NewPaymentsProvider } from './context/NewPaymentsContext'
import Layout from './components/layout/Layout'
import Dashboard from './pages/Dashboard'
import ValidarPago from './pages/ValidarPago'
import PagosRecientes from './pages/PagosRecientes'
import CierreDia from './pages/CierreDia'
import Reportes from './pages/Reportes'
import Usuarios from './pages/Usuarios'
import Configuracion from './pages/Configuracion'

export default function App() {
  return (
    <NewPaymentsProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="validar" element={<ValidarPago />} />
          <Route path="pagos" element={<PagosRecientes />} />
          <Route path="cierre" element={<CierreDia />} />
          <Route path="reportes" element={<Reportes />} />
          <Route path="usuarios" element={<Usuarios />} />
          <Route path="configuracion" element={<Configuracion />} />
        </Route>
      </Routes>
    </BrowserRouter>
    </NewPaymentsProvider>
  )
}
