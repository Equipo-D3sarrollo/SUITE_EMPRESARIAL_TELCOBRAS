# ESPECIFICACIÓN TÉCNICA FRONTEND: STACK, LIBRERÍAS Y ARQUITECTURA VISUAL
**Plataforma: OrveX.IA (Arquitectura Reactiva de 5 Zonas: 0 a 4)**  
*Guía de Replicación de Interfaz de Usuario y Experiencia de Usuario (UI/UX)*

---

## 1. CORE FRONTEND & FRAMEWORKS RECOMENDADOS

Para construir la interfaz idéntica con el rendimiento óptimo demostrado en el prototipo interactivo:

| Capa / Rol | Tecnología / Opción 1 (React Ecosystem) | Opción 2 (Vue Ecosystem) | Propósito en la Suite |
| :--- | :--- | :--- | :--- |
| **Framework Core** | **Next.js 14+ (App Router)** o React 18+ con Vite | **Nuxt 3** o Vue 3 (Composition API) | Renderizado rápido, routing anidado para submenús y carga modular por zona. |
| **Lenguaje** | **TypeScript 5.x** | **TypeScript 5.x** | Tipado estricto de eventos RADIAN, modelos Odoo, contratos y estados globales de la suite. |
| **Motor de Estilos** | **Tailwind CSS v3.4+** | **Tailwind CSS v3.4+** | Maquetación con utilidades directas, clases flex/grid ultra-optimizadas y cero overhead de CSS. |

---

## 2. GESTIÓN DE LAYOUT Y ARQUITECTURA DE LAS 5 ZONAS (0 - 4)

El prototipo utiliza un layout CSS estricto basado en **CSS Grid & Flexbox**:

* **Contenedor Principal (`h-screen overflow-hidden flex flex-col`)**:
  * **Zona [0] - Topbar Global**: `h-14 border-b flex items-center justify-between z-30 shrink-0`.
  * **Cuerpo Central (`flex-1 flex overflow-hidden`)**:
    * **Zona [1] - Sidebar Acordeón**: `w-64 border-r flex flex-col shrink-0 bg-white overflow-y-auto`.
    * **Contenedor de Trabajo Reactivo (`flex-1 flex overflow-hidden`)**:
      * **Zona [2] - Workspace Principal**: `w-[72%] overflow-y-auto p-6 flex flex-col space-y-6`.
      * **Zona [3] - Panel Derecho Contextual**: `w-[28%] border-l overflow-y-auto p-5 bg-slate-50/50 flex flex-col space-y-5`.
  * **Zona [4] - Telemetry Bottom Bar**: `h-12 border-t flex items-center justify-between px-6 bg-white z-20 shrink-0`.

---

## 3. LIBRERÍAS DE UI, ICONOGRAFÍA Y COMPONENTES

1. **Sistema de Iconos**:
   * **Lucide Icons (`lucide-react` / `lucide-vue-next`)**:
     * Es el set de iconos usado en el prototipo (`LayoutDashboard`, `Briefcase`, `Target`, `FileText`, `Layers`, `GitBranch`, `Bot`, `BarChart3`, `ShieldCheck`, `HelpCircle`, `Activity`, `CheckCircle2`, `Clock`, `ArrowUpRight`).
     * Trazo unificado de `strokeWidth={1.75}` o `2`.

2. **Componentes Primitivos y Accesibilidad (Headless UI)**:
   * **Radix UI (`@radix-ui/react-accordion`, `@radix-ui/react-popover`, `@radix-ui/react-dialog`, `@radix-ui/react-dropdown-menu`)** o **shadcn/ui**:
     * **Acordeón estricto (Zona 1)**: `type="single" collapsible` para que al abrir un menú se cierren automáticamente los demás.
     * **Popover de Usuario (Zona 0)**: Menú desplegable estilo Google Account al pulsar el avatar del usuario.
     * **Command Bar (Zona 0)**: `cmdk` para el buscador indexado `Ctrl + K`.
     * **Switches interactivos (Zona 2 - Integraciones)**: `@radix-ui/react-switch`.

---

## 4. VISUALIZACIÓN DE DATOS Y GRÁFICOS (DATA VIZ)

Para replicar las curvas de facturación y los gráficos de dona idénticos:

* **Gráficos Generales**:
  * **Recharts** (`recharts` para React) o **Chart.js / vue-chartjs**:
    * **Curva de Captación (Zona 2)**: `<AreaChart>` o `<LineChart>` con doble gradiente suavizado (`stroke="#0A66C2"` y `fill="url(#colorPipeline)"` con `type="monotone"`).
    * **Gráfico de Donut por Industria (Zona 3)**: `<PieChart>` con `<Pie innerRadius={60} outerRadius={85} dataKey="value">` usando los 4 colores sectoriales (`#0A66C2`, `#00C29F`, `#FFBB28`, `#8884d8`).
