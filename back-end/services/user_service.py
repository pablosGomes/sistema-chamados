"""
Serviço de Usuários - Lógica de negócio
"""
from datetime import datetime
from typing import List, Optional, Dict, Any
from bson import ObjectId
from pymongo.collection import Collection
from pymongo.database import Database
from extensions import get_db
from models.user_model import UserCreate, UserUpdate, UserModel, UserResponse


class UserService:
    """Serviço para gerenciar usuários"""
    
    def __init__(self):
        self.db: Database = get_db()
        if self.db is not None:
            self.collection: Collection = self.db.usuarios
        else:
            self.collection = None
    
    def create_user(self, user_data: UserCreate) -> UserResponse:
        """Cria um novo usuário"""
        try:
            # Verificar se username já existe
            if self.collection.find_one({"username": user_data.username}):
                raise ValueError(f"Usuário com username {user_data.username} já existe")
            
            # Verificar se email já existe
            if self.collection.find_one({"email": user_data.email}):
                raise ValueError(f"Usuário com email {user_data.email} já existe")
            
            # TODO: Implementar hash da senha
            # Por enquanto, armazenar senha em texto plano (NÃO RECOMENDADO PARA PRODUÇÃO)
            # Em produção, usar: hashlib.sha256(user_data.password.encode()).hexdigest()
            
            # Preparar dados para inserção
            user_dict = user_data.dict()
            user_dict["created_at"] = datetime.utcnow()
            user_dict["updated_at"] = None
            user_dict["last_login"] = None
            
            # Inserir no banco
            result = self.collection.insert_one(user_dict)
            
            # Buscar usuário criado
            created_user = self.collection.find_one({"_id": result.inserted_id})
            
            # Converter para resposta (sem senha)
            return UserResponse(
                id=str(created_user["_id"]),
                username=created_user["username"],
                email=created_user["email"],
                nome_completo=created_user["nome_completo"],
                grupo=created_user["grupo"],
                ativo=created_user["ativo"],
                created_at=created_user["created_at"],
                updated_at=created_user.get("updated_at"),
                last_login=created_user.get("last_login")
            )
            
        except Exception as e:
            raise Exception(f"Erro ao criar usuário: {str(e)}")
    
    def get_user_by_id(self, user_id: str) -> Optional[UserResponse]:
        """Busca usuário por ID"""
        try:
            if not ObjectId.is_valid(user_id):
                raise ValueError("ID de usuário inválido")
            
            user = self.collection.find_one({"_id": ObjectId(user_id)})
            
            if not user:
                return None
            
            return UserResponse(
                id=str(user["_id"]),
                username=user["username"],
                email=user["email"],
                nome_completo=user["nome_completo"],
                grupo=user["grupo"],
                ativo=user["ativo"],
                created_at=user["created_at"],
                updated_at=user.get("updated_at"),
                last_login=user.get("last_login")
            )
            
        except Exception as e:
            raise Exception(f"Erro ao buscar usuário: {str(e)}")
    
    def get_user_by_username(self, username: str) -> Optional[UserModel]:
        """Busca usuário por username (retorna modelo completo com senha para autenticação)"""
        try:
            user = self.collection.find_one({"username": username.lower()})
            
            if not user:
                return None
            
            return UserModel(
                id=user["_id"],
                username=user["username"],
                email=user["email"],
                nome_completo=user["nome_completo"],
                grupo=user["grupo"],
                ativo=user["ativo"],
                created_at=user["created_at"],
                updated_at=user.get("updated_at"),
                last_login=user.get("last_login")
            )
            
        except Exception as e:
            raise Exception(f"Erro ao buscar usuário por username: {str(e)}")
    
    def get_users(self, filters: Optional[Dict[str, Any]] = None, 
                 limit: int = 100, skip: int = 0) -> List[UserResponse]:
        """Lista usuários com filtros opcionais"""
        try:
            # Construir query de filtros
            query = {}
            
            if filters:
                if "grupo" in filters:
                    query["grupo"] = filters["grupo"]
                
                if "ativo" in filters:
                    query["ativo"] = filters["ativo"]
                
                if "username" in filters:
                    query["username"] = {"$regex": filters["username"], "$options": "i"}
                
                if "nome_completo" in filters:
                    query["nome_completo"] = {"$regex": filters["nome_completo"], "$options": "i"}
            
            # Executar query
            cursor = self.collection.find(query).sort("created_at", -1).skip(skip).limit(limit)
            
            # Converter para lista de respostas
            users = []
            for user in cursor:
                users.append(UserResponse(
                    id=str(user["_id"]),
                    username=user["username"],
                    email=user["email"],
                    nome_completo=user["nome_completo"],
                    grupo=user["grupo"],
                    ativo=user["ativo"],
                    created_at=user["created_at"],
                    updated_at=user.get("updated_at"),
                    last_login=user.get("last_login")
                ))
            
            return users
            
        except Exception as e:
            raise Exception(f"Erro ao listar usuários: {str(e)}")
    
    def update_user(self, user_id: str, update_data: UserUpdate) -> Optional[UserResponse]:
        """Atualiza um usuário existente"""
        try:
            if not ObjectId.is_valid(user_id):
                raise ValueError("ID de usuário inválido")
            
            # Verificar se username já existe (se estiver sendo alterado)
            if update_data.username:
                existing_user = self.collection.find_one({
                    "username": update_data.username,
                    "_id": {"$ne": ObjectId(user_id)}
                })
                if existing_user:
                    raise ValueError(f"Username {update_data.username} já está em uso")
            
            # Verificar se email já existe (se estiver sendo alterado)
            if update_data.email:
                existing_user = self.collection.find_one({
                    "email": update_data.email,
                    "_id": {"$ne": ObjectId(user_id)}
                })
                if existing_user:
                    raise ValueError(f"Email {update_data.email} já está em uso")
            
            # Preparar dados para atualização
            update_dict = update_data.dict(exclude_unset=True)
            update_dict["updated_at"] = datetime.utcnow()
            
            # Atualizar no banco
            result = self.collection.update_one(
                {"_id": ObjectId(user_id)},
                {"$set": update_dict}
            )
            
            if result.matched_count == 0:
                return None
            
            # Buscar usuário atualizado
            return self.get_user_by_id(user_id)
            
        except Exception as e:
            raise Exception(f"Erro ao atualizar usuário: {str(e)}")
    
    def delete_user(self, user_id: str) -> bool:
        """Remove um usuário"""
        try:
            if not ObjectId.is_valid(user_id):
                raise ValueError("ID de usuário inválido")
            
            result = self.collection.delete_one({"_id": ObjectId(user_id)})
            
            return result.deleted_count > 0
            
        except Exception as e:
            raise Exception(f"Erro ao deletar usuário: {str(e)}")
    
    def authenticate_user(self, username: str, password: str) -> Optional[UserResponse]:
        """Autentica um usuário"""
        try:
            # TODO: Implementar verificação de senha hash
            # Por enquanto, verificação simples (NÃO RECOMENDADO PARA PRODUÇÃO)
            
            user = self.get_user_by_username(username)
            
            if not user or not user.ativo:
                return None
            
            # TODO: Verificar hash da senha
            # if user.password != hashlib.sha256(password.encode()).hexdigest():
            #     return None
            
            # Atualizar último login
            self.collection.update_one(
                {"_id": user.id},
                {"$set": {"last_login": datetime.utcnow()}}
            )
            
            # Retornar resposta sem senha
            return UserResponse(
                id=str(user.id),
                username=user.username,
                email=user.email,
                nome_completo=user.nome_completo,
                grupo=user.grupo,
                ativo=user.ativo,
                created_at=user.created_at,
                updated_at=user.updated_at,
                last_login=user.last_login
            )
            
        except Exception as e:
            raise Exception(f"Erro ao autenticar usuário: {str(e)}")
    
    def change_password(self, user_id: str, current_password: str, new_password: str) -> bool:
        """Altera a senha de um usuário"""
        try:
            if not ObjectId.is_valid(user_id):
                raise ValueError("ID de usuário inválido")
            
            # TODO: Implementar verificação de senha atual e hash da nova senha
            # Por enquanto, apenas simular sucesso
            
            # Atualizar senha no banco
            result = self.collection.update_one(
                {"_id": ObjectId(user_id)},
                {"$set": {
                    "password": new_password,  # TODO: Hash da senha
                    "updated_at": datetime.utcnow()
                }}
            )
            
            return result.modified_count > 0
            
        except Exception as e:
            raise Exception(f"Erro ao alterar senha: {str(e)}")
    
    def get_dashboard_stats(self) -> Dict[str, Any]:
        """Retorna estatísticas para o dashboard"""
        try:
            stats = {
                "total_usuarios": self.collection.count_documents({}),
                "usuarios_ativos": self.collection.count_documents({"ativo": True}),
                "usuarios_inativos": self.collection.count_documents({"ativo": False}),
                "usuarios_por_grupo": {}
            }
            
            # Estatísticas por grupo
            grupos = ['TI Infraestrutura', 'TI Sistemas', 'TI Vendas', 'TI Monitoramento', 'TI Dados', 'TI Segurança', 'TI Integração']
            for grupo in grupos:
                stats["usuarios_por_grupo"][grupo] = self.collection.count_documents({"grupo": grupo})
            
            return stats
            
        except Exception as e:
            raise Exception(f"Erro ao buscar estatísticas: {str(e)}")
    
    def get_user_count(self, filters: Optional[Dict[str, Any]] = None) -> int:
        """Retorna o total de usuários com filtros"""
        try:
            query = {}
            
            if filters:
                if "grupo" in filters:
                    query["grupo"] = filters["grupo"]
                
                if "ativo" in filters:
                    query["ativo"] = filters["ativo"]
            
            return self.collection.count_documents(query)
            
        except Exception as e:
            raise Exception(f"Erro ao contar usuários: {str(e)}")
