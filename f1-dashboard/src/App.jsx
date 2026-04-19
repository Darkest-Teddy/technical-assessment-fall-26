// App.jsx - the root component, wires everything together
//
// Handles:
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

      {/* Navbar always visible */}
      <Navbar />

      {/* AnimatedRoutes handles the page transition and route matching */}
      <AnimatedRoutes />

    </BrowserRouter>
  )
}

export default App
