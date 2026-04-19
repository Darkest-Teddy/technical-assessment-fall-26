/* Stats.jsx - the chart page
 *
 * Shows Red Bull's points scored per race for the selected season as a bar chart.
 * Season selector added - user can switch between any of Red Bull's 22 seasons.
 * When season changes, useEffect re-runs and fetches fresh data automatically.
 */

import { useState, useEffect } from 'react'
import axios from 'axios'
import Chart from '../components/Chart'

// All seasons Red Bull Racing has competed in (2005–2026)
const SEASONS = [
  '2026','2025','2024','2023','2022','2021','2020','2019','2018','2017',
  '2016','2015','2014','2013','2012','2011','2010','2009','2008','2007',
  '2006','2005'
]

// Defined outside the component so it's not recreated on every render
// Takes a single race object and returns the total constructor points
// by adding up every driver's individual points using .reduce()
function getTotalPoints(race) {
  return race.Results.reduce((accumulator, result) => {
    return accumulator + Number(result.points)
  }, 0)
}

function Stats() {

  // racePoints = array of { race, points } objects built from the API response
  const [racePoints, setRacePoints] = useState([])

  // loading = true while waiting for API, false once data arrives
  const [loading, setLoading] = useState(true)

  // visible = controls opacity of the chart area - fades out on fetch, in when ready
  const [visible, setVisible] = useState(false)

  // season = which year we're showing (defaults to 2026)
  const [season, setSeason] = useState('2026')

  // useEffect re-runs every time season changes
  useEffect(() => {
    setVisible(false)  /* fade out before fetching */
    setLoading(true)
    axios.get(`https://api.jolpi.ca/ergast/f1/${season}/constructors/red_bull/results/?limit=100&format=json`)
      .then((response) => {
        const races = response.data.MRData.RaceTable.Races

        // Each race has two Red Bull drivers - we add their points together
        // to get the total constructor points for that race
        const chartData = races.map((race) => ({
          race: race.raceName.replace('Grand Prix', 'GP'),
          points: getTotalPoints(race)
        }))

        setRacePoints(chartData)
        setLoading(false)
        setVisible(true)  /* fade chart back in */
      })
      .catch((error) => {
        console.error('Error fetching stats data:', error)
        setLoading(false)
        setVisible(true)
      })

  }, [season]) /* re-fetch whenever season changes */

  if (loading) {
    return (
      <div style={styles.loadingWrapper}>
        <p style={styles.loading}>LOADING STATS...</p>
      </div>
    )
  }

  return (
    <div style={styles.page}>

      {/* ── PAGE HEADER ──────────────────────────────────────────────────── */}
      <div style={styles.header}>
        <p style={styles.eyebrow}>{season} SEASON · CONSTRUCTOR PERFORMANCE</p>
        <h1 style={styles.title}>TEAM STATS</h1>
        <span aria-hidden="true" style={styles.accentLine} />

        {/* ── SEASON SELECTOR ────────────────────────────────────────────── */}
        <div style={styles.selectorRow}>
          <label htmlFor="season-select" style={styles.selectorLabel}>SEASON</label>
          <select
            id="season-select"
            value={season}
            onChange={(e) => setSeason(e.target.value)}
            style={styles.select}
          >
            {SEASONS.map((yr) => (
              <option key={yr} value={yr}>{yr}</option>
            ))}
          </select>
        </div>

        <p style={styles.subtitle}>
          Points per race weekend, both drivers combined
        </p>
      </div>

      <div style={{
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.4s ease-out',
      }}>
        <Chart data={racePoints} />
      </div>

    </div>
  )
}

/* ─── STYLES ──────────────────────────────────────────────────────────────── */
const styles = {

  page: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: 'clamp(80px, 10vw, 100px) clamp(12px, 3vw, 24px) 60px',
    animation: 'fadeUp 0.6s ease-out both',
  },

  header: {
    marginBottom: '48px',
  },

  eyebrow: {
    fontFamily: "'Barlow Condensed', sans-serif",
    fontSize: '12px',
    fontWeight: 600,
    letterSpacing: '0.3em',
    color: '#FFB800',
    marginBottom: '12px',
  },

  title: {
    fontFamily: "'Barlow Condensed', sans-serif",
    fontSize: 'clamp(48px, 6vw, 80px)',
    fontWeight: 900,
    color: '#FFFFFF',
    lineHeight: 1,
  },

  accentLine: {
    display: 'block',
    width: '60px',
    height: '4px',
    background: '#E8002D',
    margin: '20px 0',
  },

  selectorRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '16px',
    flexWrap: 'wrap',
  },

  selectorLabel: {
    fontFamily: "'Barlow Condensed', sans-serif",
    fontSize: '11px',
    fontWeight: 700,
    letterSpacing: '0.2em',
    color: '#7A8899',
  },

  select: {
    fontFamily: "'Barlow Condensed', sans-serif",
    fontSize: '14px',
    fontWeight: 700,
    letterSpacing: '0.1em',
    color: '#F0F0F0',
    background: '#121212',
    border: '1px solid rgba(0,64,204,0.3)',
    borderBottom: '2px solid #0040CC',
    padding: '8px 16px',
    cursor: 'pointer',
    outline: 'none',
  },

  subtitle: {
    fontFamily: "'Barlow', sans-serif",
    fontSize: '16px',
    color: '#7A8899',
  },

  loadingWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
  },

  loading: {
    fontFamily: "'Barlow Condensed', sans-serif",
    fontSize: '18px',
    letterSpacing: '0.2em',
    color: '#7A8899',
    animation: 'loadingPulse 1.2s ease-in-out infinite',
  },

}

export default Stats
