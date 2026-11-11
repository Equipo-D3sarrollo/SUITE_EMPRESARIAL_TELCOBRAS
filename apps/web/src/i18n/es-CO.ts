import type { NAVIGATION } from '@telcobras/contracts';

type NavigationNode = (typeof NAVIGATION)[number];

/** Un texto por cada módulo y submódulo del árbol: si contracts agrega uno, este archivo deja de compilar hasta traducirlo. */
type NavigationLabels = {
  [M in NavigationNode as M['id']]: {
    label: string;
    submodules: Record<M['submodules'][number]['id'], string>;
  };
};

const navigation: NavigationLabels = {
  dashboard: {
    label: 'Inicio',
    submodules: {
      overview: 'Dashboard General',
      'quick-metrics': 'Métricas Rápidas',
      'operations-summary': 'Resumen Operativo',
    },
  },
  commercial: {
    label: 'Comercial',
    submodules: {
      companies: 'CRM Empresas',
      contacts: 'Contactos',
      leads: 'Leads',
      opportunities: 'Oportunidades',
      activities: 'Actividades',
      pipeline: 'Pipeline Kanban',
    },
  },
  leadgen: {
    label: 'Inteligencia Comercial',
    submodules: {
      prospecting: 'LeadGen y Prospección',
      campaigns: 'Campañas',
      'data-enrichment': 'Enriquecimiento de Datos',
    },
  },
  documents: {
    label: 'Documentos',
    submodules: {
      'document-center': 'Centro Documental',
      'radian-invoices': 'RADIAN / DIAN Facturas',
      'odoo-approvals': 'Aprobaciones Odoo',
    },
  },
  integrations: {
    label: 'Integraciones',
    submodules: {
      'connector-hub': 'Hub de Conectores',
      odoo: 'Odoo ERP',
      whatsapp: 'WhatsApp Cloud API',
      webhooks: 'Webhooks y Logs',
    },
  },
  automation: {
    label: 'Automatización',
    submodules: {
      'process-flows': 'Flujos de Proceso',
      'live-triggers': 'Disparadores en Vivo',
      queues: 'Colas y Monitoreo',
    },
  },
  ai: {
    label: 'Inteligencia Artificial',
    submodules: {
      'agent-management': 'Agent Management',
      'agent-runtime': 'Runtime Docker',
      'agent-logs': 'Logs del Agents SDK',
    },
  },
  analytics: {
    label: 'Analítica',
    submodules: {
      'executive-dashboard': 'Dashboard Ejecutivo',
      'cross-reports': 'Reportes Transversales',
      'bi-export': 'Exportación BI',
    },
  },
  administration: {
    label: 'Administración',
    submodules: {
      organization: 'Configuración Empresa',
      roles: 'Roles y Permisos',
      subscription: 'Suscripción y Licencias',
      users: 'Usuarios',
    },
  },
  help: {
    label: 'Ayuda',
    submodules: {
      'help-center': 'Centro de Ayuda y Docs',
      'noc-support': 'Soporte NOC 24/7',
      'network-status': 'Estado de Red y Conectores',
    },
  },
};

