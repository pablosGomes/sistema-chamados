import { useState, useEffect, useCallback } from 'react';
import { apiService } from '../services/api';

export const useFetchIncidentes = () => {
  const [incidentes, setIncidentes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    porFila: {},
    porPrioridade: {},
    porStatus: {}
  });

  // Buscar todos os incidentes
  const fetchIncidentes = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await apiService.getIncidentes(params);
      setIncidentes(data.incidentes || data || []);
      return data;
    } catch (err) {
      setError(err.message);
      console.error('Erro ao buscar incidentes:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Buscar estatísticas do dashboard
  const fetchStats = useCallback(async () => {
    try {
      const data = await apiService.getDashboardStats();
      setStats(data);
      return data;
    } catch (err) {
      console.error('Erro ao buscar estatísticas:', err);
      return null;
    }
  }, []);

  // Buscar incidentes com filtros
  const fetchIncidentesFiltrados = useCallback(async (filtros) => {
    const params = {};
    
    if (filtros.fila) params.fila = filtros.fila;
    if (filtros.prioridade) params.prioridade = filtros.prioridade;
    if (filtros.status) params.status = filtros.status;
    if (filtros.grupo_designado) params.grupo_designado = filtros.grupo_designado;
    if (filtros.atribuido) params.atribuido = filtros.atribuido;
    
    return await fetchIncidentes(params);
  }, [fetchIncidentes]);

  // Criar novo incidente
  const createIncidente = useCallback(async (incidenteData) => {
    try {
      const data = await apiService.createIncidente(incidenteData);
      
      // Atualizar lista local
      setIncidentes(prev => [data, ...prev]);
      
      // Atualizar estatísticas
      await fetchStats();
      
      return data;
    } catch (err) {
      setError(err.message);
      console.error('Erro ao criar incidente:', err);
      return null;
    }
  }, [fetchStats]);

  // Atualizar incidente
  const updateIncidente = useCallback(async (id, updateData) => {
    try {
      const data = await apiService.updateIncidente(id, updateData);
      
      // Atualizar lista local
      setIncidentes(prev => 
        prev.map(inc => inc._id === id ? data : inc)
      );
      
      // Atualizar estatísticas
      await fetchStats();
      
      return data;
    } catch (err) {
      setError(err.message);
      console.error('Erro ao atualizar incidente:', err);
      return null;
    }
  }, [fetchStats]);

  // Deletar incidente
  const deleteIncidente = useCallback(async (id) => {
    try {
      await apiService.deleteIncidente(id);
      
      // Remover da lista local
      setIncidentes(prev => prev.filter(inc => inc._id !== id));
      
      // Atualizar estatísticas
      await fetchStats();
      
      return true;
    } catch (err) {
      setError(err.message);
      console.error('Erro ao deletar incidente:', err);
      return false;
    }
  }, [fetchStats]);

  // Atualizar status do incidente
  const updateStatus = useCallback(async (id, novoStatus) => {
    return await updateIncidente(id, { status: novoStatus });
  }, [updateIncidente]);

  // Atribuir incidente
  const assignIncidente = useCallback(async (id, atribuido) => {
    return await updateIncidente(id, { atribuido });
  }, [updateIncidente]);

  // Limpar erro
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Carregar dados iniciais
  useEffect(() => {
    fetchIncidentes();
    fetchStats();
  }, [fetchIncidentes, fetchStats]);

  return {
    // Estados
    incidentes,
    loading,
    error,
    stats,
    
    // Ações
    fetchIncidentes,
    fetchIncidentesFiltrados,
    fetchStats,
    createIncidente,
    updateIncidente,
    deleteIncidente,
    updateStatus,
    assignIncidente,
    clearError,
    
    // Utilitários
    refetch: () => {
      fetchIncidentes();
      fetchStats();
    }
  };
};
