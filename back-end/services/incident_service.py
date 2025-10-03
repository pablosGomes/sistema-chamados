"""
Serviço de Incidentes - Lógica de negócio
"""
from datetime import datetime
from typing import List, Optional, Dict, Any
from bson import ObjectId
from pymongo.collection import Collection
from pymongo.database import Database
from extensions import get_db
from models.incident_model import IncidentCreate, IncidentUpdate, IncidentModel, IncidentResponse


class IncidentService:
    """Serviço para gerenciar incidentes"""
    
    def __init__(self):
        self.db: Database = get_db()
        if self.db is not None:
            self.collection: Collection = self.db.chamados
        else:
            self.collection = None
    
    def _generate_next_number(self) -> str:
        """Gera o próximo número sequencial de incidente"""
        try:
            # Buscar o último incidente ordenado por número
            last_incident = self.collection.find_one(
                sort=[("numero", -1)]
            )
            
            if last_incident and "numero" in last_incident:
                # Extrair número do último incidente (ex: INC-001 -> 1)
                last_num = last_incident["numero"]
                if "-" in last_num:
                    last_num = last_num.split("-")[-1]
                
                try:
                    next_num = int(last_num) + 1
                except ValueError:
                    next_num = 1
            else:
                next_num = 1
            
            # Formatar número (ex: 1 -> INC-001)
            return f"INC-{next_num:03d}"
            
        except Exception as e:
            print(f"Erro ao gerar número do incidente: {e}")
            return f"INC-{int(datetime.now().timestamp())}"
    
    def create_incident(self, incident_data: IncidentCreate) -> IncidentResponse:
        """Cria um novo incidente"""
        try:
            # Gerar número único se não fornecido
            if not incident_data.numero:
                incident_data.numero = self._generate_next_number()
            
            # Verificar se número já existe
            if self.collection.find_one({"numero": incident_data.numero}):
                raise ValueError(f"Incidente com número {incident_data.numero} já existe")
            
            # Preparar dados para inserção
            incident_dict = incident_data.dict()
            incident_dict["created_at"] = datetime.utcnow()
            incident_dict["updated_at"] = None
            
            # Inserir no banco
            result = self.collection.insert_one(incident_dict)
            
            # Buscar incidente criado
            created_incident = self.collection.find_one({"_id": result.inserted_id})
            
            # Converter para resposta
            return IncidentResponse(
                id=str(created_incident["_id"]),
                numero=created_incident["numero"],
                titulo=created_incident["titulo"],
                descricao=created_incident["descricao"],
                prioridade=created_incident["prioridade"],
                status=created_incident["status"],
                atribuido=created_incident.get("atribuido"),
                tipo_tarefa=created_incident["tipo_tarefa"],
                grupo_designado=created_incident["grupo_designado"],
                local_problema=created_incident.get("local_problema"),
                incidente_vendas=created_incident.get("incidente_vendas", False),
                created_at=created_incident["created_at"],
                updated_at=created_incident.get("updated_at")
            )
            
        except Exception as e:
            raise Exception(f"Erro ao criar incidente: {str(e)}")
    
    def get_incident_by_id(self, incident_id: str) -> Optional[IncidentResponse]:
        """Busca incidente por ID"""
        try:
            if not ObjectId.is_valid(incident_id):
                raise ValueError("ID de incidente inválido")
            
            incident = self.collection.find_one({"_id": ObjectId(incident_id)})
            
            if not incident:
                return None
            
            return IncidentResponse(
                id=str(incident["_id"]),
                numero=incident["numero"],
                titulo=incident["titulo"],
                descricao=incident["descricao"],
                prioridade=incident["prioridade"],
                status=incident["status"],
                atribuido=incident.get("atribuido"),
                tipo_tarefa=incident["tipo_tarefa"],
                grupo_designado=incident["grupo_designado"],
                local_problema=incident.get("local_problema"),
                incidente_vendas=incident.get("incidente_vendas", False),
                created_at=incident["created_at"],
                updated_at=incident.get("updated_at")
            )
            
        except Exception as e:
            raise Exception(f"Erro ao buscar incidente: {str(e)}")
    
    def get_incidents(self, filters: Optional[Dict[str, Any]] = None, 
                     limit: int = 100, skip: int = 0) -> List[IncidentResponse]:
        """Lista incidentes com filtros opcionais"""
        try:
            # Construir query de filtros
            query = {}
            
            if filters:
                # Mapear filtros para campos do banco
                if "fila" in filters:
                    fila_map = {
                        "P2K": "fila_p2k",
                        "CRIVO": "fila_crivo",
                        "SG5_URA": "sg5_ura",
                        "ALARMES": "alarmes",
                        "TSK_VENDAS": "tsk_vendas",
                        "SR": "sr",
                        "RIT": "rit"
                    }
                    if filters["fila"] in fila_map:
                        query["local_problema"] = fila_map[filters["fila"]]
                
                if "prioridade" in filters:
                    prioridade_map = {
                        "Crítico": "critica",
                        "Alto": "alta",
                        "Moderado": "media"
                    }
                    if filters["prioridade"] in prioridade_map:
                        query["prioridade"] = prioridade_map[filters["prioridade"]]
                
                if "status" in filters:
                    status_map = {
                        "Em andamento": "em_andamento",
                        "Em espera": "em_espera",
                        "TKS Remoto": "tks_remoto",
                        "Aberto": "aberto"
                    }
                    if filters["status"] in status_map:
                        query["status"] = status_map[filters["status"]]
                
                if "grupo_designado" in filters:
                    query["grupo_designado"] = filters["grupo_designado"]
                
                if "atribuido" in filters:
                    query["atribuido"] = filters["atribuido"]
            
            # Executar query
            cursor = self.collection.find(query).sort("created_at", -1).skip(skip).limit(limit)
            
            # Converter para lista de respostas
            incidents = []
            for incident in cursor:
                incidents.append(IncidentResponse(
                    id=str(incident["_id"]),
                    numero=incident["numero"],
                    titulo=incident["titulo"],
                    descricao=incident["descricao"],
                    prioridade=incident["prioridade"],
                    status=incident["status"],
                    atribuido=incident.get("atribuido"),
                    tipo_tarefa=incident["tipo_tarefa"],
                    grupo_designado=incident["grupo_designado"],
                    local_problema=incident.get("local_problema"),
                    incidente_vendas=incident.get("incidente_vendas", False),
                    created_at=incident["created_at"],
                    updated_at=incident.get("updated_at")
                ))
            
            return incidents
            
        except Exception as e:
            raise Exception(f"Erro ao listar incidentes: {str(e)}")
    
    def update_incident(self, incident_id: str, update_data: IncidentUpdate) -> Optional[IncidentResponse]:
        """Atualiza um incidente existente"""
        try:
            if not ObjectId.is_valid(incident_id):
                raise ValueError("ID de incidente inválido")
            
            # Preparar dados para atualização
            update_dict = update_data.dict(exclude_unset=True)
            update_dict["updated_at"] = datetime.utcnow()
            
            # Atualizar no banco
            result = self.collection.update_one(
                {"_id": ObjectId(incident_id)},
                {"$set": update_dict}
            )
            
            if result.matched_count == 0:
                return None
            
            # Buscar incidente atualizado
            return self.get_incident_by_id(incident_id)
            
        except Exception as e:
            raise Exception(f"Erro ao atualizar incidente: {str(e)}")
    
    def delete_incident(self, incident_id: str) -> bool:
        """Remove um incidente"""
        try:
            if not ObjectId.is_valid(incident_id):
                raise ValueError("ID de incidente inválido")
            
            result = self.collection.delete_one({"_id": ObjectId(incident_id)})
            
            return result.deleted_count > 0
            
        except Exception as e:
            raise Exception(f"Erro ao deletar incidente: {str(e)}")
    
    def get_dashboard_stats(self) -> Dict[str, Any]:
        """Retorna estatísticas para o dashboard"""
        try:
            stats = {
                "incidentes_vendas": self.collection.count_documents({"incidente_vendas": True}),
                "filas": {},
                "prioridades": {},
                "status": {}
            }
            
            # Estatísticas por fila
            filas = ["fila_p2k", "fila_crivo", "sg5_ura", "alarmes", "tsk_vendas", "sr", "rit"]
            for fila in filas:
                stats["filas"][fila] = self.collection.count_documents({"local_problema": fila})
            
            # Estatísticas por prioridade
            prioridades = ["critica", "alta", "media", "baixa"]
            for prioridade in prioridades:
                stats["prioridades"][prioridade] = self.collection.count_documents({"prioridade": prioridade})
            
            # Estatísticas por status
            status_list = ["em_andamento", "em_espera", "tks_remoto", "aberto", "resolvido", "fechado"]
            for status in status_list:
                stats["status"][status] = self.collection.count_documents({"status": status})
            
            return stats
            
        except Exception as e:
            raise Exception(f"Erro ao buscar estatísticas: {str(e)}")
    
    def get_incident_count(self, filters: Optional[Dict[str, Any]] = None) -> int:
        """Retorna o total de incidentes com filtros"""
        try:
            query = {}
            
            if filters:
                # Aplicar os mesmos filtros da busca
                if "fila" in filters:
                    fila_map = {
                        "P2K": "fila_p2k",
                        "CRIVO": "fila_crivo",
                        "SG5_URA": "sg5_ura",
                        "ALARMES": "alarmes",
                        "TSK_VENDAS": "tsk_vendas",
                        "SR": "sr",
                        "RIT": "rit"
                    }
                    if filters["fila"] in fila_map:
                        query["local_problema"] = fila_map[filters["fila"]]
                
                if "prioridade" in filters:
                    prioridade_map = {
                        "Crítico": "critica",
                        "Alto": "alta",
                        "Moderado": "media"
                    }
                    if filters["prioridade"] in prioridade_map:
                        query["prioridade"] = prioridade_map[filters["prioridade"]]
                
                if "status" in filters:
                    status_map = {
                        "Em andamento": "em_andamento",
                        "Em espera": "em_espera",
                        "TKS Remoto": "tks_remoto",
                        "Aberto": "aberto"
                    }
                    if filters["status"] in status_map:
                        query["status"] = status_map[filters["status"]]
            
            return self.collection.count_documents(query)
            
        except Exception as e:
            raise Exception(f"Erro ao contar incidentes: {str(e)}")
