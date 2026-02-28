// src/components/surfaces/appbar/inputs/hooks/useDebounce.ts
import { useState, useEffect } from 'react';

/**
 * Hook personalizado para aplicar debounce a un valor.
 * Retorna el valor después de un retraso especificado, evitando actualizaciones frecuentes.
 * Útil para retrasar búsquedas o peticiones mientras el usuario escribe.
 *
 * @template T Tipo del valor a debounce.
 * @param value El valor que cambia frecuentemente (ej. texto de búsqueda).
 * @param delay Tiempo de retraso en milisegundos.
 * @returns El valor estabilizado después del retraso.
 */
export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Establece un temporizador para actualizar el valor debounced después del delay.
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Limpia el temporizador si el valor cambia antes de que se cumpla el delay,
    // o si el componente se desmonta. Esto reinicia el contador.
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]); // Solo se re-ejecuta si value o delay cambian.

  return debouncedValue;
};