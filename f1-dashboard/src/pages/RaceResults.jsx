import { useState, useEffect } from 'react'
import axios from 'axios'
import Table from '../components/Table'

const SEASONS = [
  '2026','2025','2024','2023','2022','2021','2020','2019','2018','2017',
  '2016','2015','2014','2013','2012','2011','2010','2009','2008','2007',
  '2006','2005'
]

const TABS = ['RACE RESULTS', 'DRIVER STANDINGS', 'LAP TIMES']

// Column definitions for each tab
// type: 'accent' = red bold, 'muted' = grey, 'yellow' = gold, default = white
const RESULTS_COLS = [
  { header: 'RND',     type: 'accent', render: r => r.round },
  { header: 'RACE',    type: 'normal', render: r => r.raceName },
  { header: 'CIRCUIT', type: 'muted',  render: r => r.Circuit?.circuitName },
  { header: 'DATE',    type: 'muted',  render: r => r.date },
  { header: 'WINNER',  type: 'normal', render: r => r.Results?.[0]?.Driver?.familyName || 'N/A' },
  { header: 'PTS',     type: 'yellow', render: r => r.Results?.[0]?.points || '0' },
]

const STANDINGS_COLS = [
  { header: 'POS',         type: 'accent', render: r => r.position },
  { header: 'DRIVER',      type: 'normal', render: r => r.driver },
  { header: 'NATIONALITY', type: 'muted',  render: r => r.nationality },
  { header: 'TEAM',        type: 'muted',  render: r => r.team },
  { header: 'WINS',        type: 'normal', render: r => r.wins },
  { header: 'PTS',         type: 'yellow', render: r => r.points },
]

const LAP_COLS = [
  { header: 'RANK',        type: 'accent', render: r => r.rank },
  { header: 'DRIVER',      type: 'normal', render: r => r.driver },
  { header: 'TEAM',        type: 'muted',  render: r => r.team },
  { header: 'FASTEST LAP', type: 'normal', render: r => r.fastestLap },
  { header: 'LAP NO.',     type: 'muted',  render: r => r.lap },
  { header: 'AVG KPH',     type: 'yellow', render: r => r.speed },
]

