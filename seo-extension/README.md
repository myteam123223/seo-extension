# SEO Analyzer Extension

Una extensión para Google Chrome que analiza el SEO de las páginas web en tiempo real.

## Características

- Analiza meta etiquetas, títulos y descripciones
- Examina estructura de encabezados H1-H6
- Verifica enlaces internos y externos
- Analiza configuración de hreflang
- Identifica imágenes sin atributos alt
- Detecta markup de Schema.org
- Calcula una puntuación SEO global

## Instalación

### Método de desarrollo:

1. Clona este repositorio
2. Ejecuta `npm install` para instalar dependencias
3. Ejecuta `npm run build` para generar los archivos de distribución
4. Abre Chrome y navega a `chrome://extensions/`
5. Activa el "Modo desarrollador"
6. Haz clic en "Cargar descomprimida" y selecciona la carpeta `build`

### Desde Chrome Web Store:
*(Próximamente)*

## Uso

1. Navega a cualquier página web
2. Haz clic en el icono de la extensión en la barra de herramientas
3. Revisa las diferentes pestañas de análisis SEO

## Desarrollo

### Requisitos previos

- Node.js v14.0.0 o superior
- npm v6.0.0 o superior

### Comandos

- `npm start`: Inicia el entorno de desarrollo
- `npm run build`: Genera archivos para producción
- `npm test`: Ejecuta pruebas

## Licencia

MIT
