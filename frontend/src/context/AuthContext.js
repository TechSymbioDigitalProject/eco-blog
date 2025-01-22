import { createContext } from 'preact';
import { useState, useCallback } from 'preact/hooks';
import { loginUser } from '../services/authService';

// Création du context
// @ts-ignore
export const AuthContext = createContext();

// Fournisseur du contexte
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);


  // Fonction pour gérer la connexion
  const login = useCallback(async (email, password) => {
    try {
      setError(null);
      const response = await loginUser(email, password);
      setIsAuthenticated(true);
      setUser(response.utilisateur);
    } catch (err) {
      setError(err.message);
    }
  }, [])

  // Fonction pour réinitialiser l'erreur
  const resetError = useCallback(() => {
    setError(null);
  }, []);


  // Fournir les données et action dans le contexte
  return (
    <AuthContext.Provider value={{ isAuthenticated, user, error, login, resetError }}>
      {children}
    </AuthContext.Provider>
  );
};