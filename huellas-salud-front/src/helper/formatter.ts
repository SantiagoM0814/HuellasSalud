export const formatCurrencyCOP = (value: number) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0, // para no mostrar decimales si es un entero
  }).format(value);
};