import { createContext } from 'preact';
import { useState, useCallback, useEffect } from 'preact/hooks';
import { checkSession, loginUser } from '../services/authService';

// Création du context
// @ts-ignore
export const AuthContext = createContext();

// Fournisseur du contexte
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);


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


  // Fonction pour vérifier la session existante 
  const verifySession = useCallback(async () => {
    try {
      const userData = await checkSession();
      setIsAuthenticated(true);
      setUser(userData);

    } catch (err) {
      setIsAuthenticated(false);
      setUser(null);

    } finally {
      setLoading(false)
    }
  }, [])


  useEffect(() => {
    verifySession();
  }, [verifySession])


  // Fonction pour réinitialiser l'erreur
  const resetError = useCallback(() => {
    setError(null);
  }, []);


  // Fournir les données et action dans le contexte
  return (
    <AuthContext.Provider value={{ isAuthenticated, user, error, loading, login, verifySession, resetError }}>
      {children}
    </AuthContext.Provider>
  );
};