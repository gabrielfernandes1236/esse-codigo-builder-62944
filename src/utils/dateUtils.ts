
export const isToday = (date: string | Date): boolean => {
  const targetDate = new Date(date);
  const today = new Date();
  
  return targetDate.getDate() === today.getDate() &&
         targetDate.getMonth() === today.getMonth() &&
         targetDate.getFullYear() === today.getFullYear();
};

export const isThisWeek = (date: string | Date): boolean => {
  const targetDate = new Date(date);
  const today = new Date();
  
  // Início da semana (domingo)
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());
  startOfWeek.setHours(0, 0, 0, 0);
  
  // Fim da semana (sábado)
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);
  
  return targetDate >= startOfWeek && targetDate <= endOfWeek;
};

export const isThisMonth = (date: string | Date): boolean => {
  const targetDate = new Date(date);
  const today = new Date();
  
  return targetDate.getMonth() === today.getMonth() &&
         targetDate.getFullYear() === today.getFullYear();
};

export const isThisYear = (date: string | Date): boolean => {
  const targetDate = new Date(date);
  const today = new Date();
  
  return targetDate.getFullYear() === today.getFullYear();
};

export const getPeriodFilter = (periodo: 'diario' | 'semanal' | 'mensal' | 'anual') => {
  switch (periodo) {
    case 'diario':
      return isToday;
    case 'semanal':
      return isThisWeek;
    case 'mensal':
      return isThisMonth;
    case 'anual':
      return isThisYear;
    default:
      return isThisYear;
  }
};

// Função para comparar datas corretamente (apenas a parte da data, ignorando horário)
export const isSameDate = (date1: string | Date, date2: string | Date): boolean => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  
  return d1.getFullYear() === d2.getFullYear() &&
         d1.getMonth() === d2.getMonth() &&
         d1.getDate() === d2.getDate();
};

// Função CORRIGIDA para normalizar data no formato YYYY-MM-DD (CORREÇÃO FINAL DO BUG DE TIMEZONE)
export const normalizeDate = (date: string | Date): string => {
  // Se já é uma string no formato YYYY-MM-DD, retorna diretamente (CORREÇÃO PRINCIPAL)
  if (typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
    console.log('🔧 Data já no formato correto (YYYY-MM-DD):', date);
    return date;
  }
  
  let dateObj: Date;
  
  if (typeof date === 'string') {
    // Para outras strings, converte para Date
    dateObj = new Date(date);
  } else {
    dateObj = new Date(date);
  }
  
  // Verifica se a data é válida
  if (isNaN(dateObj.getTime())) {
    console.error('❌ Data inválida detectada:', date);
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  }
  
  // Usar getFullYear, getMonth, getDate para evitar problemas de timezone
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  
  const normalized = `${year}-${month}-${day}`;
  
  console.log('🔧 Normalizando data:', {
    input: date,
    inputType: typeof date,
    normalized
  });
  
  return normalized;
};

// Função para verificar se uma data está dentro de um período
export const isDateInRange = (date: string | Date, startDate: string | Date, endDate: string | Date): boolean => {
  const targetDate = normalizeDate(date);
  const start = normalizeDate(startDate);
  const end = normalizeDate(endDate);
  
  return targetDate >= start && targetDate <= end;
};

// Função para verificar se duas datas são do mesmo dia (melhorada)
export const isSameDateString = (date1: string, date2: string): boolean => {
  const normalized1 = normalizeDate(date1);
  const normalized2 = normalizeDate(date2);
  
  console.log('🔍 Comparando datas strings:', {
    date1,
    date2,
    normalized1,
    normalized2,
    areEqual: normalized1 === normalized2
  });
  
  return normalized1 === normalized2;
};
