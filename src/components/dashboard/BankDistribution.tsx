import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'

function CustomTooltip({ active, payload }) {
  if (!active || !payload || !payload.length) return null
  const d = payload[0]
  return (
    <div style={{
      background: '#18140F',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: 8,
      padding: '8px 12px',
    }}>
      <div style={{ color: '#F4EEDF', fontSize: 13, fontWeight: 500 }}>{d.name}</div>
      <div style={{ color: '#9A9285', fontSize: 11, fontFamily: "'Geist Mono', monospace", marginTop: 2 }}>
        {d.payload.percent}% · {d.payload.count} pagos
      </div>
    </div>
  )
}

import type { BankDistributionItem } from '../../types'

export default function BankDistribution({ data = [] }: { data: BankDistributionItem[] }) {
  const total = data.reduce((s, d) => s + d.count, 0)

  const bankCodes = {
    BN: '0134',
    MC: '0105',
    BV: '0102',
    OT: '—',
  }

  const bankSubs = {
    BN: 'pagos',
    MC: 'pagos',
    BV: 'pagos',
    OT: 'BNC, Provincial',
  }

  return (
    <div style={{
      background: '#FBF7EE',
      border: '1px solid rgba(24,20,15,0.09)',
      borderRadius: 16,
      boxShadow: '0 1px 0 rgba(24,20,15,0.04), 0 1px 2px rgba(24,20,15,0.04)',
    }}>
      {/* Card head */}
      <div style={{
        padding: '16px 20px 12px',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        gap: 16,
        borderBottom: '1px solid rgba(24,20,15,0.05)',
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <b style={{ fontSize: 14, fontWeight: 500, letterSpacing: '-0.005em' }}>Distribución por banco</b>
          <span style={{ fontSize: 12, color: '#6A6357' }}>Pagos validados hoy</span>
        </div>
        <button style={{
          height: 32,
          padding: '0 10px',
          borderRadius: 10,
          fontSize: 11.5,
          fontWeight: 500,
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          border: '1px solid rgba(24,20,15,0.09)',
          background: '#FBF7EE',
          color: '#18140F',
          cursor: 'pointer',
        }}>
          Ver todos
        </button>
      </div>

      <div style={{ padding: '18px 20px 20px' }}>
        <div style={{ display: 'flex', gap: 18, alignItems: 'center' }}>
          {/* Donut */}
          <div style={{ width: 168, height: 168, flexShrink: 0, position: 'relative' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={1.5}
                  dataKey="count"
                  startAngle={90}
                  endAngle={-270}
                  strokeWidth={0}
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              pointerEvents: 'none',
            }}>
              <div className="num" style={{ fontSize: 24, letterSpacing: '-0.02em', fontWeight: 500 }}>{total}</div>
              <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#6A6357' }}>Pagos · hoy</div>
            </div>
          </div>

          {/* Bank list */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {data.map((bank) => (
              <div key={bank.code} style={{
                display: 'grid',
                gridTemplateColumns: '28px 1fr auto',
                gap: 10,
                alignItems: 'center',
                fontSize: 12.5,
              }}>
                <div style={{
                  width: 28,
                  height: 28,
                  borderRadius: 8,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: "'Geist Mono', monospace",
                  fontSize: 10,
                  fontWeight: 600,
                  color: bank.textColor || 'white',
                  background: bank.color,
                }}>
                  {bank.code === 'OT' ? '+' : bank.code}
                </div>
                <div>
                  <b style={{ fontWeight: 500 }}>{bank.name}</b>
                  <small style={{ display: 'block', fontFamily: "'Geist Mono', monospace", fontSize: 10.5, color: '#6A6357' }}>
                    {bank.code !== 'OT' ? `${bankCodes[bank.code]} · ` : ''}{bank.count} {bankSubs[bank.code]}
                  </small>
                </div>
                <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: 12.5 }}>{bank.percent}%</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}