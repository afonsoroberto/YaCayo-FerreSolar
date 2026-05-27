import { IconSpark, IconArrowRight } from '../icons/Icons'

export default function InsightStrip() {
  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(217,64,42,0.06) 0%, rgba(244,183,49,0.04) 60%, transparent 100%), #FBF7EE',
      border: '1px solid rgba(24,20,15,0.09)',
      borderRadius: 16,
      boxShadow: '0 1px 0 rgba(24,20,15,0.04), 0 1px 2px rgba(24,20,15,0.04)',
      padding: '18px 20px',
      display: 'grid',
      gridTemplateColumns: '1fr auto',
      gap: 14,
      alignItems: 'center',
    }}>
      <div>
        <div style={{ fontSize: 13.5, fontWeight: 500, letterSpacing: '-0.005em' }}>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            padding: '3px 8px',
            borderRadius: 999,
            fontFamily: "'Geist Mono', monospace",
            fontSize: 10.5,
            background: 'linear-gradient(135deg,rgba(217,64,42,0.16) 0%, rgba(233,122,31,0.14) 50%, rgba(244,183,49,0.12) 100%)',
            color: '#8a3a14',
          }}>▲ Hallazgo</span>
          &nbsp; Banesco está procesando 22% más rápido hoy que el promedio de la semana.
        </div>
        <div style={{ fontSize: 12.5, color: '#6A6357', lineHeight: 1.55, marginTop: 4, maxWidth: 760 }}>
          El tiempo medio de validación bajó de <b className="num" style={{ color: '#18140F' }}>3.4s</b> a <b className="num" style={{ color: '#18140F' }}>2.6s</b>. Mercantil presenta una demora intermitente entre 12:00 — 13:30. Recomendamos priorizar Banesco para conciliaciones masivas durante el resto del día.
        </div>
      </div>
      <button style={{
        height: 38,
        padding: '0 14px',
        borderRadius: 10,
        fontSize: 13,
        fontWeight: 500,
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        border: '1px solid #25201B',
        background: '#1C1814',
        color: '#F4EEDF',
        cursor: 'pointer',
        whiteSpace: 'nowrap',
        flexShrink: 0,
      }}>
        <IconSpark size={16} />
        Ver análisis
        <IconArrowRight size={16} />
      </button>
    </div>
  )
}
