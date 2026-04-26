import { Home, Calendar } from 'lucide-react';
import './BottomNavigation.css';

const BottomNavigation = ({ activeTab, setActiveTab }) => {
  return (
    <nav className="bottom-nav">
      <button 
        className={`nav-item ${activeTab === 'reminders' ? 'active' : ''}`}
        onClick={() => setActiveTab('reminders')}
      >
        <Home size={24} />
        <span>Lembretes</span>
      </button>
      
      <button 
        className={`nav-item ${activeTab === 'report' ? 'active' : ''}`}
        onClick={() => setActiveTab('report')}
      >
        <Calendar size={24} />
        <span>Relatório</span>
      </button>
    </nav>
  );
};

export default BottomNavigation;