function RaceResults() {
  const [season, setSeason]         = useState('2026')
  const [activeTab, setActiveTab]   = useState('RACE RESULTS')
  const [visible, setVisible]       = useState(false)

  // Race results
  const [races, setRaces]                 = useState([])
  const [loadingResults, setLoadingResults] = useState(true)

  // Driver standings
  const [standingsData, setStandingsData]     = useState([])
  const [loadingStandings, setLoadingStandings] = useState(false)

  // Lap times
  const [lapData, setLapData]             = useState([])
  const [loadingLaps, setLoadingLaps]     = useState(false)
  const [selectedRound, setSelectedRound] = useState('')

  // Clear secondary data when season changes
  useEffect(() => {
    setStandingsData([])
    setLapData([])
    setSelectedRound('')
  }, [season])

  // Fetch race results on season change
  useEffect(() => {
    setVisible(false)
    setLoadingResults(true)
    axios.get(`https://api.jolpi.ca/ergast/f1/${season}/constructors/red_bull/results/?limit=100&format=json`)
      .then((res) => {
        setRaces(res.data.MRData.RaceTable.Races)
        setLoadingResults(false)
        setVisible(true)
      })
      .catch(() => {
        setLoadingResults(false)
        setVisible(true)
      })
  }, [season])

  // Fetch driver standings when that tab is first opened
  useEffect(() => {
    if (activeTab !== 'DRIVER STANDINGS' || standingsData.length > 0) return
    setLoadingStandings(true)
    axios.get(`https://api.jolpi.ca/ergast/f1/${season}/driverstandings/?format=json`)
      .then((res) => {
        const list = res.data.MRData.StandingsTable.StandingsLists[0]?.DriverStandings || []
        setStandingsData(list.map((s) => ({
          position:    s.position,
          driver:      `${s.Driver.givenName} ${s.Driver.familyName}`,
          nationality: s.Driver.nationality,
          team:        s.Constructors[0]?.name || 'N/A',
          wins:        s.wins,
          points:      s.points,
        })))
        setLoadingStandings(false)
      })
      .catch(() => setLoadingStandings(false))
  }, [activeTab, season, standingsData.length])

  // Fetch fastest laps when a round is selected
  useEffect(() => {
    if (!selectedRound) return
    setLoadingLaps(true)
    axios.get(`https://api.jolpi.ca/ergast/f1/${season}/${selectedRound}/results/?format=json`)
      .then((res) => {
        const results = res.data.MRData.RaceTable.Races[0]?.Results || []
        setLapData(
          results
            .filter((r) => r.FastestLap)
            .sort((a, b) => Number(a.FastestLap.rank) - Number(b.FastestLap.rank))
            .map((r) => ({
              rank:       r.FastestLap.rank,
              driver:     `${r.Driver.givenName} ${r.Driver.familyName}`,
              team:       r.Constructor.name,
              fastestLap: r.FastestLap.Time?.time || 'N/A',
              lap:        r.FastestLap.lap || 'N/A',
              speed:      r.FastestLap.AverageSpeed?.speed || 'N/A',
            }))
        )
        setLoadingLaps(false)
      })
      .catch(() => setLoadingLaps(false))
  }, [selectedRound, season])

  const isLoading =
    (activeTab === 'RACE RESULTS'     && loadingResults) ||
    (activeTab === 'DRIVER STANDINGS' && loadingStandings) ||
    (activeTab === 'LAP TIMES'        && loadingLaps)

  const activeData =
    activeTab === 'RACE RESULTS'     ? races :
    activeTab === 'DRIVER STANDINGS' ? standingsData :
    lapData

  const activeCols =
    activeTab === 'RACE RESULTS'     ? RESULTS_COLS :
    activeTab === 'DRIVER STANDINGS' ? STANDINGS_COLS :
    LAP_COLS

  return (
    <div style={styles.page}>

      <div style={styles.header}>
        <p style={styles.eyebrow}>{season} SEASON · RED BULL RACING</p>
        <h1 style={styles.title}>RACE RESULTS</h1>
        <span style={styles.accentLine} />

        {/* Selectors row */}
        <div style={styles.selectorRow}>
          <label style={styles.selectorLabel}>SEASON</label>
          <select
            value={season}
            onChange={(e) => setSeason(e.target.value)}
            style={styles.select}
          >
            {SEASONS.map((yr) => <option key={yr} value={yr}>{yr}</option>)}
          </select>

          {activeTab === 'LAP TIMES' && (
            <>
              <label style={styles.selectorLabel}>ROUND</label>
              <select
                value={selectedRound}
                onChange={(e) => setSelectedRound(e.target.value)}
                style={styles.select}
                disabled={races.length === 0}
              >
                <option value="">Select round</option>
                {races.map((r) => (
                  <option key={r.round} value={r.round}>
                    R{r.round} · {r.raceName}
                  </option>
                ))}
              </select>
            </>
          )}
        </div>

        {/* Tab switcher */}
        <div style={styles.tabRow}>
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{ ...styles.tab, ...(activeTab === tab ? styles.tabActive : {}) }}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <p style={styles.loading}>LOADING...</p>
      ) : activeTab === 'LAP TIMES' && !selectedRound ? (
        <p style={styles.placeholder}>Select a round above to view fastest laps</p>
      ) : (
        <div style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.4s ease-out' }}>
          <Table key={activeTab} data={activeData} columns={activeCols} />
        </div>
      )}

    </div>
  )
}

const styles = {

  page: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: 'clamp(80px, 10vw, 100px) clamp(12px, 3vw, 24px) 60px',
    animation: 'fadeUp 0.6s ease-out both',
  },

  header: {
    marginBottom: '32px',
  },

  eyebrow: {
    fontFamily: "'Barlow Condensed', sans-serif",
    fontSize: '12px',
    fontWeight: 600,
    letterSpacing: '0.3em',
    color: '#FFC906',
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
    marginBottom: '24px',
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

  tabRow: {
    display: 'flex',
    borderBottom: '1px solid rgba(255,255,255,0.08)',
    marginBottom: '24px',
  },

  tab: {
    fontFamily: "'Barlow Condensed', sans-serif",
    fontSize: '13px',
    fontWeight: 700,
    letterSpacing: '0.15em',
    color: '#7A8899',
    background: 'transparent',
    border: 'none',
    borderBottom: '2px solid transparent',
    padding: '12px 20px',
    cursor: 'pointer',
    transition: 'color 0.2s, border-color 0.2s',
    marginBottom: '-1px',
  },

  tabActive: {
    color: '#FFFFFF',
    borderBottom: '2px solid #E8002D',
  },

  loading: {
    fontFamily: "'Barlow Condensed', sans-serif",
    fontSize: '18px',
    letterSpacing: '0.2em',
    color: '#7A8899',
    textAlign: 'center',
    padding: '60px 0',
  },

  placeholder: {
    fontFamily: "'Barlow', sans-serif",
    fontSize: '15px',
    color: '#7A8899',
    textAlign: 'center',
    padding: '60px 0',
  },

}

export default RaceResults
