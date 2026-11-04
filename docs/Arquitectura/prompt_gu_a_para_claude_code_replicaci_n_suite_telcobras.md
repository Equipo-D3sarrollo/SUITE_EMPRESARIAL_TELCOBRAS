# GUÍA RÁPIDA DE IMPLEMENTACIÓN FRONTEND: ARCHITECTURE & DESIGN SPEC (PARA CLAUDE CODE)
**Proyecto: Suite Empresarial Telcobras (Arquitectura Reactiva de 5 Zonas: 0 a 4)**  
*Instrucciones directas de ingeniería para replicar exactamente la interfaz visual, layout, paleta y reactividad.*

---

## 1. STACK TECNOLÓGICO OBLIGATORIO

```bash
# 1. Crear proyecto e instalar dependencias base
npx create-next-app@latest telcobras-suite --typescript --tailwind --app --eslint
cd telcobras-suite

# 2. Instalar el set exacto de dependencias de UI, iconos, estado y gráficos
npm install lucide-react @radix-ui/react-accordion @radix-ui/react-popover @radix-ui/react-switch @radix-ui/react-dropdown-menu cmdk zustand recharts @tanstack/react-table @hello-pangea/dnd framer-motion @fontsource/plus-jakarta-sans clsx tailwind-merge
```

---

## 2. SISTEMA DE DISEÑO & TOKENS (TAILWIND & FONTS)

### A. Tipografía
* Importar en `app/layout.tsx`:
  ```typescript
  import '@fontsource/plus-jakarta-sans/400.css';
  import '@fontsource/plus-jakarta-sans/500.css';
  import '@fontsource/plus-jakarta-sans/600.css';
  import '@fontsource/plus-jakarta-sans/700.css';
  ```

### B. Tokens de Color (`tailwind.config.ts`)
```typescript
import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        telco: {
          blue: '#0A66C2',       // Azul primario de marca (acciones, logos, selecciones)
          'blue-dark': '#004182',
          emerald: '#10B981',    // Estados operativos OK, ingresos, validado DIAN
          amber: '#F59E0B',      // Alertas y pendientes Odoo
          slate: '#0F172A',      // Textos principales y cabeceras
          canvas: '#F8FAFC',     // Fondo neutro corporativo
          surface: '#FFFFFF',
          border: '#E2E8F0',     // Bordes sutiles de alta fidelidad
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
      }
    }
  },
  plugins: [],
};
export default config;
```

---

## 3. EL LAYOUT MAESTRO DE 5 ZONAS (ESTRUCTURA HTML/CSS ESTRICTA)

La pantalla **NUNCA** debe romper el viewport ni tener scroll global. La estructura es `h-screen overflow-hidden flex flex-col`:

```tsx
// components/layout/MasterSuiteLayout.tsx
export default function MasterSuiteLayout() {
  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col bg-slate-50 font-sans text-slate-900">
      
      {/* =========================================================
          ZONA [0]: TOPBAR GLOBAL (Height fija: h-14 / 56px)
          - Logo Telcobras + Pill 'SUITE'
          - Selector Multi-Tenant (Empresa activa + NIT + Dot Verde)
          - Input Búsqueda indexada CMD-K (cmdk)
          - Status servicios ('Servicios Operativos')
          - Popover Usuario estilo Google (CM - Carlos Mendoza)
         ========================================================= */}
      <header className="h-14 border-b border-slate-200 bg-white flex items-center justify-between px-6 shrink-0 z-30">
        <Zone0Topbar />
      </header>

      {/* CUERPO CENTRAL (Flex-1, Ocupa todo el espacio restante) */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* =========================================================
            ZONA [1]: SIDEBAR LATERAL (Ancho fijo: w-64 / 256px)
            - 10 Categorías con Acordeón Estricto (Single Collapsible)
            - Buscador/Filtro rápido de módulos arriba
            - Al abrir una categoría se cierran automáticamente las demás
           ========================================================= */}
        <aside className="w-64 border-r border-slate-200 bg-white flex flex-col shrink-0 overflow-y-auto">
          <Zone1Sidebar />
        </aside>

        {/* CONTENEDOR DINÁMICO REACTIVO (Workspace + Panel Lateral) */}
        <main className="flex-1 flex overflow-hidden">
          
          {/* =========================================================
              ZONA [2]: WORKSPACE PRINCIPAL (~72% del ancho)
              - Scroll vertical independiente (overflow-y-auto)
              - Contenido protagonista: Tableros Kanban, Curvas SVG, Tablas
              - Cambia inmediatamente al hacer clic en un submenú de Zona 1
             ========================================================= */}
          <section className="w-[72%] overflow-y-auto p-6 space-y-6 bg-slate-50">
            <Zone2Workspace />
          </section>

          {/* =========================================================
              ZONA [3]: PANEL DERECHO CONTEXTUAL (~28% del ancho)
              - Scroll vertical independiente (overflow-y-auto)
              - Widgets de soporte: Donut Charts Recharts, Cuotas, Live Feed
              - Sincronizado dinámicamente con la vista activa de Zona 2
             ========================================================= */}
          <aside className="w-[28%] border-l border-slate-200 bg-slate-50/70 overflow-y-auto p-5 space-y-5">
            <Zone3ContextPanel />
          </aside>

        </main>
      </div>

      {/* =========================================================
          ZONA [4]: BARRA DE TELEMETRÍA (Height fija: h-12 / 48px)
          - Indicador de latencia (18ms), Ping DIAN SOAP (100%),
          - Sync Odoo ERP (12s), Meta WhatsApp API, Crawler Pool
         ========================================================= */}
      <footer className="h-12 border-t border-slate-200 bg-white flex items-center justify-between px-6 shrink-0 z-20 text-xs">
        <Zone4TelemetryBar />
      </footer>

    </div>
  );
}
```

