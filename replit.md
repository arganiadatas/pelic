# CineVault - Plataforma de Streaming Premium

## Descripción del Proyecto

CineVault es una plataforma de streaming estilo Netflix con estadísticas automatizadas y rankings dinámicos. La aplicación simula un servicio de streaming donde se pueden visualizar películas y series con estadísticas en tiempo real de reproducciones y likes.

## Características Principales

- **Catálogo de contenido**: Películas y series con pósters profesionales generados
- **Sistema de estadísticas automatizado**: Las vistas y likes se calculan automáticamente basándose en:
  - Rating de calidad del contenido
  - Nivel de hype
  - Días desde el estreno
- **Rankings dinámicos**: Top 10 semanal, mensual y de todos los tiempos
- **Filtros por categoría**: Acción, Drama, Comedia, Ciencia Ficción, Terror, Fantasía, Romance, Misterio, Thriller, Aventura
- **Efectos de sonido satisfactorios**: Clicks, hovers, y transiciones con audio
- **Animaciones fluidas**: Transiciones de página, hover effects, y animaciones de carga
- **Modo oscuro/claro**: Toggle de tema con persistencia

## Arquitectura

### Frontend (React + TypeScript)
- **Framework**: React 18 con TypeScript
- **Routing**: Wouter para navegación
- **Estado**: TanStack Query para data fetching
- **UI**: Shadcn/ui components con Tailwind CSS
- **Animaciones**: Framer Motion
- **Sonido**: Web Audio API

### Backend (Express + Node.js)
- **Framework**: Express.js
- **Storage**: In-memory storage con interface para fácil migración a DB
- **API Routes**:
  - `GET /api/content` - Obtener todo el contenido con estadísticas
  - `GET /api/content/:id` - Obtener contenido específico
  - `GET /api/rankings/:period` - Obtener rankings (weekly/monthly/alltime)
  - `POST /api/content/:id/update-stats` - Actualizar estadísticas de contenido

### Sistema de Estadísticas

El motor de estadísticas simula engagement realista basándose en:

```typescript
// Factores que afectan las estadísticas:
- qualityRating (0-100): Calidad percibida del contenido
- hypeLevel (0-100): Nivel de expectación/tendencia
- releaseDate: Contenido reciente recibe boost
- Días desde estreno: Afecta crecimiento acumulativo
```

Las estadísticas se actualizan automáticamente cada hora en el backend.

## Cómo Agregar Nuevo Contenido

Edita el archivo `server/initialData.ts` y agrega nuevos objetos al array `contentData`:

```typescript
{
  id: "9", // ID único
  type: "movie", // o "series"
  title: "Tu Título",
  description: "Descripción completa...",
  category: "Acción", // Una de las categorías válidas
  qualityRating: 85, // 0-100, afecta estadísticas
  hypeLevel: 90, // 0-100, afecta trending y stats
  releaseDate: "2024-11-01", // YYYY-MM-DD
  director: "Nombre Director",
  cast: ["Actor 1", "Actor 2"],
  production: "Estudio de Producción",
  posterUrl: "/path/to/poster.png",
  duration: "2h 15m" // para películas
  // seasons: 3 // para series
}
```

## Estructura de Archivos

```
client/
├── src/
│   ├── components/
│   │   ├── Header.tsx
│   │   ├── HeroSection.tsx
│   │   ├── CategoryFilter.tsx
│   │   ├── ContentCard.tsx
│   │   ├── TopRankings.tsx
│   │   ├── ContentDetail.tsx
│   │   ├── ThemeProvider.tsx
│   │   └── ThemeToggle.tsx
│   ├── lib/
│   │   ├── soundEffects.ts
│   │   └── queryClient.ts
│   ├── pages/
│   │   └── Home.tsx
│   └── data/
│       └── content.ts (legacy, usar server/initialData.ts)
server/
├── routes.ts - API endpoints
├── storage.ts - Interface y lógica de almacenamiento
└── initialData.ts - Datos de películas/series
shared/
└── schema.ts - Tipos TypeScript compartidos
```

## Diseño

La interfaz sigue las guías de diseño en `design_guidelines.md`:
- Paleta de colores sofisticada (púrpura primario)
- Tipografía: Inter para UI, Playfair Display para títulos
- Espaciado generoso y componentes premium
- Efectos hover y animaciones sutiles
- Responsive design para todos los dispositivos

## Cambios Recientes

- **2024-11-03**: Implementación inicial completa
  - Sistema de estadísticas automatizado
  - Rankings dinámicos
  - 8 películas/series de ejemplo con pósters generados
  - Efectos de sonido y animaciones
  - API backend funcional
  - Integración frontend-backend

## Próximos Pasos Sugeridos

- [ ] Agregar más contenido al catálogo
- [ ] Implementar búsqueda por texto
- [ ] Sistema de usuarios y favoritos
- [ ] Historial de visualización
- [ ] Recomendaciones basadas en gustos
- [ ] Gestión de temporadas/episodios para series