* **Micro-gráficos de Telemetría (Zona 4)**:
  * SVGs vectoriales nativos en línea o sparklines ultraligeras (`recharts/TinyLine`).

---

## 5. TABLEROS KANBAN Y TABLAS DE DATOS

* **Tablero Kanban Comercial (Módulo 2)**:
  * **`@hello-pangea/dnd`** (fork moderno y mantenido de react-beautiful-dnd) o **`@dnd-kit/core`**:
    * Permite el arrastre suave de tarjetas entre las columnas (*Calificación*, *Propuesta*, *Negociación*, *Cierre*).
* **Tablas de Facturación RADIAN / DIAN (Módulo 4 y Dashboard)**:
  * **TanStack Table v8 (`@tanstack/react-table`)**:
    * Ordenamiento por columnas, filtrado en caliente, paginación virtualizada y renderizado rápido de miles de registros UBL 2.1 sin pérdida de FPS.

---

## 6. GESTIÓN DE ESTADO REACTIVO (SINCRONIZACIÓN ZONAS 1 ➔ 2, 3, 4)

El secreto de la arquitectura reactiva radica en un store global liviano:

* **Zustand** (Recomendado por su ligereza y cero boilerplate) o **Pinia** (en Vue):
  ```typescript
  // store/useSuiteStore.ts
  interface SuiteState {
    activeCategory: string; // ej: 'comercial'
    activeSubmodule: string; // ej: 'kanban'
    accordionMode: boolean;
    activeTenant: string;
    setActiveSubmodule: (category: string, sub: string) => void;
  }
  ```
* Al ejecutar `setActiveSubmodule`, los componentes de la **Zona 2**, **Zona 3** y **Zona 4** escuchan el cambio y montan condicionalmente la vista correspondiente (`switch/case` o sub-rutas dinámicas) con transición fade fluida.

---

## 7. ANIMACIONES Y MICRO-INTERACCIONES

* **Framer Motion (`framer-motion`)**:
  * Transición de entrada suave para la Zona 2 al cambiar de submenú (`initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}`).
  * Animación suave al desplegar/replegar los submenús del sidebar.
  * Pulso visual y badges de telemetría en vivo en la Zona 4 (`animate-pulse`).

---

## 8. TIPOGRAFÍA Y TOKENS DE DISEÑO DE TELCOBRAS

* **Fuente Tipográfica**:
  * **Plus Jakarta Sans** (Google Fonts / `@fontsource/plus-jakarta-sans`).
  * Pesos recomendados: `400` (Regular), `500` (Medium), `600` (SemiBold), `700` (Bold).

* **Paleta de Colores en Tailwind Config (`tailwind.config.js`)**:
  ```javascript
  module.exports = {
    theme: {
      extend: {
        colors: {
          telco: {
            primary: '#0A66C2',       // Azul Corporativo Telcobras
            'primary-dark': '#004182',
            emerald: '#10B981',       // Verde Operaciones / Éxito
            amber: '#F59E0B',         // Advertencias / Pendientes
            slate: '#0F172A',         // Tipografía y fondos oscuros
            surface: '#F8FAFC',       // Fondo de zonas secundarias
          }
        },
        fontFamily: {
          sans: ['"Plus Jakarta Sans"', 'sans-serif'],
        }
      }
    }
  }
  ```

---

## 9. RESUMEN DEL `package.json` RECOMENDADO

```json
{
  "name": "suite-empresarial-telcobras-frontend",
  "version": "4.8.2",
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "next": "14.2.5",
    "typescript": "^5.5.4",
    "tailwindcss": "^3.4.7",
    "lucide-react": "^0.417.0",
    "@radix-ui/react-accordion": "^1.2.0",
    "@radix-ui/react-popover": "^1.1.1",
    "@radix-ui/react-switch": "^1.1.0",
    "@radix-ui/react-dropdown-menu": "^2.1.1",
    "cmdk": "^1.0.0",
    "zustand": "^4.5.4",
    "recharts": "^2.12.7",
    "@tanstack/react-table": "^8.19.3",
    "@dnd-kit/core": "^6.1.0",
    "@dnd-kit/sortable": "^8.0.0",
    "framer-motion": "^11.3.19",
    "@fontsource/plus-jakarta-sans": "^5.0.21"
  }
}
```