/** Todos los textos visibles de la SPA, en español de Colombia (ADR-008). */
export const t = {
  brand: {
    name: 'OrveX.IA',
    productName: 'OrveX.IA',
    slogan: 'Una nueva forma de entender las redes',
    copyright: (year: number) => `© ${year} Telcobras S.A.S.`,
  },
  navigation,
  common: {
    close: 'Cerrar',
    retry: 'Reintentar',
    loading: 'Cargando…',
    genericError: 'Algo salió mal. Intenta de nuevo en unos segundos.',
    notFoundTitle: 'Esta página no existe',
    notFoundDescription: 'Revisa la dirección o vuelve al inicio.',
    goHome: 'Ir al inicio',
    simulatedData: 'Datos de ejemplo',
  },
  shell: {
    skipToContent: 'Saltar al contenido principal',
    skipToNavigation: 'Saltar al menú de módulos',
    regions: {
      navigation: 'Módulos',
      workspace: 'Área de trabajo',
      context: 'Panel contextual',
    },
    organization: {
      switcherLabel: 'Cambiar de organización',
      listTitle: 'Tus organizaciones',
      active: 'Activa',
      nit: (nit: string) => `NIT: ${nit}`,
      switchError: 'No se pudo cambiar de organización.',
      add: 'Registrar otra organización',
    },
    search: {
      trigger: 'Buscar módulos…',
      shortcut: 'Ctrl K',
      dialogTitle: 'Buscar en OrveX.IA',
      placeholder: 'Escribe el nombre de un módulo o submódulo',
      empty: 'No hay resultados para tu búsqueda.',
    },
    servicesOperational: 'Servicios operativos',
    servicesDegraded: 'Servicios con novedades',
    notifications: {
      label: 'Notificaciones',
      emptyTitle: 'No tienes notificaciones',
      emptyDescription: 'Aquí verás los avisos de tus módulos.',
    },
    theme: {
      label: 'Apariencia',
      options: { light: 'Claro', dark: 'Oscuro', system: 'Según el sistema' },
    },
    userMenu: {
      label: 'Menú de usuario',
      signOut: 'Cerrar sesión',
    },
    sidebar: {
      filterLabel: 'Filtrar módulos',
      filterPlaceholder: 'Filtrar menú o submódulo…',
      noMatches: 'Ningún módulo coincide con el filtro.',
      noModules: 'Tu rol todavía no tiene módulos asignados.',
    },
    status: {
      title: 'Estado de servicios y conectores',
      latency: 'Latencia promedio',
      connectorsUp: (up: number, total: number) => `Conectores ${up}/${total}`,
      states: { ok: 'Operativo', warning: 'Con novedades', error: 'Caído' },
    },
  },
  connectors: {
    radian: { name: 'RADIAN / DIAN', description: 'Web service de la DIAN' },
    odoo: { name: 'Odoo ERP', description: 'Sincronización JSON-2' },
    whatsapp: { name: 'WhatsApp Cloud API', description: 'Mensajería con clientes' },
    leadgen: { name: 'LeadGen Crawler', description: 'Prospección distribuida' },
    agents: { name: 'Agent Runtime', description: 'Agentes en Docker' },
    latency: (ms: number) => `Latencia ${ms} ms`,
  },
  placeholder: {
    availableInStage: (stage: number) => `Disponible en la etapa ${stage}`,
    contextTitle: 'Acerca de este módulo',
    moduleLabel: 'Módulo',
    stageLabel: 'Etapa de entrega',
    submodulesLabel: 'Submódulos',
  },
  auth: {
    sidePanel: {
      title: 'Bienvenido a OrveX.IA',
      description:
        'Gestión comercial, documental y de integraciones para tu empresa, en un solo lugar.',
      features: [
        {
          title: 'Acceso sin contraseña',
          description: 'Con un código que te llega al correo o con tu cuenta de Google.',
        },
        {
          title: 'Datos aislados por empresa',
          description: 'Cada organización ve solo su información.',
        },
        { title: 'Segundo factor', description: 'Protege tu cuenta con un código TOTP.' },
      ],
    },
    or: 'o',
    emailLabel: 'Correo electrónico',
    emailPlaceholder: 'nombre@empresa.com',
    invalidEmail: 'Escribe un correo válido.',
    login: {
      title: 'Iniciar sesión en OrveX.IA',
      description:
        'Ingresa a tu espacio de trabajo con un código que te enviamos al correo o con tu cuenta de Google.',
      google: 'Continuar con Google Workspace',
      sendCode: 'Enviarme un código',
      submitCode: 'Iniciar sesión',
      error: 'No pudimos iniciar tu sesión. Intenta de nuevo.',
      noAccount: '¿Tu empresa es nueva en OrveX.IA?',
      createAccount: 'Crea una cuenta',
    },
    code: {
      title: 'Revisa tu correo',
      sent: (email: string) => `Enviamos un código de 6 dígitos a ${email}.`,
      resent: (email: string) => `Te enviamos un código nuevo a ${email}. El anterior ya no sirve.`,
      label: 'Código de acceso',
      hint: 'Vence en 10 minutos. Si no lo ves, revisa la carpeta de spam.',
      invalidFormat: 'El código debe tener 6 dígitos.',
      resend: 'Reenviar código',
      useAnotherEmail: 'Usar otro correo',
      errors: {
        invalid: 'El código no es correcto. Revísalo e intenta de nuevo.',
        expired: 'El código venció. Pide uno nuevo con «Reenviar código».',
        tooManyAttempts: 'Hiciste demasiados intentos. Pide un código nuevo con «Reenviar código».',
        accountNotFound:
          'No hay una cuenta con este correo. Si tu empresa es nueva, crea una cuenta.',
        rateLimited: 'Hiciste demasiadas solicitudes. Espera un minuto e intenta de nuevo.',
        send: 'No pudimos enviar el código a tu correo. Intenta de nuevo.',
        verify: 'No pudimos verificar el código. Intenta de nuevo.',
      },
    },
    totp: {
      title: 'Verificación en dos pasos',
      description: 'Escribe el código de 6 dígitos de tu aplicación de autenticación.',
      label: 'Código de verificación',
      submit: 'Verificar',
      invalid: 'El código debe tener 6 dígitos.',
      error: 'El código no es válido o ya venció.',
    },
    register: {
      title: 'Crear cuenta en OrveX.IA',
      description: 'Empieza en minutos. No necesitas contraseña.',
      google: 'Registrarse con Google',
      nameLabel: 'Nombre completo',
      invalidName: 'Escribe tu nombre (mínimo 2 caracteres).',
      submit: 'Enviarme un código',
      submitCode: 'Crear cuenta',
      haveAccount: '¿Ya tienes cuenta?',
      signIn: 'Iniciar sesión',
      steps: { details: '1. Tus datos', code: '2. Código del correo' },
    },
    invitation: {
      title: 'Te invitaron a OrveX.IA',
      description: 'Acepta la invitación para unirte a la organización que te invitó.',
      signedOutHint: 'Para aceptarla, crea tu cuenta o inicia sesión con el correo invitado.',
      accept: 'Aceptar invitación',
      error: 'La invitación no es válida, ya se usó o venció.',
    },
  },
  onboarding: {
    badge: 'Configura tu empresa en 2 minutos',
    title: 'Personaliza tu espacio de trabajo',
    description: 'Ingresa los datos esenciales de tu empresa para empezar a usar OrveX.IA.',
    nameLabel: 'Nombre de la empresa',
    namePlaceholder: 'Logística Andina',
    legalNameLabel: 'Razón social',
    legalNamePlaceholder: 'Logística Andina S.A.S.',
    nitLabel: 'NIT',
    nitPlaceholder: '900.123.456-7',
    nitDescription: 'Con dígito de verificación.',
    sizeLabel: 'Tamaño de la empresa',
    sizes: { '1-10': '1 - 10', '11-50': '11 - 50', '51-200': '51 - 200', '200+': '200+' },
    submit: 'Guardar y entrar al panel',
    error: 'No pudimos crear la organización. Revisa los datos e intenta de nuevo.',
    errors: {
      name: 'Escribe entre 2 y 120 caracteres.',
      legalName: 'Escribe entre 2 y 200 caracteres.',
      nitFormat: 'Usa el formato 900123456-7.',
      nitCheckDigit: 'El dígito de verificación no corresponde al NIT.',
      size: 'Elige el tamaño de la empresa.',
    },
  },
  newOrganization: {
    title: 'Registrar otra organización',
    description:
      'Se crea con tu cuenta actual, sin volver a iniciar sesión, y quedarás con el rol de Administrador de empresa. Tus demás organizaciones siguen disponibles en el selector.',
    account: (email: string) => `Cuenta: ${email}`,
    back: 'Volver al panel',
  },
} as const;
