// Validation format email
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) ? '' : "L'adresse email est invalide.";
};

// Validation format password
export const validatePassword = (password) => {
  const errors = [];

  if (password.length < 12) {
    errors.push("au moins 12 caractères");
  }
  if (!/[A-Z]/.test(password)) {
    errors.push("une majuscule");
  }
  if (!/[a-z]/.test(password)) {
    errors.push("une minuscule");
  }
  if (!/[0-9]/.test(password)) {
    errors.push("un chiffre");
  }
  if (!/[\W_]/.test(password)) {
    errors.push("un caractère spécial");
  }

  return errors.length > 0
    ? `Le mot de passe doit contenir ${errors.join(', ')}.`
    : '';
};
