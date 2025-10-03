"""
Serviço de Changes - Lógica de negócio
"""
from datetime import datetime
from typing import List, Optional, Dict, Any
from bson import ObjectId
from pymongo.collection import Collection
from pymongo.database import Database
from extensions import get_db
from models.change_model import ChangeCreate, ChangeUpdate, ChangeModel, ChangeResponse


class ChangeService:
    """Serviço para gerenciar changes"""
    
    def __init__(self):
        self.db: Database = get_db()
        if self.db is not None:
            self.collection: Collection = self.db.changes
        else:
            self.collection = None
    
    def _generate_next_number(self) -> str:
        """Gera o próximo número sequencial de change"""
        try:
            # Buscar a última change ordenada por número
            last_change = self.collection.find_one(
                sort=[("numero", -1)]
            )
            
            if last_change and "numero" in last_change:
                # Extrair número da última change (ex: CHG-001 -> 1)
                last_num = last_change["numero"]
                if "-" in last_num:
                    last_num = last_num.split("-")[-1]
                
                try:
                    next_num = int(last_num) + 1
                except ValueError:
                    next_num = 1
            else:
                next_num = 1
            
            # Formatar número (ex: 1 -> CHG-001)
            return f"CHG-{next_num:03d}"
            
        except Exception as e:
            print(f"Erro ao gerar número da change: {e}")
            return f"CHG-{int(datetime.now().timestamp())}"
    
    def create_change(self, change_data: ChangeCreate) -> ChangeResponse:
        """Cria uma nova change"""
        try:
            # Gerar número único se não fornecido
            if not change_data.numero:
                change_data.numero = self._generate_next_number()
            
            # Verificar se número já existe
            if self.collection.find_one({"numero": change_data.numero}):
                raise ValueError(f"Change com número {change_data.numero} já existe")
            
            # Preparar dados para inserção
            change_dict = change_data.dict()
            change_dict["created_at"] = datetime.utcnow()
            change_dict["updated_at"] = None
            
            # Inserir no banco
            result = self.collection.insert_one(change_dict)
            
            # Buscar change criada
            created_change = self.collection.find_one({"_id": result.inserted_id})
            
            # Converter para resposta
            return ChangeResponse(
                id=str(created_change["_id"]),
                numero=created_change["numero"],
                titulo=created_change["titulo"],
                descricao=created_change["descricao"],
                tipo=created_change["tipo"],
                prioridade=created_change["prioridade"],
                status=created_change["status"],
                data_programada=created_change.get("data_programada"),
                grupo_responsavel=created_change["grupo_responsavel"],
                impacto=created_change["impacto"],
                created_at=created_change["created_at"],
                updated_at=created_change.get("updated_at")
            )
            
        except Exception as e:
            raise Exception(f"Erro ao criar change: {str(e)}")
    
    def get_change_by_id(self, change_id: str) -> Optional[ChangeResponse]:
        """Busca change por ID"""
        try:
            if not ObjectId.is_valid(change_id):
                raise ValueError("ID de change inválido")
            
            change = self.collection.find_one({"_id": ObjectId(change_id)})
            
            if not change:
                return None
            
            return ChangeResponse(
                id=str(change["_id"]),
                numero=change["numero"],
                titulo=change["titulo"],
                descricao=change["descricao"],
                tipo=change["tipo"],
                prioridade=change["prioridade"],
                status=change["status"],
                data_programada=change.get("data_programada"),
                grupo_responsavel=change["grupo_responsavel"],
                impacto=change["impacto"],
                created_at=change["created_at"],
                updated_at=change.get("updated_at")
            )
            
        except Exception as e:
            raise Exception(f"Erro ao buscar change: {str(e)}")
    
    def get_changes(self, filters: Optional[Dict[str, Any]] = None, 
                   limit: int = 100, skip: int = 0) -> List[ChangeResponse]:
        """Lista changes com filtros opcionais"""
        try:
            # Construir query de filtros
            query = {}
            
            if filters:
                if "tipo" in filters:
                    query["tipo"] = filters["tipo"].lower()
                
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
                        "Pendente": "pendente",
                        "Aprovada": "aprovada",
                        "Em execução": "em_execucao",
                        "Concluída": "concluida",
                        "Cancelada": "cancelada"
                    }
                    if filters["status"] in status_map:
                        query["status"] = status_map[filters["status"]]
                
                if "grupo_responsavel" in filters:
                    query["grupo_responsavel"] = filters["grupo_responsavel"]
                
                if "impacto" in filters:
                    impacto_map = {
                        "Baixo": "baixo",
                        "Médio": "medio",
                        "Alto": "alto",
                        "Crítico": "critico"
                    }
                    if filters["impacto"] in impacto_map:
                        query["impacto"] = impacto_map[filters["impacto"]]
            
            # Executar query
            cursor = self.collection.find(query).sort("created_at", -1).skip(skip).limit(limit)
            
            # Converter para lista de respostas
            changes = []
            for change in cursor:
                changes.append(ChangeResponse(
                    id=str(change["_id"]),
                    numero=change["numero"],
                    titulo=change["titulo"],
                    descricao=change["descricao"],
                    tipo=change["tipo"],
                    prioridade=change["prioridade"],
                    status=change["status"],
                    data_programada=change.get("data_programada"),
                    grupo_responsavel=change["grupo_responsavel"],
                    impacto=change["impacto"],
                    created_at=change["created_at"],
                    updated_at=change.get("updated_at")
                ))
            
            return changes
            
        except Exception as e:
            raise Exception(f"Erro ao listar changes: {str(e)}")
    
    def update_change(self, change_id: str, update_data: ChangeUpdate) -> Optional[ChangeResponse]:
        """Atualiza uma change existente"""
        try:
            if not ObjectId.is_valid(change_id):
                raise ValueError("ID de change inválido")
            
            # Preparar dados para atualização
            update_dict = update_data.dict(exclude_unset=True)
            update_dict["updated_at"] = datetime.utcnow()
            
            # Atualizar no banco
            result = self.collection.update_one(
                {"_id": ObjectId(change_id)},
                {"$set": update_dict}
            )
            
            if result.matched_count == 0:
                return None
            
            # Buscar change atualizada
            return self.get_change_by_id(change_id)
            
        except Exception as e:
            raise Exception(f"Erro ao atualizar change: {str(e)}")
    
    def delete_change(self, change_id: str) -> bool:
        """Remove uma change"""
        try:
            if not ObjectId.is_valid(change_id):
                raise ValueError("ID de change inválido")
            
            result = self.collection.delete_one({"_id": ObjectId(change_id)})
            
            return result.deleted_count > 0
            
        except Exception as e:
            raise Exception(f"Erro ao deletar change: {str(e)}")
    
    def get_dashboard_stats(self) -> Dict[str, Any]:
        """Retorna estatísticas para o dashboard"""
        try:
            stats = {
                "changes_pendentes": self.collection.count_documents({"status": "pendente"}),
                "changes_aprovadas": self.collection.count_documents({"status": "aprovada"}),
                "changes_execucao": self.collection.count_documents({"status": "em_execucao"}),
                "changes_concluidas": self.collection.count_documents({"status": "concluida"}),
                "changes_canceladas": self.collection.count_documents({"status": "cancelada"}),
                "total_changes": self.collection.count_documents({})
            }
            
            return stats
            
        except Exception as e:
            raise Exception(f"Erro ao buscar estatísticas: {str(e)}")
    
    def get_upcoming_changes(self, days: int = 7) -> List[ChangeResponse]:
        """Retorna changes programadas para os próximos dias"""
        try:
            from datetime import timedelta
            
            start_date = datetime.utcnow()
            end_date = start_date + timedelta(days=days)
            
            query = {
                "data_programada": {
                    "$gte": start_date,
                    "$lte": end_date
                },
                "status": {"$in": ["aprovada", "em_execucao"]}
            }
            
            cursor = self.collection.find(query).sort("data_programada", 1)
            
            changes = []
            for change in cursor:
                changes.append(ChangeResponse(
                    id=str(change["_id"]),
                    numero=change["numero"],
                    titulo=change["titulo"],
                    descricao=change["descricao"],
                    tipo=change["tipo"],
                    prioridade=change["prioridade"],
                    status=change["status"],
                    data_programada=change.get("data_programada"),
                    grupo_responsavel=change["grupo_responsavel"],
                    impacto=change["impacto"],
                    created_at=change["created_at"],
                    updated_at=change.get("updated_at")
                ))
            
            return changes
            
        except Exception as e:
            raise Exception(f"Erro ao buscar changes programadas: {str(e)}")
    
    def get_change_count(self, filters: Optional[Dict[str, Any]] = None) -> int:
        """Retorna o total de changes com filtros"""
        try:
            query = {}
            
            if filters:
                # Aplicar os mesmos filtros da busca
                if "tipo" in filters:
                    query["tipo"] = filters["tipo"].lower()
                
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
                        "Pendente": "pendente",
                        "Aprovada": "aprovada",
                        "Em execução": "em_execucao",
                        "Concluída": "concluida",
                        "Cancelada": "cancelada"
                    }
                    if filters["status"] in status_map:
                        query["status"] = status_map[filters["status"]]
            
            return self.collection.count_documents(query)
            
        except Exception as e:
            raise Exception(f"Erro ao contar changes: {str(e)}")
