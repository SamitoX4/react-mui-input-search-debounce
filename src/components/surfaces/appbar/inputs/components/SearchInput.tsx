import { useEffect, useState, type FC } from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import InputAdornment from "@mui/material/InputAdornment";
import CircularProgress from "@mui/material/CircularProgress";
import { useTheme } from "@mui/material/styles";
import { useSearch } from "../hooks/useSearchInput";
import { useDebounce } from "../hooks/useDebounce";
import { SearchSelect } from "./SearchSelect";
import { SearchButton } from "./SearchButton";
import {
  getAutocompleteStyles,
  getTextFieldRootStyles,
  getInputLabelStyles,
} from "../styles/SearchInput.styles";

// Tipo para el mapeo de rutas (categoría → ruta de búsqueda)
type RouteMap = Record<string, string>;

/**
 * Propiedades del componente InputSearch.
 */
export type InputSearchProps = {
  /** Texto a mostrar como etiqueta (placeholder) del campo de búsqueda. */
  labelText: string;
  /** Mensaje personalizado cuando no hay resultados (opcional, por defecto "No results"). */
  noResultMessage?: string;
  /** Lista de opciones para el selector de categorías. */
  menuItems: Array<{ label: string; value: string }>;
  /** Mapa que relaciona cada valor de categoría con una ruta de búsqueda (opcional). */
  routeMap?: RouteMap;
  /** Fuente de sugerencias: puede ser una URL base (string) o una función asíncrona que retorne un array de strings. */
  fetchSuggestions?: string | ((query: string) => Promise<string[]>);
};

/**
 * Componente de búsqueda con autocompletado, selector de categorías y enrutamiento.
 * - Usa debounce para evitar peticiones innecesarias.
 * - Muestra sugerencias obtenidas de una API o función personalizada.
 * - El selector de categorías solo se muestra si hay al menos dos elementos en menuItems.
 * - Integra navegación mediante routeMap y el hook useSearch.
 */
const InputSearch: FC<InputSearchProps> = ({
  labelText,
  noResultMessage,
  menuItems,
  routeMap,
  fetchSuggestions,
}) => {
  const theme = useTheme();

  // Hook personalizado que maneja el estado de la búsqueda, el valor seleccionado y la navegación.
  const {
    inputValue,
    selectedValue,
    handleChange,
    handleSearchClick,
    handleKeyDown,
    setInputValue,
  } = useSearch(routeMap);

  // Estado local para las sugerencias y el indicador de carga.
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // Aplica debounce al valor de entrada para retrasar la petición de sugerencias.
  const debouncedInput = useDebounce(inputValue, 300);

  // Mensaje por defecto si no se proporciona noResultMessage.
  const defaultNoResultMessage = "No results";
  const noResultMsg = noResultMessage ?? defaultNoResultMessage;

  // Efecto que se dispara cuando cambia el valor con debounce, la categoría o la fuente de sugerencias.
  useEffect(() => {
    // Solo buscar si hay al menos 3 caracteres (para no saturar la API).
    if (debouncedInput.length < 3) {
      setSuggestions([]);
      return;
    }

    let active = true; // Control para evitar actualizaciones después de desmontar el componente.

    const fetchData = async () => {
      setLoading(true);
      try {
        let results: string[] = [];

        // Si fetchSuggestions es una función, se llama directamente.
        if (typeof fetchSuggestions === "function") {
          results = await fetchSuggestions(debouncedInput);
        }
        // Si es un string, se construye la URL con la categoría actual.
        else if (typeof fetchSuggestions === "string") {
          const category = selectedValue || "all"; // Si no hay categoría, se usa 'all'
          const finalUrl = `${fetchSuggestions}${encodeURIComponent(debouncedInput)}&category=${encodeURIComponent(category)}`;
          const response = await fetch(finalUrl);

          if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
          }
          const data = await response.json();
          // Se asume que la respuesta es un array de strings.
          results = Array.isArray(data) ? data : [];
        }

        // Solo actualiza el estado si el componente sigue montado.
        if (active) {
          // Si no hay resultados, se muestra el mensaje personalizado (como sugerencia única).
          setSuggestions(results.length ? results : [noResultMsg]);
        }
      } catch (error) {
        console.error("Error fetching suggestions:", error);
        if (active) {
          // En caso de error, también se muestra el mensaje de "sin resultados".
          setSuggestions([noResultMsg]);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchData();

    // Cleanup: marca el componente como inactivo para evitar actualizaciones en segundo plano.
    return () => {
      active = false;
    };
  }, [debouncedInput, fetchSuggestions, selectedValue, routeMap, noResultMsg]);

  return (
    <Autocomplete
      onKeyDown={handleKeyDown} // Maneja tecla Enter para navegar
      freeSolo // Permite valores libres (no restringidos a las opciones)
      disablePortal // Evita que el popup se renderice en un portal (simplifica estilos)
      options={suggestions}
      // Desactiva el filtrado interno de MUI; mostramos exactamente las sugerencias obtenidas.
      filterOptions={(options) => options}
      loading={loading} // Muestra el indicador de carga dentro del campo
      sx={getAutocompleteStyles()}
      inputValue={inputValue}
      onInputChange={(event, newInputValue) => {
        setInputValue(newInputValue); // Sincroniza el valor con el hook useSearch
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          // Si hay texto, la etiqueta se oculta (shrink=false) para que no flote.
          label={inputValue ? "" : labelText}
          InputLabelProps={{
            shrink: false,
            sx: getInputLabelStyles(theme), // Estilos personalizados para la etiqueta
          }}
          sx={getTextFieldRootStyles(theme)}
          InputProps={{
            ...params.InputProps,
            // Adorno final: contiene el selector de categorías (si aplica) y el botón de búsqueda.
            endAdornment: (
              <>
                {loading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : null}
                <InputAdornment position="end">
                  {/* El selector solo aparece si hay más de un elemento en menuItems.
                      El primer elemento suele ser "Todo el contenido" (búsqueda general). */}
                  {menuItems.length >= 2 && (
                    <SearchSelect
                      selectedValue={selectedValue}
                      onChange={handleChange}
                      menuItems={menuItems}
                      inputValue={inputValue}
                    />
                  )}
                  <SearchButton
                    onClick={handleSearchClick}
                    inputValue={inputValue}
                  />
                </InputAdornment>
              </>
            ),
          }}
        />
      )}
    />
  );
};

export default InputSearch;
