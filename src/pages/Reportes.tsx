import VolumeChart from '../components/dashboard/VolumeChart'
import { volumeData } from '../lib/data'
import { IconChart, IconArrowUpRight } from '../components/icons/Icons'

export default function Reportes() {
  return (
    <div style={{ padding: '32px 32px 56px', display: 'flex', flexDirection: 'column', gap: 28 }}>
      {/* Heading */}
      <div>
        <h2 style={{ margin: 0, fontSize: 30, fontWeight: 500, letterSpacing: '-0.025em' }}>
          <b style={{ fontWeight: 600 }}>Reportes</b>
        </h2>
        <div style={{ marginTop: 8, fontSize: 13.5, color: '#6A6357' }}>
          Análisis y reportes del período operativo
        </div>
      </div>

      {/* Coming soon banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(217,64,42,0.06) 0%, rgba(244,183,49,0.04) 60%, transparent 100%), #FBF7EE',
        border: '1px solid rgba(244,183,49,0.25)',
        borderRadius: 16,
        padding: '24px 28px',
        display: 'flex',
        alignItems: 'center',
        gap: 20,
      }}>
        <div style={{
          width: 48, height: 48, borderRadius: 14,
          background: 'linear-gradient(135deg,#D9402A 0%, #E97A1F 52%, #F4B731 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'white',
          flexShrink: 0,
          boxShadow: '0 6px 16px -4px rgba(217,64,42,0.45)',
        }}>
          <IconChart size={22} />
        </div>
        <div style={{ flex: 1 }}>
          <b style={{ fontSize: 16, fontWeight: 600 }}>Módulo de Reportes</b>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: '#6A6357', lineHeight: 1.6 }}>
            Reportes avanzados de conciliación, análisis de tendencias y exportación de datos están en desarrollo.
          </p>
        </div>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          padding: '6px 14px', borderRadius: 999,
          fontFamily: "'Geist Mono', monospace",
          fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase',
          background: 'rgba(244,183,49,0.15)',
          color: '#8a601a',
          border: '1px solid rgba(244,183,49,0.25)',
          whiteSpace: 'nowrap',
        }}>
          Próximamente
        </div>
      </div>

      {/* Volume chart preview */}
      <div>
        <div style={{ fontSize: 13, color: '#6A6357', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
          <span>Vista previa del módulo —</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#E97A1F' }}>
            <IconArrowUpRight size={14} />
            Próximas funciones
          </span>
        </div>
        <VolumeChart data={volumeData} />
      </div>

      {/* Feature list */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
        {[
          { title: 'Reporte diario', desc: 'Resumen completo de todas las transacciones del día con validación estado por estado.' },
          { title: 'Análisis por banco', desc: 'Comparativas de rendimiento, tiempos de respuesta y tasas de éxito por entidad bancaria.' },
          { title: 'Exportación CSV/PDF', desc: 'Descarga de reportes en múltiples formatos para contabilidad y auditoría.' },
        ].map(f => (
          <div key={f.title} style={{
            background: '#FBF7EE',
            border: '1px solid rgba(24,20,15,0.09)',
            borderRadius: 14,
            padding: '16px 18px',
            opacity: 0.7,
          }}>
            <b style={{ fontSize: 13.5, fontWeight: 600 }}>{f.title}</b>
            <p style={{ margin: '6px 0 0', fontSize: 12, color: '#6A6357', lineHeight: 1.55 }}>{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
