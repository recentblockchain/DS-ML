import { useState } from 'react'
import Header from './components/Header'
import Dashboard from './components/Dashboard'
import ModelMetrics from './components/ModelMetrics'
import DataVisualization from './components/DataVisualization'
import Models from './components/Models'
import './App.css'

function App() {
  const [activeTab, setActiveTab] = useState('dashboard')

  return (
    <div className="app">
      <Header activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="app-main">
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'metrics' && <ModelMetrics />}
        {activeTab === 'visualization' && <DataVisualization />}
        {activeTab === 'models' && <Models />}
      </main>
    </div>
  )
}

export default App

