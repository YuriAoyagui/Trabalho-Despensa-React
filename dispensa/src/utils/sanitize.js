// Sanitização de entradas para prevenir XSS e SQL Injection
// (No contexto client-side/localStorage, o foco é XSS)

const stripTags = (str) =>
  String(str)
    .replace(/[<>"'`]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#x27;', '`': '&#x60;' }[c]))
    .trim();

// Remove caracteres de controle e limita tamanho
const clean = (str, maxLen = 255) =>
  stripTags(str).replace(/[\x00-\x1F\x7F]/g, '').slice(0, maxLen);

export const sanitizeText = (str) => clean(str, 100);
export const sanitizePassword = (str) => clean(str, 255); // não aplica stripTags em senha
export const sanitizeNumber = (val) => {
  const n = parseInt(val, 10);
  return isNaN(n) || n < 0 ? 0 : Math.min(n, 9999);
};

// Validação de data ISO (YYYY-MM-DD)
export const isValidDate = (dateStr) => /^\d{4}-\d{2}-\d{2}$/.test(dateStr);

// Hash simples de senha (para fins educacionais — em prod use bcrypt no server)
export const hashPassword = async (password) => {
  if (!crypto.subtle) return btoa(password); // fallback
  const enc = new TextEncoder();
  const buf = await crypto.subtle.digest('SHA-256', enc.encode(password));
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, '0')).join('');
};