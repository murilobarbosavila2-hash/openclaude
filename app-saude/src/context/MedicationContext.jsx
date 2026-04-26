import { createContext, useContext, useState, useEffect } from 'react';

const MedicationContext = createContext();

export const useMedication = () => useContext(MedicationContext);

export const MedicationProvider = ({ children }) => {
  const [medications, setMedications] = useState(() => {
    const saved = localStorage.getItem('medications');
    return saved ? JSON.parse(saved) : [];
  });

  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem('medication_history');
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    localStorage.setItem('medications', JSON.stringify(medications));
  }, [medications]);

  useEffect(() => {
    localStorage.setItem('medication_history', JSON.stringify(history));
  }, [history]);

  const addMedication = (med) => {
    setMedications([...medications, { ...med, id: Date.now().toString() }]);
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

  return (
    <MedicationContext.Provider value={{
      medications,
      history,
      addMedication,
      removeMedication,
      markAsTaken,
      markAsUntaken
    }}>
      {children}
    </MedicationContext.Provider>
  );
};
