// src/components/surfaces/appbar/inputs/services/api/suggestionsService.ts

/**
 * Crea una función para obtener sugerencias de búsqueda desde una API.
 * Es un factory function que toma una URL base y retorna una función asíncrona
 * que, dado un query, realiza la petición y devuelve un array de sugerencias.
 *
 * @param baseUrl - URL base del endpoint de sugerencias (debe incluir el parámetro de consulta, ej: "https://api.example.com/suggestions?q=").
 * @returns Una función fetchSuggestions(query: string) => Promise<string[]>.
 */
export function createFetchSuggestions(baseUrl: string) {
  /**
   * Función interna que realiza la petición de sugerencias.
   * - Concatena la URL base con el query codificado.
   * - Si la respuesta es exitosa y contiene un array, lo retorna.
   * - Si hay error o el array está vacío, retorna un array con un mensaje por defecto.
   *
   * @param query - Término de búsqueda ingresado por el usuario.
   * @returns Promesa que resuelve en un array de strings (sugerencias o mensaje de "no resultados").
   */
  return async function fetchSuggestions(query: string): Promise<string[]> {
    try {
      // Construir la URL final codificando el query para evitar problemas con caracteres especiales.
      const url = `${baseUrl}${encodeURIComponent(query)}`;

      // Realizar la petición fetch.
      const response = await fetch(url);

      // Verificar si la respuesta es exitosa (código 2xx).
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      // Parsear el cuerpo de la respuesta como JSON.
      const data = await response.json();

      // Si el dato recibido es un array y tiene al menos un elemento, retornarlo.
      if (Array.isArray(data) && data.length > 0) {
        return data;
      } else {
        // Si la respuesta es un array vacío o no es un array, retornar mensaje de "no resultados".
        return ['No results were found'];
      }
    } catch (error) {
      // En caso de error en la red, parseo o HTTP, se registra en consola y se retorna mensaje por defecto.
      console.error('Error getting suggestions:', error);
      return ['No results were found'];
    }
  };
}