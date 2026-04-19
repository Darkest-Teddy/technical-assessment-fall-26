import { useState } from 'react'

function getCellStyle(type) {
  switch (type) {
    case 'accent': return styles.tdAccent
    case 'muted':  return styles.tdMuted
    case 'yellow': return styles.tdYellow
    default:       return styles.td
  }
}

function Table({ data = [], columns = [] }) {
  const [currentPage, setCurrentPage] = useState(0)
  const [searchTerm, setSearchTerm] = useState('')
  const [rowsPerPage, setRowsPerPage] = useState(20)

  const filteredData = data.filter((row) =>
    JSON.stringify(row).toLowerCase().includes(searchTerm.toLowerCase())
  )

  const startIndex  = currentPage * rowsPerPage
  const currentRows = filteredData.slice(startIndex, startIndex + rowsPerPage)
  const totalPages  = Math.ceil(filteredData.length / rowsPerPage)

  function handleSearch(e) {
    setSearchTerm(e.target.value)
    setCurrentPage(0)
  }

  function handleRowsPerPage(e) {
    setRowsPerPage(Number(e.target.value))
    setCurrentPage(0)
  }

  return (
    <div style={styles.wrapper}>

      <div style={styles.searchRow}>
        <input
          type="text"
          placeholder="Search races, circuits, drivers..."
          value={searchTerm}
          onChange={handleSearch}
          style={styles.searchInput}
        />
        <select value={rowsPerPage} onChange={handleRowsPerPage} style={styles.rowsSelect}>
          <option value={10}>10 rows</option>
          <option value={20}>20 rows</option>
          <option value={50}>50 rows</option>
        </select>
        <span style={styles.resultCount}>{filteredData.length} RESULTS</span>
      </div>

      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col.header} style={styles.th}>{col.header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentRows.map((row, index) => (
              <tr
                key={index}
                style={{
                  ...styles.tr,
                  animation: 'rowFadeIn 0.3s ease-out both',
                  animationDelay: `${index * 40}ms`,
                  background: index % 2 === 0 ? '#121212' : '#0D0D0D',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#1C1C1C'
                  e.currentTarget.style.borderLeft = '3px solid #0040CC'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = index % 2 === 0 ? '#121212' : '#0D0D0D'
                  e.currentTarget.style.borderLeft = '3px solid transparent'
                }}
              >
                {columns.map((col) => (
                  <td key={col.header} style={getCellStyle(col.type)}>
                    {col.render(row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={styles.pagination}>
        <button
          onClick={() => setCurrentPage(0)}
          disabled={currentPage === 0}
          style={{ ...styles.btn, ...(currentPage === 0 ? styles.btnDisabled : {}) }}
          onMouseEnter={(e) => { if (currentPage !== 0) e.currentTarget.style.background = 'rgba(0,64,204,0.15)' }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
        >
          «
        </button>

        <button
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 0))}
          disabled={currentPage === 0}
          style={{ ...styles.btn, ...(currentPage === 0 ? styles.btnDisabled : {}) }}
          onMouseEnter={(e) => { if (currentPage !== 0) e.currentTarget.style.background = 'rgba(0,64,204,0.15)' }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
        >
          ← PREV
        </button>

        <span style={styles.pageCount}>
          PAGE <span style={styles.pageNumber}>{currentPage + 1}</span> OF {totalPages || 1}
        </span>

        <button
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages - 1))}
          disabled={currentPage >= totalPages - 1}
          style={{ ...styles.btn, ...(currentPage >= totalPages - 1 ? styles.btnDisabled : {}) }}
          onMouseEnter={(e) => { if (currentPage < totalPages - 1) e.currentTarget.style.background = 'rgba(0,64,204,0.15)' }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
        >
          NEXT →
        </button>

        <button
          onClick={() => setCurrentPage(totalPages - 1)}
          disabled={currentPage >= totalPages - 1}
          style={{ ...styles.btn, ...(currentPage >= totalPages - 1 ? styles.btnDisabled : {}) }}
          onMouseEnter={(e) => { if (currentPage < totalPages - 1) e.currentTarget.style.background = 'rgba(0,64,204,0.15)' }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
        >
          »
        </button>

      </div>

    </div>
  )
}

const styles = {

  wrapper: {
    animation: 'fadeIn 0.6s ease-out both',
  },

  searchRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '16px',
    marginBottom: '16px',
    flexWrap: 'wrap',
  },

  searchInput: {
    flex: 1,
    minWidth: '200px',
    background: '#121212',
    border: '1px solid rgba(0,64,204,0.2)',
    borderBottom: '2px solid #0040CC',
    color: '#F0F0F0',
    fontFamily: "'Barlow', sans-serif",
    fontSize: '14px',
    padding: '12px 16px',
    outline: 'none',
  },

  rowsSelect: {
    fontFamily: "'Barlow Condensed', sans-serif",
    fontSize: '14px',
    fontWeight: 700,
    letterSpacing: '0.1em',
    color: '#F0F0F0',
    background: '#121212',
    border: '1px solid rgba(0,64,204,0.2)',
    borderBottom: '2px solid #0040CC',
    padding: '12px 16px',
    cursor: 'pointer',
    outline: 'none',
  },

  resultCount: {
    fontFamily: "'Barlow Condensed', sans-serif",
    fontSize: '12px',
    fontWeight: 700,
    letterSpacing: '0.15em',
    color: '#7A8899',
    whiteSpace: 'nowrap',
  },

  tableWrapper: {
    overflowX: 'auto',
    borderRadius: '2px',
    border: '1px solid rgba(0,64,204,0.12)',
  },

  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '14px',
  },

  th: {
    fontFamily: "'Barlow Condensed', sans-serif",
    fontSize: '11px',
    fontWeight: 700,
    letterSpacing: '0.15em',
    color: '#7A8899',
    padding: '14px 16px',
    textAlign: 'left',
    background: '#090909',
    borderBottom: '2px solid #E8002D',
  },

  tr: {
    borderLeft: '3px solid transparent',
    transition: 'background 0.15s, border-left 0.15s',
    cursor: 'default',
  },

  td: {
    padding: '13px 16px',
    color: '#F0F0F0',
    borderBottom: '1px solid rgba(0,64,204,0.06)',
    fontFamily: "'Barlow', sans-serif",
  },

  tdAccent: {
    padding: '13px 16px',
    color: '#E8002D',
    fontFamily: "'Barlow Condensed', sans-serif",
    fontWeight: 700,
    fontSize: '16px',
    borderBottom: '1px solid rgba(0,64,204,0.06)',
  },

  tdMuted: {
    padding: '13px 16px',
    color: '#7A8899',
    fontFamily: "'Barlow', sans-serif",
    fontSize: '13px',
    borderBottom: '1px solid rgba(0,64,204,0.06)',
  },

  tdYellow: {
    padding: '13px 16px',
    color: '#FFB800',
    fontFamily: "'Barlow Condensed', sans-serif",
    fontWeight: 700,
    fontSize: '16px',
    borderBottom: '1px solid rgba(0,64,204,0.06)',
  },

  pagination: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '24px',
    marginTop: '24px',
    padding: '16px 0',
  },

  btn: {
    fontFamily: "'Barlow Condensed', sans-serif",
    fontSize: '13px',
    fontWeight: 700,
    letterSpacing: '0.1em',
    color: '#F0F0F0',
    background: 'transparent',
    border: '2px solid #0040CC',
    padding: '10px 24px',
    cursor: 'pointer',
    transition: 'background 0.2s',
  },

  btnDisabled: {
    opacity: 0.3,
    cursor: 'not-allowed',
    borderColor: '#7A8899',
  },

  pageCount: {
    fontFamily: "'Barlow Condensed', sans-serif",
    fontSize: '13px',
    letterSpacing: '0.1em',
    color: '#7A8899',
  },

  pageNumber: {
    color: '#F0F0F0',
    fontWeight: 700,
  },

}

export default Table
