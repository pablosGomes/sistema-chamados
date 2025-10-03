#!/usr/bin/env python3
"""
Script para popular o banco de dados com dados de exemplo
"""
import os
import sys
from datetime import datetime, timedelta
from pymongo import MongoClient
from dotenv import load_dotenv

# Carregar variáveis de ambiente
load_dotenv()

# Configurações do MongoDB
MONGODB_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017")
MONGODB_DB = os.getenv("MONGODB_DB", "sistema_chamados")


def connect_to_mongodb():
    """Conecta ao MongoDB"""
    try:
        client = MongoClient(MONGODB_URI)
        db = client[MONGODB_DB]
        
        # Testar conexão
        client.admin.command('ping')
        print("✅ Conectado ao MongoDB com sucesso")
        
        return client, db
    except Exception as e:
        print(f"❌ Erro ao conectar ao MongoDB: {e}")
        sys.exit(1)


def create_sample_incidents(db):
    """Cria incidentes de exemplo"""
    incidents = [
        {
            "numero": "INC-001",
            "titulo": "Problema na Fila P2K",
            "descricao": "Sistema apresentando lentidão nas consultas da fila P2K",
            "prioridade": "critica",
            "status": "em_andamento",
            "atribuido": "João Silva",
            "tipo_tarefa": "manutencao",
            "grupo_designado": "TI Infraestrutura",
            "local_problema": "fila_p2k",
            "incidente_vendas": True,
            "created_at": datetime.utcnow() - timedelta(hours=2),
            "updated_at": None
        },
        {
            "numero": "INC-002",
            "titulo": "Erro no SG5/URA222",
            "descricao": "Falha na conexão com o sistema SG5/URA222",
            "prioridade": "alta",
            "status": "aberto",
            "atribuido": "Maria Santos",
            "tipo_tarefa": "suporte",
            "grupo_designado": "TI Sistemas",
            "local_problema": "sg5_ura",
            "incidente_vendas": False,
            "created_at": datetime.utcnow() - timedelta(hours=1),
            "updated_at": None
        },
        {
            "numero": "INC-003",
            "titulo": "Alarme de CPU Alto",
            "descricao": "CPU do servidor de produção atingindo 95%",
            "prioridade": "alta",
            "status": "em_espera",
            "atribuido": "Carlos Oliveira",
            "tipo_tarefa": "monitoramento",
            "grupo_designado": "TI Monitoramento",
            "local_problema": "alarmes",
            "incidente_vendas": False,
            "created_at": datetime.utcnow() - timedelta(minutes=30),
            "updated_at": None
        },
        {
            "numero": "INC-004",
            "titulo": "Problema no TSK Vendas",
            "descricao": "Sistema de vendas apresentando falhas intermitentes",
            "prioridade": "critica",
            "status": "em_andamento",
            "atribuido": "Ana Costa",
            "tipo_tarefa": "investigacao",
            "grupo_designado": "TI Vendas",
            "local_problema": "tsk_vendas",
            "incidente_vendas": True,
            "created_at": datetime.utcnow() - timedelta(hours=4),
            "updated_at": None
        },
        {
            "numero": "INC-005",
            "titulo": "Falha no Sistema RIT",
            "descricao": "Sistema RIT não está respondendo às requisições",
            "prioridade": "media",
            "status": "aberto",
            "atribuido": "Pedro Lima",
            "tipo_tarefa": "suporte",
            "grupo_designado": "TI Sistemas",
            "local_problema": "rit",
            "incidente_vendas": False,
            "created_at": datetime.utcnow() - timedelta(minutes=15),
            "updated_at": None
        }
    ]
    
    try:
        # Inserir incidentes
        result = db.incidentes.insert_many(incidents)
        print(f"✅ {len(result.inserted_ids)} incidentes criados com sucesso")
        
        # Criar índices
        db.incidentes.create_index("numero", unique=True)
        db.incidentes.create_index("status")
        db.incidentes.create_index("prioridade")
        db.incidentes.create_index("grupo_designado")
        db.incidentes.create_index("created_at")
        
        print("✅ Índices dos incidentes criados")
        
    except Exception as e:
        print(f"❌ Erro ao criar incidentes: {e}")


