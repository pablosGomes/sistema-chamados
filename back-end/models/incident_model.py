"""
Modelo de Incidente usando Pydantic
"""
from datetime import datetime
from typing import Optional, Annotated
from pydantic import BaseModel, Field, field_validator
from bson import ObjectId


class IncidentBase(BaseModel):
    """Modelo base para incidente"""
    
    numero: str = Field(..., description="Número único do incidente")
    titulo: str = Field(..., min_length=1, max_length=200, description="Título do incidente")
    descricao: str = Field(..., min_length=1, max_length=2000, description="Descrição detalhada")
    prioridade: str = Field(..., description="Prioridade do incidente")
    status: str = Field(..., description="Status atual do incidente")
    atribuido: Optional[str] = Field(None, max_length=100, description="Responsável pelo incidente")
    tipo_tarefa: str = Field(..., description="Tipo de tarefa")
    grupo_designado: str = Field(..., description="Grupo responsável")
    local_problema: Optional[str] = Field(None, description="Local onde ocorreu o problema")
    incidente_vendas: bool = Field(False, description="Se é um incidente de vendas")
    
    @field_validator('prioridade')
    @classmethod
    def validate_prioridade(cls, v):
        prioridades_validas = ['critica', 'alta', 'media', 'baixa']
        if v.lower() not in prioridades_validas:
            raise ValueError(f'Prioridade deve ser uma das seguintes: {", ".join(prioridades_validas)}')
        return v.lower()
    
    @field_validator('status')
    @classmethod
    def validate_status(cls, v):
        status_validos = ['aberto', 'em_andamento', 'em_espera', 'resolvido', 'fechado', 'tks_remoto']
        if v.lower() not in status_validos:
            raise ValueError(f'Status deve ser um dos seguintes: {", ".join(status_validos)}')
        return v.lower()
    
    @field_validator('tipo_tarefa')
    @classmethod
    def validate_tipo_tarefa(cls, v):
        tipos_validos = ['manutencao', 'suporte', 'configuracao', 'atualizacao', 'investigacao']
        if v.lower() not in tipos_validos:
            raise ValueError(f'Tipo de tarefa deve ser um dos seguintes: {", ".join(tipos_validos)}')
        return v.lower()


class IncidentCreate(IncidentBase):
    """Modelo para criação de incidente"""
    pass


class IncidentUpdate(BaseModel):
    """Modelo para atualização de incidente"""
    
    titulo: Optional[str] = Field(None, min_length=1, max_length=200)
    descricao: Optional[str] = Field(None, min_length=1, max_length=2000)
    prioridade: Optional[str] = Field(None)
    status: Optional[str] = Field(None)
    atribuido: Optional[str] = Field(None, max_length=100)
    tipo_tarefa: Optional[str] = Field(None)
    grupo_designado: Optional[str] = Field(None)
    local_problema: Optional[str] = Field(None)
    incidente_vendas: Optional[bool] = Field(None)
    
    @field_validator('prioridade')
    @classmethod
    def validate_prioridade(cls, v):
        if v is not None:
            prioridades_validas = ['critica', 'alta', 'media', 'baixa']
            if v.lower() not in prioridades_validas:
                raise ValueError(f'Prioridade deve ser uma das seguintes: {", ".join(prioridades_validas)}')
            return v.lower()
        return v
    
    @field_validator('status')
    @classmethod
    def validate_status(cls, v):
        if v is not None:
            status_validos = ['aberto', 'em_andamento', 'em_espera', 'resolvido', 'fechado', 'tks_remoto']
            if v.lower() not in status_validos:
                raise ValueError(f'Status deve ser um dos seguintes: {", ".join(status_validos)}')
            return v.lower()
        return v
    
    @field_validator('tipo_tarefa')
    @classmethod
    def validate_tipo_tarefa(cls, v):
        if v is not None:
            tipos_validos = ['manutencao', 'suporte', 'configuracao', 'atualizacao', 'investigacao']
            if v.lower() not in tipos_validos:
                raise ValueError(f'Tipo de tarefa deve ser um dos seguintes: {", ".join(tipos_validos)}')
            return v.lower()
        return v


class IncidentModel(IncidentBase):
    """Modelo completo de incidente com ID e timestamps"""
    
    id: Annotated[str, Field(alias="_id")] = Field(default_factory=lambda: str(ObjectId()))
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Config:
        populate_by_name = True
        json_encoders = {
            ObjectId: str,
            datetime: lambda v: v.isoformat()
        }
        json_schema_extra = {
            "example": {
                "numero": "INC001",
                "titulo": "Sistema P2K fora do ar",
                "descricao": "Sistema principal de vendas não está respondendo",
                "prioridade": "alta",
                "status": "aberto",
                "atribuido": "João Silva",
                "tipo_tarefa": "suporte",
                "grupo_designado": "Suporte Técnico",
                "local_problema": "Loja Centro",
                "incidente_vendas": True
            }
        }


class IncidentResponse(BaseModel):
    """Modelo de resposta para incidente"""
    
    id: str = Field(..., description="ID do incidente")
    numero: str = Field(..., description="Número do incidente")
    titulo: str = Field(..., description="Título do incidente")
    descricao: str = Field(..., description="Descrição do incidente")
    prioridade: str = Field(..., description="Prioridade")
    status: str = Field(..., description="Status atual")
    atribuido: Optional[str] = Field(None, description="Responsável")
    tipo_tarefa: str = Field(..., description="Tipo de tarefa")
    grupo_designado: str = Field(..., description="Grupo responsável")
    local_problema: Optional[str] = Field(None, description="Local do problema")
    incidente_vendas: bool = Field(..., description="Se é incidente de vendas")
    created_at: datetime = Field(..., description="Data de criação")
    updated_at: datetime = Field(..., description="Data de atualização")
    
    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }
