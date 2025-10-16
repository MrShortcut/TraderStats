export const cx = (...classes: any[]) =>
  classes.filter((cls) => typeof cls === 'string' && cls).join(' ');

// 🧹 Función utilitaria para limpiar strings
export const cleanText = (text?: string) =>
  text
    ?.replace(/\r/g, '')           // elimina retornos de carro
    .replace(/"/g, '')             // elimina comillas
    .replace(/\s+/g, ' ')          // reemplaza múltiples espacios por uno
    .trim()                        // elimina espacios al inicio y final
  ?? ''

