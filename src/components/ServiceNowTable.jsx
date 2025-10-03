import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Eye, Edit, Trash2, Download, RefreshCw } from "lucide-react";

const ServiceNowTable = ({
  incidentes = [],
  loading = false,
  onView,
  onEdit,
  onDelete,
  className = "",
}) => {
  const [filtros, setFiltros] = useState({
    grupo: "",
    status: "",
    prioridade: "",
    atribuido: "",
  });

  const [searchTerm, setSearchTerm] = useState("");

  const mockIncidentes = [
    {
      id: 1,
      numero: "INC001",
      prioridade: "Alta",
      status: "Em andamento",
      atribuido: "João Silva",
      declaracao: "Sistema P2K fora do ar - usuários não conseguem acessar",
      tipoTarefa: "Suporte",
      grupoDesignado: "TI Vendas",
    },
    {
      id: 2,
      numero: "INC002",
      prioridade: "Crítica",
      status: "Aberto",
      atribuido: "Maria Santos",
      declaracao: "Falha na integração com sistema de pagamentos",
      tipoTarefa: "Desenvolvimento",
      grupoDesignado: "TI Sistemas",
    },
    {
      id: 3,
      numero: "INC003",
      prioridade: "Média",
      status: "Em espera",
      atribuido: "Pedro Costa",
      declaracao: "Problema com impressora na loja centro",
      tipoTarefa: "Infraestrutura",
      grupoDesignado: "TI Infraestrutura",
    },
  ];

  const incidentesData = incidentes.length > 0 ? incidentes : mockIncidentes;

  // Componente para chips de status/prioridade
  const StatusChip = ({ value, type = "status" }) => {
    const chipConfig = {
      status: {
        aberto: {
          bg: "bg-blue-100",
          text: "text-blue-800",
          border: "border-blue-200",
        },
        "em andamento": {
          bg: "bg-yellow-100",
          text: "text-yellow-800",
          border: "border-yellow-200",
        },
        "em espera": {
          bg: "bg-gray-100",
          text: "text-gray-800",
          border: "border-gray-200",
        },
        resolvido: {
          bg: "bg-green-100",
          text: "text-green-800",
          border: "border-green-200",
        },
        fechado: {
          bg: "bg-gray-100",
          text: "text-gray-800",
          border: "border-gray-200",
        },
      },
      prioridade: {
        crítica: {
          bg: "bg-red-100",
          text: "text-red-800",
          border: "border-red-200",
        },
        alta: {
          bg: "bg-orange-100",
          text: "text-orange-800",
          border: "border-orange-200",
        },
        média: {
          bg: "bg-yellow-100",
          text: "text-yellow-800",
          border: "border-yellow-200",
        },
        baixa: {
          bg: "bg-green-100",
          text: "text-green-800",
          border: "border-green-200",
        },
      },
    };

    const config =
      chipConfig[type][value?.toLowerCase()] || chipConfig[type]["média"];

    return (
      <span
        className={`
        inline-flex items-center px-2 py-1 text-xs font-medium
        ${config.bg} ${config.text} ${config.border}
        border transition-colors duration-200
      `}
      >
        {value}
      </span>
    );
  };

  // Componente para filtros dropdown
  const FilterDropdown = ({ label, value, onChange, options, placeholder }) => (
    <div className="flex flex-col space-y-2">
      <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="px-4 py-3 border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 rounded-lg shadow-sm focus:shadow-md"
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );

  return (
    <div
      className={`bg-white border border-gray-200 shadow-lg overflow-hidden rounded-lg ${className}`}
    >
      {/* Header da tabela com filtros */}
      <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">
            Incidentes ({incidentesData.length})
          </h3>
          <div className="flex items-center space-x-3">
            <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 transition-all duration-200 rounded-lg shadow-md hover:shadow-lg transform hover:scale-105">
              <Download className="w-4 h-4" />
              <span className="text-sm font-medium">Exportar</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white hover:bg-gray-700 transition-all duration-200 rounded-lg shadow-md hover:shadow-lg transform hover:scale-105">
              <RefreshCw className="w-4 h-4" />
              <span className="text-sm font-medium">Atualizar</span>
            </button>
          </div>
        </div>

        {/* Barra de busca */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar incidentes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-4 border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 rounded-lg shadow-sm focus:shadow-md"
          />
        </div>

        {/* Filtros dinâmicos */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <FilterDropdown
            label="GRUPO DESIGNADO"
            value={filtros.grupo}
            onChange={(value) => setFiltros({ ...filtros, grupo: value })}
            options={[
              { value: "TI Vendas", label: "TI Vendas" },
              { value: "TI Sistemas", label: "TI Sistemas" },
              { value: "TI Infraestrutura", label: "TI Infraestrutura" },
              { value: "TI Dados", label: "TI Dados" },
            ]}
            placeholder="Selecione o grupo"
          />

          <FilterDropdown
            label="STATUS"
            value={filtros.status}
            onChange={(value) => setFiltros({ ...filtros, status: value })}
            options={[
              { value: "aberto", label: "Aberto" },
              { value: "em andamento", label: "Em Andamento" },
              { value: "em espera", label: "Em Espera" },
              { value: "resolvido", label: "Resolvido" },
              { value: "fechado", label: "Fechado" },
            ]}
            placeholder="Selecione o status"
          />

          <FilterDropdown
            label="PRIORIDADE"
            value={filtros.prioridade}
            onChange={(value) => setFiltros({ ...filtros, prioridade: value })}
            options={[
              { value: "crítica", label: "Crítica" },
              { value: "alta", label: "Alta" },
              { value: "média", label: "Média" },
              { value: "baixa", label: "Baixa" },
            ]}
            placeholder="Selecione a prioridade"
          />

          <FilterDropdown
            label="ATRIBUÍDO A"
            value={filtros.atribuido}
            onChange={(value) => setFiltros({ ...filtros, atribuido: value })}
            options={[
              { value: "João Silva", label: "João Silva" },
              { value: "Maria Santos", label: "Maria Santos" },
              { value: "Pedro Costa", label: "Pedro Costa" },
              { value: "Ana Oliveira", label: "Ana Oliveira" },
            ]}
            placeholder="Selecione o responsável"
          />
        </div>
      </div>

      {/* Tabela */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100 border-b-2 border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                NÚMERO
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                PRIORIDADE
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                STATUS
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                ATRIBUÍDO A
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                DECLARAÇÃO DO PROBLEMA
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                TIPO DE TAREFA
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                GRUPO DESIGNADO
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                AÇÕES
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            <AnimatePresence>
              {incidentesData.map((incidente, index) => (
                <motion.tr
                  key={incidente.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                  className="hover:bg-blue-50 transition-all duration-200 border-b border-gray-100"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-gray-900">
                      {incidente.numero}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusChip
                      value={incidente.prioridade}
                      type="prioridade"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusChip value={incidente.status} type="status" />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">
                      {incidente.atribuido}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="max-w-xs">
                      <p className="text-sm text-gray-900 truncate">
                        {incidente.declaracao}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">
                      {incidente.tipoTarefa}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">
                      {incidente.grupoDesignado}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => onView?.(incidente)}
                        className="p-2 text-blue-600 hover:bg-blue-50 transition-colors duration-200"
                        title="Visualizar"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onEdit?.(incidente)}
                        className="p-2 text-green-600 hover:bg-green-50 transition-colors duration-200"
                        title="Editar"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete?.(incidente)}
                        className="p-2 text-red-600 hover:bg-red-50 transition-colors duration-200"
                        title="Excluir"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* Footer da tabela*/}
      <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span className="font-medium">
            Mostrando {incidentesData.length} de {incidentesData.length}{" "}
            incidentes
          </span>
          <div className="flex items-center space-x-2">
            <span className="font-medium">Página 1 de 1</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceNowTable;
