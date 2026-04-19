/* Chart.jsx - styled bar chart showing Red Bull points per season
 *
 * Receives an array of { season, points } objects as a prop from Stats.jsx
 * and uses Recharts to draw a bar chart.
 *
 * Recharts works by wrapping SVG drawing logic in React components.
 * You pass your data and configuration as props - it handles the math.
 */

import {
  BarChart,           // outer wrapper - sets up the chart canvas
  Bar,                // the actual bar shapes
  XAxis,              // horizontal axis (season years)
  YAxis,              // vertical axis (points scale)
  CartesianGrid,      // background grid lines
  Tooltip,            // popup on hover
  ResponsiveContainer // makes the chart fill its container width
} from 'recharts'

// Custom tooltip - replaces Recharts' default popup with our styled version
// active = is the user hovering over a bar right now
// payload = the data object for the bar being hovered
// label = the x-axis label (the season year)
function CustomTooltip({ active, payload, label }) {
  // optional chaining: payload?.length checks if payload exists AND has items
  // this is cleaner than "payload && payload.length"
  if (active && payload?.length) {
    return (
      <div style={tooltipStyles.box}>
        <p style={tooltipStyles.label}>{label}</p>
        <p style={tooltipStyles.value}>{payload[0].value} PTS</p>
      </div>
    )
  }
  return null
}

function Chart({ data = [] }) {

  // Find the highest points value so we can highlight the best season in yellow
  const maxPoints = Math.max(...data.map((d) => d.points))

  // We add a "fill" color to each data entry before passing to Recharts
  // This avoids using Cell (which is deprecated in Recharts v3)
  // The bar reads the "fill" field directly from each data object
  const coloredData = data.map((entry) => ({
    ...entry, // copy all existing fields (season, points)
    // best season gets yellow, all others get red
    fill: entry.points === maxPoints ? '#FFC906' : '#E8002D'
  }))

  return (
    <div style={styles.card}>

      <ResponsiveContainer width="100%" height={450}>
        <BarChart
          data={coloredData}
          margin={{ top: 20, right: 30, left: 10, bottom: 20 }}
        >
          {/* Very faint horizontal grid lines - vertical={false} hides vertical ones */}
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(255,255,255,0.05)"
            vertical={false}
          />

          {/* X axis - season years along the bottom */}
          <XAxis
            dataKey="race"
            tick={{ fill: '#4A5B78', fontFamily: 'Barlow Condensed', fontSize: 11, angle: -45, textAnchor: 'end', dy: 4 }}
            axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
            tickLine={false}
            interval={0}
            height={70}
          />

          {/* Y axis - points scale on the left */}
          <YAxis
            tick={{ fill: '#4A5B78', fontFamily: 'Barlow Condensed', fontSize: 13 }}
            axisLine={false}
            tickLine={false}
          />

          {/* Our custom styled tooltip */}
          <Tooltip
            content={<CustomTooltip />}
            cursor={{ fill: 'rgba(255,255,255,0.03)' }}
          />

          {/* Bar reads "fill" from each data object for individual bar colors
              radius rounds the top two corners of each bar */}
          <Bar
            dataKey="points"
            fill="fill"      /* tells Recharts to read the fill field per entry */
            radius={[2, 2, 0, 0]}
            isAnimationActive={true}
            animationDuration={1200}
            animationEasing="ease-out"
          />

        </BarChart>
      </ResponsiveContainer>

      {/* Legend - explains what the colors mean */}
      <div style={styles.legend}>
        <div style={styles.legendItem}>
          <div style={{ ...styles.legendDot, background: '#E8002D' }} />
          <span style={styles.legendLabel}>SEASON POINTS</span>
        </div>
        <div style={styles.legendItem}>
          <div style={{ ...styles.legendDot, background: '#FFC906' }} />
          <span style={styles.legendLabel}>BEST SEASON</span>
        </div>
      </div>

    </div>
  )
}

/* ─── STYLES ──────────────────────────────────────────────────────────────── */
const styles = {

  card: {
    background: '#0D1526',
    border: '1px solid rgba(255,255,255,0.06)',
    padding: '32px 16px 16px',
    animation: 'fadeIn 0.8s ease-out both',
  },

  legend: {
    display: 'flex',
    gap: '24px',
    justifyContent: 'center',
    marginTop: '16px',
  },

  legendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },

  legendDot: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
  },

  legendLabel: {
    fontFamily: "'Barlow Condensed', sans-serif",
    fontSize: '11px',
    fontWeight: 600,
    letterSpacing: '0.15em',
    color: '#4A5B78',
  },

}

const tooltipStyles = {

  box: {
    background: '#0A0F1E',
    border: '1px solid #E8002D',
    padding: '6px 10px',
  },

  label: {
    fontFamily: "'Inter', sans-serif",
    fontSize: '10px',
    fontWeight: 400,
    color: '#4A5B78',
    marginBottom: '2px',
  },

  value: {
    fontFamily: "'Space Mono', monospace",
    fontSize: '13px',
    fontWeight: 700,
    color: '#FFC906',
  },

}

export default Chart
