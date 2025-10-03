import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Filter, 
  X, 
  Search, 
  RefreshCw,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

const FiltroBar = ({ 
  filtrosAtivos = {}, 
  onFiltroChange, 
  onLimparFiltros,
  onBuscar,
  className = ''
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleFiltroToggle = (categoria, valor) => {
    const novosFiltros = { ...filtrosAtivos };
    
    if (novosFiltros[categoria]?.includes(valor)) {
      // Remove o filtro se já estiver ativo
      novosFiltros[categoria] = novosFiltros[categoria].filter(f => f !== valor);
      if (novosFiltros[categoria].length === 0) {
        delete novosFiltros[categoria];
      }
    } else {
      // Adiciona o filtro
      if (!novosFiltros[categoria]) {
        novosFiltros[categoria] = [];
      }
      novosFiltros[categoria].push(valor);
    }
    
    onFiltroChange?.(novosFiltros);
  };

  const handleLimparFiltros = () => {
    onLimparFiltros?.();
    setSearchTerm('');
  };

  const handleBuscar = () => {
    onBuscar?.(searchTerm);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleBuscar();
    }
  };

  const totalFiltrosAtivos = Object.values(filtrosAtivos).flat().length;

  return (
    <div className={`bg-card rounded-2xl border border-border shadow-soft ${className}`}>
      {/* Header da barra de filtros */}
      <div className="px-6 py-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Filter className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">
              Filtros
              {totalFiltrosAtivos > 0 && (
                <span className="ml-2 inline-flex items-center justify-center w-6 h-6 text-xs font-medium bg-primary text-primary-foreground rounded-full">
                  {totalFiltrosAtivos}
                </span>
              )}
            </h3>
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Barra de busca */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Buscar incidentes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={handleKeyPress}
                className="pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
              />
            </div>
            
            <button
              onClick={handleBuscar}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors duration-200 font-medium"
            >
              Buscar
            </button>
            
            {/* Botão expandir/colapsar */}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors duration-200"
              aria-label={isExpanded ? 'Colapsar filtros' : 'Expandir filtros'}
            >
              <AnimatePresence mode="wait">
                {isExpanded ? (
                  <motion.div
                    key="up"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronUp className="w-5 h-5" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="down"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown className="w-5 h-5" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </div>

      {/* Filtros expandidos */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-6 py-6 space-y-6">
              {/* Filtros por Fila */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-foreground uppercase tracking-wider">
                  Fila
                </h4>
                <div className="flex flex-wrap gap-2">
                  {['P2K', 'CRIVO', 'GN', 'SG5', 'URA222', 'ALARMES', 'TSK VENDAS', 'SR', 'RIT'].map((fila) => (
                    <button
                      key={fila}
                      onClick={() => handleFiltroToggle('fila', fila)}
                      className={`
                        px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
                        ${filtrosAtivos.fila?.includes(fila)
                          ? 'bg-primary text-primary-foreground ring-2 ring-primary ring-offset-2'
                          : 'bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground'
                        }
                      `}
                    >
                      {fila}
                    </button>
                  ))}
                </div>
              </div>

              {/* Filtros por Prioridade */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-foreground uppercase tracking-wider">
                  Prioridade
                </h4>
                <div className="flex flex-wrap gap-2">
                  {[
                    { valor: 'critico', label: 'Crítico', cor: 'bg-destructive text-destructive-foreground' },
                    { valor: 'alto', label: 'Alto', cor: 'bg-warning text-warning-foreground' },
                    { valor: 'moderado', label: 'Moderado', cor: 'bg-info text-info-foreground' },
                    { valor: 'baixo', label: 'Baixo', cor: 'bg-success text-success-foreground' }
                  ].map(({ valor, label, cor }) => (
                    <button
                      key={valor}
                      onClick={() => handleFiltroToggle('prioridade', valor)}
                      className={`
                        px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
                        ${filtrosAtivos.prioridade?.includes(valor)
                          ? `${cor} ring-2 ring-offset-2 ring-current`
                          : 'bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground'
                        }
                      `}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Filtros por Status */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-foreground uppercase tracking-wider">
                  Status
                </h4>
                <div className="flex flex-wrap gap-2">
                  {[
                    { valor: 'aberto', label: 'Aberto', cor: 'bg-info text-info-foreground' },
                    { valor: 'em_andamento', label: 'Em Andamento', cor: 'bg-warning text-warning-foreground' },
                    { valor: 'em_espera', label: 'Em Espera', cor: 'bg-secondary text-secondary-foreground' },
                    { valor: 'resolvido', label: 'Resolvido', cor: 'bg-success text-success-foreground' },
                    { valor: 'fechado', label: 'Fechado', cor: 'bg-muted text-muted-foreground' },
                    { valor: 'tks_remoto', label: 'TKS Remoto', cor: 'bg-primary text-primary-foreground' }
                  ].map(({ valor, label, cor }) => (
                    <button
                      key={valor}
                      onClick={() => handleFiltroToggle('status', valor)}
                      className={`
                        px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
                        ${filtrosAtivos.status?.includes(valor)
                          ? `${cor} ring-2 ring-offset-2 ring-current`
                          : 'bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground'
                        }
                      `}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Filtros ativos */}
              {totalFiltrosAtivos > 0 && (
                <div className="pt-4 border-t border-border">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-foreground">
                      Filtros ativos:
                    </h4>
                    <button
                      onClick={handleLimparFiltros}
                      className="flex items-center space-x-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors duration-200"
                    >
                      <RefreshCw className="w-4 h-4" />
                      <span>Limpar todos</span>
                    </button>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mt-3">
                    {Object.entries(filtrosAtivos).map(([categoria, valores]) =>
                      valores.map((valor) => (
                        <div
                          key={`${categoria}-${valor}`}
                          className="flex items-center space-x-2 px-3 py-2 bg-primary/10 text-primary rounded-lg"
                        >
                          <span className="text-xs font-medium uppercase">{categoria}:</span>
                          <span className="text-sm">{valor}</span>
                          <button
                            onClick={() => handleFiltroToggle(categoria, valor)}
                            className="ml-2 p-1 hover:bg-primary/20 rounded-full transition-colors duration-200"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FiltroBar;
