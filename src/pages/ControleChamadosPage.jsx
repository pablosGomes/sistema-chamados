import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Search, 
  Filter, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Users,
  Calendar,
  Eye,
  Edit,
  Trash2,
  FileText,
  Tag,
  MessageSquare,
  Server
} from 'lucide-react';

const ControleChamadosPage = ({ isDarkMode }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('todos');
  const [selectedChamado, setSelectedChamado] = useState(null);

  // Dados mockados para demonstração
  const chamados = [
    {
      id: 1,
      numero: 'CHM001',
      titulo: 'Problema de acesso ao sistema P2K',
      descricao: 'Usuários não conseguem acessar o sistema principal',
      solicitante: 'João Silva',
      responsavel: 'Maria Santos',
      status: 'em_andamento',
      prioridade: 'alta',
      dataCriacao: '2024-01-15',
      tempoEstimado: '2 horas',
      tipo: 'Incidente',
      categoria: 'Acesso ao Sistema',
      grupo: 'Infraestrutura',
      atribuido: 'Ana Oliveira',
      equipe: 'Equipe de Suporte',
      criadoEm: '2024-01-15 10:00',
      atualizadoEm: '2024-01-15 11:30',
      prazo: '2024-01-16 10:00',
      sistema: 'Sistema P2K',
      ambiente: 'Produção',
      versao: '1.2.3',
      tags: ['urgente', 'sistema', 'acesso'],
      anexos: ['anexo1.pdf', 'anexo2.docx'],
      comentarios: [
        { autor: 'João Silva', data: '2024-01-15 10:05', texto: 'Usuários ainda não conseguem acessar o sistema.' },
        { autor: 'Maria Santos', data: '2024-01-15 10:10', texto: 'Verifiquei a conexão com o servidor e o firewall.' },
      ]
    },
    {
      id: 2,
      numero: 'CHM002',
      titulo: 'Falha na impressora da loja centro',
      descricao: 'Impressora não está funcionando corretamente',
      solicitante: 'Pedro Costa',
      responsavel: 'Ana Oliveira',
      status: 'resolvido',
      prioridade: 'media',
      dataCriacao: '2024-01-14',
      tempoEstimado: '1 hora',
      tipo: 'Solicitação de Serviço',
      categoria: 'Impressão',
      grupo: 'Recursos Humanos',
      atribuido: 'Carlos Lima',
      equipe: 'Equipe de Suporte',
      criadoEm: '2024-01-14 14:00',
      atualizadoEm: '2024-01-14 15:00',
      prazo: '2024-01-14 16:00',
      sistema: 'Sistema de RH',
      ambiente: 'Homologação',
      versao: '1.0.0',
      tags: ['impressora', 'loja', 'urgente'],
      anexos: [],
      comentarios: [
        { autor: 'Pedro Costa', data: '2024-01-14 14:05', texto: 'Impressora parou de imprimir.' },
        { autor: 'Ana Oliveira', data: '2024-01-14 14:10', texto: 'Reiniciar a impressora e verificar a ligação.' },
      ]
    },
    {
      id: 3,
      numero: 'CHM003',
      titulo: 'Sistema CRIVO lento',
      descricao: 'Sistema está respondendo muito lentamente',
      solicitante: 'Carlos Lima',
      responsavel: 'Roberto Alves',
      status: 'aberto',
      prioridade: 'critica',
      dataCriacao: '2024-01-15',
      tempoEstimado: '4 horas',
      tipo: 'Incidente',
      categoria: 'Performance',
      grupo: 'Desenvolvimento',
      atribuido: 'Ana Oliveira',
      equipe: 'Equipe de Desenvolvimento',
      criadoEm: '2024-01-15 09:00',
      atualizadoEm: '2024-01-15 10:00',
      prazo: '2024-01-15 14:00',
      sistema: 'CRIVO',
      ambiente: 'Produção',
      versao: '2.1.0',
      tags: ['sistema', 'performance', 'urgente'],
      anexos: ['log_erro.txt'],
      comentarios: [
        { autor: 'Carlos Lima', data: '2024-01-15 09:05', texto: 'Sistema está lento desde a última atualização.' },
        { autor: 'Roberto Alves', data: '2024-01-15 09:10', texto: 'Verifiquei a configuração do servidor e a carga.' },
      ]
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'aberto': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'em_andamento': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'resolvido': return 'bg-green-100 text-green-800 border-green-200';
      case 'fechado': return 'bg-gray-100 text-gray-800 border-gray-200';
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

  const filteredChamados = chamados.filter(chamado => {
    const matchesSearch = chamado.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         chamado.numero.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'todos' || chamado.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-8 p-8">
      {/* Header da página */}
      <div className="text-center">
        <h1 className={`text-4xl font-bold mb-4 ${
          isDarkMode ? 'text-dark-text-primary' : 'text-gray-900'
        }`}>
          Controle de Chamados
        </h1>
        <p className={`text-xl max-w-2xl mx-auto ${
          isDarkMode ? 'text-dark-text-secondary' : 'text-gray-600'
        }`}>
          Gerencie e acompanhe todos os chamados técnicos do sistema
        </p>
      </div>

      {/* Estatísticas */}
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
              }`}>Total de Chamados</p>
              <p className={`text-3xl font-bold ${
                isDarkMode ? 'text-dark-text-primary' : 'text-gray-900'
              }`}>{chamados.length}</p>
            </div>
            <AlertCircle className="w-8 h-8 text-blue-500" />
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
              <p className="text-3xl font-bold text-yellow-600">
                {chamados.filter(c => c.status === 'em_andamento').length}
              </p>
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
              <p className="text-3xl font-bold text-green-600">
                {chamados.filter(c => c.status === 'resolvido').length}
              </p>
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
              }`}>Abertos</p>
              <p className="text-3xl font-bold text-blue-600">
                {chamados.filter(c => c.status === 'aberto').length}
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-blue-500" />
          </div>
        </motion.div>
      </div>

      {/* Controles de busca e filtro */}
      <div className={`rounded-2xl shadow-lg border p-6 ${
        isDarkMode 
          ? 'bg-dark-bg-surface border-dark-border' 
          : 'bg-white border-gray-200'
      }`}>
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar chamados..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  isDarkMode 
                    ? 'bg-dark-bg-muted border-dark-border text-dark-text-primary placeholder-dark-text-muted' 
                    : 'border-gray-300 text-gray-900 placeholder-gray-400'
                }`}
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-500" />
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
                <option value="aberto">Aberto</option>
                <option value="em_andamento">Em Andamento</option>
                <option value="resolvido">Resolvido</option>
                <option value="fechado">Fechado</option>
              </select>
            </div>
            
            <motion.button
              className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Plus className="w-5 h-5" />
              <span>Novo Chamado</span>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Lista de Chamados com informações detalhadas */}
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
            Chamados ({filteredChamados.length})
          </h2>
        </div>
        
        <div className="p-6 space-y-6">
          {filteredChamados.map((chamado, index) => (
            <motion.div
              key={chamado.id}
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
                  : 'bg-gradient-to-r from-green-50 to-emerald-50 border-gray-200'
              }`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className={`text-xl font-bold ${
                        isDarkMode ? 'text-dark-text-primary' : 'text-gray-900'
                      }`}>
                        #{chamado.numero} - {chamado.titulo}
                      </h3>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border-2 ${getStatusColor(chamado.status)}`}>
                        {chamado.status.toUpperCase()}
                      </span>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border-2 ${getPrioridadeColor(chamado.prioridade)}`}>
                        {chamado.prioridade.toUpperCase()}
                      </span>
                    </div>
                    
                    <p className={`text-sm leading-relaxed ${
                      isDarkMode ? 'text-dark-text-secondary' : 'text-gray-700'
                    }`}>
                      {chamado.descricao}
                    </p>
                  </div>
                  
                  <div className="flex space-x-2 ml-4">
                    <button 
                      onClick={() => setSelectedChamado(chamado)}
                      className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors duration-200"
                      title="Visualizar detalhes"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                    <button className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors duration-200" title="Editar">
                      <Edit className="w-5 h-5" />
                    </button>
                    <button className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors duration-200" title="Excluir">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Conteúdo principal do card */}
              <div className="p-6">
                {/* Grid de informações principais */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                  {/* Card de Informações */}
                  <div className={`rounded-xl p-4 border shadow-sm ${
                    isDarkMode 
                      ? 'bg-dark-bg-primary border-dark-border' 
                      : 'bg-white border-gray-200'
                  }`}>
                    <div className="flex items-center space-x-2 text-blue-600 mb-3">
                      <FileText className="w-5 h-5" />
                      <span className="font-bold text-sm">INFORMAÇÕES</span>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className={isDarkMode ? 'text-dark-text-muted' : 'text-gray-600'}>Tipo:</span>
                        <span className={`font-semibold ${
                          isDarkMode ? 'text-dark-text-primary' : 'text-gray-900'
                        }`}>{chamado.tipo}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className={isDarkMode ? 'text-dark-text-muted' : 'text-gray-600'}>Categoria:</span>
                        <span className={`font-semibold ${
                          isDarkMode ? 'text-dark-text-primary' : 'text-gray-900'
                        }`}>{chamado.categoria}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className={isDarkMode ? 'text-dark-text-muted' : 'text-gray-600'}>Grupo:</span>
                        <span className={`font-semibold ${
                          isDarkMode ? 'text-dark-text-primary' : 'text-gray-900'
                        }`}>{chamado.grupo}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Card de Responsabilidade */}
                  <div className={`rounded-xl p-4 border shadow-sm ${
                    isDarkMode 
                      ? 'bg-dark-bg-primary border-dark-border' 
                      : 'bg-white border-gray-200'
                  }`}>
                    <div className="flex items-center space-x-2 text-green-600 mb-3">
                      <Users className="w-5 h-5" />
                      <span className="font-bold text-sm">RESPONSABILIDADE</span>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className={isDarkMode ? 'text-dark-text-muted' : 'text-gray-600'}>Solicitante:</span>
                        <span className={`font-semibold ${
                          isDarkMode ? 'text-dark-text-primary' : 'text-gray-900'
                        }`}>{chamado.solicitante}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className={isDarkMode ? 'text-dark-text-muted' : 'text-gray-600'}>Atribuído:</span>
                        <span className={`font-semibold ${
                          isDarkMode ? 'text-dark-text-primary' : 'text-gray-900'
                        }`}>{chamado.atribuido}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className={isDarkMode ? 'text-dark-text-muted' : 'text-gray-600'}>Equipe:</span>
                        <span className={`font-semibold ${
                          isDarkMode ? 'text-dark-text-primary' : 'text-gray-900'
                        }`}>{chamado.equipe}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Card de Tempo */}
                  <div className={`rounded-xl p-4 border shadow-sm ${
                    isDarkMode 
                      ? 'bg-dark-bg-primary border-dark-border' 
                      : 'bg-white border-gray-200'
                  }`}>
                    <div className="flex items-center space-x-2 text-purple-600 mb-3">
                      <Clock className="w-5 h-5" />
                      <span className="font-bold text-sm">TEMPO</span>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className={isDarkMode ? 'text-dark-text-muted' : 'text-gray-600'}>Criado:</span>
                        <span className={`font-semibold ${
                          isDarkMode ? 'text-dark-text-primary' : 'text-gray-900'
                        }`}>{chamado.criadoEm}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className={isDarkMode ? 'text-dark-text-muted' : 'text-gray-600'}>Atualizado:</span>
                        <span className={`font-semibold ${
                          isDarkMode ? 'text-dark-text-primary' : 'text-gray-900'
                        }`}>{chamado.atualizadoEm}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className={isDarkMode ? 'text-dark-text-muted' : 'text-gray-600'}>Prazo:</span>
                        <span className={`font-semibold ${
                          isDarkMode ? 'text-dark-text-primary' : 'text-gray-900'
                        }`}>{chamado.prazo}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Card de Sistema */}
                  <div className={`rounded-xl p-4 border shadow-sm ${
                    isDarkMode 
                      ? 'bg-dark-bg-primary border-dark-border' 
                      : 'bg-white border-gray-200'
                  }`}>
                    <div className="flex items-center space-x-2 text-orange-600 mb-3">
                      <Server className="w-5 h-5" />
                      <span className="font-bold text-sm">SISTEMA</span>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className={isDarkMode ? 'text-dark-text-muted' : 'text-gray-600'}>Sistema:</span>
                        <span className={`font-semibold ${
                          isDarkMode ? 'text-dark-text-primary' : 'text-gray-900'
                        }`}>{chamado.sistema}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className={isDarkMode ? 'text-dark-text-muted' : 'text-gray-600'}>Ambiente:</span>
                        <span className={`font-semibold ${
                          isDarkMode ? 'text-dark-text-primary' : 'text-gray-900'
                        }`}>{chamado.ambiente}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className={isDarkMode ? 'text-dark-text-muted' : 'text-gray-600'}>Versão:</span>
                        <span className={`font-semibold ${
                          isDarkMode ? 'text-dark-text-primary' : 'text-gray-900'
                        }`}>{chamado.versao}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Tags e Anexos */}
                <div className="space-y-4 mb-6">
                  {chamado.tags && chamado.tags.length > 0 && (
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
                        {chamado.tags.map((tag, idx) => (
                          <span key={idx} className="px-3 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium border border-green-200">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {chamado.anexos && chamado.anexos.length > 0 && (
                    <div className={`rounded-xl p-4 border ${
                      isDarkMode 
                        ? 'bg-dark-bg-muted border-dark-border' 
                        : 'bg-gray-50 border-gray-200'
                    }`}>
                      <div className="flex items-center space-x-2 mb-3">
                        <FileText className="w-4 h-4 text-gray-500" />
                        <span className={`font-semibold ${
                          isDarkMode ? 'text-dark-text-secondary' : 'text-gray-700'
                        }`}>Anexos</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {chamado.anexos.map((anexo, idx) => (
                          <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium border border-blue-200">
                            {anexo}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Comentários */}
                {chamado.comentarios && chamado.comentarios.length > 0 && (
                  <div className={`rounded-xl p-4 border ${
                    isDarkMode 
                      ? 'bg-blue-900/20 border-blue-700' 
                      : 'bg-blue-50 border-blue-200'
                  }`}>
                    <div className="flex items-center space-x-2 mb-3">
                      <MessageSquare className="w-4 h-4 text-blue-600" />
                      <span className={`font-semibold ${
                        isDarkMode ? 'text-blue-400' : 'text-blue-800'
                      }`}>Comentários</span>
                    </div>
                    <div className="space-y-2">
                      {chamado.comentarios.map((comentario, idx) => (
                        <div key={idx} className={`rounded-lg p-3 border ${
                          isDarkMode 
                            ? 'bg-dark-bg-primary border-blue-700' 
                            : 'bg-white border-blue-200'
                        }`}>
                          <div className="flex items-center justify-between mb-2">
                            <span className={`font-medium text-sm ${
                              isDarkMode ? 'text-dark-text-primary' : 'text-gray-900'
                            }`}>{comentario.autor}</span>
                            <span className={`text-xs ${
                              isDarkMode ? 'text-dark-text-muted' : 'text-gray-500'
                            }`}>{comentario.data}</span>
                          </div>
                          <p className={`text-sm ${
                            isDarkMode ? 'text-dark-text-secondary' : 'text-gray-700'
                          }`}>{comentario.texto}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Footer com metadados */}
                <div className={`mt-6 pt-4 border-t ${
                  isDarkMode ? 'border-dark-border' : 'border-gray-200'
                }`}>
                  <div className="flex flex-col sm:flex-row justify-between text-xs text-gray-500 space-y-2 sm:space-y-0">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">Criado em:</span>
                      <span>{chamado.criadoEm}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">Atualizado em:</span>
                      <span>{chamado.atualizadoEm}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ControleChamadosPage;
