function generatePassword() {
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const specials = '!@#$%^&*()_+-=[]{};:,.<>?';
  const allCharacters = uppercase + lowercase + numbers + specials;

  let password = '';

  // Garantir au moins un de chaque type de caractère
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += specials[Math.floor(Math.random() * specials.length)];

  // Compléter le mot de passe avec des caractères aléatoires
  for (let i = password.length; i < 12; i++) {
    password += allCharacters[Math.floor(Math.random() * allCharacters.length)];
  }

  // Mélanger les caractères pour éviter un ordre prévisible
  password = password.split('').sort(() => Math.random() - 0.5).join('');
  
  return password;
}