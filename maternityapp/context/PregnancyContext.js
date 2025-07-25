import React, { createContext, useContext, useState } from 'react';

const PregnancyContext = createContext({
  pregnancyId: '',
  setPregnancyId: () => {},
});

export const PregnancyProvider = ({ children }) => {
  const [pregnancyId, setPregnancyId] = useState('');
  return (
    <PregnancyContext.Provider value={{ pregnancyId, setPregnancyId }}>
      {children}
    </PregnancyContext.Provider>
  );
};

export const usePregnancy = () => useContext(PregnancyContext);
