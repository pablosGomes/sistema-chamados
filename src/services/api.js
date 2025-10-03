// Configuração base da API
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Headers padrão
const getHeaders = () => ({
  'Content-Type': 'application/json',
  'Accept': 'application/json',
});

// Função para fazer requisições HTTP
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config = {
    headers: getHeaders(),
    ...options,
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
};

// API para Incidentes
export const incidentesAPI = {
  // Buscar todos os incidentes
  getAll: (filters = {}) => {
    const params = new URLSearchParams(filters);
    return apiRequest(`/incidentes?${params}`);
  },
  
  // Buscar incidente por ID
  getById: (id) => apiRequest(`/incidentes/${id}`),
  
  // Criar novo incidente
  create: (data) => apiRequest('/incidentes', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  // Atualizar incidente
  update: (id, data) => apiRequest(`/incidentes/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  
  // Deletar incidente
  delete: (id) => apiRequest(`/incidentes/${id}`, {
    method: 'DELETE',
  }),
};

// API para Changes
export const changesAPI = {
  // Buscar todas as changes
  getAll: (filters = {}) => {
    const params = new URLSearchParams(filters);
    return apiRequest(`/changes?${params}`);
  },
  
  // Buscar change por ID
  getById: (id) => apiRequest(`/changes/${id}`),
  
  // Criar nova change
  create: (data) => apiRequest('/changes', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  // Atualizar change
  update: (id, data) => apiRequest(`/changes/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  
  // Deletar change
  delete: (id) => apiRequest(`/changes/${id}`, {
    method: 'DELETE',
  }),
  
  // Aprovar change
  approve: (id, data = {}) => apiRequest(`/changes/${id}/approve`, {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  // Rejeitar change
  reject: (id, data = {}) => apiRequest(`/changes/${id}/reject`, {
    method: 'POST',
    body: JSON.stringify(data),
  }),
};

// API para Chamados
export const chamadosAPI = {
  // Buscar todos os chamados
  getAll: (filters = {}) => {
    const params = new URLSearchParams(filters);
    return apiRequest(`/chamados?${params}`);
  },
  
  // Buscar chamado por ID
  getById: (id) => apiRequest(`/chamados/${id}`),
  
  // Criar novo chamado
  create: (data) => apiRequest('/chamados', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  // Atualizar chamado
  update: (id, data) => apiRequest(`/chamados/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  
  // Deletar chamado
  delete: (id) => apiRequest(`/chamados/${id}`, {
    method: 'DELETE',
  }),
  
  // Atribuir chamado
  assign: (id, data) => apiRequest(`/chamados/${id}/assign`, {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  // Mudar status do chamado
  changeStatus: (id, status) => apiRequest(`/chamados/${id}/status`, {
    method: 'POST',
    body: JSON.stringify({ status }),
  }),
};

// API para Usuários
export const usuariosAPI = {
  // Buscar todos os usuários
  getAll: () => apiRequest('/usuarios'),
  
  // Buscar usuário por ID
  getById: (id) => apiRequest(`/usuarios/${id}`),
  
  // Criar novo usuário
  create: (data) => apiRequest('/usuarios', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  // Atualizar usuário
  update: (id, data) => apiRequest(`/usuarios/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  
  // Deletar usuário
  delete: (id) => apiRequest(`/usuarios/${id}`, {
    method: 'DELETE',
  }),
  
  // Login
  login: (credentials) => apiRequest('/usuarios/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  }),
  
  // Logout
  logout: () => apiRequest('/usuarios/logout', {
    method: 'POST',
  }),
};

// API para Notificações
export const notificacoesAPI = {
  // Buscar notificações do usuário
  getUserNotifications: () => apiRequest('/notificacoes'),
  
  // Marcar como lida
  markAsRead: (id) => apiRequest(`/notificacoes/${id}/read`, {
    method: 'POST',
  }),
  
  // Marcar todas como lidas
  markAllAsRead: () => apiRequest('/notificacoes/read-all', {
    method: 'POST',
  }),
  
  // Deletar notificação
  delete: (id) => apiRequest(`/notificacoes/${id}`, {
    method: 'DELETE',
  }),
};

// API para Estatísticas
export const estatisticasAPI = {
  // Dashboard geral
  getDashboard: () => apiRequest('/estatisticas/dashboard'),
  
  // Estatísticas de incidentes
  getIncidentesStats: (period = '30d') => apiRequest(`/estatisticas/incidentes?period=${period}`),
  
  // Estatísticas de changes
  getChangesStats: (period = '30d') => apiRequest(`/estatisticas/changes?period=${period}`),
  
  // Estatísticas de chamados
  getChamadosStats: (period = '30d') => apiRequest(`/estatisticas/chamados?period=${period}`),
};

export default {
  incidentes: incidentesAPI,
  changes: changesAPI,
  chamados: chamadosAPI,
  usuarios: usuariosAPI,
  notificacoes: notificacoesAPI,
  estatisticas: estatisticasAPI,
};
