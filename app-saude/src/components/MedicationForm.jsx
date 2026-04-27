import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useMedication } from '../context/MedicationContext';
import './MedicationForm.css';

const DAYS_OF_WEEK = [
  { id: 0, label: 'Dom' },
  { id: 1, label: 'Seg' },
  { id: 2, label: 'Ter' },
  { id: 3, label: 'Qua' },
  { id: 4, label: 'Qui' },
  { id: 5, label: 'Sex' },
  { id: 6, label: 'Sáb' },
];

const MedicationForm = ({ onClose, editingMed = null }) => {
  const { addMedication, editMedication } = useMedication();
  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');
  const [time, setTime] = useState('');
  const [selectedDays, setSelectedDays] = useState([0, 1, 2, 3, 4, 5, 6]);

  useEffect(() => {
    if (editingMed) {
      setName(editingMed.name);
      setDosage(editingMed.dosage || '');
      setTime(editingMed.time);
      setSelectedDays(editingMed.days || [0, 1, 2, 3, 4, 5, 6]);
    }
  }, [editingMed]);

  const toggleDay = (dayId) => {
    setSelectedDays(prev => 
      prev.includes(dayId) 
        ? prev.filter(d => d !== dayId) 
        : [...prev, dayId].sort()
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !time || selectedDays.length === 0) {
      alert("Preencha nome, horário e escolha pelo menos um dia.");
      return;
    }
    
    if (editingMed) {
      editMedication({ ...editingMed, name, dosage, time, days: selectedDays });
    } else {
      addMedication({ name, dosage, time, days: selectedDays });
    }
    onClose();
  };

  return (
    <div className="form-overlay">
      <div className="glass-card form-container">
        <div className="form-header">
          <h3>{editingMed ? 'Editar Medicamento' : 'Novo Medicamento'}</h3>
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

          <div className="form-group">
            <label>Dias da Semana</label>
            <div className="days-selector">
              {DAYS_OF_WEEK.map(day => (
                <button
                  key={day.id}
                  type="button"
                  className={`day-btn ${selectedDays.includes(day.id) ? 'selected' : ''}`}
                  onClick={() => toggleDay(day.id)}
                >
                  {day.label}
                </button>
              ))}
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '16px' }}>
            {editingMed ? 'Salvar Alterações' : 'Salvar Lembrete'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default MedicationForm;
