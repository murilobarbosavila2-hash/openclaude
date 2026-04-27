import { useState } from 'react';
import { Plus, Bell, Check, Trash2, Pencil } from 'lucide-react';
import { useMedication } from '../context/MedicationContext';
import MedicationForm from './MedicationForm';
import './MedicationList.css';

const MedicationList = () => {
  const { medications, history, markAsTaken, markAsUntaken, removeMedication } = useMedication();
  const [showForm, setShowForm] = useState(false);
  const [editingMed, setEditingMed] = useState(null);
  
  const todayStr = new Date().toISOString().split('T')[0];
  const todaysHistory = history[todayStr] || [];

  const handleEdit = (med) => {
    setEditingMed(med);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingMed(null);
  };

  return (
    <div className="medication-list-container">
      <div className="list-header">
        <h2>Seus Medicamentos</h2>
        <button className="btn-icon" onClick={() => setShowForm(true)} aria-label="Adicionar medicação">
          <Plus size={24} color="var(--primary-color)" />
        </button>
      </div>

      {showForm && <MedicationForm onClose={handleCloseForm} editingMed={editingMed} />}

      <div className="medications">
        {medications.length === 0 ? (
          <div className="empty-state">
            <p>Nenhum medicamento cadastrado ainda.</p>
          </div>
        ) : (
          medications.map(med => {
            const isTaken = todaysHistory.includes(med.id);
            return (
              <div key={med.id} className={`glass-card med-card ${isTaken ? 'taken' : ''}`}>
                <div className="med-info">
                  <h3>{med.name}</h3>
                  <p>{med.dosage} • {med.time}</p>
                </div>
                
                <div className="med-actions">
                  <button 
                    className={`btn-icon ${isTaken ? 'active-check' : ''}`}
                    onClick={() => isTaken ? markAsUntaken(med.id, todayStr) : markAsTaken(med.id, todayStr)}
                  >
                    <Check size={20} />
                  </button>
                  <button 
                    className="btn-icon"
                    style={{ color: 'var(--text-secondary)' }}
                    onClick={() => handleEdit(med)}
                  >
                    <Pencil size={20} />
                  </button>
                  <button 
                    className="btn-icon danger"
                    onClick={() => removeMedication(med.id)}
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default MedicationList;
