import { useState, useRef, useEffect } from 'react'
import { toPng } from 'html-to-image'
import sqdLogo from './assets/sqd.jpg'

interface CardData {
  jogadorSquadron: string
  jogadorAdversario: string
  claAdversario: string
  placar: string
  federacao: string
}

/* ─── Fundo animado via Canvas ─────────────────────────────────────── */
function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!

    const resize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)

    // Particles
    const COUNT = 60
    type P = { x: number; y: number; r: number; vx: number; vy: number; alpha: number; color: string; pulse: number; pulseSpeed: number }
    const COLORS = ['#FFD700', '#FFA500', '#FFE566', '#ffffff']
    const pts: P[] = Array.from({ length: COUNT }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 2.5 + 0.5,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4 - 0.15,
      alpha: Math.random() * 0.7 + 0.1,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      pulse: Math.random() * Math.PI * 2,
      pulseSpeed: Math.random() * 0.03 + 0.01,
    }))

    // Energy beams (diagonal light rays)
    type Beam = { x: number; y: number; w: number; h: number; angle: number; speed: number; alpha: number; color: string }
    const beams: Beam[] = Array.from({ length: 6 }, (_, i) => ({
      x: (i / 6) * canvas.width + Math.random() * 60,
      y: -canvas.height * 0.3,
      w: 1 + Math.random() * 1.5,
      h: canvas.height * 1.8,
      angle: -0.18 + Math.random() * 0.12,
      speed: 0.12 + Math.random() * 0.08,
      alpha: 0.04 + Math.random() * 0.05,
      color: Math.random() > 0.5 ? '#D4AA00' : '#FFD700',
    }))

    // Hex grid nodes
    type Node = { x: number; y: number; r: number; alpha: number; phase: number; speed: number }
    const nodes: Node[] = Array.from({ length: 20 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: 40 + Math.random() * 60,
      alpha: 0,
      phase: Math.random() * Math.PI * 2,
      speed: 0.008 + Math.random() * 0.006,
    }))

    let raf: number
    let t = 0

    const draw = () => {
      t += 1
      const W = canvas.width
      const H = canvas.height

      ctx.clearRect(0, 0, W, H)

      // Base dark background
      const base = ctx.createRadialGradient(W * 0.5, H * 0.85, 0, W * 0.5, H * 0.5, H * 1.1)
      base.addColorStop(0, 'rgba(35,22,0,1)')
      base.addColorStop(0.4, 'rgba(12,8,0,1)')
      base.addColorStop(1, 'rgba(4,4,4,1)')
      ctx.fillStyle = base
      ctx.fillRect(0, 0, W, H)

      // Pulsing central glow
      const pulse = 0.5 + 0.5 * Math.sin(t * 0.018)
      const glow = ctx.createRadialGradient(W * 0.5, H * 0.52, 0, W * 0.5, H * 0.52, W * 0.7)
      glow.addColorStop(0, `rgba(180,120,0,${0.08 + pulse * 0.07})`)
      glow.addColorStop(0.5, `rgba(100,60,0,${0.04 + pulse * 0.03})`)
      glow.addColorStop(1, 'rgba(0,0,0,0)')
      ctx.fillStyle = glow
      ctx.fillRect(0, 0, W, H)

      // Bottom arena glow
      const arena = ctx.createRadialGradient(W * 0.5, H, 0, W * 0.5, H * 0.8, W * 0.8)
      arena.addColorStop(0, `rgba(200,140,0,${0.12 + pulse * 0.05})`)
      arena.addColorStop(0.4, 'rgba(80,50,0,0.06)')
      arena.addColorStop(1, 'rgba(0,0,0,0)')
      ctx.fillStyle = arena
      ctx.fillRect(0, 0, W, H)

      // Energy beams
      for (const b of beams) {
        b.x += b.speed
        if (b.x > W + 60) b.x = -60
        ctx.save()
        ctx.translate(b.x, b.y)
        ctx.rotate(b.angle)
        const hex = b.color
        const r2 = parseInt(hex.slice(1, 3), 16)
        const g2 = parseInt(hex.slice(3, 5), 16)
        const bl2 = parseInt(hex.slice(5, 7), 16)
        const cg = ctx.createLinearGradient(0, 0, 0, b.h)
        cg.addColorStop(0, `rgba(${r2},${g2},${bl2},0)`)
        cg.addColorStop(0.25, `rgba(${r2},${g2},${bl2},${b.alpha})`)
        cg.addColorStop(0.75, `rgba(${r2},${g2},${bl2},${b.alpha * 0.6})`)
        cg.addColorStop(1, `rgba(${r2},${g2},${bl2},0)`)
        ctx.fillStyle = cg
        ctx.fillRect(-b.w / 2, 0, b.w, b.h)
        ctx.restore()
      }

      // Hex-ring pulse nodes
      for (const n of nodes) {
        n.phase += n.speed
        const a = (Math.sin(n.phase) * 0.5 + 0.5) * 0.12
        ctx.beginPath()
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(212,170,0,${a})`
        ctx.lineWidth = 0.8
        ctx.stroke()
      }

      // Floating particles
      for (const p of pts) {
        p.x += p.vx
        p.y += p.vy
        if (p.x < -5) p.x = W + 5
        if (p.x > W + 5) p.x = -5
        if (p.y < -5) p.y = H + 5
        if (p.y > H + 5) p.y = -5
        p.pulse += p.pulseSpeed
        const a = p.alpha * (0.6 + 0.4 * Math.sin(p.pulse))
        const hex2 = p.color.startsWith('#')
          ? [parseInt(p.color.slice(1, 3), 16), parseInt(p.color.slice(3, 5), 16), parseInt(p.color.slice(5, 7), 16)]
          : [255, 215, 0]
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${hex2[0]},${hex2[1]},${hex2[2]},${a})`
        ctx.fill()
        if (p.color !== '#ffffff') {
          ctx.shadowBlur = p.r * 6
          ctx.shadowColor = p.color
          ctx.fill()
          ctx.shadowBlur = 0
        }
      }

      raf = requestAnimationFrame(draw)
    }

    draw()
    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
    />
  )
}

