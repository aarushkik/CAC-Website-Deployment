import { useEffect, useState } from 'react'
import './App.css'

const tools = [
  {
    title: 'Diagnostics',
    label: 'Diagnostics',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="10" cy="10" r="6" />
        <path d="M16.5 16.5L20 20" />
      </svg>
    ),
    description: 'Run live scans, detect faults, and prioritize repair actions.',
  },
  {
    title: 'Repair',
    label: 'Repair',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 12l6 6 10-10-6-6L6 12Z" />
        <path d="M9 9l6 6" />
      </svg>
    ),
    description: 'Open the repair console to apply fixes and restore systems quickly.',
  },
  {
    title: 'AI',
    label: 'AI',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
        <rect x="6" y="6" width="12" height="12" rx="3" />
        <path d="M8 9h8" />
        <path d="M8 12h8" />
        <path d="M8 15h5" />
      </svg>
    ),
    description: 'Get repair guidance, diagnostics summaries, and fast troubleshooting help.',
  },
  {
    title: 'Patch',
    label: 'Patch',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3 5 6v6c0 4.5 3 8.5 7 10 4-1.5 7-5.5 7-10V6l-7-3Z" />
        <path d="M9 12h6" />
        <path d="M12 9v6" />
      </svg>
    ),
    description: 'Deploy the latest maintenance patches and confirm system updates.',
  },
  {
    title: 'Schedule',
    label: 'Schedule',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
        <path d="M7 4v4" />
        <path d="M17 4v4" />
        <rect x="4" y="8" width="16" height="12" rx="3" />
        <path d="M12 12v4" />
      </svg>
    ),
    description: 'Plan maintenance windows and track upcoming repair tasks.',
  },
  {
    title: 'Log',
    label: 'Log',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
        <rect x="7" y="4" width="10" height="16" rx="2" />
        <path d="M9 9h6" />
        <path d="M9 13h6" />
        <path d="M9 17h4" />
      </svg>
    ),
    description: 'Review incident history, repair notes, and service events.',
  },
  {
    title: 'Support',
    label: 'Support',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="7" />
        <path d="M12 8v1" />
        <path d="M12 15v1" />
        <path d="M8 12h1" />
        <path d="M15 12h1" />
      </svg>
    ),
    description: 'Open support resources, help guides, and escalation tools.',
  },
]

function App() {
  const [stage, setStage] = useState<'intro' | 'main'>('intro')
  const [activeTool, setActiveTool] = useState('Diagnostics')
  const [search, setSearch] = useState('')
  const [isSearchFocused, setIsSearchFocused] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setStage('main'), 1600)
    return () => clearTimeout(timer)
  }, [])

  const triggerHaptic = () => {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(10)
    }
  }

  const tool = tools.find((item) => item.title === activeTool) ?? tools[0]
  const filteredTools = tools.filter((item) => item.title.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="app-shell">
      <div className={`intro-screen ${stage === 'main' ? 'hidden' : ''}`}>
        <div className="intro-content">
          <span className="intro-dot" />
          <h1>Fix-It</h1>
          <p>Repair interface for WA03</p>
        </div>
      </div>

      <div className={`app-content ${stage === 'main' ? 'visible' : ''}`}>
        <div className="phone-shell">
          <div className="phone-notch" />
          <div className="phone-screen">
            <div className="search-block">
              <div className={`search-box ${isSearchFocused ? 'active' : ''}`}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="10" cy="10" r="6" />
                  <path d="M16.5 16.5L20 20" />
                </svg>
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  placeholder="Search tools, repairs, alerts"
                />
              </div>
            </div>

            <div className="phone-body">
              <aside className="side-nav">
                <div className="side-heading">Tools</div>
                <div className="side-list">
                  {filteredTools.map((toolItem) => (
                    <button
                      key={toolItem.title}
                      type="button"
                      className={`side-item ${toolItem.title === activeTool ? 'active' : ''}`}
                      aria-label={toolItem.title}
                      onClick={() => {
                        setActiveTool(toolItem.title)
                        triggerHaptic()
                      }}
                    >
                      {toolItem.icon}
                    </button>
                  ))}
                </div>
              </aside>

              <main className="main-panel">
                <div className="panel-header">
                  <h1>Fix It</h1>
                  <button className="icon-button" aria-label="AI helper" onPointerDown={triggerHaptic}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 3v4" />
                      <path d="M12 17v4" />
                      <path d="M4.2 7.5l2.8 2.8" />
                      <path d="M17 7l2.8 2.8" />
                      <path d="M7 17l2.8-2.8" />
                      <path d="M17 17l2.8-2.8" />
                      <circle cx="12" cy="12" r="4" />
                    </svg>
                  </button>
                </div>

                <section key={tool.title} className="content-panel">
                  <div className="content-top">
                    <span className="content-label">{tool.title}</span>
                    <p>{tool.description}</p>
                  </div>
                  <div className="content-actions">
                    <button className="primary-button" onPointerDown={triggerHaptic}>
                      Open {tool.title}
                    </button>
                    <button className="secondary-button" onPointerDown={triggerHaptic}>
                      Details
                    </button>
                  </div>
                  <div className="content-grid">
                    <div>
                      <strong>Fast</strong>
                      <span>Instant action with one tap</span>
                    </div>
                    <div>
                      <strong>Clear</strong>
                      <span>One screen for every repair flow</span>
                    </div>
                  </div>
                </section>
              </main>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