---

## 4. GESTOR DE ESTADO REACTIVO (STORE ZUSTAND)

El pegamento que sincroniza las Zonas 1 ➔ [2, 3, 4] sin recargar la página:

```typescript
// store/useSuiteStore.ts
import { create } from 'zustand';

export type ModuleCategory = 
  | 'inicio' | 'comercial' | 'leadgen' | 'documentos' 
  | 'integraciones' | 'automatizacion' | 'ia' 
  | 'analitica' | 'administracion' | 'ayuda';

interface SuiteState {
  activeCategory: ModuleCategory;
  activeSubmodule: string;
  setActiveSubmodule: (cat: ModuleCategory, sub: string) => void;
}

export const useSuiteStore = create<SuiteState>((set) => ({
  activeCategory: 'inicio',
  activeSubmodule: 'dashboard',
  setActiveSubmodule: (activeCategory, activeSubmodule) => 
    set({ activeCategory, activeSubmodule }),
}));
```

---

## 5. MAPA DE LOS 10 MÓDULOS DEL SIDEBAR (ZONA 1)

Usa `@radix-ui/react-accordion` con `type="single"` y `collapsible`:

1. **`01. Inicio`** ➔ `Dashboard General`
2. **`02. Comercial`** ➔ `CRM Kanban`, `Contactos`, `Oportunidades`
3. **`03. Intel. Comercial`** ➔ `LeadGen & Prospección`, `Campañas`, `Enriquecimiento IA`
4. **`04. Documentos`** ➔ `RADIAN / DIAN Facturas`, `Aprobaciones Odoo`, `Centro Documental`
5. **`05. Integraciones`** ➔ `Conector Odoo v16`, `WhatsApp Cloud API`, `DIAN SOAP XML`
6. **`06. Automatización`** ➔ `Flujos n8n`, `Colas BullMQ`, `Logs de Ejecución`
7. **`07. Intel. Artificial`** ➔ `Agentes Docker (LeadScout, Auditor RADIAN)`, `OpenAI SDK`
8. **`08. Analítica`** ➔ `BI Financiero (MRR, CAC)`, `Reportes Junta Directiva`
9. **`09. Administración`** ➔ `Roles y Permisos (RBAC)`, `Usuarios`, `Licencias (24/30)`
10. **`10. Ayuda`** ➔ `NOC Telcobras 24/7`, `API Docs`, `Tickets de Soporte`

---

## 6. REGLAS VISUALES CRÍTICAS PARA CLAUDE CODE

1. **Iconografía Coherente**: Usar **únicamente** `lucide-react` con `strokeWidth={1.75}` o `2`. No mezclar sets de iconos.
2. **Data Viz (Recharts)**:
   * Curva comercial: `<AreaChart>` con curva cúbica suave (`type="monotone"`), trazo `#0A66C2` y degradado `linearGradient` que desvanece a transparente.
   * Donut chart (Zona 3): `<PieChart>` con `<Pie innerRadius={60} outerRadius={80}>` usando `#0A66C2` (Telecom), `#10B981` (Fintech), `#F59E0B` (Logística), `#8884d8` (Salud).
3. **Formato Monetario y Datos Colombianos**:
   * Montos siempre formateados en pesos colombianos: `$845.2M COP` o `$84,500,000`.
   * Identificadores de facturas y eventos tributarios: `FE-10928`, `CUFE`, eventos DIAN `030 (Acuse)`, `032 (Recibo)`, `034 (Aceptación Tácita)`.
4. **Transición Fade**:
   * Envolver el renderizado de la Zona 2 y 3 con `framer-motion`:
     ```tsx
     <motion.div key={activeSubmodule} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.15 }}>
       {/* Componente del módulo */}
     </motion.div>
     ```
