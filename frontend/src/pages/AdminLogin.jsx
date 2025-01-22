import { useContext, useState } from "preact/hooks";
import { AuthContext } from "../context/AuthContext";

const AdminLogin = () => {
  const { login, error } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      setLoading(false);
    } catch {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#F5F5F5]">
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md lg:max-w-lg mx-4">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#4CAF50] text-center mb-6 leading-tight whitespace-nowrap">
          Connexion administrateur
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="email" className="block text-sm sm:text-base font-medium text-gray-700 mb-2">
              Adresse e-mail
            </label>
            <input
              type="email"
              id="email"
              className="block w-full border border-gray-300 rounded-md shadow-sm focus:ring-green-400 focus:border-green-400 p-3 lg:p-4 bg-white text-gray-800"
              placeholder="admin@example.com"
              value={email}
              onInput={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm sm:text-base font-medium text-gray-700 mb-2">
              Mot de passe
            </label>
            <input
              type="password"
              id="password"
              className="block w-full border border-gray-300 rounded-md shadow-sm focus:ring-green-400 focus:border-green-400 p-3 lg:p-4 bg-white text-gray-800"
              placeholder="••••••••"
              value={password}
              onInput={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <button
            type="submit"
            className={`w-full text-white bg-[#4CAF50] hover:bg-[#8BC34A] font-medium rounded-md p-3 lg:p-4 transition-transform transform ${
              loading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'
            }`}
            disabled={loading}
          >
            {loading ? 'Connexion en cours...' : 'Se connecter'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
