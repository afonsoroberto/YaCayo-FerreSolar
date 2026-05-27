import { useState, useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useNewPayments } from '../context/NewPaymentsContext'
import { useStats } from '../hooks/useStats'
import { usePayments } from '../hooks/usePayments'
import { useIsMobile } from '../hooks/useIsMobile'
import { fetchVolumeData } from '../lib/pagosDb'
import StatCard from '../components/dashboard/StatCard'
import VolumeChart from '../components/dashboard/VolumeChart'
import BankDistribution from '../components/dashboard/BankDistribution'
import RecentPayments from '../components/dashboard/RecentPayments'
import ValidationForm from '../components/dashboard/ValidationForm'
import ValidationResult from '../components/dashboard/ValidationResult'
import { IconPlus } from '../components/icons/Icons'
import { bankDistribution } from '../lib/data'
import type { ValidationResult as VResult, VolumeDataPoint } from '../types'

export default function Dashboard() {
  const navigate = useNavigate()
  const { increment } = useNewPayments()
  const { data: stats, loading: statsLoading } = useStats()
  const { data: payments, loading: paymentsLoading, refetch } = usePayments()
  const isMobile = useIsMobile()
  const [validationResult, setValidationResult] = useState<VResult | null>(null)
  const [volumeData, setVolumeData] = useState<VolumeDataPoint[]>([])

  useEffect(() => {
    fetchVolumeData().then(setVolumeData).catch(console.error)
  }, [])

  const handleValidationSuccess = useCallback((result: VResult) => {
    setValidationResult(result)
    increment()
    refetch()
  }, [increment, refetch])

  const sparkTotal    = [22, 18, 20, 14, 16, 10, 12, 6, 8, 4]
  const sparkPayments = [20, 22, 16, 18, 14, 16, 10, 12, 8, 10]
  const sparkPending  = [14, 16, 14, 16, 14, 16, 14, 16, 14, 16]

  return (
    <div style={{ padding: isMobile ? '20px 16px 56px' : '32px 32px 56px', display: 'flex', flexDirection: 'column', gap: isMobile ? 20 : 28 }}>

      {/* Page heading */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: isMobile ? 22 : 30, fontWeight: 500, letterSpacing: '-0.025em' }}>
            Buen día, <b style={{ fontWeight: 600 }}>FerreSolar</b>.
          </h2>
          {!isMobile && (
            <div style={{ marginTop: 8, fontSize: 13.5, color: '#6A6357', display: 'flex', gap: 14, alignItems: 'center' }}>
              <span>Resumen del día</span>
              <span style={{ width: 3, height: 3, background: '#9A9285', borderRadius: '50%' }}/>
              <span>1 banco conectado · BDV</span>
            </div>
          )}
        </div>
        <button style={btnPrimaryStyle} onClick={() => navigate('/validar')}>
          <IconPlus size={16} />
          {isMobile ? 'Validar' : 'Validar pago'}
        </button>
      </div>

      {/* Stats row — 2x2 en mobile, 4 en desktop */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', gap: isMobile ? 10 : 16 }}>
        <StatCard
          featured
          label="Total validado hoy"
          swatchColor="ember"
          value={statsLoading ? '—' : `Bs ${(stats?.totalValidated ?? 0).toLocaleString('es-VE', { minimumFractionDigits: 2 })}`}
          changeLabel="— sin movimiento"
          changeType="up"
          sparkData={sparkTotal}
        />
        <StatCard
          label="Pagos procesados"
          swatchColor="#2F6A47"
          value={statsLoading ? '—' : String(stats?.paymentsProcessed ?? 0)}
          unit={`/ ${stats?.paymentsTotal ?? 0} hoy`}
          changeLabel="— sin movimiento"
          changeType="up"
          sparkData={sparkPayments}
        />
        <StatCard
          label="Pendientes"
          swatchColor="#E0A02C"
          value={statsLoading ? '—' : String(stats?.pending ?? 0)}
          unit="requieren atención"
          changeLabel="— sin cambio"
          changeType="flat"
          sparkData={sparkPending}
        />
        <StatCard
          label="Bancos conectados"
          swatchColor="#2A241E"
          value="1"
          unit="/ 1 disponible"
          changeLabel={
            <span style={{ display: 'inline-flex', gap: 5, alignItems: 'center', fontSize: 10.5 }}>
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#4F9D6B', display: 'inline-block' }}/>
              BDV activo
            </span>
          }
          changeType="flat"
        />
      </div>

      {/* Charts row — stacked en mobile */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1.6fr 1fr', gap: isMobile ? 14 : 16 }}>
        <VolumeChart data={volumeData} />
        <BankDistribution data={bankDistribution} />
      </div>

      {/* Recent payments + validation — stacked en mobile */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1.4fr 1fr', gap: isMobile ? 14 : 16, alignItems: 'start' }}>
        <RecentPayments payments={payments || []} loading={paymentsLoading} />
        {/* En mobile el form de validación se oculta — ir a /validar */}
        {!isMobile && <ValidationForm onSuccess={handleValidationSuccess} />}
      </div>

      {/* En mobile mostrar botón para ir a validar */}
      {isMobile && (
        <button
          onClick={() => navigate('/validar')}
          style={{
            ...btnPrimaryStyle,
            width: '100%', justifyContent: 'center',
            height: 46, fontSize: 14,
          }}
        >
          <IconPlus size={18} />
          Validar nuevo pago
        </button>
      )}

      {/* Validation result overlay */}
      {validationResult && (
        <div style={{
          position: 'fixed',
          bottom: isMobile ? 16 : 32,
          right: isMobile ? 16 : 32,
          left: isMobile ? 16 : 'auto',
          zIndex: 100,
        }}>
          <ValidationResult
            result={validationResult}
            bankCode={validationResult.bankCode}
            onClose={() => setValidationResult(null)}
          />
        </div>
      )}
    </div>
  )
}

const btnStyle = {
  height: 38, padding: '0 14px', borderRadius: 10,
  fontSize: 13, fontWeight: 500,
  display: 'inline-flex', alignItems: 'center', gap: 8,
  border: '1px solid rgba(24,20,15,0.09)',
  background: '#FBF7EE', color: '#18140F', cursor: 'pointer',
}

const btnPrimaryStyle = {
  ...btnStyle,
  background: 'linear-gradient(135deg,#D9402A 0%, #E97A1F 52%, #F4B731 100%)',
  color: 'white', border: 'none',
  boxShadow: '0 1px 0 rgba(255,255,255,0.25) inset, 0 8px 18px -8px rgba(217,64,42,0.55)',
}