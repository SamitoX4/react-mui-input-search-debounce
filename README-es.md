# 🔍 react-mui-input-search-debounce

Componente de búsqueda con autocompletado, selector de categorías y
enrutamiento, construido con **Material‑UI (MUI)** y **React Router**.
Incluye debounce para optimizar peticiones y soporte para temas
claro/oscuro.

## Componente para su uso en dos temas

| Modo claro                                                                                        | Modo oscuro                                                                                      |
| ------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| ![Input Search white](https://cdn.jsdelivr.net/gh/SamitoX4/react-mui-input-search-debounce@master/react-mui-input-search-debounce-white.gif) | ![Input Search black](https://cdn.jsdelivr.net/gh/SamitoX4/react-mui-input-search-debounce@master/react-mui-input-search-debounce-black.gif) |

------------------------------------------------------------------------

## 📦 Instalación

``` bash
npm install react-mui-input-search-debounce
```

o con Yarn:

``` bash
yarn add react-mui-input-search-debounce
```

### Dependencias necesarias (peer dependencies)

Asegúrate de tener instaladas las siguientes librerías en tu proyecto:

``` txt
react >= 17.0.0
react-dom >= 17.0.0
@mui/material >= 5.0.0
@mui/icons-material >= 5.0.0
@emotion/react >= 11.0.0
@emotion/styled >= 11.0.0
react-router-dom >= 6.0.0
```

------------------------------------------------------------------------

## 🚀 Uso básico

``` tsx
import { InputSearch } from 'react-mui-input-search-debounce';

function App() {
  return (
    <InputSearch
      labelText="Buscar en Portafolio, Blog, Emprendimientos..."
      noResultMessage="No hay resultados"
      menuItems={[
        { label: 'Todo el contenido', value: '' },
        { label: 'Portafolio Técnico', value: 'portfolio' },
        { label: 'Emprendimientos', value: 'entrepreneurships' },
        { label: 'Blog', value: 'blog' },
      ]}
      routeMap={{
        '': '/todo/search',
        portfolio: '/portfolio/search',
        entrepreneurships: '/entrepreneurships/search',
        blog: '/blog/search',
      }}
      fetchSuggestions="https://api.example.com/suggestions?q="
    />
  );
}
```

------------------------------------------------------------------------

## 📋 Propiedades (Props)

  ------------------------------------------------------------------------------------------------------------------------
  Prop                 Tipo                                                Requerido              Descripción
  -------------------- --------------------------------------------------- ---------------------- ------------------------
  `labelText`          `string`                                            Sí                     Texto que aparece como
                                                                                                  placeholder cuando el
                                                                                                  input está vacío.

  `menuItems`          `{ label: string; value: string }[]`                Sí                     Lista de opciones para
                                                                                                  el selector de
                                                                                                  categorías. El primer
                                                                                                  elemento se usa como
                                                                                                  valor por defecto.

  `fetchSuggestions`   `string | ((query: string) => Promise<string[]>)`   Sí\*                   URL base o función
                                                                                                  personalizada que
                                                                                                  retorne sugerencias.

  `routeMap`           `Record<string, string>`                            No                     Mapa de rutas por
                                                                                                  categoría.

  `noResultMessage`    `string`                                            No                     Mensaje cuando no hay
                                                                                                  sugerencias. Default:
                                                                                                  `"No results"`.
  ------------------------------------------------------------------------------------------------------------------------

> **Nota:** El selector de categorías solo se muestra si
> `menuItems.length >= 2`.

------------------------------------------------------------------------

## 🧠 Comportamiento

-   **Debounce:** 300 ms después de dejar de escribir.
-   **Selector condicional:** Solo si hay más de una categoría.
-   **React Router:** Navega con `?q=termino&p=1`.
-   **Autocompletado:** Muestra sugerencias o `noResultMessage`.
-   **Tema claro/oscuro:** Se adapta automáticamente al tema MUI.

![Input Search black](https://cdn.jsdelivr.net/gh/SamitoX4/react-mui-input-search-debounce@master/react-mui-input-search-debounce-black.gif)

------------------------------------------------------------------------

## 🔗 Enrutamiento (routeMap)

``` ts
const menuItems = [
  { label: 'Todo', value: '' },
  { label: 'Blog', value: 'blog' },
];

const routeMap = {
  '': '/buscar/todo',
  blog: '/blog/buscar',
};
```

Si no se proporciona `routeMap`, usa `/all/search` por defecto.

------------------------------------------------------------------------

## 🔌 Fuente de sugerencias (fetchSuggestions)

### Como string

``` tsx
fetchSuggestions="https://miapi.com/suggest?q="
```

### Como función personalizada

``` tsx
fetchSuggestions={async (query) => {
  const res = await fetch(`/api/search?q=${query}`);
  const data = await res.json();
  return data.titulos; // debe devolver string[]
}}
```

------------------------------------------------------------------------

## 🎨 Personalización de estilos

Puedes usar la prop `sx`, un tema personalizado o sobrescribir clases
como `.MuiAutocomplete-root`.

------------------------------------------------------------------------

## 📁 Estructura interna

``` txt
src/
  components/
    surfaces/
      appbar/
        inputs/
          components/
            SearchButton.tsx
            SearchInput.tsx
            SearchSelect.tsx
          hooks/
            useDebounce.ts
            useSearchInput.ts
          services/
            api/
              suggestionsService.ts
          styles/
            SearchInput.styles.ts
          index.ts
```

------------------------------------------------------------------------

## ⚙️ Ejemplo completo con ruteo

``` tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { InputSearch } from 'react-mui-input-search-debounce';

const menuItems = [
  { label: 'Todo', value: '' },
  { label: 'Proyectos', value: 'projects' },
];

const routeMap = {
  '': '/search',
  projects: '/projects/search',
};

function App() {
  return (
    <BrowserRouter>
      <InputSearch
        labelText="Buscar..."
        menuItems={menuItems}
        routeMap={routeMap}
        fetchSuggestions="https://api.example.com/suggest?q="
        noResultMessage="No se encontraron sugerencias"
      />
      <Routes>
        <Route path="/search" element={<SearchResults />} />
        <Route path="/projects/search" element={<ProjectsResults />} />
      </Routes>
    </BrowserRouter>
  );
}
```

------------------------------------------------------------------------

## 🧪 Notas adicionales

-   La API debe devolver `string[]`.
-   Se añade automáticamente `p=1` si no existe.
-   Si falta `q` o `p`, redirige a `/`.
-   El debounce puede modificarse editando `useDebounce`.

------------------------------------------------------------------------

## 📄 Licencia

MIT © BlackyCoder

------------------------------------------------------------------------

Hecho con ❤️ para la comunidad de React y MUI.