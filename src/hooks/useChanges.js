import { useState, useEffect, useCallback } from 'react';
import { changesAPI } from '../services/api';

// Dados mockados para funcionar offline
const mockChanges = [
  {
    id: 1,
    titulo: 'Atualização do Sistema P2K',
    descricao: 'Manutenção programada para atualização de segurança e correção de bugs críticos',
    data: '2024-01-15',
    hora: '02:00',
    duracao: '4 horas',
    status: 'agendada',
    prioridade: 'alta',
    tipo: 'manutencao',
    sistema: 'P2K',
    responsavel: 'Maria Santos',
    aprovador: 'João Silva',
    equipe: ['Maria Santos', 'Pedro Costa', 'Ana Oliveira'],
    impacto: 'medio',
    rollback: true,
    testes: true,
    documentacao: true,
    comunicacao: true,
    tags: ['seguranca', 'bugfix', 'sistema-critico'],
    dependencias: ['Backup completo', 'Equipe disponível'],
    observacoes: 'Change aprovada pela diretoria. Equipe de plantão disponível.',
    criadoEm: '2024-01-10 14:30',
    atualizadoEm: '2024-01-12 09:15'
  },
  {
    id: 2,
    titulo: 'Migração de Dados CRIVO',
    descricao: 'Transferência de dados para nova infraestrutura com zero downtime',
    data: '2024-01-18',
    hora: '01:00',
    duracao: '6 horas',
    status: 'em_analise',
    prioridade: 'critica',
    tipo: 'migracao',
    sistema: 'CRIVO',
    responsavel: 'Roberto Alves',
    aprovador: 'Carlos Lima',
    equipe: ['Roberto Alves', 'Fernanda Silva', 'Lucas Costa'],
    impacto: 'alto',
    rollback: true,
    testes: true,
    documentacao: true,
    comunicacao: true,
    tags: ['migracao', 'infraestrutura', 'zero-downtime'],
    dependencias: ['Nova infraestrutura pronta', 'Backup validado'],
    observacoes: 'Change em análise técnica. Necessita validação de infraestrutura.',
    criadoEm: '2024-01-08 10:15',
    atualizadoEm: '2024-01-11 16:45'
  },
  {
    id: 3,
    titulo: 'Backup de Segurança',
    descricao: 'Backup completo dos sistemas críticos com validação de integridade',
    data: '2024-01-20',
    hora: '03:00',
    duracao: '2 horas',
    status: 'aprovada',
    prioridade: 'media',
    tipo: 'backup',
    sistema: 'Todos',
    responsavel: 'Ana Oliveira',
    aprovador: 'Maria Santos',
    equipe: ['Ana Oliveira', 'Pedro Costa'],
    impacto: 'baixo',
    rollback: false,
    testes: true,
    documentacao: true,
    comunicacao: false,
    tags: ['backup', 'seguranca', 'manutencao'],
    dependencias: ['Sistemas estáveis', 'Storage disponível'],
    observacoes: 'Change de rotina aprovada automaticamente.',
    criadoEm: '2024-01-12 08:30',
    atualizadoEm: '2024-01-12 08:30'
  },
  {
    id: 4,
    titulo: 'Atualização de Firewall',
    descricao: 'Atualização das regras de firewall para novos padrões de segurança',
    data: '2024-01-22',
    hora: '00:00',
    duracao: '1 hora',
    status: 'pendente',
    prioridade: 'alta',
    tipo: 'seguranca',
    sistema: 'Firewall',
    responsavel: 'Carlos Lima',
    aprovador: 'João Silva',
    equipe: ['Carlos Lima', 'Roberto Alves'],
    impacto: 'medio',
    rollback: true,
    testes: true,
    documentacao: true,
    comunicacao: true,
    tags: ['seguranca', 'firewall', 'atualizacao'],
    dependencias: ['Testes em ambiente homologado', 'Aprovação de segurança'],
    observacoes: 'Aguardando aprovação da equipe de segurança.',
    criadoEm: '2024-01-09 15:20',
    atualizadoEm: '2024-01-13 11:30'
  }
];

