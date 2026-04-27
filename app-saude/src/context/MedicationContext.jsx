import { createContext, useContext, useState, useEffect } from 'react';

const MedicationContext = createContext();

export const useMedication = () => useContext(MedicationContext);

export const MedicationProvider = ({ children }) => {
  // ═══════════════════════════════════════════
  //  ESTADO DOS MEDICAMENTOS (já existia)
  // ═══════════════════════════════════════════
  const [medications, setMedications] = useState(() => {
    const saved = localStorage.getItem('medications');
    return saved ? JSON.parse(saved) : [];
  });

  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem('medication_history');
    return saved ? JSON.parse(saved) : {};
  });

  // ═══════════════════════════════════════════
  //  ESTADO DAS CONSULTAS (NOVO!)
  // ═══════════════════════════════════════════
  const [appointments, setAppointments] = useState(() => {
    const saved = localStorage.getItem('appointments');
    return saved ? JSON.parse(saved) : [];
  });

  // Salva no Local Storage sempre que os dados mudarem
  useEffect(() => {
    localStorage.setItem('medications', JSON.stringify(medications));
  }, [medications]);

  useEffect(() => {
    localStorage.setItem('medication_history', JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem('appointments', JSON.stringify(appointments));
  }, [appointments]);

  // ═══════════════════════════════════════════
  //  FUNÇÕES DOS MEDICAMENTOS (já existiam)
  // ═══════════════════════════════════════════
  const addMedication = (med) => {
    setMedications([...medications, { ...med, id: Date.now().toString() }]);
  };

  const editMedication = (updatedMed) => {
    setMedications(medications.map(med => med.id === updatedMed.id ? updatedMed : med));
  };

  const removeMedication = (id) => {
    setMedications(medications.filter(m => m.id !== id));
  };

  const markAsTaken = (medId, dateString) => {
    setHistory(prev => {
      const dayHistory = prev[dateString] || [];
      if (!dayHistory.includes(medId)) {
        return { ...prev, [dateString]: [...dayHistory, medId] };
      }
      return prev;
    });
  };

  const markAsUntaken = (medId, dateString) => {
    setHistory(prev => {
      const dayHistory = prev[dateString] || [];
      return { ...prev, [dateString]: dayHistory.filter(id => id !== medId) };
    });
  };

  // ═══════════════════════════════════════════
  //  FUNÇÕES DAS CONSULTAS (NOVAS!)
  // ═══════════════════════════════════════════
  const addAppointment = (appt) => {
    setAppointments([...appointments, { ...appt, id: Date.now().toString() }]);
  };

  const editAppointment = (updatedAppt) => {
    setAppointments(appointments.map(appt => appt.id === updatedAppt.id ? updatedAppt : appt));
  };

  const removeAppointment = (id) => {
    setAppointments(appointments.filter(appt => appt.id !== id));
  };

  return (
    <MedicationContext.Provider value={{
      medications,
      history,
      addMedication,
      editMedication,
      removeMedication,
      markAsTaken,
      markAsUntaken,
      appointments,
      addAppointment,
      editAppointment,
      removeAppointment
    }}>
      {children}
    </MedicationContext.Provider>
  );
};
