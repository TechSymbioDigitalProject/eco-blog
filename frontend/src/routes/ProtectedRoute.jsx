import { useContext, useEffect } from 'preact/hooks';
import { AuthContext } from '../context/AuthContext';
import { route } from 'preact-router';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useContext(AuthContext);

  // Attendre que le chargement soit terminé avant de rediriger
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      route('/access-panel');
    }
  }, [isAuthenticated, loading]);

  // Afficher un indicateur de chargement pendant la vérification
  if (loading) {
    return null;
  }

  // Afficher le contenu protégé si l'utilisateur est authentifié
  return isAuthenticated ? children : null;
};

export default ProtectedRoute;
