import { useMedication } from '../context/MedicationContext';
import { CheckCircle2, Circle } from 'lucide-react';
import './DailyReport.css';

const DailyReport = () => {
  const { medications, history } = useMedication();
  
  const todayStr = new Date().toISOString().split('T')[0];
  const todaysHistory = history[todayStr] || [];

  const totalMeds = medications.length;
  const takenMeds = todaysHistory.length;
  
  // Prevent division by zero
  const progressPercentage = totalMeds === 0 ? 0 : Math.round((takenMeds / totalMeds) * 100);

  return (
    <div className="report-container">
      <div className="report-header">
        <h2>Progresso Diário</h2>
        <p>Acompanhe suas medicações de hoje</p>
      </div>

      <div className="glass-card progress-card">
        <div className="progress-info">
          <div>
            <span className="progress-value">{progressPercentage}%</span>
            <span className="progress-label">Concluído</span>
          </div>
          <div className="progress-stats">
            {takenMeds} de {totalMeds} medicamentos
          </div>
        </div>
        
        <div className="progress-bar-bg">
          <div 
            className="progress-bar-fill" 
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>

      <div className="report-list">
        <h3>Detalhes de Hoje</h3>
        {medications.length === 0 ? (
          <p className="empty-text">Sem medicamentos cadastrados.</p>
        ) : (
          <div className="timeline">
            {medications.map(med => {
              const isTaken = todaysHistory.includes(med.id);
              return (
                <div key={med.id} className="timeline-item">
                  <div className="timeline-icon">
                    {isTaken ? (
                      <CheckCircle2 size={24} color="var(--secondary-color)" />
                    ) : (
                      <Circle size={24} color="var(--text-secondary)" />
                    )}
                  </div>
                  <div className={`timeline-content ${isTaken ? 'taken' : ''}`}>
                    <h4>{med.name}</h4>
                    <p>{med.time} {med.dosage && `• ${med.dosage}`}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default DailyReport;
