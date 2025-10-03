// Paleta de cores centralizada para o sistema
export const colors = {
  // Cores de fundo
  background: {
    primary: 'bg-slate-50',
    secondary: 'bg-white',
    dark: 'bg-slate-900',
    card: 'bg-white',
    sidebar: 'bg-slate-100'
  },
  
  // Cores de texto
  text: {
    primary: 'text-slate-900',
    secondary: 'text-slate-600',
    muted: 'text-slate-500',
    light: 'text-slate-400',
    white: 'text-white',
    dark: 'text-slate-800'
  },
  
  // Cores de borda
  border: {
    primary: 'border-slate-200',
    secondary: 'border-slate-300',
    accent: 'border-blue-300',
    active: 'border-blue-500',
    error: 'border-red-300'
  },
  
  // Cores de status
  status: {
    success: 'bg-green-100 text-green-800 border-green-200',
    warning: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    error: 'bg-red-100 text-red-800 border-red-200',
    info: 'bg-blue-100 text-blue-800 border-blue-200'
  },
  
  // Cores de prioridade
  priority: {
    critical: 'bg-red-500 text-white',
    high: 'bg-orange-500 text-white',
    medium: 'bg-yellow-500 text-slate-800',
    low: 'bg-green-500 text-white'
  },
  
  // Cores de cards
  cards: {
    primary: 'from-blue-500 to-blue-600',
    secondary: 'from-slate-500 to-slate-600',
    success: 'from-green-500 to-green-600',
    warning: 'from-yellow-500 to-yellow-600',
    danger: 'from-red-500 to-red-600',
    info: 'from-cyan-500 to-cyan-600'
  },
  
  // Cores de hover
  hover: {
    primary: 'hover:bg-slate-100',
    secondary: 'hover:bg-slate-200',
    card: 'hover:shadow-lg hover:-translate-y-1',
    button: 'hover:bg-blue-600'
  }
};

// Espaçamentos consistentes
export const spacing = {
  xs: 'p-1',
  sm: 'p-2',
  md: 'p-4',
  lg: 'p-6',
  xl: 'p-8',
  xxl: 'p-12'
};

// Sombras
export const shadows = {
  sm: 'shadow-sm',
  md: 'shadow-md',
  lg: 'shadow-lg',
  xl: 'shadow-xl',
  card: 'shadow-md hover:shadow-lg',
  navbar: 'shadow-sm'
};

// Bordas arredondadas
export const radius = {
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  '2xl': 'rounded-2xl',
  full: 'rounded-full'
};

// Transições
export const transitions = {
  fast: 'transition-all duration-150 ease-in-out',
  normal: 'transition-all duration-300 ease-in-out',
  slow: 'transition-all duration-500 ease-in-out',
  bounce: 'transition-all duration-300 ease-out'
};

// Breakpoints responsivos
export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px'
};

// Z-index
export const zIndex = {
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  modal: 1040,
  popover: 1050,
  tooltip: 1060
};
