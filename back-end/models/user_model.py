"""
Modelo de Usuário usando Pydantic
"""
from datetime import datetime
from typing import Optional, Annotated
from pydantic import BaseModel, Field, field_validator, EmailStr
from bson import ObjectId


class UserBase(BaseModel):
    """Modelo base para usuário"""
    
    username: str = Field(..., min_length=3, max_length=50, description="Nome de usuário único")
    email: EmailStr = Field(..., description="Email do usuário")
    nome_completo: str = Field(..., min_length=1, max_length=100, description="Nome completo")
    grupo: str = Field(..., description="Grupo/função do usuário")
    ativo: bool = Field(True, description="Se o usuário está ativo")
    
    @field_validator('username')
    @classmethod
    def validate_username(cls, v):
        if not v.isalnum():
            raise ValueError('Username deve conter apenas letras e números')
        return v.lower()
    
    @field_validator('grupo')
    @classmethod
    def validate_grupo(cls, v):
        grupos_validos = ['TI Infraestrutura', 'TI Sistemas', 'TI Vendas', 'TI Monitoramento', 'TI Dados', 'TI Segurança', 'TI Integração']
        if v not in grupos_validos:
            raise ValueError(f'Grupo deve ser um dos seguintes: {", ".join(grupos_validos)}')
        return v


class UserCreate(UserBase):
    """Modelo para criação de usuário"""
    password: str = Field(..., min_length=6, description="Senha do usuário")
    
    @field_validator('password')
    @classmethod
    def validate_password(cls, v):
        if len(v) < 6:
            raise ValueError('Senha deve ter pelo menos 6 caracteres')
        return v


class UserUpdate(BaseModel):
    """Modelo para atualização de usuário"""
    
    username: Optional[str] = Field(None, min_length=3, max_length=50)
    email: Optional[EmailStr] = Field(None)
    nome_completo: Optional[str] = Field(None, min_length=1, max_length=100)
    grupo: Optional[str] = Field(None)
    ativo: Optional[bool] = Field(None)
    
    @field_validator('username')
    @classmethod
    def validate_username(cls, v):
        if v is not None:
            if not v.isalnum():
                raise ValueError('Username deve conter apenas letras e números')
            return v.lower()
        return v
    
    @field_validator('grupo')
    @classmethod
    def validate_grupo(cls, v):
        if v is not None:
            grupos_validos = ['TI Infraestrutura', 'TI Sistemas', 'TI Vendas', 'TI Monitoramento', 'TI Dados', 'TI Segurança', 'TI Integração']
            if v not in grupos_validos:
                raise ValueError(f'Grupo deve ser um dos seguintes: {", ".join(grupos_validos)}')
            return v
        return v


class UserModel(UserBase):
    """Modelo completo de usuário"""
    
    id: Annotated[str, Field(alias="_id")] = Field(default_factory=lambda: str(ObjectId()))
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    last_login: Optional[datetime] = Field(None)
    
    class Config:
        populate_by_name = True
        json_encoders = {
            ObjectId: str,
            datetime: lambda v: v.isoformat()
        }
        json_schema_extra = {
            "example": {
                "username": "joao.silva",
                "email": "joao.silva@empresa.com",
                "nome_completo": "João Silva",
                "grupo": "TI Infraestrutura",
                "ativo": True
            }
        }


class UserResponse(BaseModel):
    """Modelo de resposta para usuário (sem senha)"""
    
    id: str = Field(..., description="ID do usuário")
    username: str = Field(..., description="Nome de usuário")
    email: str = Field(..., description="Email do usuário")
    nome_completo: str = Field(..., description="Nome completo")
    grupo: str = Field(..., description="Grupo/função")
    ativo: bool = Field(..., description="Se está ativo")
    created_at: datetime = Field(..., description="Data de criação")
    updated_at: datetime = Field(..., description="Data de atualização")
    last_login: Optional[datetime] = Field(None, description="Último login")
    
    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }


class UserLogin(BaseModel):
    """Modelo para login de usuário"""
    
    username: str = Field(..., description="Nome de usuário")
    password: str = Field(..., description="Senha")
    
    class Config:
        json_schema_extra = {
            "example": {
                "username": "joao.silva",
                "password": "senha123"
            }
        }
