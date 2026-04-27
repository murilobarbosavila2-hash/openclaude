import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useMedication } from '../context/MedicationContext';
import './AppointmentForm.css';

const AppointmentForm = ({ onClose, editingAppt = null }) => {
  const { addAppointment, editAppointment } = useMedication();
  const [doctor, setDoctor] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');

  // Se estiver editando, preenche os campos com os dados existentes
  useEffect(() => {
    if (editingAppt) {
      setDoctor(editingAppt.doctor || '');
      setDate(editingAppt.date || '');
      setTime(editingAppt.time || '');
      setLocation(editingAppt.location || '');
      setNotes(editingAppt.notes || '');
    }
  }, [editingAppt]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!doctor || !date || !time) {
      alert('Preencha pelo menos o médico, a data e o horário.');
      return;
    }

    const apptData = { doctor, date, time, location, notes };

    if (editingAppt) {
      editAppointment({ ...editingAppt, ...apptData });
    } else {
      addAppointment(apptData);
    }
    onClose();
  };

  return (
    <div className="form-overlay">
      <div className="glass-card form-container">
        <div className="form-header">
          <h3>{editingAppt ? 'Editar Consulta' : 'Nova Consulta'}</h3>
          <button className="btn-icon" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Médico / Especialidade</label>
            <input
              type="text"
              className="form-control"
              value={doctor}
              onChange={(e) => setDoctor(e.target.value)}
              placeholder="Ex: Dr. Silva — Cardiologista"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Data</label>
              <input
                type="date"
                className="form-control"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
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
          </div>

          <div className="form-group">
            <label>Local (Opcional)</label>
            <input
              type="text"
              className="form-control"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Ex: Hospital São Lucas, Sala 305"
            />
          </div>

          <div className="form-group">
            <label>Observações (Opcional)</label>
            <textarea
              className="form-control form-textarea"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ex: Levar exames de sangue do mês passado"
              rows={3}
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '16px' }}>
            {editingAppt ? 'Salvar Alterações' : 'Agendar Consulta'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AppointmentForm;
