import { useState } from 'react'
import { MedicationProvider } from './context/MedicationContext'
import BottomNavigation from './components/BottomNavigation'
import MedicationList from './components/MedicationList'
import AppointmentList from './components/AppointmentList'
import DailyReport from './components/DailyReport'
import NotificationSystem from './components/NotificationSystem'
import './index.css'

function App() {
  const [activeTab, setActiveTab] = useState('reminders')

  return (
    <MedicationProvider>
      <div className="app-container">
        <header className="header">
          <h1>HealthCare App</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
            {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
        </header>

        <NotificationSystem />

        <main className="content-area">
          {activeTab === 'reminders' && <MedicationList />}
          {activeTab === 'appointments' && <AppointmentList />}
          {activeTab === 'report' && <DailyReport />}
        </main>

        <BottomNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
    </MedicationProvider>
  )
}

export default App
