"""
Configurações da aplicação usando Pydantic Settings
"""
import os
from typing import Optional
from pydantic_settings import BaseSettings
from pydantic import Field


class Settings(BaseSettings):
    """Configurações da aplicação"""
    
    # Configurações do MongoDB
    MONGODB_URI: str = Field(
        default="mongodb://localhost:27017",
        description="URI de conexão com MongoDB"
    )
    MONGODB_DB: str = Field(
        default="sistema_chamados",
        description="Nome do banco de dados"
    )
    
    # Configurações da aplicação
    APP_NAME: str = Field(
        default="Sistema de Chamados API",
        description="Nome da aplicação"
    )
    DEBUG: bool = Field(
        default=False,
        description="Modo debug"
    )
    SECRET_KEY: str = Field(
        default="your-secret-key-change-in-production",
        description="Chave secreta da aplicação"
    )
    
    # Configurações de CORS
    CORS_ORIGINS: list[str] = Field(
        default=["http://localhost:3000", "http://localhost:5173"],
        description="Origens permitidas para CORS"
    )
    
    # Configurações de Log
    LOG_LEVEL: str = Field(
        default="INFO",
        description="Nível de log"
    )
    LOG_FORMAT: str = Field(
        default="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
        description="Formato dos logs"
    )
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = False


# Instância global das configurações
settings = Settings()

# Configurações específicas do Flask
class FlaskConfig:
    """Configurações específicas do Flask"""
    
    SECRET_KEY = settings.SECRET_KEY
    DEBUG = settings.DEBUG
    
    # Configurações do MongoDB para Flask-PyMongo
    MONGODB_SETTINGS = {
        'host': settings.MONGODB_URI,
        'db': settings.MONGODB_DB,
        'connect': False,  # Conexão lazy
        'maxPoolSize': 10,
        'serverSelectionTimeoutMS': 5000,
        'socketTimeoutMS': 2000,
        'connectTimeoutMS': 2000,
    }
    
    # Configurações de CORS
    CORS_ORIGINS = settings.CORS_ORIGINS
    
    # Configurações de Log
    LOG_LEVEL = settings.LOG_LEVEL
    LOG_FORMAT = settings.LOG_FORMAT

