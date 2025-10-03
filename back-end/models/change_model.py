"""
Modelo de Change usando Pydantic
"""
from datetime import datetime
from typing import Optional, Annotated
from pydantic import BaseModel, Field, field_validator
from bson import ObjectId


class ChangeBase(BaseModel):
    """Modelo base para change"""
    
    numero: str = Field(..., description="Número único da change")
    titulo: str = Field(..., min_length=1, max_length=200, description="Título da change")
    descricao: str = Field(..., min_length=1, max_length=2000, description="Descrição detalhada")
    tipo: str = Field(..., description="Tipo de change")
    prioridade: str = Field(..., description="Prioridade da change")
    status: str = Field(..., description="Status atual da change")
    data_programada: Optional[datetime] = Field(None, description="Data programada para execução")
    grupo_responsavel: str = Field(..., description="Grupo responsável pela change")
    impacto: str = Field(..., description="Impacto da change")
    
    @field_validator('tipo')
    @classmethod
    def validate_tipo(cls, v):
        tipos_validos = ['manutencao', 'atualizacao', 'configuracao', 'migracao', 'correcao']
        if v.lower() not in tipos_validos:
            raise ValueError(f'Tipo deve ser um dos seguintes: {", ".join(tipos_validos)}')
        return v.lower()
    
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
        status_validos = ['pendente', 'aprovada', 'em_execucao', 'concluida', 'cancelada']
        if v.lower() not in status_validos:
            raise ValueError(f'Status deve ser um dos seguintes: {", ".join(status_validos)}')
        return v.lower()
    
    @field_validator('impacto')
    @classmethod
    def validate_impacto(cls, v):
        impactos_validos = ['baixo', 'medio', 'alto', 'critico']
        if v.lower() not in impactos_validos:
            raise ValueError(f'Impacto deve ser um dos seguintes: {", ".join(impactos_validos)}')
        return v.lower()


class ChangeCreate(ChangeBase):
    """Modelo para criação de change"""
    pass


class ChangeUpdate(BaseModel):
    """Modelo para atualização de change"""
    
    titulo: Optional[str] = Field(None, min_length=1, max_length=200)
    descricao: Optional[str] = Field(None, min_length=1, max_length=2000)
    tipo: Optional[str] = Field(None)
    prioridade: Optional[str] = Field(None)
    status: Optional[str] = Field(None)
    data_programada: Optional[datetime] = Field(None)
    grupo_responsavel: Optional[str] = Field(None)
    impacto: Optional[str] = Field(None)
    
    @field_validator('tipo')
    @classmethod
    def validate_tipo(cls, v):
        if v is not None:
            tipos_validos = ['manutencao', 'atualizacao', 'configuracao', 'migracao', 'correcao']
            if v.lower() not in tipos_validos:
                raise ValueError(f'Tipo deve ser um dos seguintes: {", ".join(tipos_validos)}')
            return v.lower()
        return v
    
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
            status_validos = ['pendente', 'aprovada', 'em_execucao', 'concluida', 'cancelada']
            if v.lower() not in status_validos:
                raise ValueError(f'Status deve ser um dos seguintes: {", ".join(status_validos)}')
            return v.lower()
        return v
    
    @field_validator('impacto')
    @classmethod
    def validate_impacto(cls, v):
        if v is not None:
            impactos_validos = ['baixo', 'medio', 'alto', 'critico']
            if v.lower() not in impactos_validos:
                raise ValueError(f'Impacto deve ser um dos seguintes: {", ".join(impactos_validos)}')
            return v.lower()
        return v


class ChangeModel(ChangeBase):
    """Modelo completo de change com ID e timestamps"""
    
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
                "numero": "CH001",
                "titulo": "Atualização do Sistema P2K",
                "descricao": "Manutenção programada para atualização de segurança",
                "tipo": "manutencao",
                "prioridade": "alta",
                "status": "pendente",
                "data_programada": "2024-01-15T02:00:00",
                "grupo_responsavel": "Infraestrutura",
                "impacto": "medio"
            }
        }


class ChangeResponse(BaseModel):
    """Modelo de resposta para change"""
    
    id: str = Field(..., description="ID da change")
    numero: str = Field(..., description="Número da change")
    titulo: str = Field(..., description="Título da change")
    descricao: str = Field(..., description="Descrição da change")
    tipo: str = Field(..., description="Tipo de change")
    prioridade: str = Field(..., description="Prioridade")
    status: str = Field(..., description="Status atual")
    data_programada: Optional[datetime] = Field(None, description="Data programada")
    grupo_responsavel: str = Field(..., description="Grupo responsável")
    impacto: str = Field(..., description="Impacto")
    created_at: datetime = Field(..., description="Data de criação")
    updated_at: datetime = Field(..., description="Data de atualização")
    
    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }
