import { useState } from 'react'
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend
} from 'recharts'

function formatAmount(v) {
  if (v >= 1000000) return (v / 1000000).toFixed(1).replace(/\.0$/, '') + 'M'
  if (v >= 1000) return (v / 1000).toFixed(0) + 'k'
  return v
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null

  return (
    <div style={{
      background: '#18140F',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: 10,
      padding: '10px 14px',
      minWidth: 160,
    }}>
      <div style={{
        fontFamily: "'Geist Mono', monospace",
        fontSize: 9,
        letterSpacing: '0.06em',
        color: '#9A9285',
        textTransform: 'uppercase',
        marginBottom: 6,
      }}>{label}</div>
      {payload.map((entry, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
          <span style={{ width: 8, height: 8, borderRadius: 2, background: entry.color, display: 'inline-block', flexShrink: 0 }}/>
          <span style={{ fontSize: 13, fontWeight: 500, color: '#F4EEDF', fontFamily: "'Geist', sans-serif" }}>
            Bs {Number(entry.value).toLocaleString('es-VE', { minimumFractionDigits: 0 })}
          </span>
        </div>
      ))}
    </div>
  )
}

const SEGMENTS = ['24h', '14d', '30d', '3m']

import type { VolumeDataPoint } from '../../types'

export default function VolumeChart({ data = [] }: { data: VolumeDataPoint[] }) {
  const [activeSeg, setActiveSeg] = useState('14d')

  const total = data.reduce((s, d) => s + d.amount, 0)

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
          <b style={{ fontSize: 14, fontWeight: 500, letterSpacing: '-0.005em' }}>Volumen conciliado</b>
          <span style={{ fontSize: 12, color: '#6A6357' }}>Bolívares · últimos 14 días</span>
        </div>

        <div style={{
          display: 'inline-flex',
          padding: 3,
          background: '#E4DCC8',
          borderRadius: 9,
          fontSize: 11.5,
        }}>
          {SEGMENTS.map(seg => (
            <span
              key={seg}
              onClick={() => setActiveSeg(seg)}
              style={{
                padding: '4px 10px',
                borderRadius: 7,
                color: activeSeg === seg ? '#18140F' : '#6A6357',
                background: activeSeg === seg ? '#FBF7EE' : 'transparent',
                boxShadow: activeSeg === seg ? '0 1px 2px rgba(24,20,15,0.06)' : 'none',
                cursor: 'pointer',
                userSelect: 'none',
              }}
            >{seg}</span>
          ))}
        </div>
      </div>

      {/* Chart body */}
      <div style={{ padding: '10px 20px 20px' }}>
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="areaGradA" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#E97A1F" stopOpacity={0.32}/>
                <stop offset="100%" stopColor="#E97A1F" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="areaGradB" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#F4B731" stopOpacity={0.22}/>
                <stop offset="100%" stopColor="#F4B731" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="2 4"
              stroke="rgba(24,20,15,0.06)"
              horizontal={true}
              vertical={false}
            />
            <XAxis
              dataKey="date"
              tick={{ fontFamily: "'Geist Mono', monospace", fontSize: 10, fill: 'rgba(24,20,15,0.42)' }}
              axisLine={false}
              tickLine={false}
              interval={2}
            />
            <YAxis
              tickFormatter={formatAmount}
              tick={{ fontFamily: "'Geist Mono', monospace", fontSize: 10, fill: 'rgba(24,20,15,0.42)' }}
              axisLine={false}
              tickLine={false}
              width={40}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="prevAmount"
              name="Período anterior"
              stroke="#F4B731"
              strokeWidth={1.4}
              strokeDasharray="3 3"
              fill="url(#areaGradB)"
              dot={false}
              activeDot={{ r: 4, fill: '#F4B731', stroke: '#FBF7EE', strokeWidth: 2 }}
            />
            <Area
              type="monotone"
              dataKey="amount"
              name="Este período"
              stroke="#E97A1F"
              strokeWidth={2}
              fill="url(#areaGradA)"
              dot={false}
              activeDot={{ r: 5, fill: '#FBF7EE', stroke: '#D9402A', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>

        {/* Legend */}
        <div style={{ display: 'flex', gap: 16, fontSize: 11.5, color: '#6A6357', marginTop: 10, alignItems: 'center' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 10, height: 10, borderRadius: 3, background: '#E97A1F', display: 'inline-block' }}/>
            Este período
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 10, height: 10, borderRadius: 3, background: '#F4B731', opacity: 0.7, display: 'inline-block' }}/>
            Período anterior
          </span>
          <span style={{ marginLeft: 'auto', fontFamily: "'Geist Mono', monospace", fontSize: 11 }}>
            Total 14d: <b style={{ color: '#18140F', fontWeight: 500 }}>
              Bs {total.toLocaleString('es-VE', { minimumFractionDigits: 0 })}
            </b>
          </span>
        </div>
      </div>
    </div>
  )
}