/* ─── Card ─────────────────────────────────────────────────────────── */
function VictoryCard({ data, cardRef }: { data: CardData; cardRef: React.RefObject<HTMLDivElement | null> }) {
  return (
    <div
      ref={cardRef}
      style={{
        width: '100%',
        maxWidth: '540px',
        aspectRatio: '1080 / 1350',
        fontFamily: "'Barlow Condensed', sans-serif",
        position: 'relative',
        overflow: 'hidden',
        background: '#080808',
        borderRadius: '8px',
        boxShadow: '0 0 60px rgba(212,170,0,0.3), 0 0 120px rgba(0,0,0,0.9)',
      }}
    >
      {/* Fundo animado */}
      <AnimatedBackground />

      {/* Top golden rim */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, transparent, #D4AA00, #FFD700, #D4AA00, transparent)', zIndex: 5 }} />
      {/* Bottom golden rim */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, transparent, #D4AA00, #FFD700, #D4AA00, transparent)', zIndex: 5 }} />
      {/* Left golden rim */}
      <div style={{ position: 'absolute', top: 0, bottom: 0, left: 0, width: '3px', background: 'linear-gradient(180deg, transparent, #D4AA00 20%, #FFD700 50%, #D4AA00 80%, transparent)', zIndex: 5 }} />
      {/* Right golden rim */}
      <div style={{ position: 'absolute', top: 0, bottom: 0, right: 0, width: '3px', background: 'linear-gradient(180deg, transparent, #D4AA00 20%, #FFD700 50%, #D4AA00 80%, transparent)', zIndex: 5 }} />

      {/* === CONTENT === */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '5% 6%',
          gap: 0,
        }}
      >
        {/* VITÓRIA */}
        <div style={{ textAlign: 'center', marginBottom: '3%' }}>
          <div
            style={{
              fontSize: 'clamp(10px, 2vw, 13px)',
              letterSpacing: '0.35em',
              color: '#D4AA00',
              textTransform: 'uppercase',
              fontWeight: 700,
              fontFamily: "'Rajdhani', sans-serif",
              opacity: 0.85,
            }}
          >
            resultado
          </div>
          <div
            style={{
              fontSize: 'clamp(52px, 10vw, 88px)',
              fontWeight: 900,
              letterSpacing: '0.08em',
              lineHeight: 0.9,
              textTransform: 'uppercase',
              color: '#FFFFFF',
              textShadow: '0 0 40px rgba(255,200,0,0.5), 0 0 80px rgba(255,200,0,0.2)',
              WebkitTextStroke: '1px rgba(212,170,0,0.3)',
            }}
          >
            VITÓRIA
          </div>
        </div>

        {/* Logo Squadron centralizada */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', marginBottom: '2%' }}>
          <div
            style={{
              width: 'clamp(90px, 18vw, 140px)',
              height: 'clamp(90px, 18vw, 140px)',
              borderRadius: '50%',
              overflow: 'hidden',
              border: '3px solid rgba(212,170,0,0.8)',
              boxShadow: '0 0 32px rgba(212,170,0,0.5), 0 0 60px rgba(212,170,0,0.2), inset 0 0 14px rgba(0,0,0,0.6)',
            }}
          >
            <img
              src={sqdLogo}
              alt="Squadron logo"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>

          {/* Squadron × Adversário */}
          <div
            style={{
              fontSize: 'clamp(13px, 2.6vw, 20px)',
              fontWeight: 800,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              fontFamily: "'Barlow Condensed', sans-serif",
              color: 'rgba(255,255,255,0.85)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <span style={{ color: '#D4AA00' }}>Squadron</span>
            <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.8em' }}>×</span>
            <span style={{ color: 'rgba(255,255,255,0.65)' }}>{data.claAdversario || 'Adversário'}</span>
          </div>
        </div>

        {/* SCORE */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginBottom: '4%',
            position: 'relative',
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: '-20px -40px',
              background: 'radial-gradient(ellipse at 50% 50%, rgba(212,170,0,0.18) 0%, transparent 70%)',
              pointerEvents: 'none',
            }}
          />
          <div
            style={{
              fontSize: 'clamp(14px, 2.5vw, 18px)',
              fontWeight: 700,
              letterSpacing: '0.4em',
              color: '#D4AA00',
              textTransform: 'uppercase',
              fontFamily: "'Rajdhani', sans-serif",
              marginBottom: '2px',
            }}
          >
            placar
          </div>
          <div
            style={{
              fontSize: 'clamp(64px, 13vw, 108px)',
              fontWeight: 900,
              letterSpacing: '0.02em',
              lineHeight: 1,
              background: 'linear-gradient(180deg, #FFE566 0%, #D4AA00 45%, #A07800 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              filter: 'drop-shadow(0 0 24px rgba(212,170,0,0.6)) drop-shadow(0 4px 12px rgba(0,0,0,0.8))',
              position: 'relative',
              zIndex: 1,
            }}
          >
            {data.placar || '0 × 0'}
          </div>
        </div>

        {/* Players */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '3%',
            marginBottom: '5%',
            width: '100%',
            justifyContent: 'center',
          }}
        >
          <div style={{ textAlign: 'right', flex: 1 }}>
            <div
              style={{
                fontSize: 'clamp(15px, 3vw, 22px)',
                fontWeight: 800,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                color: '#FFFFFF',
                lineHeight: 1,
                textShadow: '0 0 20px rgba(255,220,50,0.4)',
              }}
            >
              {data.jogadorSquadron || 'Jogador SQD'}
            </div>
            <div
              style={{
                fontSize: 'clamp(8px, 1.4vw, 10px)',
                letterSpacing: '0.25em',
                color: '#D4AA00',
                textTransform: 'uppercase',
                fontFamily: "'Rajdhani', sans-serif",
                fontWeight: 600,
                marginTop: '2px',
              }}
            >
              Squadron
            </div>
          </div>

          <div
            style={{
              fontSize: 'clamp(16px, 3vw, 22px)',
              color: 'rgba(212,170,0,0.8)',
              filter: 'drop-shadow(0 0 8px rgba(212,170,0,0.6))',
              flex: '0 0 auto',
            }}
          >
            ⚔
          </div>

          <div style={{ textAlign: 'left', flex: 1 }}>
            <div
              style={{
                fontSize: 'clamp(15px, 3vw, 22px)',
                fontWeight: 800,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.6)',
                lineHeight: 1,
              }}
            >
              {data.jogadorAdversario || 'Jogador ADV'}
            </div>
            <div
              style={{
                fontSize: 'clamp(8px, 1.4vw, 10px)',
                letterSpacing: '0.25em',
                color: 'rgba(255,255,255,0.35)',
                textTransform: 'uppercase',
                fontFamily: "'Rajdhani', sans-serif",
                fontWeight: 600,
                marginTop: '2px',
              }}
            >
              {data.claAdversario || 'Adversário'}
            </div>
          </div>
        </div>

        {/* Federation */}
        <div
          style={{
            width: '100%',
            padding: '7px 0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 'auto',
          }}
        >
          <span
            style={{
              fontSize: 'clamp(10px, 2vw, 14px)',
              fontWeight: 700,
              letterSpacing: '0.3em',
              color: 'rgba(255,255,255,0.6)',
              textTransform: 'uppercase',
              fontFamily: "'Rajdhani', sans-serif",
            }}
          >
            {data.federacao || 'Federação'}
          </span>
        </div>

        {/* Footer */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            paddingTop: '4%',
          }}
        >
          <div
            style={{
              width: 'clamp(36px, 7vw, 56px)',
              height: 'clamp(36px, 7vw, 56px)',
              borderRadius: '50%',
              overflow: 'hidden',
              border: '1px solid rgba(212,170,0,0.4)',
              boxShadow: '0 0 10px rgba(212,170,0,0.2)',
            }}
          >
            <img src={sqdLogo} alt="Squadron" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>

          <div
            style={{
              fontSize: 'clamp(18px, 3.5vw, 26px)',
              fontWeight: 900,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              background: 'linear-gradient(135deg, #FFE566, #D4AA00)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              filter: 'drop-shadow(0 0 12px rgba(212,170,0,0.5))',
            }}
          >
            #GoSQD
          </div>

          <div style={{ width: 'clamp(36px, 7vw, 56px)' }} />
        </div>
      </div>
    </div>
  )
}

