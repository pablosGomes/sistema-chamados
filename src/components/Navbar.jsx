import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, 
  X, 
  Sun, 
  Moon, 
  Bell, 
  User,
  Settings,
  LogOut,
  ChevronDown,
  CheckCircle,
  AlertTriangle,
  Info,
  Clock
} from 'lucide-react';

// NOTA: O hook useDarkMode foi removido deste componente.
// App deve ser a fonte de verdade e passar isDarkMode / handlers via props.

function Navbar({
  activeTab,
  onTabChange,
  tabs,
  className = '',
  isDarkMode: isDarkModeProp,
  onThemeToggle,
  setDarkMode, // optional handler from App
  clearUserPreference,
  isUserPref
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
  const notificationsRef = useRef(null);
  const profileRef = useRef(null);

  // Fallback para detectar tema atual caso App não passe prop (compatibilidade)
  const getDocTheme = () => {
    if (typeof document === 'undefined') return false;
    const dataTheme = document.documentElement.getAttribute('data-theme');
    if (dataTheme === 'dark' || dataTheme === 'light') return dataTheme === 'dark';
    return document.documentElement.classList.contains('dark');
  };

  const effectiveIsDark = typeof isDarkModeProp === 'boolean'
    ? isDarkModeProp
    : getDocTheme();

  // Função para alternar tema:
  // Prioridade: onThemeToggle (App.toggle) > setDarkMode (App.setDarkMode) > fallback DOM toggle
  const handleThemeToggle = () => {
    if (typeof onThemeToggle === 'function') {
      try { onThemeToggle(); return; } catch {}
    }
    if (typeof setDarkMode === 'function') {
      try { setDarkMode(!effectiveIsDark, true); return; } catch {}
    }
    // Fallback: altera classe/data-theme e dispara evento custom (não persiste)
    try {
      const newIsDark = !effectiveIsDark;
      if (newIsDark) {
        document.documentElement.classList.add('dark');
        document.documentElement.setAttribute('data-theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        document.documentElement.setAttribute('data-theme', 'light');
      }
      window.dispatchEvent(new CustomEvent('theme-change', { detail: newIsDark }));
      try { localStorage.setItem('darkMode', newIsDark ? 'dark' : 'light'); } catch {}
    } catch {}
  };

  const defaultTabs = [
    { id: 'incidentes', label: 'Incidentes' },
    { id: 'changes', label: 'Changes' },
    { id: 'chamados', label: 'Chamados' }
  ];
  const navTabs = tabs || defaultTabs;

  const [internalActiveTab, setInternalActiveTab] = useState(() => {
    return activeTab || navTabs[0]?.id || '';
  });

  useEffect(() => {
    if (activeTab !== undefined && activeTab !== internalActiveTab) {
      setInternalActiveTab(activeTab);
    }
  }, [activeTab, internalActiveTab]);

  const currentActive = activeTab !== undefined ? activeTab : internalActiveTab;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setIsNotificationsOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleTabClick = (tabId) => {
    setInternalActiveTab(tabId);
    if (onTabChange) onTabChange(tabId);
    setIsMobileMenuOpen(false);
  };

  // Dados mockados
  const notifications = [
    {
      id: 1,
      type: 'success',
      title: 'Chamado resolvido',
      message: 'O chamado CHM001 foi resolvido com sucesso',
      time: '2 min atrás',
      read: false
    },
    {
      id: 2,
      type: 'warning',
      title: 'Sistema lento',
      message: 'O sistema P2K está respondendo lentamente',
      time: '15 min atrás',
      read: false
    },
    {
      id: 3,
      type: 'info',
      title: 'Nova change programada',
      message: 'Uma nova change foi agendada para amanhã',
      time: '1 hora atrás',
      read: true
    }
  ];

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-400" />;
      case 'info':
        return <Info className="w-5 h-5 text-blue-400" />;
      default:
        return <Info className="w-5 h-5 text-gray-400" />;
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'success':
        return 'border-l-green-400';
      case 'warning':
        return 'border-l-yellow-400';
      case 'info':
        return 'border-l-blue-400';
      default:
        return 'border-l-gray-400';
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <nav className={`
      sticky top-0 z-40 transition-colors duration-300
      ${effectiveIsDark 
        ? 'bg-dark-bg-base border-dark-border shadow-strong' 
        : 'bg-white border-gray-200 shadow-sm'
      }
      border-b ${className}
    `}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo e título */}
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">S</span>
              </div>
            </div>
            <h1 className={`text-xl font-semibold hidden sm:block transition-colors duration-300 ${
              effectiveIsDark ? 'text-dark-text-primary' : 'text-gray-900'
            }`}>
              Sistema de Chamados
            </h1>
          </div>

          {/* Navegação desktop */}
          <div className="hidden md:block">
            <div className="flex items-center space-x-1">
              {navTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleTabClick(tab.id)}
                  className={`
                    relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                    ${currentActive === tab.id 
                      ? effectiveIsDark
                        ? 'text-blue-300 bg-blue-900/20 border border-blue-800'
                        : 'text-blue-600 bg-blue-100'
                      : effectiveIsDark
                        ? 'text-dark-text-secondary hover:text-dark-text-primary hover:bg-dark-bg-surface'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }
                  `}
                >
                  {tab.label}
                  
                  {/* Indicador ativo */}
                  {currentActive === tab.id && (
                    <motion.div
                      layoutId="activeTab"
                      className={`absolute bottom-0 left-0 right-0 h-0.5 rounded-full transition-colors duration-300 ${
                        effectiveIsDark ? 'bg-blue-300' : 'bg-blue-600'
                      }`}
                      initial={false}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Ações da direita */}
          <div className="flex items-center space-x-2">
            {/* Toggle de tema */}
            <button
              onClick={handleThemeToggle}
              className={`p-2 rounded-lg transition-colors duration-200 ${
                effectiveIsDark
                  ? 'text-dark-text-secondary hover:text-dark-text-primary hover:bg-dark-bg-surface'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
              aria-label="Alternar tema"
            >
              <AnimatePresence mode="wait">
                {effectiveIsDark ? (
                  <motion.div
                    key="sun"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.18 }}
                  >
                    <Sun className="w-5 h-5" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="moon"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.18 }}
                  >
                    <Moon className="w-5 h-5" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>

            {/* Notificações */}
            <div className="relative" ref={notificationsRef}>
              <button 
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className={`p-2 rounded-lg transition-colors duration-200 relative ${
                  effectiveIsDark
                    ? 'text-dark-text-secondary hover:text-dark-text-primary hover:bg-dark-bg-surface'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              {/* Dropdown de notificações */}
              <AnimatePresence>
                {isNotificationsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.98 }}
                    transition={{ duration: 0.18 }}
                    className={`absolute right-0 mt-2 w-80 rounded-xl shadow-xl border overflow-hidden z-50 transition-colors duration-300 notifications-dropdown ${
                      effectiveIsDark
                        ? 'bg-dark-bg-surface border-dark-border'
                        : 'bg-white border-gray-200'
                    }`}
                  >
                    <div className={`px-4 py-3 border-b transition-colors duration-300 ${
                      effectiveIsDark
                        ? 'bg-dark-bg-surface border-dark-border'
                        : 'bg-gray-50 border-gray-200'
                    }`}>
                      <div className="flex items-center justify-between">
                        <h3 className={`text-sm font-semibold transition-colors duration-300 ${
                          effectiveIsDark ? 'text-dark-text-primary' : 'text-gray-900'
                        }`}>
                          Notificações
                        </h3>
                        <button
                          onClick={() => {
                            // marcar todas como lidas (simples mock)
                            // ideal: chamar handler vindo do App / API
                            // aqui apenas fecha e assume lidas
                            setIsNotificationsOpen(false);
                          }}
                          className={`text-xs font-medium transition-colors duration-300 ${
                            effectiveIsDark ? 'text-blue-300 hover:text-blue-200' : 'text-blue-600 hover:text-blue-700'
                          }`}
                        >
                          Marcar todas como lidas
                        </button>
                      </div>
                    </div>
                    
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.length > 0 ? (
                        notifications.map((notification) => {
                          const base = `px-4 py-3 border-l-4 transition-colors duration-200`;
                          const readStateClass = !notification.read
                            ? (effectiveIsDark ? 'notification-item unread' : 'bg-blue-50')
                            : (effectiveIsDark ? 'notification-item read' : '');
                          return (
                            <div
                              key={notification.id}
                              className={`${base} ${getNotificationColor(notification.type)} ${readStateClass}`}
                            >
                              <div className="flex items-start space-x-3">
                                <div className="pt-0.5">{getNotificationIcon(notification.type)}</div>
                                <div className="flex-1 min-w-0">
                                  <p className={`text-sm font-medium transition-colors duration-300 ${
                                    effectiveIsDark ? 'text-dark-text-primary' : 'text-gray-900'
                                  }`}>
                                    {notification.title}
                                  </p>
                                  <p className={`text-sm mt-1 transition-colors duration-300 ${
                                    effectiveIsDark ? 'text-dark-text-secondary' : 'text-gray-600'
                                  }`}>
                                    {notification.message}
                                  </p>
                                  <div className="flex items-center space-x-2 mt-2">
                                    <Clock className="w-3 h-3 text-gray-400" />
                                    <span className={`text-xs transition-colors duration-300 ${
                                      effectiveIsDark ? 'text-dark-text-muted' : 'text-gray-500'
                                    }`}>
                                      {notification.time}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <div className="px-4 py-8 text-center">
                          <Bell className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                          <p className={`text-sm transition-colors duration-300 ${
                            effectiveIsDark ? 'text-dark-text-muted' : 'text-gray-500'
                          }`}>
                            Nenhuma notificação
                          </p>
                        </div>
                      )}
                    </div>
                    
                    {notifications.length > 0 && (
                      <div className={`px-4 py-3 border-t transition-colors duration-300 ${
                        effectiveIsDark
                          ? 'bg-dark-bg-surface border-dark-border'
                          : 'bg-gray-50 border-gray-200'
                      }`}>
                        <button className={`w-full text-center text-sm font-medium transition-colors duration-300 ${
                          effectiveIsDark
                            ? 'text-blue-300 hover:text-blue-200'
                            : 'text-blue-600 hover:text-blue-700'
                        }`}>
                          Ver todas as notificações
                        </button>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Menu do usuário */}
            <div className="relative" ref={profileRef}>
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className={`flex items-center space-x-2 p-2 rounded-lg transition-colors duration-200 ${
                  effectiveIsDark
                    ? 'text-dark-text-secondary hover:text-dark-text-primary hover:bg-dark-bg-surface'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">U</span>
                </div>
                <span className={`hidden sm:block text-sm font-medium transition-colors duration-300 ${
                  effectiveIsDark ? 'text-dark-text-secondary' : 'text-gray-700'
                }`}>
                  Usuário
                </span>
                <ChevronDown className="w-4 h-4" />
              </button>

              {/* Dropdown do perfil */}
              <AnimatePresence>
                {isProfileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.98 }}
                    transition={{ duration: 0.18 }}
                    className={`absolute right-0 mt-2 w-56 rounded-xl shadow-xl border overflow-hidden z-50 transition-colors duration-300 ${
                      effectiveIsDark
                        ? 'bg-dark-bg-surface border-dark-border'
                        : 'bg-white border-gray-200'
                    }`}
                  >
                    <div className={`px-4 py-3 border-b transition-colors duration-300 ${
                      effectiveIsDark
                        ? 'bg-dark-bg-surface border-dark-border'
                        : 'bg-gray-50 border-gray-200'
                    }`}>
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-sm">U</span>
                        </div>
                        <div>
                          <p className={`text-sm font-semibold transition-colors duration-300 ${
                            effectiveIsDark ? 'text-dark-text-primary' : 'text-gray-900'
                          }`}>
                            Usuário Admin
                          </p>
                          <p className={`text-xs transition-colors duration-300 ${
                            effectiveIsDark ? 'text-dark-text-muted' : 'text-gray-500'
                          }`}>
                            admin@sistema.com
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="py-2">
                      <button className={`w-full text-left px-4 py-2 text-sm transition-colors duration-200 flex items-center space-x-3 ${
                        effectiveIsDark
                          ? 'text-dark-text-secondary hover:text-dark-text-primary hover:bg-dark-bg-surface'
                          : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                      }`}>
                        <User className="w-4 h-4" />
                        <span>Meu Perfil</span>
                      </button>
                      
                      <button className={`w-full text-left px-4 py-2 text-sm transition-colors duration-200 flex items-center space-x-3 ${
                        effectiveIsDark
                          ? 'text-dark-text-secondary hover:text-dark-text-primary hover:bg-dark-bg-surface'
                          : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                      }`}>
                        <Settings className="w-4 h-4" />
                        <span>Configurações</span>
                      </button>
                      
                      <div className={`border-t my-2 transition-colors duration-300 ${
                        effectiveIsDark ? 'border-dark-border' : 'border-gray-200'
                      }`}></div>
                      
                      <button className={`w-full text-left px-4 py-2 text-sm transition-colors duration-200 flex items-center space-x-3 ${
                        effectiveIsDark
                          ? 'text-red-400 hover:bg-red-900/20'
                          : 'text-red-600 hover:bg-red-50'
                      }`}>
                        <LogOut className="w-4 h-4" />
                        <span>Sair</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Botão do menu mobile */}
            <button
              onClick={toggleMobileMenu}
              className={`md:hidden p-2 rounded-lg transition-colors duration-200 ${
                effectiveIsDark
                  ? 'text-dark-text-secondary hover:text-dark-text-primary hover:bg-dark-bg-surface'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Menu mobile */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className={`md:hidden border-t transition-colors duration-300 ${
              effectiveIsDark
                ? 'bg-dark-bg-base border-dark-border'
                : 'bg-white border-gray-200'
            }`}
          >
            <div className="px-4 py-4 space-y-2">
              {/* Navegação mobile */}
              {navTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleTabClick(tab.id)}
                  className={`
                    w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200
                    ${currentActive === tab.id 
                      ? effectiveIsDark
                        ? 'text-blue-300 bg-blue-900/10 border border-blue-800'
                        : 'text-blue-600 bg-blue-100'
                      : effectiveIsDark
                        ? 'text-dark-text-secondary hover:text-dark-text-primary hover:bg-dark-bg-surface'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }
                  `}
                >
                  {tab.label}
                </button>
              ))}
              
              {/* Separador */}
              <div className={`border-t my-2 transition-colors duration-300 ${
                effectiveIsDark ? 'border-dark-border' : 'border-gray-200'
              }`}></div>
              
              {/* Ações adicionais no mobile */}
              <button className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center space-x-3 ${
                effectiveIsDark
                  ? 'text-dark-text-secondary hover:text-dark-text-primary hover:bg-dark-bg-surface'
                  : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
              }`}>
                <Settings className="w-4 h-4" />
                <span>Configurações</span>
              </button>
              
              <button className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center space-x-3 ${
                effectiveIsDark
                  ? 'text-red-400 hover:bg-red-900/20'
                  : 'text-red-600 hover:bg-red-50'
              }`}>
                <LogOut className="w-4 h-4" />
                <span>Sair</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;

