import { Home, Stethoscope, Calendar } from 'lucide-react';
import './BottomNavigation.css';

const BottomNavigation = ({ activeTab, setActiveTab }) => {
  return (
    <nav className="bottom-nav">
      <button 
        className={`nav-item ${activeTab === 'reminders' ? 'active' : ''}`}
        onClick={() => setActiveTab('reminders')}
      >
        <Home size={22} />
        <span>Remédios</span>
      </button>

      <button 
        className={`nav-item ${activeTab === 'appointments' ? 'active' : ''}`}
        onClick={() => setActiveTab('appointments')}
      >
        <Stethoscope size={22} />
        <span>Consultas</span>
      </button>
      
      <button 
        className={`nav-item ${activeTab === 'report' ? 'active' : ''}`}
        onClick={() => setActiveTab('report')}
      >
        <Calendar size={22} />
        <span>Relatório</span>
      </button>
    </nav>
  );
};

export default BottomNavigation;
