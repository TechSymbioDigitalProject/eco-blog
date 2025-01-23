import { useContext } from 'preact/hooks';
import { AuthContext } from '../context/AuthContext';

const AdminHome = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#F5F5F5]">
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md lg:max-w-lg mx-4">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#4CAF50] text-center mb-6 leading-tight">
          Bonjour, {user?.prenom || 'Admin'} !
        </h1>
        <p className="text-gray-700 text-center">
          Bienvenue sur l'espace administrateur.
        </p>
      </div>
    </div>
  );
};

export default AdminHome;
