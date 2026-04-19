// App.jsx - the root component, wires everything together
//
// Now also handles:
//   - Global animated background (two glowing orbs that slowly pulse)
//   - Page transition animation via useLocation key on the Routes wrapper

// BrowserRouter - activates React Router
// Routes, Route - define which page shows at which URL
// useLocation - tells us the current URL path (used for page transitions)
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'

import Navbar from './components/Navbar'
import Home from './pages/Home'
import RaceResults from './pages/RaceResults'
import Stats from './pages/Stats'

// AnimatedRoutes is a separate component from App so it can use useLocation.
// useLocation only works INSIDE BrowserRouter - if we called it directly
// in App, it would crash because BrowserRouter hasn't wrapped it yet.
// Splitting it out solves that problem.
function AnimatedRoutes() {

  // useLocation gives us the current URL - e.g. { pathname: "/results" }
  // We use location.pathname as the "key" on the wrapper div below.
  // When the key changes (i.e. user navigates to a new page),
  // React destroys the old div and creates a new one -
  // which restarts the CSS animation, giving us a smooth page transition.
  const location = useLocation()

  return (
    // This div wraps all page content.
    // key={location.pathname} means every time the URL changes,
    // React treats this as a brand new element and reruns the animation.
    // pageMountFade is defined in index.css
    <div
      key={location.pathname}
      style={{
        animation: 'pageMountFade 0.4s ease-out both',
        minHeight: '100vh',
      }}
    >
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/results" element={<RaceResults />} />
        <Route path="/stats" element={<Stats />} />
      </Routes>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>

      {/* ── GLOBAL ANIMATED BACKGROUND ────────────────────────────────────
       * Two large blurred orbs that slowly pulse behind all content.
       * position: fixed means they stay in place even when you scroll.
       * They sit at z-index: 0 so all page content renders above them.
       * This gives the Results and Stats pages the same alive feeling
       * as the Home hero, but much more subtle.
       */}

      {/* Blue orb - top left */}
      <div style={{
        position: 'fixed',
        top: '-20vh',
        left: '-10vw',
        width: '60vw',
        height: '60vw',
        borderRadius: '50%',        /* makes it a circle */
        background: 'radial-gradient(circle, rgba(0,64,204,0.1) 0%, transparent 70%)',  /* Oracle blue glow */
        animation: 'pulseGlow 8s ease-in-out infinite',
        /* pulseGlow defined in index.css - slowly breathes in and out */
        zIndex: 0,
        pointerEvents: 'none',      /* clicks pass through it - it's purely decorative */
      }} />

      {/* Red orb - bottom right */}
      <div style={{
        position: 'fixed',
        bottom: '-20vh',
        right: '-10vw',
        width: '50vw',
        height: '50vw',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(232,0,45,0.08) 0%, transparent 70%)',  /* subtle red glow */
        animation: 'pulseGlow 10s ease-in-out infinite 2s',
        /* 2s delay so it's out of phase with the red orb - they breathe at different times */
        zIndex: 0,
        pointerEvents: 'none',
      }} />

      {/* Third orb - faint blue, center-right, out of phase with the others */}
      <div style={{
        position: 'fixed',
        top: '40vh',
        right: '20vw',
        width: '30vw',
        height: '30vw',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(232,0,45,0.06) 0%, transparent 70%)',
        animation: 'pulseGlow 12s ease-in-out infinite 4s',
        zIndex: 0,
        pointerEvents: 'none',
      }} />

      {/* Scanline overlay - thin horizontal lines at 4px repeat, barely visible.
       * Gives the dark background a subtle CRT / broadcast monitor texture.
       * pointerEvents: none means clicks pass straight through it. */}
      <div style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.04) 3px, rgba(0,0,0,0.04) 4px)',
      }} />

      {/* Navbar always visible - z-index 1000 in its own styles so it floats above orbs */}
      <Navbar />

      {/* AnimatedRoutes handles the page transition and route matching */}
      <AnimatedRoutes />

    </BrowserRouter>
  )
}

export default App
