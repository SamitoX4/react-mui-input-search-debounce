import React from 'react';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { useTheme } from '@mui/material/styles';
import { getSelectStyles } from '../styles/SearchInput.styles';

/**
 * Propiedades del selector de categorías (SearchSelect).
 */
interface SearchSelectProps {
  /** Valor actualmente seleccionado (debe coincidir con la propiedad "value" de algún MenuItem). */
  selectedValue: string;
  /** Función que se ejecuta al cambiar la selección. */
  onChange: (event: any) => void;
  /** Lista de elementos a mostrar en el menú desplegable. */
  menuItems: Array<{ label: string; value: string }>;
  /** Valor actual del campo de búsqueda (se usa para ajustar el margen derecho del selector). */
  inputValue: string;
}

/**
 * Componente Select que permite filtrar la búsqueda por categorías.
 * - Se muestra únicamente cuando hay más de un elemento en menuItems (controlado desde InputSearch).
 * - Ajusta su margen derecho dinámicamente según si el input tiene contenido o no, para evitar superposiciones con el botón de búsqueda.
 * - Aplica estilos personalizados mediante getSelectStyles, que varían según el tema y el valor del input.
 */
export const SearchSelect: React.FC<SearchSelectProps> = ({
  selectedValue,
  onChange,
  menuItems,
  inputValue,
}) => {
  const theme = useTheme();

  return (
    <FormControl
      sx={{
        minWidth: 10, // Ancho mínimo para que el select sea visible
        // Margen derecho condicional:
        // - Si el input está vacío (inputValue === ''), se usa -15px para acercarlo al botón de búsqueda.
        // - Si hay texto, se usa -45px para dejar espacio al texto y al icono de búsqueda.
        mr: inputValue === '' ? '-15px' : '-45px',
      }}
    >
      <Select
        value={selectedValue}
        onChange={onChange}
        displayEmpty // Permite mostrar un valor aunque esté vacío (el placeholder se maneja externamente)
        inputProps={{ 'aria-label': 'Without label' }} // Atributo de accesibilidad
        sx={getSelectStyles(theme, inputValue)} // Estilos personalizados (color, bordes, etc.) según el tema y si hay texto
      >
        {menuItems.map((item) => (
          <MenuItem key={item.value} value={item.value}>
            {item.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};