/* ─── Field ─────────────────────────────────────────────────────────── */
function Field({ label, value, onChange, placeholder }: {
  label: string; value: string; onChange: (v: string) => void; placeholder: string
}) {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
      <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#D4AA00', fontFamily: "'Rajdhani', sans-serif" }}>
        {label}
      </span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(212,170,0,0.25)',
          borderRadius: '4px',
          padding: '8px 12px',
          color: '#fff',
          fontSize: '14px',
          fontFamily: "'Barlow Condensed', sans-serif",
          fontWeight: 600,
          letterSpacing: '0.05em',
          outline: 'none',
          transition: 'border-color 0.2s',
        }}
        onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(212,170,0,0.7)')}
        onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(212,170,0,0.25)')}
      />
    </label>
  )
}

/* ─── App ────────────────────────────────────────────────────────────── */
export default function App() {
  const [data, setData] = useState<CardData>({
    jogadorSquadron: '',
    jogadorAdversario: '',
    claAdversario: '',
    placar: '',
    federacao: '',
  })
  const [downloading, setDownloading] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  const set = (key: keyof CardData) => (v: string) =>
    setData((prev) => ({ ...prev, [key]: v }))

  const handleDownload = async () => {
    if (!cardRef.current) return
    setDownloading(true)
    try {
      const dataUrl = await toPng(cardRef.current, { cacheBust: true, pixelRatio: 2 })
      const link = document.createElement('a')
      link.download = `squadron-vitoria-${data.claAdversario || 'card'}.png`
      link.href = dataUrl
      link.click()
    } finally {
      setDownloading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '32px 16px', gap: '32px', fontFamily: "'Barlow Condensed', sans-serif" }}>

      {/* Editor */}
      <div style={{ width: '100%', maxWidth: '540px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(212,170,0,0.15)', borderRadius: '8px', padding: '20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
        <div style={{ gridColumn: '1 / -1' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.3em', color: 'rgba(212,170,0,0.6)', textTransform: 'uppercase', fontFamily: "'Rajdhani', sans-serif", marginBottom: '16px' }}>
            ⚙ Campos Dinâmicos
          </div>
        </div>
        <Field label="Jogador Squadron" value={data.jogadorSquadron} onChange={set('jogadorSquadron')} placeholder="ex: Caio" />
        <Field label="Jogador Adversário" value={data.jogadorAdversario} onChange={set('jogadorAdversario')} placeholder="ex: Arrasca" />
        <Field label="Clã Adversário" value={data.claAdversario} onChange={set('claAdversario')} placeholder="ex: flamengo" />
        <Field label="Placar" value={data.placar} onChange={set('placar')} placeholder="ex: 1 × 0" />
        <div style={{ gridColumn: '1 / -1' }}>
          <Field label="Federação" value={data.federacao} onChange={set('federacao')} placeholder="ex: Fed. SRN" />
        </div>
        <div style={{ gridColumn: '1 / -1', marginTop: '4px' }}>
          <button
            onClick={handleDownload}
            disabled={downloading}
            style={{
              width: '100%',
              padding: '12px 0',
              background: downloading ? 'rgba(212,170,0,0.15)' : 'linear-gradient(135deg, rgba(212,170,0,0.9), rgba(180,130,0,0.95))',
              border: '1px solid rgba(212,170,0,0.4)',
              borderRadius: '6px',
              color: downloading ? 'rgba(212,170,0,0.5)' : '#000',
              fontSize: '13px',
              fontFamily: "'Barlow Condensed', sans-serif",
              fontWeight: 800,
              letterSpacing: '0.25em',
              textTransform: 'uppercase',
              cursor: downloading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => { if (!downloading) e.currentTarget.style.filter = 'brightness(1.15)' }}
            onMouseLeave={(e) => { e.currentTarget.style.filter = 'none' }}
          >
            {downloading ? '⏳ Gerando...' : '⬇ Baixar Imagem'}
          </button>
        </div>
      </div>

      <VictoryCard data={data} cardRef={cardRef} />

      <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.2)', letterSpacing: '0.15em', textTransform: 'uppercase', fontFamily: "'Rajdhani', sans-serif" }}>
        Squadron Victory Card — 1080 × 1350
      </div>
    </div>
  )
}
