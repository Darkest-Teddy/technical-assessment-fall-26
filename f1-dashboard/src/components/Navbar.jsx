import { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import logo from '../assets/Redbull-Racing-Logo-Vector.svg-.png'

function Navbar() {
  const location = useLocation()
  const [hidden, setHidden] = useState(false)
  const lastScrollY = useRef(0)

  useEffect(() => {
    const handleScroll = () => {
      const current = window.scrollY
      setHidden(current > lastScrollY.current && current > 80)
      lastScrollY.current = current
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav style={{
      ...styles.nav,
      transform: hidden ? 'translateY(-100%)' : 'translateY(0)',
      transition: 'transform 0.3s ease',
    }}>
      <div style={styles.inner} className="nav-inner">

        <Link to="/" style={styles.brand}>
          <img src={logo} alt="Red Bull Racing" style={styles.logo} />
        </Link>

        <div style={styles.links} className="nav-links">
          <Link
            to="/"
            className="nav-link"
            style={{ ...styles.link, ...(location.pathname === '/' ? styles.linkActive : {}) }}
          >
            HOME
          </Link>

          <Link
            to="/results"
            className="nav-link"
            style={{ ...styles.link, ...(location.pathname === '/results' ? styles.linkActive : {}) }}
          >
            RESULTS
          </Link>

          <Link
            to="/stats"
            className="nav-link"
            style={{ ...styles.link, ...(location.pathname === '/stats' ? styles.linkActive : {}) }}
          >
            STATS
          </Link>
        </div>
      </div>
    </nav>
  )
}

const styles = {
  nav: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    background: 'linear-gradient(rgba(0,0,0,0.55) 0%, rgba(0,0,0,0) 100%)',
  },

  inner: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 24px',
    height: '64px',
  },

  brand: {
    display: 'flex',
    alignItems: 'center',
  },

  logo: {
    height: '36px',
    width: 'auto',
    display: 'block',
  },

  links: {
    display: 'flex',
    gap: '32px',
    alignItems: 'center',
  },

  link: {
    fontFamily: "'Barlow Condensed', sans-serif",
    fontSize: '14px',
    fontWeight: 700,
    letterSpacing: '0.12em',
    color: '#4A5B78',
    paddingBottom: '4px',
    borderBottom: '2px solid transparent',
    transition: 'color 0.2s, border-color 0.2s',
  },

  linkActive: {
    color: '#FFFFFF',
    borderBottom: '2px solid #E8002D',
  },
}

export default Navbar
