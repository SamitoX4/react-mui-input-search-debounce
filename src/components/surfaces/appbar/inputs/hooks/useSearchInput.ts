// src/components/surfaces/appbar/inputs/hooks/useSearchInput.ts
import { useState, useEffect } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import type { SelectChangeEvent } from "@mui/material/Select";

/**
 * Tipo para el mapeo de rutas: cada categoría (value) debe tener asociada una ruta base de búsqueda.
 */
type RouteMap = Record<string, string>;

/**
 * Hook personalizado que maneja la lógica de búsqueda:
 * - Sincroniza el input y la categoría seleccionada con los parámetros de la URL.
 * - Proporciona funciones para cambiar de categoría, ejecutar la búsqueda y manejar teclas.
 * - Navega a la ruta correspondiente con los parámetros `q` (término) y `p` (página).
 *
 * @param routeMap - Objeto opcional que asigna cada categoría a una ruta base.
 * @returns Objeto con el estado y funciones necesarias para el componente de búsqueda.
 */
export const useSearch = (routeMap?: RouteMap) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  // Estado del término de búsqueda
  const [inputValue, setInputValue] = useState("");
  // Estado de la categoría seleccionada (vacío por defecto, corresponde al primer elemento)
  const [selectedValue, setSelectedValue] = useState("");

  /**
   * Determina la ruta base para una categoría dada.
   * Si routeMap está definido y contiene la categoría, se usa esa ruta.
   * De lo contrario, se retorna '/all/search' como ruta por defecto.
   *
   * @param value - Valor de la categoría seleccionada.
   * @returns Ruta base para la búsqueda.
   */
  const getBasePath = (value: string): string => {
    if (routeMap && routeMap[value]) {
      return routeMap[value];
    }
    return "/all/search";
  };

  /**
   * Maneja el cambio de categoría en el Select.
   * @param event - Evento de cambio de MUI Select.
   */
  const handleChange = (event: SelectChangeEvent) => {
    setSelectedValue(event.target.value as string);
  };

  /**
   * Ejecuta la búsqueda: valida que haya un término, construye la URL y navega.
   * Si no hay término, muestra una alerta.
   */
  const handleSearchClick = () => {
    if (!inputValue) {
      alert("Por favor, ingrese un término de búsqueda.");
      return;
    }

    const basePath = getBasePath(selectedValue);

    // Copia los parámetros actuales para conservar otros (ej. filtros) si existieran
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.set("q", inputValue);
    if (!newSearchParams.has("p")) {
      newSearchParams.set("p", "1"); // Si no hay página, se inicia en 1
    }

    navigate(`${basePath}?${newSearchParams.toString()}`);
  };

  /**
   * Efecto que sincroniza el inputValue con el query param 'q' cuando la ruta actual es una ruta de búsqueda.
   * También valida que existan 'q' y 'p'; si falta alguno, redirige al home.
   * Esto asegura que las rutas de búsqueda incompletas sean corregidas.
   */
  useEffect(() => {
    const currentPath = location.pathname;
    const query = searchParams.get("q");
    const page = searchParams.get("p");

    // Obtiene todas las rutas de búsqueda posibles (del mapa proporcionado o del defecto)
    const searchRoutes = routeMap
      ? Object.values(routeMap)
      : Object.values("/all/search"); // Nota: Object.values sobre un string retorna un array con el string como único elemento? En realidad Object.values('/all/search') devuelve ['/', 'a', 'l', 'l', '/', 's', 'e', 'a', 'r', 'c', 'h']? Eso es un error. Pero el código original está así. Se podría corregir, pero documentamos tal cual.
    // Asegurar que '/all/search' esté incluido (ruta de fallback)
    if (!searchRoutes.includes("/all/search")) {
      searchRoutes.push("/all/search");
    }

    const isSearchRoute = searchRoutes.includes(currentPath);

    if (isSearchRoute) {
      if (!query || !page) {
        // Si falta query o página, redirige al home
        navigate("/");
      } else if (query) {
        // Si hay query, actualiza el inputValue
        setInputValue(query);
      }
    }
  }, [location, searchParams, navigate, routeMap]);

  /**
   * Maneja el evento de tecla presionada en el campo de búsqueda.
   * Si se presiona Enter, ejecuta la búsqueda.
   * @param event - Evento de teclado.
   */
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSearchClick();
    }
  };

  return {
    inputValue, // Valor actual del input
    selectedValue, // Categoría seleccionada
    handleChange, // Función para cambiar categoría
    handleSearchClick, // Función para ejecutar búsqueda
    handleKeyDown, // Función para manejar teclas (Enter)
    setInputValue, // Setter directo del input (usado por el componente)
  };
};
