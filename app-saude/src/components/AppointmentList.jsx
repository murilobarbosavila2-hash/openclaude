import { useState } from 'react';
import { Plus, Pencil, Trash2, MapPin, Clock } from 'lucide-react';
import { useMedication } from '../context/MedicationContext';
import AppointmentForm from './AppointmentForm';
import './AppointmentList.css';

const AppointmentList = () => {
  const { appointments, removeAppointment } = useMedication();
  const [showForm, setShowForm] = useState(false);
  const [editingAppt, setEditingAppt] = useState(null);

  const handleEdit = (appt) => {
    setEditingAppt(appt);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingAppt(null);
  };

  // Ordena as consultas da data mais próxima para a mais distante
  const sortedAppointments = [...appointments].sort((a, b) => {
    const dateA = new Date(`${a.date}T${a.time}`);
    const dateB = new Date(`${b.date}T${b.time}`);
    return dateA - dateB;
  });

  // Separa as consultas em futuras e passadas
  const now = new Date();
  const upcoming = sortedAppointments.filter(appt => new Date(`${appt.date}T${appt.time}`) >= now);
  const past = sortedAppointments.filter(appt => new Date(`${appt.date}T${appt.time}`) < now);

  // Formata a data para exibição legível (ex: "28 de abril de 2026")
  const formatDate = (dateStr) => {
    const [year, month, day] = dateStr.split('-');
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const renderCard = (appt, isPast = false) => (
    <div key={appt.id} className={`glass-card appt-card ${isPast ? 'past' : ''}`}>
      <div className="appt-color-bar"></div>
      <div className="appt-body">
        <div className="appt-info">
          <h3>{appt.doctor}</h3>
          <div className="appt-meta">
            <span className="appt-tag">
              <Clock size={14} />
              {formatDate(appt.date)} às {appt.time}
            </span>
            {appt.location && (
              <span className="appt-tag">
                <MapPin size={14} />
                {appt.location}
              </span>
            )}
          </div>
          {appt.notes && <p className="appt-notes">{appt.notes}</p>}
        </div>
        <div className="appt-actions">
          <button className="btn-icon" style={{ color: 'var(--text-secondary)' }} onClick={() => handleEdit(appt)}>
            <Pencil size={18} />
          </button>
          <button className="btn-icon danger" onClick={() => removeAppointment(appt.id)}>
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="appointment-list-container">
      <div className="list-header">
        <h2>Suas Consultas</h2>
        <button className="btn-icon" onClick={() => setShowForm(true)} aria-label="Adicionar consulta">
          <Plus size={24} color="var(--primary-color)" />
        </button>
      </div>

      {showForm && <AppointmentForm onClose={handleCloseForm} editingAppt={editingAppt} />}

      {appointments.length === 0 ? (
        <div className="empty-state">
          <p>Nenhuma consulta agendada ainda.</p>
        </div>
      ) : (
        <>
          {upcoming.length > 0 && (
            <div className="appt-section">
              <h3 className="appt-section-title">Próximas</h3>
              <div className="appt-list">{upcoming.map(appt => renderCard(appt))}</div>
            </div>
          )}
          {past.length > 0 && (
            <div className="appt-section">
              <h3 className="appt-section-title">Passadas</h3>
              <div className="appt-list">{past.map(appt => renderCard(appt, true))}</div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AppointmentList;