def create_sample_changes(db):
    """Cria changes de exemplo"""
    changes = [
        {
            "numero": "CHG-001",
            "titulo": "Atualização de Segurança - Sistema P2K",
            "descricao": "Aplicação de patches de segurança críticos no sistema P2K",
            "tipo": "atualizacao",
            "prioridade": "alta",
            "status": "aprovada",
            "data_programada": datetime.utcnow() + timedelta(days=1, hours=2),
            "grupo_responsavel": "TI Infraestrutura",
            "impacto": "medio",
            "created_at": datetime.utcnow() - timedelta(days=1),
            "updated_at": None
        },
        {
            "numero": "CHG-002",
            "titulo": "Manutenção Preventiva - Servidores",
            "descricao": "Manutenção programada nos servidores de produção",
            "tipo": "manutencao",
            "prioridade": "media",
            "status": "pendente",
            "data_programada": datetime.utcnow() + timedelta(days=3, hours=4),
            "grupo_responsavel": "TI Infraestrutura",
            "impacto": "baixo",
            "created_at": datetime.utcnow() - timedelta(hours=6),
            "updated_at": None
        },
        {
            "numero": "CHG-003",
            "titulo": "Configuração de Backup",
            "descricao": "Configuração de novo sistema de backup automático",
            "tipo": "configuracao",
            "prioridade": "alta",
            "status": "em_execucao",
            "data_programada": datetime.utcnow(),
            "grupo_responsavel": "TI Dados",
            "impacto": "alto",
            "created_at": datetime.utcnow() - timedelta(days=2),
            "updated_at": None
        },
        {
            "numero": "CHG-004",
            "titulo": "Migração de Dados",
            "descricao": "Migração de dados do sistema legado para nova plataforma",
            "tipo": "migracao",
            "prioridade": "critica",
            "status": "pendente",
            "data_programada": datetime.utcnow() + timedelta(weeks=1),
            "grupo_responsavel": "TI Dados",
            "impacto": "critico",
            "created_at": datetime.utcnow() - timedelta(days=5),
            "updated_at": None
        }
    ]
    
    try:
        # Inserir changes
        result = db.changes.insert_many(changes)
        print(f"✅ {len(result.inserted_ids)} changes criadas com sucesso")
        
        # Criar índices
        db.changes.create_index("numero", unique=True)
        db.changes.create_index("status")
        db.changes.create_index("data_programada")
        db.changes.create_index("created_at")
        
        print("✅ Índices das changes criados")
        
    except Exception as e:
        print(f"❌ Erro ao criar changes: {e}")


def create_sample_users(db):
    """Cria usuários de exemplo"""
    users = [
        {
            "username": "joao.silva",
            "email": "joao.silva@empresa.com",
            "nome_completo": "João Silva",
            "grupo": "TI Infraestrutura",
            "ativo": True,
            "password": "senha123",  # Em produção, usar hash
            "created_at": datetime.utcnow() - timedelta(days=30),
            "updated_at": None,
            "last_login": datetime.utcnow() - timedelta(hours=2)
        },
        {
            "username": "maria.santos",
            "email": "maria.santos@empresa.com",
            "nome_completo": "Maria Santos",
            "grupo": "TI Sistemas",
            "ativo": True,
            "password": "senha123",
            "created_at": datetime.utcnow() - timedelta(days=25),
            "updated_at": None,
            "last_login": datetime.utcnow() - timedelta(hours=1)
        },
        {
            "username": "carlos.oliveira",
            "email": "carlos.oliveira@empresa.com",
            "nome_completo": "Carlos Oliveira",
            "grupo": "TI Monitoramento",
            "ativo": True,
            "password": "senha123",
            "created_at": datetime.utcnow() - timedelta(days=20),
            "updated_at": None,
            "last_login": datetime.utcnow() - timedelta(minutes=30)
        },
        {
            "username": "ana.costa",
            "email": "ana.costa@empresa.com",
            "nome_completo": "Ana Costa",
            "grupo": "TI Vendas",
            "ativo": True,
            "password": "senha123",
            "created_at": datetime.utcnow() - timedelta(days=15),
            "updated_at": None,
            "last_login": datetime.utcnow() - timedelta(hours=4)
        },
        {
            "username": "pedro.lima",
            "email": "pedro.lima@empresa.com",
            "nome_completo": "Pedro Lima",
            "grupo": "TI Sistemas",
            "ativo": False,
            "password": "senha123",
            "created_at": datetime.utcnow() - timedelta(days=10),
            "updated_at": None,
            "last_login": datetime.utcnow() - timedelta(days=2)
        }
    ]
    
    try:
        # Inserir usuários
        result = db.usuarios.insert_many(users)
        print(f"✅ {len(result.inserted_ids)} usuários criados com sucesso")
        
        # Criar índices
        db.usuarios.create_index("email", unique=True)
        db.usuarios.create_index("username", unique=True)
        
        print("✅ Índices dos usuários criados")
        
    except Exception as e:
        print(f"❌ Erro ao criar usuários: {e}")


def main():
    """Função principal"""
    print("🚀 Iniciando população do banco de dados...")
    print("=" * 50)
    
    try:
        # Conectar ao MongoDB
        client, db = connect_to_mongodb()
        
        # Limpar coleções existentes (opcional)
        clear_existing = input("Deseja limpar dados existentes? (s/N): ").lower()
        if clear_existing == 's':
            db.incidentes.delete_many({})
            db.changes.delete_many({})
            db.usuarios.delete_many({})
            print("🗑️ Dados existentes removidos")
        
        # Criar dados de exemplo
        print("\n📊 Criando dados de exemplo...")
        
        create_sample_incidents(db)
        create_sample_changes(db)
        create_sample_users(db)
        
        print("\n" + "=" * 50)
        print("✅ Banco de dados populado com sucesso!")
        print(f"📁 Banco: {MONGODB_DB}")
        print(f"🌐 URI: {MONGODB_URI}")
        print("\n💡 Agora você pode executar a aplicação com: python app.py")
        
        # Fechar conexão
        client.close()
        
    except KeyboardInterrupt:
        print("\n\n🛑 Operação interrompida pelo usuário")
    except Exception as e:
        print(f"\n\n❌ Erro durante a população do banco: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()
