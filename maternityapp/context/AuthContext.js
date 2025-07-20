import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [language, setLanguage] = useState('en');

  return (
    <AuthContext.Provider value={{ user, setUser, token, setToken, language, setLanguage }}>
      {children}
    </AuthContext.Provider>
  );
};
