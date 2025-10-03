import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  Settings, 
  AlertTriangle, 
  CheckCircle, 
  Plus,
  Edit,
  Trash2,
  Eye,
  Users,
  FileText,
  BarChart3,
  Filter,
  Search,
  Download,
  Upload,
  Zap,
  Shield,
  Globe,
  Database,
  Server,
  Network,
  HardDrive,
  Monitor,
  Smartphone,
  Laptop,
  Cloud,
  Lock,
  Unlock,
  CalendarDays,
  Clock3,
  Timer,
  AlertCircle,
  Info,
  X,
  ChevronDown,
  ChevronUp,
  Star,
  Tag,
  Link,
  ExternalLink,
  Loader2
} from 'lucide-react';
import { useChanges } from '../hooks/useChanges';

const GerenciarChangesPage = ({ isDarkMode }) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedChange, setSelectedChange] = useState(null);
  const [filterStatus, setFilterStatus] = useState('todos');
  const [filterPriority, setFilterPriority] = useState('todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('list'); // 'list', 'calendar', 'timeline'

  // Hook para gerenciar changes
  const {
    changes,
    loading,
    error,
    createChange,
    updateChange,
    deleteChange,
    approveChange,
    rejectChange,
    totalChanges,
    agendadas,
    emAnalise,
    aprovadas,
    pendentes,
    criticas,
    altas
  } = useChanges();

  const getStatusColor = (status) => {
    switch (status) {
      case 'agendada': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'em_analise': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'aprovada': return 'bg-green-100 text-green-800 border-green-200';
      case 'pendente': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'rejeitada': return 'bg-red-100 text-red-800 border-red-200';
      case 'em_andamento': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'concluida': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPrioridadeColor = (prioridade) => {
    switch (prioridade) {
      case 'critica': return 'bg-red-100 text-red-800 border-red-200';
      case 'alta': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'media': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'baixa': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTipoIcon = (tipo) => {
    switch (tipo) {
      case 'manutencao': return <Settings className="w-4 h-4" />;
      case 'migracao': return <Database className="w-4 h-4" />;
      case 'backup': return <HardDrive className="w-4 h-4" />;
      case 'seguranca': return <Shield className="w-4 h-4" />;
      case 'atualizacao': return <Zap className="w-4 h-4" />;
      default: return <Settings className="w-4 h-4" />;
    }
  };

  const getSistemaIcon = (sistema) => {
    switch (sistema) {
      case 'P2K': return <Server className="w-4 h-4" />;
      case 'CRIVO': return <Database className="w-4 h-4" />;
      case 'Firewall': return <Shield className="w-4 h-4" />;
      case 'Todos': return <Globe className="w-4 h-4" />;
      default: return <Server className="w-4 h-4" />;
    }
  };

  const filteredChanges = changes.filter(change => {
    const matchesSearch = change.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         change.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         change.sistema.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'todos' || change.status === filterStatus;
    const matchesPriority = filterPriority === 'todos' || change.prioridade === filterPriority;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  // Função para criar nova change
  const handleCreateChange = async (formData) => {
    try {
      // Processar dados do formulário
      const processedData = {
        ...formData,
        // Converter checkboxes para booleanos
        rollback: formData.rollback === 'on',
        testes: formData.testes === 'on',
        documentacao: formData.documentacao === 'on',
        comunicacao: formData.comunicacao === 'on',
        // Adicionar campos padrão
        responsavel: 'Usuário Atual',
        aprovador: 'Aguardando Aprovação',
        equipe: formData.equipe ? formData.equipe.split(',').map(e => e.trim()) : [],
        tags: formData.tags ? formData.tags.split(',').map(t => t.trim()) : [],
        dependencias: formData.dependencias ? [formData.dependencias] : [],
        // Adicionar campos de data
        criadoEm: new Date().toLocaleString(),
        atualizadoEm: new Date().toLocaleString()
      };

      await createChange(processedData);
      setShowCreateModal(false);
      
      // Mostrar mensagem de sucesso
      alert('Change criada com sucesso!');
    } catch (error) {
      console.error('Erro ao criar change:', error);
      alert('Erro ao criar change. Tente novamente.');
    }
  };

  // Função para deletar change
  const handleDeleteChange = async (id) => {
    if (window.confirm('Tem certeza que deseja deletar esta change?')) {
      try {
        await deleteChange(id);
      } catch (error) {
        console.error('Erro ao deletar change:', error);
        // Mostrar mensagem de erro para o usuário
      }
    }
  };

  // Função para aprovar change
  const handleApproveChange = async (id) => {
    try {
      await approveChange(id);
    } catch (error) {
      console.error('Erro ao aprovar change:', error);
      // Mostrar mensagem de erro para o usuário
    }
  };

  // Função para rejeitar change
  const handleRejectChange = async (id) => {
    try {
      await rejectChange(id);
    } catch (error) {
      console.error('Erro ao rejeitar change:', error);
      // Mostrar mensagem de erro para o usuário
    }
  };

  if (loading && changes.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-lg text-gray-600">Carregando changes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-lg text-red-600">Erro ao carregar changes</p>
          <p className="text-sm text-gray-500 mt-2">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-8">
      {/* Header da página */}
      <div className="text-center">
        <h1 className={`text-4xl font-bold mb-4 ${
          isDarkMode ? 'text-dark-text-primary' : 'text-gray-900'
        }`}>
          Gerenciar Changes
        </h1>
        <p className={`text-xl max-w-3xl mx-auto ${
          isDarkMode ? 'text-dark-text-secondary' : 'text-gray-600'
        }`}>
          Gerencie e acompanhe todas as mudanças programadas nos sistemas com controle total de aprovações, 
          agendamentos e monitoramento de impacto
        </p>
      </div>

      {/* Estatísticas avançadas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
              }`}>Total de Changes</p>
              <p className={`text-3xl font-bold ${
                isDarkMode ? 'text-dark-text-primary' : 'text-gray-900'
              }`}>{totalChanges}</p>
            </div>
            <Calendar className="w-8 h-8 text-blue-500" />
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
              }`}>Agendadas</p>
              <p className="text-3xl font-bold text-blue-600">{agendadas}</p>
            </div>
            <Clock className="w-8 h-8 text-blue-500" />
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
              }`}>Em Análise</p>
              <p className="text-3xl font-bold text-yellow-600">{emAnalise}</p>
            </div>
            <Settings className="w-8 h-8 text-yellow-500" />
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
              }`}>Críticas</p>
              <p className="text-3xl font-bold text-red-600">{criticas}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
        </motion.div>
      </div>

      {/* Controles avançados */}
      <div className={`rounded-2xl shadow-lg border p-6 ${
        isDarkMode 
          ? 'bg-dark-bg-surface border-dark-border' 
          : 'bg-white border-gray-200'
      }`}>
        <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
          {/* Busca e filtros */}
          <div className="flex-1 space-y-4 lg:space-y-0 lg:space-x-4 lg:flex lg:items-center">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar changes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  isDarkMode 
                    ? 'bg-dark-bg-muted border-dark-border text-dark-text-primary placeholder-dark-text-muted' 
                    : 'border-gray-300 text-gray-900 placeholder-gray-400'
                }`}
              />
            </div>
            
            <div className="flex space-x-2">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className={`px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  isDarkMode 
                    ? 'bg-dark-bg-muted border-dark-border text-dark-text-primary' 
                    : 'border-gray-300 text-gray-900'
                }`}
              >
                <option value="todos">Todos os Status</option>
                <option value="agendada">Agendada</option>
                <option value="em_analise">Em Análise</option>
                <option value="aprovada">Aprovada</option>
                <option value="pendente">Pendente</option>
                <option value="rejeitada">Rejeitada</option>
                <option value="em_andamento">Em Andamento</option>
                <option value="concluida">Concluída</option>
              </select>
              
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className={`px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  isDarkMode 
                    ? 'bg-dark-bg-muted border-dark-border text-dark-text-primary' 
                    : 'border-gray-300 text-gray-900'
                }`}
              >
                <option value="todos">Todas as Prioridades</option>
                <option value="critica">Crítica</option>
                <option value="alta">Alta</option>
                <option value="media">Média</option>
                <option value="baixa">Baixa</option>
              </select>
            </div>
          </div>
          
          {/* Modos de visualização e ações */}
          <div className="flex items-center space-x-4">
            <div className={`flex rounded-lg p-1 ${
              isDarkMode ? 'bg-dark-bg-muted' : 'bg-gray-100'
            }`}>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  viewMode === 'list' 
                    ? isDarkMode 
                      ? 'bg-dark-bg-surface text-dark-text-primary shadow-sm' 
                      : 'bg-white text-gray-900 shadow-sm'
                    : isDarkMode
                      ? 'text-dark-text-secondary hover:text-dark-text-primary'
                      : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Lista
              </button>
              <button
                onClick={() => setViewMode('calendar')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  viewMode === 'calendar' 
                    ? isDarkMode 
                      ? 'bg-dark-bg-surface text-dark-text-primary shadow-sm' 
                      : 'bg-white text-gray-900 shadow-sm'
                    : isDarkMode
                      ? 'text-dark-text-secondary hover:text-dark-text-primary'
                      : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Calendário
              </button>
              <button
                onClick={() => setViewMode('timeline')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  viewMode === 'timeline' 
                    ? isDarkMode 
                      ? 'bg-dark-bg-surface text-dark-text-primary shadow-sm' 
                      : 'bg-white text-gray-900 shadow-sm'
                    : isDarkMode
                      ? 'text-dark-text-secondary hover:text-dark-text-primary'
                      : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Timeline
              </button>
            </div>
            
            <motion.button
              onClick={() => setShowCreateModal(true)}
              className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Plus className="w-5 h-5" />
              <span>Nova Change</span>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Lista de Changes com informações detalhadas */}
      <div className={`rounded-2xl shadow-lg border overflow-hidden ${
        isDarkMode 
          ? 'bg-dark-bg-surface border-dark-border' 
          : 'bg-white border-gray-200'
      }`}>
        <div className={`px-6 py-4 border-b ${
          isDarkMode 
            ? 'bg-dark-bg-muted border-dark-border' 
            : 'bg-gray-50 border-gray-200'
        }`}>
          <h2 className={`text-xl font-semibold ${
            isDarkMode ? 'text-dark-text-primary' : 'text-gray-900'
          }`}>
            Changes ({filteredChanges.length})
          </h2>
        </div>
        
        <div className="p-6 space-y-6">
          {filteredChanges.map((change, index) => (
            <motion.div
              key={change.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className={`rounded-2xl border shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden ${
                isDarkMode 
                  ? 'bg-dark-bg-secondary border-dark-border' 
                  : 'bg-gradient-to-r from-gray-50 to-white border-gray-200'
              }`}
            >
              {/* Header do card com gradiente */}
              <div className={`px-6 py-4 border-b ${
                isDarkMode 
                  ? 'bg-dark-bg-muted border-dark-border' 
                  : 'bg-gradient-to-r from-blue-50 to-indigo-50 border-gray-200'
              }`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className={`text-xl font-bold ${
                        isDarkMode ? 'text-dark-text-primary' : 'text-gray-900'
                      }`}>
                        {change.titulo}
                      </h3>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border-2 ${getStatusColor(change.status)}`}>
                        {change.status.replace('_', ' ').toUpperCase()}
                      </span>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border-2 ${getPrioridadeColor(change.prioridade)}`}>
                        {change.prioridade.toUpperCase()}
                      </span>
                    </div>
                    
                    <p className={`text-sm leading-relaxed ${
                      isDarkMode ? 'text-dark-text-secondary' : 'text-gray-700'
                    }`}>
                      {change.descricao}
                    </p>
                  </div>
                  
                  <div className="flex space-x-2 ml-4">
                    <button 
                      onClick={() => setSelectedChange(change)}
                      className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors duration-200"
                      title="Visualizar detalhes"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                    <button className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors duration-200" title="Editar">
                      <Edit className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => handleDeleteChange(change.id)}
                      className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors duration-200" 
                      title="Excluir"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Conteúdo principal do card */}
              <div className="p-6">
                {/* Grid de informações principais */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                  {/* Card de Agendamento */}
                  <div className={`rounded-xl p-4 border shadow-sm ${
                    isDarkMode 
                      ? 'bg-dark-bg-primary border-dark-border' 
                      : 'bg-white border-gray-200'
                  }`}>
                    <div className="flex items-center space-x-2 text-blue-600 mb-3">
                      <Calendar className="w-5 h-5" />
                      <span className="font-bold text-sm">AGENDAMENTO</span>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className={isDarkMode ? 'text-dark-text-muted' : 'text-gray-600'}>Data:</span>
                        <span className={`font-semibold ${
                          isDarkMode ? 'text-dark-text-primary' : 'text-gray-900'
                        }`}>{change.data}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className={isDarkMode ? 'text-dark-text-muted' : 'text-gray-600'}>Hora:</span>
                        <span className={`font-semibold ${
                          isDarkMode ? 'text-dark-text-primary' : 'text-gray-900'
                        }`}>{change.hora}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className={isDarkMode ? 'text-dark-text-muted' : 'text-gray-600'}>Duração:</span>
                        <span className={`font-semibold ${
                          isDarkMode ? 'text-dark-text-primary' : 'text-gray-900'
                        }`}>{change.duracao}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Card de Sistema */}
                  <div className={`rounded-xl p-4 border shadow-sm ${
                    isDarkMode 
                      ? 'bg-dark-bg-primary border-dark-border' 
                      : 'bg-white border-gray-200'
                  }`}>
                    <div className="flex items-center space-x-2 text-green-600 mb-3">
                      {getSistemaIcon(change.sistema)}
                      <span className="font-bold text-sm">SISTEMA</span>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className={isDarkMode ? 'text-dark-text-muted' : 'text-gray-600'}>Sistema:</span>
                        <span className={`font-semibold ${
                          isDarkMode ? 'text-dark-text-primary' : 'text-gray-900'
                        }`}>{change.sistema}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className={isDarkMode ? 'text-dark-text-muted' : 'text-gray-600'}>Tipo:</span>
                        <span className={`font-semibold ${
                          isDarkMode ? 'text-dark-text-primary' : 'text-gray-900'
                        }`}>{change.tipo}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className={isDarkMode ? 'text-dark-text-muted' : 'text-gray-600'}>Impacto:</span>
                        <span className={`font-semibold ${
                          isDarkMode ? 'text-dark-text-primary' : 'text-gray-900'
                        }`}>{change.impacto}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Card de Equipe */}
                  <div className={`rounded-xl p-4 border shadow-sm ${
                    isDarkMode 
                      ? 'bg-dark-bg-primary border-dark-border' 
                      : 'bg-white border-gray-200'
                  }`}>
                    <div className="flex items-center space-x-2 text-purple-600 mb-3">
                      <Users className="w-5 h-5" />
                      <span className="font-bold text-sm">EQUIPE</span>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className={isDarkMode ? 'text-dark-text-muted' : 'text-gray-600'}>Responsável:</span>
                        <span className={`font-semibold ${
                          isDarkMode ? 'text-dark-text-primary' : 'text-gray-900'
                        }`}>{change.responsavel}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className={isDarkMode ? 'text-dark-text-muted' : 'text-gray-600'}>Aprovador:</span>
                        <span className={`font-semibold ${
                          isDarkMode ? 'text-dark-text-primary' : 'text-gray-900'
                        }`}>{change.aprovador}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className={isDarkMode ? 'text-dark-text-muted' : 'text-gray-600'}>Equipe:</span>
                        <span className={`font-semibold ${
                          isDarkMode ? 'text-dark-text-primary' : 'text-gray-900'
                        }`}>{change.equipe.length} pessoas</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Card de Checklist */}
                  <div className={`rounded-xl p-4 border shadow-sm ${
                    isDarkMode 
                      ? 'bg-dark-bg-primary border-dark-border' 
                      : 'bg-white border-gray-200'
                  }`}>
                    <div className="flex items-center space-x-2 text-orange-600 mb-3">
                      <CheckCircle className="w-5 h-5" />
                      <span className="font-bold text-sm">CHECKLIST</span>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between items-center">
                        <span className={isDarkMode ? 'text-dark-text-muted' : 'text-gray-600'}>Rollback:</span>
                        <span className={change.rollback ? 'text-green-600 font-bold' : 'text-red-600 font-bold'}>
                          {change.rollback ? '✓' : '✗'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className={isDarkMode ? 'text-dark-text-muted' : 'text-gray-600'}>Testes:</span>
                        <span className={change.testes ? 'text-green-600 font-bold' : 'text-red-600 font-bold'}>
                          {change.testes ? '✓' : '✗'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className={isDarkMode ? 'text-dark-text-muted' : 'text-gray-600'}>Documentação:</span>
                        <span className={change.documentacao ? 'text-green-600 font-bold' : 'text-red-600 font-bold'}>
                          {change.documentacao ? '✓' : '✗'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Tags e Dependências */}
                <div className="space-y-4 mb-6">
                  {change.tags && change.tags.length > 0 && (
                    <div className={`rounded-xl p-4 border ${
                      isDarkMode 
                        ? 'bg-dark-bg-muted border-dark-border' 
                        : 'bg-gray-50 border-gray-200'
                    }`}>
                      <div className="flex items-center space-x-2 mb-3">
                        <Tag className="w-4 h-4 text-gray-500" />
                        <span className={`font-semibold ${
                          isDarkMode ? 'text-dark-text-secondary' : 'text-gray-700'
                        }`}>Tags</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {change.tags.map((tag, idx) => (
                          <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium border border-blue-200">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {change.dependencias && change.dependencias.length > 0 && (
                    <div className={`rounded-xl p-4 border ${
                      isDarkMode 
                        ? 'bg-dark-bg-muted border-dark-border' 
                        : 'bg-gray-50 border-gray-200'
                    }`}>
                      <div className="flex items-center space-x-2 mb-3">
                        <Link className="w-4 h-4 text-gray-500" />
                        <span className={`font-semibold ${
                          isDarkMode ? 'text-dark-text-secondary' : 'text-gray-700'
                        }`}>Dependências</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {change.dependencias.map((dep, idx) => (
                          <span key={idx} className="px-3 py-1 bg-orange-100 text-orange-800 text-xs rounded-full font-medium border border-orange-200">
                            {dep}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Observações */}
                {change.observacoes && (
                  <div className={`rounded-xl p-4 border ${
                    isDarkMode 
                      ? 'bg-blue-900/20 border-blue-700' 
                      : 'bg-blue-50 border-blue-200'
                  }`}>
                    <div className="flex items-center space-x-2 mb-2">
                      <Info className="w-4 h-4 text-blue-600" />
                      <span className={`font-semibold ${
                        isDarkMode ? 'text-blue-400' : 'text-blue-800'
                      }`}>Observações</span>
                    </div>
                    <p className={`text-sm leading-relaxed ${
                      isDarkMode ? 'text-blue-300' : 'text-blue-800'
                    }`}>
                      {change.observacoes}
                    </p>
                  </div>
                )}
                
                {/* Footer com metadados */}
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <div className="flex flex-col sm:flex-row justify-between text-xs text-gray-500 space-y-2 sm:space-y-0">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">Criado em:</span>
                      <span>{change.criadoEm}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">Atualizado em:</span>
                      <span>{change.atualizadoEm}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Modal de criação/edição de change */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={`rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto ${
                isDarkMode ? 'bg-dark-bg-surface' : 'bg-white'
              }`}
            >
              <div className={`px-6 py-4 border-b flex items-center justify-between ${
                isDarkMode ? 'border-dark-border' : 'border-gray-200'
              }`}>
                <h3 className={`text-xl font-semibold ${
                  isDarkMode ? 'text-dark-text-primary' : 'text-gray-900'
                }`}>
                  Nova Change Programada
                </h3>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className={`p-2 rounded-lg transition-colors duration-200 ${
                    isDarkMode 
                      ? 'text-gray-400 hover:text-gray-200 hover:bg-dark-bg-muted' 
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-6">
                <form className="space-y-6" onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.target);
                  const data = Object.fromEntries(formData);
                  handleCreateChange(data);
                }}>
                  {/* Informações básicas */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${
                        isDarkMode ? 'text-dark-text-secondary' : 'text-gray-700'
                      }`}>
                        Título da Change
                      </label>
                      <input
                        name="titulo"
                        type="text"
                        required
                        className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          isDarkMode 
                            ? 'bg-dark-bg-muted border-dark-border text-dark-text-primary placeholder-dark-text-muted' 
                            : 'border-gray-300 text-gray-900 placeholder-gray-400'
                        }`}
                        placeholder="Ex: Atualização do Sistema P2K"
                      />
                    </div>
                    
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${
                        isDarkMode ? 'text-dark-text-secondary' : 'text-gray-700'
                      }`}>
                        Sistema
                      </label>
                      <select name="sistema" required className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        isDarkMode 
                          ? 'bg-dark-bg-muted border-dark-border text-dark-text-primary' 
                          : 'border-gray-300 text-gray-900'
                      }`}>
                        <option value="">Selecione o sistema</option>
                        <option value="P2K">P2K</option>
                        <option value="CRIVO">CRIVO</option>
                        <option value="Firewall">Firewall</option>
                        <option value="Todos">Todos</option>
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      isDarkMode ? 'text-dark-text-secondary' : 'text-gray-700'
                    }`}>
                      Descrição
                    </label>
                    <textarea
                      name="descricao"
                      rows={3}
                      required
                      className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        isDarkMode 
                          ? 'bg-dark-bg-muted border-dark-border text-dark-text-primary placeholder-dark-text-muted' 
                          : 'border-gray-300 text-gray-900 placeholder-gray-400'
                      }`}
                      placeholder="Descreva detalhadamente a change..."
                    />
                  </div>
                  
                  {/* Agendamento */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Data
                      </label>
                      <input
                        name="data"
                        type="date"
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Hora
                      </label>
                      <input
                        name="hora"
                        type="time"
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Duração Estimada
                      </label>
                      <input
                        name="duracao"
                        type="text"
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Ex: 4 horas"
                      />
                    </div>
                  </div>
                  
                  {/* Classificação */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Prioridade
                      </label>
                      <select name="prioridade" required className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        <option value="">Selecione a prioridade</option>
                        <option value="critica">Crítica</option>
                        <option value="alta">Alta</option>
                        <option value="media">Média</option>
                        <option value="baixa">Baixa</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tipo
                      </label>
                      <select name="tipo" required className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        <option value="">Selecione o tipo</option>
                        <option value="manutencao">Manutenção</option>
                        <option value="migracao">Migração</option>
                        <option value="backup">Backup</option>
                        <option value="seguranca">Segurança</option>
                        <option value="atualizacao">Atualização</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Impacto
                      </label>
                      <select name="impacto" required className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        <option value="">Selecione o impacto</option>
                        <option value="baixo">Baixo</option>
                        <option value="medio">Médio</option>
                        <option value="alto">Alto</option>
                      </select>
                    </div>
                  </div>
                  
                  {/* Checklist de preparação */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Checklist de Preparação
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <label className="flex items-center space-x-3">
                        <input name="rollback" type="checkbox" className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500" />
                        <span className="text-sm text-gray-700">Plano de rollback definido</span>
                      </label>
                      <label className="flex items-center space-x-3">
                        <input name="testes" type="checkbox" className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500" />
                        <span className="text-sm text-gray-700">Testes realizados</span>
                      </label>
                      <label className="flex items-center space-x-3">
                        <input name="documentacao" type="checkbox" className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500" />
                        <span className="text-sm text-gray-700">Documentação atualizada</span>
                      </label>
                      <label className="flex items-center space-x-3">
                        <input name="comunicacao" type="checkbox" className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500" />
                        <span className="text-sm text-gray-700">Comunicação enviada</span>
                      </label>
                    </div>
                  </div>
                  
                  {/* Equipe */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Equipe (separar por vírgula)
                    </label>
                    <input
                      name="equipe"
                      type="text"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Ex: João Silva, Maria Santos, Pedro Costa"
                    />
                  </div>
                  
                  {/* Tags */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tags (separar por vírgula)
                    </label>
                    <input
                      name="tags"
                      type="text"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Ex: seguranca, manutencao, sistema-critico"
                    />
                  </div>
                  
                  {/* Dependências */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Dependências
                    </label>
                    <textarea
                      name="dependencias"
                      rows={2}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Liste as dependências necessárias..."
                    />
                  </div>
                  
                  {/* Observações */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Observações
                    </label>
                    <textarea
                      name="observacoes"
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Observações adicionais..."
                    />
                  </div>
                  
                  {/* Botões de ação */}
                  <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={() => setShowCreateModal(false)}
                      className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors duration-200"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Criando...</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4" />
                          <span>Criar Change</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal de detalhes da change */}
      <AnimatePresence>
        {selectedChange && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={`rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto ${
                isDarkMode ? 'bg-dark-bg-surface' : 'bg-white'
              }`}
            >
              <div className={`px-6 py-4 border-b flex items-center justify-between ${
                isDarkMode ? 'border-dark-border' : 'border-gray-200'
              }`}>
                <h3 className={`text-xl font-semibold ${
                  isDarkMode ? 'text-dark-text-primary' : 'text-gray-900'
                }`}>
                  Detalhes da Change
                </h3>
                <button
                  onClick={() => setSelectedChange(null)}
                  className={`p-2 rounded-lg transition-colors duration-200 ${
                    isDarkMode 
                      ? 'text-gray-400 hover:text-gray-200 hover:bg-dark-bg-muted' 
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-6">
                <div className="space-y-6">
                  <div>
                    <h4 className={`text-lg font-semibold mb-2 ${
                      isDarkMode ? 'text-dark-text-primary' : 'text-gray-900'
                    }`}>
                      {selectedChange.titulo}
                    </h4>
                    <p className={isDarkMode ? 'text-dark-text-secondary' : 'text-gray-600'}>
                      {selectedChange.descricao}
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h5 className={`font-medium mb-3 ${
                        isDarkMode ? 'text-dark-text-primary' : 'text-gray-900'
                      }`}>Informações de Agendamento</h5>
                      <div className="space-y-2 text-sm">
                        <p><strong>Data:</strong> {selectedChange.data}</p>
                        <p><strong>Hora:</strong> {selectedChange.hora}</p>
                        <p><strong>Duração:</strong> {selectedChange.duracao}</p>
                      </div>
                    </div>
                    
                    <div>
                      <h5 className={`font-medium mb-3 ${
                        isDarkMode ? 'text-dark-text-primary' : 'text-gray-900'
                      }`}>Classificação</h5>
                      <div className="space-y-2 text-sm">
                        <p><strong>Status:</strong> {selectedChange.status}</p>
                        <p><strong>Prioridade:</strong> {selectedChange.prioridade}</p>
                        <p><strong>Tipo:</strong> {selectedChange.tipo}</p>
                        <p><strong>Impacto:</strong> {selectedChange.impacto}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h5 className={`font-medium mb-3 ${
                      isDarkMode ? 'text-dark-text-primary' : 'text-gray-900'
                    }`}>Equipe</h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p><strong>Responsável:</strong> {selectedChange.responsavel}</p>
                        <p><strong>Aprovador:</strong> {selectedChange.aprovador}</p>
                      </div>
                      <div>
                        <p><strong>Equipe:</strong></p>
                        <ul className="list-disc list-inside ml-2">
                          {selectedChange.equipe.map((membro, idx) => (
                            <li key={idx}>{membro}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  {selectedChange.observacoes && (
                    <div>
                      <h5 className={`font-medium mb-3 ${
                        isDarkMode ? 'text-dark-text-primary' : 'text-gray-900'
                      }`}>Observações</h5>
                      <p className={`text-sm ${
                        isDarkMode ? 'text-dark-text-secondary' : 'text-gray-600'
                      }`}>{selectedChange.observacoes}</p>
                    </div>
                  )}
                  
                  {/* Ações para changes pendentes */}
                  {selectedChange.status === 'pendente' && (
                    <div className={`flex space-x-4 pt-4 border-t ${
                      isDarkMode ? 'border-dark-border' : 'border-gray-200'
                    }`}>
                      <button
                        onClick={() => {
                          handleApproveChange(selectedChange.id);
                          setSelectedChange(null);
                        }}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
                      >
                        Aprovar Change
                      </button>
                      <button
                        onClick={() => {
                          handleRejectChange(selectedChange.id);
                          setSelectedChange(null);
                        }}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
                      >
                        Rejeitar Change
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GerenciarChangesPage;
