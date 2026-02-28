// src/components/surfaces/appbar/inputs/styles/SearchInput.styles.ts
import type { Theme } from "@mui/material/styles";

/**
 * Estilos para el componente Autocomplete.
 * - Ancho completo.
 * - Oculta el adornment final nativo de MUI Autocomplete (porque usamos uno personalizado en el TextField).
 */
export const getAutocompleteStyles = () => ({
  width: "100%",
  "& .MuiAutocomplete-endAdornment": {
    display: "none",
  },
});

/**
 * Estilos para el componente TextField (raíz).
 * - Ajusta la altura del input a 36px y el tamaño de fuente a 14px.
 * - Alinea verticalmente el contenido.
 * - Cuando el input está enfocado, cambia el color del borde según el modo del tema (claro/oscuro).
 *
 * @param theme - Tema de MUI para acceder al modo (light/dark).
 */
export const getTextFieldRootStyles = (theme: Theme) => ({
  "& .MuiInputBase-root": {
    height: "36px",
    fontSize: "14px",
    display: "flex",
    alignItems: "center",
    "&.Mui-focused": {
      "& .MuiOutlinedInput-notchedOutline": {
        borderColor: theme.palette.mode === "light" ? "#000000" : "#FFFFFF",
        borderWidth: "2px",
      },
    },
  },
  "& .MuiInputBase-input::placeholder": {
    "&:focus": {
      color: theme.palette.mode === "light" ? "#000000" : "#FFFFFF",
    },
  },
});

/**
 * Estilos para la etiqueta (label) del TextField.
 * - Centra verticalmente la etiqueta dentro del input.
 * - Elimina la transformación por defecto (flotar) para que siempre esté visible.
 * - Margen izquierdo de 16px (ml: 2).
 * - Cuando está enfocada, cambia el color según el modo del tema.
 *
 * @param theme - Tema de MUI.
 */
export const getInputLabelStyles = (theme: Theme) => ({
  display: "flex",
  alignItems: "center",
  height: "100%",
  transform: "none",
  ml: 2,
  "&.Mui-focused": {
    color: theme.palette.mode === "light" ? "#000000" : "#FFFFFF",
  },
});

/**
 * Estilos para el componente Select (selector de categorías).
 * - Sin bordes.
 * - La posición del ícono de despliegue (flecha) se ajusta dinámicamente según si el input tiene texto o no.
 * - El color del ícono también cambia con el modo del tema.
 *
 * @param theme - Tema de MUI.
 * @param inputValue - Valor actual del campo de búsqueda (para ajustar la posición del ícono).
 */
export const getSelectStyles = (theme: Theme, inputValue: string) => ({
  border: "none",
  "&:focus": { outline: "none" },
  "& .MuiOutlinedInput-notchedOutline": { border: "none" },
  "& .MuiSelect-icon": {
    right: inputValue === "" ? "+10px" : "+40px",
    color: theme.palette.mode === "light" ? "#000000" : "#FFFFFF",
  },
});

/**
 * Estilos para el IconButton (botón de búsqueda).
 * - Centra el ícono.
 * - Ajusta el margen derecho según si el input tiene texto o no (para que no se superponga con el select).
 * - Color del ícono según el modo del tema.
 *
 * @param theme - Tema de MUI.
 * @param inputValue - Valor actual del campo de búsqueda (para ajustar el margen).
 */
export const getIconButtonStyles = (theme: Theme, inputValue: string) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "8px",
  marginRight: inputValue === "" ? "-5px" : "-35px",
  color: theme.palette.mode === "light" ? "#000000" : "#FFFFFF",
});
