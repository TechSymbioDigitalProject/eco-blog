import api from './axiosConfig';


// Fonction de connexion utilisateur
export const loginUser = async (email, password) => {
  try {
    const response = await api.post('/auth/login', { email, password });
    return response.data;

  } catch (error) {
    if(error.response && error.response.data) {
      throw new Error(error.response.data.message || 'erreur de connexion.');
    }

    throw new Error('Erreur de connexion. Veuillez réessayer plus tard.');
  }
};


// Fonction pour contrôler la session utilisateur
export const checkSession = async () => {
  try {
    const response = await api.get('/auth/check-session', { withCredentials: true });
    return response.data;

  } catch (error) {
    if(error.response && error.response.status === 401) {
      throw new Error('Session invalide ou expirée.');
    }
    throw new Error('Erreur lors de la vérification de la session.');
  }
};


