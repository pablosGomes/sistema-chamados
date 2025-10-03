import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter, 
  ChevronDown, 
  ChevronUp,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2
} from 'lucide-react';

const TableIncidentes = ({ 
  incidentes = [], 
  loading = false, 
  onEdit, 
  onDelete, 
  onView,
  className = ''
}) => {
  // Componente para chips de status/prioridade
  const StatusChip = ({ value, type = 'status' }) => {
    const chipConfig = {
      status: {
        'aberto': { bg: 'bg-info-100', text: 'text-info-700', border: 'border-info-200' },
        'em_andamento': { bg: 'bg-warning-100', text: 'text-warning-700', border: 'border-warning-200' },
        'em_espera': { bg: 'bg-secondary-100', text: 'text-secondary-700', border: 'border-secondary-200' },
        'resolvido': { bg: 'bg-success-100', text: 'text-success-700', border: 'border-success-200' },
        'fechado': { bg: 'bg-muted-100', text: 'text-muted-700', border: 'border-muted-200' },
        'tks_remoto': { bg: 'bg-primary-100', text: 'text-primary-700', border: 'border-primary-200' }
      },
      prioridade: {
        'critico': { bg: 'bg-destructive-100', text: 'text-destructive-700', border: 'border-destructive-200' },
        'alto': { bg: 'bg-warning-100', text: 'text-warning-700', border: 'border-warning-200' },
        'moderado': { bg: 'bg-info-100', text: 'text-info-700', border: 'border-info-200' },
        'baixo': { bg: 'bg-success-100', text: 'text-success-700', border: 'border-success-200' }
      }
    };

    const config = chipConfig[type][value?.toLowerCase()] || chipConfig[type]['moderado'];
    return (
      <span className={`
        inline-flex items-center rounded-full px-3 py-1 text-xs font-medium
        ${config.bg} ${config.text} ${config.border}
        border transition-colors duration-200
      `}>
        {value}
      </span>
    );
  };

  // Componente para ações da tabela
  const ActionButton = ({ icon: Icon, onClick, label, variant = 'default' }) => {
    const variants = {
      default: 'text-muted-foreground hover:text-foreground',
      destructive: 'text-destructive hover:text-destructive-foreground',
      primary: 'text-primary hover:text-primary-foreground'
    };

    return (
      <button
        onClick={onClick}
        className={`
          p-2 rounded-lg transition-all duration-200 hover:bg-muted
          ${variants[variant]}
        `}
        aria-label={label}
      >
        <Icon className="w-4 h-4" />
      </button>
    );
  };

  // Skeleton loader para linhas
  const TableSkeleton = () => (
    <div className="animate-pulse">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-center space-x-4 py-4 border-b border-border">
          <div className="h-4 bg-muted rounded w-20"></div>
          <div className="h-4 bg-muted rounded w-32"></div>
          <div className="h-6 bg-muted rounded-full w-16"></div>
          <div className="h-6 bg-muted rounded-full w-20"></div>
          <div className="h-4 bg-muted rounded w-24"></div>
          <div className="h-4 bg-muted rounded w-20"></div>
          <div className="h-8 bg-muted rounded w-24"></div>
        </div>
      ))}
    </div>
  );

  if (loading) {
    return <TableSkeleton />;
  }

  if (!incidentes.length) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-12 text-muted-foreground"
      >
        <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
          <Search className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-medium mb-2">Nenhum incidente encontrado</h3>
        <p className="text-sm">Tente ajustar os filtros ou criar um novo incidente.</p>
      </motion.div>
    );
  }

  return (
    <div className={`bg-card rounded-2xl border border-border shadow-soft overflow-hidden ${className}`}>
      {/* Cabeçalho da tabela */}
      <div className="bg-muted/50 px-6 py-4 border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">
            Incidentes ({incidentes.length})
          </h3>
          <div className="flex items-center space-x-2">
            <button className="p-2 rounded-lg hover:bg-muted transition-colors duration-200">
              <Filter className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
        </div>
      </div>

      {/* Tabela */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/30 sticky top-0">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Número
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Título
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Prioridade
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Responsável
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Grupo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            <AnimatePresence>
              {incidentes.map((incidente, index) => (
                <motion.tr
                  key={incidente.id || index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                  className="hover:bg-muted/30 transition-colors duration-200"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-foreground">
                      {incidente.numero}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="max-w-xs">
                      <p className="text-sm font-medium text-foreground truncate">
                        {incidente.titulo}
                      </p>
                      {incidente.descricao && (
                        <p className="text-xs text-muted-foreground truncate mt-1">
                          {incidente.descricao}
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusChip value={incidente.prioridade} type="prioridade" />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusChip value={incidente.status} type="status" />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-foreground">
                      {incidente.atribuido || 'Não atribuído'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-foreground">
                      {incidente.grupo_designado}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-1">
                      <ActionButton
                        icon={Eye}
                        onClick={() => onView?.(incidente)}
                        label="Visualizar incidente"
                        variant="primary"
                      />
                      <ActionButton
                        icon={Edit}
                        onClick={() => onEdit?.(incidente)}
                        label="Editar incidente"
                        variant="default"
                      />
                      <ActionButton
                        icon={Trash2}
                        onClick={() => onDelete?.(incidente)}
                        label="Excluir incidente"
                        variant="destructive"
                      />
                    </div>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TableIncidentes;
