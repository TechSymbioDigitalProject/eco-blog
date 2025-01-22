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