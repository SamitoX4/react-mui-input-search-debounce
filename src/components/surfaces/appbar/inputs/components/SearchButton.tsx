import React from "react";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import { useTheme } from "@mui/material/styles";
import { getIconButtonStyles } from "../styles/SearchInput.styles";

/**
 * Propiedades del botón de búsqueda.
 */
interface SearchButtonProps {
  /** Función a ejecutar al hacer clic en el botón. */
  onClick: () => void;
  /** Valor actual del campo de búsqueda (se usa para aplicar estilos condicionales). */
  inputValue: string;
}

/**
 * Botón de búsqueda con ícono de lupa.
 * - Aplica estilos dinámicos basados en el valor del input y el tema.
 * - Se utiliza dentro del InputAdornment final del TextField.
 */
export const SearchButton: React.FC<SearchButtonProps> = ({
  onClick,
  inputValue,
}) => {
  const theme = useTheme();

  return (
    <IconButton
      edge="end" // Alinea el botón al final del contenedor
      onClick={onClick}
      sx={getIconButtonStyles(theme, inputValue)} // Estilos condicionales (ej: color cuando hay texto)
    >
      <SearchIcon />
    </IconButton>
  );
};
