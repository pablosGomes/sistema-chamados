import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ServiceNowTable from '../components/ServiceNowTable';
import { 
  AlertTriangle, 
  Clock, 
  CheckCircle, 
  TrendingUp,
  Search,
  Filter,
  Plus,
  Eye,
  Edit,
  Trash2,
  Server,
  Users,
  Calendar,
  FileText,
  Tag,
  MessageSquare
} from 'lucide-react';

// agora a página recebe isDarkMode via props (fonte de verdade: App)
const IncidentesPage = ({ isDarkMode }) => {
  const [showTable, setShowTable] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('todos');
  const [filterPriority, setFilterPriority] = useState('todos');
  const [selectedIncidente, setSelectedIncidente] = useState(null);

  // Manipular clique nos cards
  const handleCardClick = (cardId) => {
    if (selectedCard === cardId) {
      // Se clicar no mesmo card, fecha a tabela
      setSelectedCard(null);
      setShowTable(false);
    } else {
      // Se clicar em um card diferente, abre a tabela
      setSelectedCard(cardId);
      setShowTable(true);
      
      // Scroll suave para a tabela
      setTimeout(() => {
        document.getElementById('incidentes-table')?.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }, 100);
    }
  };

  return (
    <div className="space-y-8 p-8">
      {/* Header da página */}
      <div className="text-center">
        <h1 className={`text-4xl font-bold mb-4 ${
          isDarkMode ? 'text-dark-text-primary' : 'text-gray-900'
        }`}>
          Dashboard de Incidentes
        </h1>
        <p className={`text-xl max-w-3xl mx-auto ${
          isDarkMode ? 'text-dark-text-secondary' : 'text-gray-600'
        }`}>
          Monitore e gerencie todos os incidentes do sistema em tempo real
        </p>
      </div>

      {/* Cards de estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div 
          className={`p-6 rounded-2xl shadow-lg border ${
            isDarkMode 
              ? 'bg-dark-bg-surface border-dark-border' 
              : 'bg-white border-gray-200'
          }`}
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${
                isDarkMode ? 'text-dark-text-secondary' : 'text-gray-600'
              }`}>Total de Incidentes</p>
              <p className={`text-3xl font-bold ${
                isDarkMode ? 'text-dark-text-primary' : 'text-gray-900'
              }`}>0</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
        </motion.div>

        <motion.div 
          className={`p-6 rounded-2xl shadow-lg border ${
            isDarkMode 
              ? 'bg-dark-bg-surface border-dark-border' 
              : 'bg-white border-gray-200'
          }`}
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${
                isDarkMode ? 'text-dark-text-secondary' : 'text-gray-600'
              }`}>Em Andamento</p>
              <p className="text-3xl font-bold text-yellow-600">0</p>
            </div>
            <Clock className="w-8 h-8 text-yellow-500" />
          </div>
        </motion.div>

        <motion.div 
          className={`p-6 rounded-2xl shadow-lg border ${
            isDarkMode 
              ? 'bg-dark-bg-surface border-dark-border' 
              : 'bg-white border-gray-200'
          }`}
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${
                isDarkMode ? 'text-dark-text-secondary' : 'text-gray-600'
              }`}>Resolvidos</p>
              <p className="text-3xl font-bold text-green-600">0</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </motion.div>

        <motion.div 
          className={`p-6 rounded-2xl shadow-lg border ${
            isDarkMode 
              ? 'bg-dark-bg-surface border-dark-border' 
              : 'bg-white border-gray-200'
          }`}
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${
                isDarkMode ? 'text-dark-text-secondary' : 'text-gray-600'
              }`}>Críticos</p>
              <p className="text-3xl font-bold text-red-600">0</p>
            </div>
            <TrendingUp className="w-8 h-8 text-red-500" />
          </div>
        </motion.div>
      </div>

      {/* Tabela de incidentes (aparece APENAS quando um card é clicado) */}
      <AnimatePresence>
        {showTable && (
          <motion.div
            id="incidentes-table"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="mt-8"
          >
            <ServiceNowTable
              incidentes={[]}
              onView={(incidente) => console.log('Visualizar:', incidente)}
              onEdit={(incidente) => console.log('Editar:', incidente)}
              onDelete={(incidente) => console.log('Deletar:', incidente)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default IncidentesPage;