export const useChanges = () => {
  const [changes, setChanges] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({});
  const [isOnline, setIsOnline] = useState(false);

  // Verificar se está online
  useEffect(() => {
    const checkOnline = async () => {
      try {
        await changesAPI.getAll();
        setIsOnline(true);
      } catch (err) {
        setIsOnline(false);
        console.log('Back-end não disponível, usando dados mockados');
      }
    };
    
    checkOnline();
  }, []);

  // Buscar todas as changes
  const fetchChanges = useCallback(async (newFilters = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      if (isOnline) {
        const data = await changesAPI.getAll(newFilters);
        setChanges(data);
      } else {
        // Usar dados mockados se offline
        setChanges(mockChanges);
      }
    } catch (err) {
      if (!isOnline) {
        // Se offline, usar dados mockados
        setChanges(mockChanges);
      } else {
        setError(err.message);
        console.error('Erro ao buscar changes:', err);
      }
    } finally {
      setLoading(false);
    }
  }, [isOnline]);

  // Buscar changes com filtros
  const fetchChangesWithFilters = useCallback(async (newFilters) => {
    setFilters(newFilters);
    await fetchChanges(newFilters);
  }, [fetchChanges]);

  // Criar nova change
  const createChange = useCallback(async (changeData) => {
    setLoading(true);
    setError(null);
    
    try {
      if (isOnline) {
        const newChange = await changesAPI.create(changeData);
        setChanges(prev => [newChange, ...prev]);
        return newChange;
      } else {
        // Simular criação offline
        const newChange = {
          ...changeData,
          id: Date.now(),
          criadoEm: new Date().toLocaleString(),
          atualizadoEm: new Date().toLocaleString(),
          status: 'pendente',
          equipe: changeData.equipe ? changeData.equipe.split(',').map(e => e.trim()) : [],
          tags: changeData.tags ? changeData.tags.split(',').map(t => t.trim()) : [],
          dependencias: changeData.dependencias ? [changeData.dependencias] : []
        };
        setChanges(prev => [newChange, ...prev]);
        return newChange;
      }
    } catch (err) {
      setError(err.message);
      console.error('Erro ao criar change:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [isOnline]);

  // Atualizar change
  const updateChange = useCallback(async (id, changeData) => {
    setLoading(true);
    setError(null);
    
    try {
      if (isOnline) {
        const updatedChange = await changesAPI.update(id, changeData);
        setChanges(prev => prev.map(change => 
          change.id === id ? updatedChange : change
        ));
        return updatedChange;
      } else {
        // Simular atualização offline
        const updatedChange = {
          ...changeData,
          id,
          atualizadoEm: new Date().toLocaleString()
        };
        setChanges(prev => prev.map(change => 
          change.id === id ? updatedChange : change
        ));
        return updatedChange;
      }
    } catch (err) {
      setError(err.message);
      console.error('Erro ao atualizar change:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [isOnline]);

  // Deletar change
  const deleteChange = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    
    try {
      if (isOnline) {
        await changesAPI.delete(id);
      }
      setChanges(prev => prev.filter(change => change.id !== id));
    } catch (err) {
      setError(err.message);
      console.error('Erro ao deletar change:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [isOnline]);

  // Aprovar change
  const approveChange = useCallback(async (id, approvalData = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      if (isOnline) {
        const approvedChange = await changesAPI.approve(id, approvalData);
        setChanges(prev => prev.map(change => 
          change.id === id ? approvedChange : change
        ));
        return approvedChange;
      } else {
        // Simular aprovação offline
        const approvedChange = {
          ...changes.find(c => c.id === id),
          status: 'aprovada',
          atualizadoEm: new Date().toLocaleString()
        };
        setChanges(prev => prev.map(change => 
          change.id === id ? approvedChange : change
        ));
        return approvedChange;
      }
    } catch (err) {
      setError(err.message);
      console.error('Erro ao aprovar change:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [isOnline, changes]);

  // Rejeitar change
  const rejectChange = useCallback(async (id, rejectionData = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      if (isOnline) {
        const rejectedChange = await changesAPI.reject(id, rejectionData);
        setChanges(prev => prev.map(change => 
          change.id === id ? rejectedChange : change
        ));
        return rejectedChange;
      } else {
        // Simular rejeição offline
        const rejectedChange = {
          ...changes.find(c => c.id === id),
          status: 'rejeitada',
          atualizadoEm: new Date().toLocaleString()
        };
        setChanges(prev => prev.map(change => 
          change.id === id ? rejectedChange : change
        ));
        return rejectedChange;
      }
    } catch (err) {
      setError(err.message);
      console.error('Erro ao rejeitar change:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [isOnline, changes]);

  // Buscar change por ID
  const getChangeById = useCallback(async (id) => {
    try {
      if (isOnline) {
        return await changesAPI.getById(id);
      } else {
        return changes.find(c => c.id === id);
      }
    } catch (err) {
      setError(err.message);
      console.error('Erro ao buscar change:', err);
      throw err;
    }
  }, [isOnline, changes]);

  // Limpar erro
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Buscar changes na inicialização
  useEffect(() => {
    fetchChanges();
  }, [fetchChanges]);

  return {
    // Estado
    changes,
    loading,
    error,
    filters,
    isOnline,
    
    // Ações
    fetchChanges,
    fetchChangesWithFilters,
    createChange,
    updateChange,
    deleteChange,
    approveChange,
    rejectChange,
    getChangeById,
    clearError,
    
    // Computed
    totalChanges: changes.length,
    agendadas: changes.filter(c => c.status === 'agendada').length,
    emAnalise: changes.filter(c => c.status === 'em_analise').length,
    aprovadas: changes.filter(c => c.status === 'aprovada').length,
    pendentes: changes.filter(c => c.status === 'pendente').length,
    criticas: changes.filter(c => c.prioridade === 'critica').length,
    altas: changes.filter(c => c.prioridade === 'alta').length,
  };
};
