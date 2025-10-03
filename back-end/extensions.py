"""
Extensões e inicializações do Flask
"""
from flask import Flask
from flask_cors import CORS
from pymongo import MongoClient
from config import settings
import logging


# Cliente MongoDB
mongo_client = None
db = None
use_mock_data = False


def init_extensions(app: Flask):
    """Inicializa todas as extensões do Flask"""
    
    # Configurar CORS
    CORS(app, origins=settings.CORS_ORIGINS, supports_credentials=True)
    
    # Configurar MongoDB
    init_mongodb(app)
    
    # Configurar Logging
    init_logging(app)


def init_mongodb(app: Flask):
    """Inicializa conexão com MongoDB"""
    global mongo_client, db, use_mock_data
    
    try:
        # Criar cliente MongoDB
        mongo_client = MongoClient(
            settings.MONGODB_URI,
            maxPoolSize=10,
            serverSelectionTimeoutMS=5000,
            socketTimeoutMS=2000,
            connectTimeoutMS=2000
        )
        
        # Testar conexão
        mongo_client.admin.command('ping')
        
        # Selecionar banco de dados
        db = mongo_client[settings.MONGODB_DB]
        
        # Configurar índices
        setup_database_indexes()
        
        app.logger.info(f"✅ MongoDB conectado com sucesso: {settings.MONGODB_DB}")
        use_mock_data = False
        
    except Exception as e:
        app.logger.warning(f"⚠️ MongoDB não disponível: {e}")
        app.logger.info("🔄 Usando dados mockados para desenvolvimento")
        use_mock_data = True
        db = None


def setup_database_indexes():
    """Configura índices do banco de dados"""
    try:
        # Índices para incidentes
        db.incidentes.create_index("numero", unique=True)
        db.incidentes.create_index("status")
        db.incidentes.create_index("prioridade")
        db.incidentes.create_index("grupo_designado")
        db.incidentes.create_index("created_at")
        
        # Índices para changes
        db.changes.create_index("numero", unique=True)
        db.changes.create_index("status")
        db.changes.create_index("data_programada")
        db.changes.create_index("created_at")
        
        # Índices para usuários
        db.usuarios.create_index("email", unique=True)
        db.usuarios.create_index("username", unique=True)
        
        print("✅ Índices do banco de dados configurados com sucesso")
        
    except Exception as e:
        print(f"⚠️ Aviso ao configurar índices: {e}")


def get_db():
    """Retorna a instância do banco de dados"""
    return db


def get_mongo_client():
    """Retorna o cliente MongoDB"""
    return mongo_client


def is_using_mock_data():
    """Retorna se está usando dados mockados"""
    return use_mock_data


def close_mongodb():
    """Fecha conexão com MongoDB"""
    global mongo_client
    if mongo_client:
        mongo_client.close()
        print("🔌 Conexão com MongoDB fechada")


def init_logging(app: Flask):
    """Configura sistema de logging"""
    
    # Configurar formato dos logs
    logging.basicConfig(
        level=getattr(logging, settings.LOG_LEVEL),
        format=settings.LOG_FORMAT,
        handlers=[
            logging.StreamHandler(),
            logging.FileHandler('app.log', encoding='utf-8')
        ]
    )
    
    # Configurar logger do Flask
    app.logger.setLevel(getattr(logging, settings.LOG_LEVEL))
    
    # Log de início da aplicação
    app.logger.info(f"🚀 {settings.APP_NAME} iniciando...")
    app.logger.info(f"📊 Modo Debug: {settings.DEBUG}")
    app.logger.info(f"🗄️ Banco de dados: {settings.MONGODB_DB}")
    app.logger.info(f"🌐 CORS Origins: {settings.CORS_ORIGINS}")
