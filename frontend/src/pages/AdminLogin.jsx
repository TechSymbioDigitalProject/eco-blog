// @ts-nocheck
import { useContext, useState } from "preact/hooks";
import { AuthContext } from "../context/AuthContext";
import { validateEmail, validatePassword } from "../utils/validationRules";
import { route } from 'preact-router';

const AdminLogin = () => {
  const { login, error } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({ email: '', password: '' });

  // Validation dynamique pour l'email
  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    const emailError = validateEmail(value);
    setFormErrors((prev) => ({ ...prev, email: emailError }));
  };

  // Validation dynamique pour le mot de passe
  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    const passwordError = validatePassword(value);
    setFormErrors((prev) => ({ ...prev, password: passwordError }));
  };

  // Soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Vérification finale avant soumission
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);

    if (emailError || passwordError) {
      setFormErrors({ email: emailError, password: passwordError });
      return;
    }

    setLoading(true);
    setFormErrors({ email: '', password: '' });

    try {
      await login(email, password);
      route('/admin-home'); 
    } finally {
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
              className={`block w-full border rounded-md shadow-sm p-3 lg:p-4 bg-white text-gray-800 focus:ring-green-400 focus:border-green-400 ${
                formErrors.email ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="admin@example.com"
              value={email}
              onInput={handleEmailChange}
              required
            />
            {formErrors.email && <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>}
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm sm:text-base font-medium text-gray-700 mb-2">
              Mot de passe
            </label>
            <input
              type="password"
              id="password"
              className={`block w-full border rounded-md shadow-sm p-3 lg:p-4 bg-white text-gray-800 focus:ring-green-400 focus:border-green-400 ${
                formErrors.password ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="••••••••"
              value={password}
              onInput={handlePasswordChange}
              required
            />
            {formErrors.password && <p className="text-red-500 text-sm mt-1">{formErrors.password}</p>}
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
