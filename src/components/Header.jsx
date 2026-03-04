import './Header.css'

function Header({ activeTab, onTabChange }) {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'metrics', label: 'Model Metrics' },
    { id: 'visualization', label: 'Visualization' },
    { id: 'models', label: 'Models' },
  ]

  return (
    <header className="header">
      <div className="header-brand">
        <span className="header-icon">🧠</span>
        <div>
          <h1 className="header-title">DS-ML Dashboard</h1>
          <p className="header-subtitle">Data Science &amp; Machine Learning</p>
        </div>
      </div>
      <nav className="header-nav">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`nav-tab ${activeTab === tab.id ? 'nav-tab--active' : ''}`}
            onClick={() => onTabChange(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </header>
  )
}

export default Header
