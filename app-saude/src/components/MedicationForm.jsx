import { useState } from 'react';
import { X } from 'lucide-react';
import { useMedication } from '../context/MedicationContext';
import './MedicationForm.css';

const MedicationForm = ({ onClose }) => {
  const { addMedication } = useMedication();
  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');
  const [time, setTime] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !time) return;
    
    addMedication({ name, dosage, time });
    onClose();
  };

  return (
    <div className="form-overlay">
      <div className="glass-card form-container">
        <div className="form-header">
          <h3>Novo Medicamento</h3>
          <button className="btn-icon" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nome do Medicamento</label>
            <input 
              type="text" 
              className="form-control" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Paracetamol"
              required
            />
          </div>
          
          <div className="form-group">
            <label>Dosagem (Opcional)</label>
            <input 
              type="text" 
              className="form-control" 
              value={dosage}
              onChange={(e) => setDosage(e.target.value)}
              placeholder="Ex: 500mg"
            />
          </div>

          <div className="form-group">
            <label>Horário</label>
            <input 
              type="time" 
              className="form-control" 
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '16px' }}>
            Salvar Lembrete
          </button>
        </form>
      </div>
    </div>
  );
};

export default MedicationForm;
