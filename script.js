const passwordInput = document.getElementById('password');
const toggleButton = document.getElementById('togglePassword');
const strengthLabel = document.getElementById('strengthLabel');
const scoreLabel = document.getElementById('scoreLabel');
const meterFill = document.getElementById('meterFill');
const suggestion = document.getElementById('suggestion');

const rules = [
  ['lengthCheck', p => p.length >= 12],
  ['upperCheck', p => /[A-Z]/.test(p)],
  ['lowerCheck', p => /[a-z]/.test(p)],
  ['numberCheck', p => /[0-9]/.test(p)],
  ['symbolCheck', p => /[^A-Za-z0-9]/.test(p)],
  ['uniqueCheck', p => !isCommonOrPredictable(p)]
];

const commonPasswords = new Set([
  'password','password123','123456','123456789','qwerty','qwerty123',
  'admin','letmein','welcome','iloveyou','abc123','111111','000000'
]);

function isCommonOrPredictable(password) {
  const p = password.toLowerCase();
  if (commonPasswords.has(p)) return true;
  if (/^(.)\1+$/.test(p)) return true;
  if (/^(0123|1234|2345|3456|4567|5678|6789|9876|8765)/.test(p)) return true;
  if (/^(qwerty|asdf|zxcv)/.test(p)) return true;
  return false;
}

function analyzePassword(password) {
  const results = rules.map(([id, test]) => ({id, pass: password.length > 0 && test(password)}));
  results.forEach(({id, pass}) => {
    const el = document.getElementById(id);
    el.classList.toggle('pass', pass);
    el.querySelector('.check-icon').textContent = pass ? '✓' : '○';
  });

  if (!password) {
    updateDisplay(0, 'No password entered', 'Enter a password to see its strength and get suggestions.');
    return;
  }

  let score = results.reduce((total, item) => total + (item.pass ? 15 : 0), 0);
  if (password.length >= 16) score += 10;
  if (password.length >= 20) score += 10;
  if (new Set(password).size >= 8) score += 5;
  if (isCommonOrPredictable(password)) score = Math.min(score, 20);
  score = Math.min(score, 100);

  let label = 'Weak';
  if (score >= 85) label = 'Very strong';
  else if (score >= 65) label = 'Strong';
  else if (score >= 40) label = 'Moderate';

  const missing = results.filter(x => !x.pass);
  let advice = missing.length
    ? 'Improve your password by: ' + missing.map(x => ({
        lengthCheck: 'using at least 12 characters',
        upperCheck: 'adding an uppercase letter',
        lowerCheck: 'adding a lowercase letter',
        numberCheck: 'adding a number',
        symbolCheck: 'adding a special character',
        uniqueCheck: 'avoiding common or predictable patterns'
      }[x.id])).join('; ') + '.'
    : 'Good work! Keep it unique to this account and consider using a password manager.';
  if (isCommonOrPredictable(password)) advice = 'This password uses a common or predictable pattern. Choose a completely different, longer passphrase.';
  updateDisplay(score, label, advice);
}

function updateDisplay(score, label, advice) {
  strengthLabel.textContent = label;
  scoreLabel.textContent = `${score} / 100`;
  meterFill.style.width = `${score}%`;
  const color = score >= 85 ? '#66e3d1' : score >= 65 ? '#8bd17c' : score >= 40 ? '#f3c969' : '#f17c83';
  meterFill.style.background = color;
  suggestion.querySelector('strong').textContent = score >= 85 ? 'Excellent password!' : 'Your security recommendation';
  suggestion.querySelector('p').textContent = advice;
}

passwordInput.addEventListener('input', () => analyzePassword(passwordInput.value));
toggleButton.addEventListener('click', () => {
  const showing = passwordInput.type === 'text';
  passwordInput.type = showing ? 'password' : 'text';
  toggleButton.textContent = showing ? 'Show' : 'Hide';
  toggleButton.setAttribute('aria-label', showing ? 'Show password' : 'Hide password');
});

function secureRandomInt(max) {
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);
  return array[0] % max;
}
function generatePassword(length = 18) {
  const lower = 'abcdefghijkmnopqrstuvwxyz';
  const upper = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  const numbers = '23456789';
  const symbols = '!@#$%&*+-=?_';
  const all = lower + upper + numbers + symbols;
  const chars = [
    lower[secureRandomInt(lower.length)],
    upper[secureRandomInt(upper.length)],
    numbers[secureRandomInt(numbers.length)],
    symbols[secureRandomInt(symbols.length)]
  ];
  while (chars.length < length) chars.push(all[secureRandomInt(all.length)]);
  // Fisher-Yates shuffle using the Web Crypto API.
  for (let i = chars.length - 1; i > 0; i--) {
    const j = secureRandomInt(i + 1);
    [chars[i], chars[j]] = [chars[j], chars[i]];
  }
  return chars.join('');
}

const generatedBox = document.getElementById('generatedBox');
const generatedPassword = document.getElementById('generatedPassword');
document.getElementById('generateBtn').addEventListener('click', () => {
  generatedPassword.textContent = generatePassword();
  generatedBox.classList.remove('hidden');
});
document.getElementById('copyBtn').addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(generatedPassword.textContent);
    document.getElementById('copyBtn').textContent = 'Copied!';
    setTimeout(() => document.getElementById('copyBtn').textContent = 'Copy', 1400);
  } catch {
    document.getElementById('copyBtn').textContent = 'Copy unavailable';
  }
});
document.getElementById('useBtn').addEventListener('click', () => {
  passwordInput.value = generatedPassword.textContent;
  analyzePassword(passwordInput.value);
  passwordInput.type = 'password';
  toggleButton.textContent = 'Show';
  passwordInput.focus();
});
