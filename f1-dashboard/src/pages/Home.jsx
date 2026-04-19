import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'

import logo from '../assets/Redbull-Racing-Logo-Vector.svg-.png'
import heroBg from '../assets/4k Red Bull 2026 RB22 Live Wallpaper _ With Download Link 4k _ F1 _ Max Verstappen _ 3840x2160 UHD_1080p.mp4'

const STAT_TARGETS = { constructors: 6, drivers: 8, wins: 125 }

const MILESTONES = [
  { year: '2005', text: 'Team founded, acquired from Jaguar Racing' },
  { year: '2009', text: 'First race win - Sebastian Vettel, China' },
  { year: '2010', text: "First Constructors' Championship" },
  { year: '2013', text: 'Fourth consecutive double championship' },
  { year: '2022', text: "Return to the top - fifth Constructors' title" },
  { year: '2023', text: 'Record-breaking season - 21 wins from 22 races' },
]

function Home() {
  const statsRef = useRef(null)
  const [statsVisible, setStatsVisible] = useState(false)
  const [counts, setCounts] = useState({ constructors: 0, drivers: 0, wins: 0 })

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStatsVisible(true) },
      { threshold: 0.5 }
    )
    if (statsRef.current) observer.observe(statsRef.current)
    return () => observer.disconnect()
  }, [])

  // Phase 1 (first 55%): slot-machine random numbers
  // Phase 2 (last 45%): easeOutCubic settle to real targets
  useEffect(() => {
    if (!statsVisible) return
    const STEPS = 90
    let step = 0
    const timer = setInterval(() => {
      step++
      const progress = step / STEPS
      if (progress < 0.55) {
        setCounts({
          constructors: Math.floor(Math.random() * (STAT_TARGETS.constructors + 3)),
          drivers:      Math.floor(Math.random() * (STAT_TARGETS.drivers + 5)),
          wins:         Math.floor(Math.random() * (STAT_TARGETS.wins + 50)),
        })
      } else {
        const eased = 1 - Math.pow(1 - (progress - 0.55) / 0.45, 3)
        setCounts({
          constructors: Math.round(STAT_TARGETS.constructors * eased),
          drivers:      Math.round(STAT_TARGETS.drivers * eased),
          wins:         Math.round(STAT_TARGETS.wins * eased),
        })
      }
      if (step >= STEPS) clearInterval(timer)
    }, 1800 / STEPS)
    return () => clearInterval(timer)
  }, [statsVisible])

  const foundedRef = useRef(null)
  const [foundedVisible, setFoundedVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setFoundedVisible(true) },
      { threshold: 0.15 }
    )
    if (foundedRef.current) observer.observe(foundedRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <>
      <div style={styles.hero}>

        <video autoPlay muted loop playsInline style={styles.bgVideo}>
          <source src={heroBg} type="video/mp4" />
        </video>
        <div style={styles.stripe} />

        <div style={styles.content}>
          <img src={logo} alt="Red Bull Racing" style={styles.logo} />
          <p style={styles.eyebrow}>FORMULA ONE · CONSTRUCTOR DATA</p>

          <h1 style={styles.headline}>
            <span style={styles.headlineRed}>RED BULL</span>
            <span style={styles.headlineSub}>SEASONAL PITWALL</span>
          </h1>

          <span style={styles.accentLine} />

          <p style={styles.subtitle}>
            Explore race-by-race results, constructor standings, driver performance stats,
            and season-wide points data. All sourced live from the Ergast F1 API.
          </p>

          <div style={styles.buttons}>
            <Link
              to="/results"
              style={styles.btnPrimary}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#B8001F'
                e.currentTarget.style.transform = 'translateY(-2px)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#E8002D'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              VIEW RACE RESULTS
            </Link>

            <Link
              to="/stats"
              style={styles.btnSecondary}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#FFFFFF'
                e.currentTarget.style.transform = 'translateY(-2px)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              TEAM STATS
            </Link>
          </div>
        </div>

        <div ref={statsRef} style={styles.statsBar}>

          <div style={styles.stat}>
            <span style={styles.statNumber}>{counts.constructors}</span>
            <span style={styles.statLabel}>CONSTRUCTORS' TITLES</span>
          </div>

          <div style={styles.statDivider} />

          <div style={styles.stat}>
            <span style={styles.statNumber}>{counts.drivers}</span>
            <span style={styles.statLabel}>DRIVERS' TITLES</span>
          </div>

          <div style={styles.statDivider} />

          <div style={styles.stat}>
            <span style={styles.statNumber}>{counts.wins}</span>
            <span style={styles.statLabel}>RACE WINS</span>
          </div>

          <div style={styles.statDivider} />

          <div style={styles.stat}>
            <span style={styles.statNumber}>2005</span>
            <span style={styles.statLabel}>FOUNDED</span>
          </div>

        </div>
      </div>

      <div ref={foundedRef} style={{
        ...styles.foundedSection,
        opacity: foundedVisible ? 1 : 0,
        transform: foundedVisible ? 'translateY(0)' : 'translateY(40px)',
        transition: 'opacity 0.7s ease-out, transform 0.7s ease-out',
      }}>
        <div style={styles.foundedInner}>

          <div style={styles.foundedLeft}>
            <p style={styles.foundedEyebrow}>EST. 2005 · MILTON KEYNES, UK</p>
            <h2 style={styles.foundedHeadline}>BUILT TO WIN</h2>
            <p style={styles.foundedSubtitle}>A bit of history</p>
            <p style={styles.foundedBody}>
              Red Bull Racing was founded in January 2005 after Red Bull GmbH acquired the
              Jaguar Racing team. Based in Milton Keynes, the team took just five years to
              reach the top - clinching their first Constructors' Championship in 2010 and
              going on to dominate with four consecutive titles. Under the engineering
              leadership of Adrian Newey, Red Bull became one of the most successful
              constructors in Formula One history.
            </p>
          </div>

          <div style={styles.foundedRight}>
            {MILESTONES.map(({ year, text }, index) => (
              <div key={year} style={{
                opacity: foundedVisible ? 1 : 0,
                transition: `opacity 0.5s ease-out ${index * 100}ms`,
              }}>
                <div style={styles.milestone}>
                  <span style={styles.milestoneYear}>{year}</span>
                  <span style={styles.milestoneDot} />
                  <span style={styles.milestoneText}>{text}</span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </>
  )
}

const styles = {
  hero: {
    position: 'relative',
    minHeight: '100dvh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    overflow: 'hidden',
    paddingTop: '64px',
  },

  bgVideo: {
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    zIndex: 0,
  },

  stripe: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '200px',
    height: '100%',
    background: 'rgba(232, 0, 45, 0.15)',
    transform: 'skewX(-20deg)',
    animation: 'stripeSlide 1.5s ease-out 0.3s forwards',
    zIndex: 2,
  },

  content: {
    position: 'relative',
    zIndex: 2,
    textAlign: 'center',
    padding: '80px 24px',
    maxWidth: '800px',
    margin: '0 auto',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    animation: 'fadeUp 0.8s ease-out both',
  },

  logo: {
    height: '100px',
    width: 'auto',
    display: 'block',
    margin: '0 auto 36px',
  },

  eyebrow: {
    fontFamily: "'Barlow Condensed', sans-serif",
    fontSize: '13px',
    fontWeight: 600,
    letterSpacing: '0.3em',
    color: '#FFC906',
    marginBottom: '28px',
    opacity: 0.9,
  },

  headline: {
    fontFamily: "'Racing Sans One', sans-serif",
    fontSize: 'clamp(72px, 12vw, 160px)',
    fontWeight: 400,
    lineHeight: 0.9,
    letterSpacing: '0.02em',
    color: '#FFFFFF',
    textTransform: 'uppercase',
    textShadow: '0 2px 20px rgba(0,0,0,0.8)',
  },

  headlineSub: {
    display: 'block',
    fontFamily: "'Barlow Condensed', sans-serif",
    fontSize: 'clamp(20px, 3.5vw, 40px)',
    fontWeight: 700,
    letterSpacing: '0.2em',
    color: '#FFFFFF',
    textTransform: 'uppercase',
  },

  headlineRed: {
    color: '#E8002D',
    display: 'block',
  },

  accentLine: {
    display: 'block',
    width: '80px',
    height: '4px',
    background: '#E8002D',
    margin: '32px auto',
  },

  subtitle: {
    fontFamily: "'Barlow', sans-serif",
    fontSize: '18px',
    color: '#FFFFFF',
    lineHeight: 1.8,
    marginBottom: '52px',
    textShadow: '0 1px 12px rgba(0,0,0,1)',
  },

  buttons: {
    display: 'flex',
    gap: '20px',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },

  btnPrimary: {
    fontFamily: "'Barlow Condensed', sans-serif",
    fontSize: '15px',
    fontWeight: 700,
    letterSpacing: '0.12em',
    color: '#FFFFFF',
    background: '#E8002D',
    padding: '16px 40px',
    border: '2px solid #E8002D',
    cursor: 'pointer',
    transition: 'background 0.2s, transform 0.1s',
    display: 'inline-block',
  },

  btnSecondary: {
    fontFamily: "'Barlow Condensed', sans-serif",
    fontSize: '15px',
    fontWeight: 700,
    letterSpacing: '0.12em',
    color: '#FFFFFF',
    background: 'transparent',
    padding: '16px 40px',
    border: '2px solid rgba(255,255,255,0.3)',
    cursor: 'pointer',
    transition: 'border-color 0.2s, transform 0.1s',
    display: 'inline-block',
  },

  statsBar: {
    position: 'relative',
    zIndex: 2,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: 'rgba(9, 9, 9, 0.45)',
    backdropFilter: 'blur(12px)',
    borderTop: '1px solid rgba(0,64,204,0.15)',
    padding: 'clamp(16px, 4vw, 28px) clamp(8px, 4vw, 40px)',
    flexWrap: 'wrap',
  },

  stat: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '0 clamp(12px, 3vw, 40px)',
  },

  statNumber: {
    fontFamily: "'Barlow Condensed', sans-serif",
    fontSize: 'clamp(28px, 7vw, 48px)',
    fontWeight: 900,
    color: '#E8002D',
    lineHeight: 1,
    display: 'inline-block',
    transition: 'transform 0.2s ease',
    cursor: 'default',
  },

  statLabel: {
    fontFamily: "'Barlow Condensed', sans-serif",
    fontSize: '11px',
    fontWeight: 600,
    letterSpacing: '0.15em',
    color: '#4A5B78',
    marginTop: '4px',
  },

  statDivider: {
    width: '1px',
    height: '40px',
    background: 'rgba(255,255,255,0.1)',
  },

  foundedSection: {
    background: '#0D0D0D',
    borderTop: '1px solid rgba(0,64,204,0.12)',
    padding: 'clamp(40px, 8vw, 80px) clamp(16px, 3vw, 24px)',
  },

  foundedInner: {
    maxWidth: '1100px',
    margin: '0 auto',
    display: 'flex',
    gap: 'clamp(32px, 6vw, 80px)',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
  },

  foundedLeft: {
    flex: '1 1 340px',
  },

  foundedSubtitle: {
    fontFamily: "'Orbitron', sans-serif",
    fontSize: '14px',
    fontWeight: 500,
    color: '#4A5B78',
    letterSpacing: '0.15em',
    marginTop: '8px',
    marginBottom: '20px',
  },

  foundedEyebrow: {
    fontFamily: "'Barlow Condensed', sans-serif",
    fontSize: '12px',
    fontWeight: 600,
    letterSpacing: '0.3em',
    color: '#FFC906',
    marginBottom: '16px',
  },

  foundedHeadline: {
    fontFamily: "'Racing Sans One', sans-serif",
    fontSize: 'clamp(40px, 6vw, 72px)',
    fontWeight: 400,
    color: '#FFFFFF',
    lineHeight: 1,
    marginBottom: '20px',
  },

  foundedBody: {
    fontFamily: "'Barlow', sans-serif",
    fontSize: '16px',
    color: '#7A8899',
    lineHeight: 1.8,
  },

  foundedRight: {
    flex: '1 1 340px',
    display: 'flex',
    flexDirection: 'column',
  },

  milestone: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '16px 0 16px 12px',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
    borderLeft: '3px solid transparent',
  },

  milestoneYear: {
    fontFamily: "'Barlow Condensed', sans-serif",
    fontSize: '20px',
    fontWeight: 900,
    color: '#E8002D',
    minWidth: '52px',
  },

  milestoneDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    background: '#0055FF',
    flexShrink: 0,
  },

  milestoneText: {
    fontFamily: "'Barlow', sans-serif",
    fontSize: '14px',
    color: '#4A5B78',
    lineHeight: 1.5,
  },
}

export default Home
