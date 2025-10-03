import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import IncidentesPage from './pages/IncidentesPage';
import GerenciarChangesPage from './pages/GerenciarChangesPage';
import ControleChamadosPage from './pages/ControleChamadosPage';
import { useDarkMode } from './hooks/useDarkMode';

function App() {
  const [activeTab, setActiveTab] = useState('incidentes');
  
  // Usa o hook completo para ter acesso a todos os controles e ao estado persistido
  const {
    isDarkMode,
    toggleDarkMode,
    setDarkMode,
    clearUserPreference,
    isUserPref
  } = useDarkMode();

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'incidentes':
        return <IncidentesPage />;
      case 'changes':
        return <GerenciarChangesPage />;
      case 'chamados':
        return <ControleChamadosPage />;
      default:
        return <IncidentesPage />;
    }
  };

  return (
    // Usa isDarkMode como fonte única de verdade para classes de estilo da raiz do App
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode 
        ? 'bg-dark-bg-base text-dark-text-primary' 
        : 'bg-gray-50 text-gray-900'
    }`}>
      <Navbar 
        activeTab={activeTab} 
        onTabChange={handleTabChange}
        // passa o estado e os handlers para o Navbar — assim o Navbar não precisa
        // depender do hook diretamente (evita instâncias duplicadas / comportamento incoerente)
        isDarkMode={isDarkMode}
        onThemeToggle={toggleDarkMode}
        setDarkMode={setDarkMode}
        clearUserPreference={clearUserPreference}
        isUserPref={isUserPref}
      />
      <main className="pt-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

export default App;

