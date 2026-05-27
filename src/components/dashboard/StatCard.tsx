import React from 'react'

interface SparklineProps {
  data: number[]
  color?: string
  dashed?: boolean
}

function Sparkline({ data, color = '#E97A1F', dashed = false }: SparklineProps) {
  if (!data || data.length < 2) return null
  const w = 92, h = 28
  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1
  const pad = 3

  const points = data.map((v, i) => {
    const x = pad + (i / (data.length - 1)) * (w - pad * 2)
    const y = h - pad - ((v - min) / range) * (h - pad * 2)
    return `${x},${y}`
  })
  const polyline = points.join(' ')

  const first = points[0]
  const last = points[points.length - 1]
  const [fx] = first.split(',')
  const [lx] = last.split(',')

  const gradId = `spgrad-${color.replace('#', '')}`

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ display: 'block' }}>
      <defs>
        <linearGradient id={gradId} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor={color} stopOpacity="0.3"/>
          <stop offset="1" stopColor={color} stopOpacity="0"/>
        </linearGradient>
      </defs>
      {!dashed && (
        <path
          d={`M${points[0]} ${points.slice(1).map(p => 'L' + p).join(' ')} L${lx},${h} L${fx},${h} Z`}
          fill={`url(#${gradId})`}
        />
      )}
      <polyline
        points={polyline}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={dashed ? '2 3' : undefined}
      />
    </svg>
  )
}

interface StatCardProps {
  label: string
  swatchColor?: string
  value: string
  unit?: string
  changeLabel: React.ReactNode
  changeType?: 'up' | 'down' | 'flat'
  sparkData?: number[]
  featured?: boolean
}

export default function StatCard({
  label,
  swatchColor,
  value,
  unit,
  changeLabel,
  changeType = 'flat',
  sparkData,
  featured = false,
}: StatCardProps) {
  const changeColors = {
    up:   { color: '#2F6A47', background: 'rgba(79,157,107,0.10)' },
    down: { color: '#8E3128', background: 'rgba(200,69,58,0.08)' },
    flat: { color: '#6A6357', background: 'rgba(24,20,15,0.05)' },
  }

  const changeStyle = changeColors[changeType] || changeColors.flat

  const sparkColors = {
    up:   '#4F9D6B',
    down: '#C8453A',
    flat: '#E0A02C',
  }
  const sparkColor = swatchColor || sparkColors[changeType] || '#E97A1F'

  return (
    <div style={{
      background: featured
        ? 'linear-gradient(180deg, rgba(244,183,49,0.06), transparent 50%), #FBF7EE'
        : '#FBF7EE',
      border: featured ? '1px solid rgba(217,64,42,0.18)' : '1px solid rgba(24,20,15,0.09)',
      borderRadius: 16,
      padding: '18px 18px 16px',
      boxShadow: '0 1px 0 rgba(24,20,15,0.04), 0 1px 2px rgba(24,20,15,0.04)',
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
      position: 'relative',
      overflow: 'hidden',
    }}>
      {featured && (
        <div style={{
          position: 'absolute', right: -30, top: -30,
          width: 120, height: 120, borderRadius: '50%',
          background: 'linear-gradient(135deg,rgba(217,64,42,0.16) 0%, rgba(233,122,31,0.14) 50%, rgba(244,183,49,0.12) 100%)',
          pointerEvents: 'none',
        }}/>
      )}

      <div style={{ fontSize: 12, color: '#6A6357', display: 'flex', alignItems: 'center', gap: 8 }}>
        {swatchColor && (
          <span style={{
            width: 8, height: 8, borderRadius: 2, flexShrink: 0,
            background: featured ? 'linear-gradient(135deg,#D9402A 0%, #E97A1F 52%, #F4B731 100%)' : swatchColor,
          }}/>
        )}
        {label}
      </div>

      <div style={{
        fontFamily: "'Geist', sans-serif",
        fontSize: 32, fontWeight: 500, letterSpacing: '-0.02em',
        display: 'flex', alignItems: 'baseline', gap: 6,
      }}>
        <span className="num">{value}</span>
        {unit && <span style={{ fontSize: 13, color: '#6A6357', fontWeight: 400, letterSpacing: 0 }}>{unit}</span>}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 11.5, color: '#6A6357' }}>
        <span style={{
          fontFamily: "'Geist Mono', monospace",
          fontSize: 11, fontWeight: 500,
          display: 'inline-flex', alignItems: 'center', gap: 4,
          padding: '2px 7px', borderRadius: 999,
          color: changeStyle.color, background: changeStyle.background,
        }}>
          {changeLabel}
        </span>
        {sparkData && <Sparkline data={sparkData} color={sparkColor} dashed={changeType === 'flat'} />}
      </div>
    </div>
  )
}
