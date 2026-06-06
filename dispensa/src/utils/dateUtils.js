// Placeholder para módulos e scripts JavaScript

// Utilitários de data — RN-01: Regra cromática de validade

// Calcula dias restantes entre hoje e a data de validade
export const calcularDiasParaVencer = (dataValidade) => {
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  const validade = new Date(dataValidade + 'T00:00:00');
  return Math.ceil((validade - hoje) / (1000 * 60 * 60 * 24));
};

// Retorna a classe CSS de cor conforme RN-01
export const getStatusColor = (dataValidade) => {
  const dias = calcularDiasParaVencer(dataValidade);
  if (dias < 0)  return 'status-vencido';   // Cinza — vencido
  if (dias <= 5)  return 'status-critico';  // Vermelho
  if (dias <= 15) return 'status-atencao';  // Amarelo
  return 'status-ok';                       // Verde
};

export const getStatusLabel = (dataValidade) => {
  const dias = calcularDiasParaVencer(dataValidade);
  if (dias < 0)  return `Vencido há ${Math.abs(dias)} dia(s)`;
  if (dias === 0) return 'Vence hoje!';
  if (dias === 1) return 'Vence amanhã!';
  return `${dias} dias restantes`;
};

export const formatarData = (dateStr) => {
  if (!dateStr) return '';
  const [y, m, d] = dateStr.split('-');
  return `${d}/${m}/${y}`;
};

// Ordena itens por data de validade (mais próximos primeiro)
export const ordenarPorValidade = (items) =>
  [...items].sort((a, b) => new Date(a.dataValidade) - new Date(b.dataValidade));
