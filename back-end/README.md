# 🚀 Sistema de Chamados - Back-end Refatorado

Back-end moderno e escalável para o Sistema de Chamados, construído com Flask, PyMongo e arquitetura modular.

## 🏗️ Arquitetura

```
backend/
├── app.py                    # Ponto de entrada da aplicação
├── config.py                 # Configurações usando Pydantic Settings
├── extensions.py             # Inicialização de extensões (MongoDB, CORS, Logging)
├── models/                   # Modelos de dados usando Pydantic
│   ├── __init__.py
│   ├── incident_model.py     # Modelo de incidentes
│   ├── change_model.py       # Modelo de changes
│   └── user_model.py         # Modelo de usuários
├── services/                 # Camada de serviços (lógica de negócio)
│   ├── __init__.py
│   ├── incident_service.py   # Serviços de incidentes
│   ├── change_service.py     # Serviços de changes
│   └── user_service.py       # Serviços de usuários
├── routes/                   # Blueprints de rotas
│   ├── __init__.py
│   ├── incident_routes.py    # Rotas de incidentes
│   ├── change_routes.py      # Rotas de changes
│   ├── user_routes.py        # Rotas de usuários
│   └── dashboard_routes.py   # Rotas do dashboard
├── utils/                    # Utilitários e helpers
│   ├── __init__.py
│   ├── error_handler.py      # Handler global de erros
│   └── validators.py         # Funções de validação
├── requirements.txt          # Dependências Python
├── env_example.txt           # Exemplo de variáveis de ambiente
├── populate_database.py      # Script para popular banco com dados de exemplo
└── README.md                 # Este arquivo
```

## ✨ Funcionalidades

### 🎯 **Incidentes**
- ✅ CRUD completo (Create, Read, Update, Delete)
- ✅ Filtros dinâmicos por fila, prioridade, status, grupo
- ✅ Paginação e ordenação
- ✅ Validação de dados com Pydantic
- ✅ Geração automática de números sequenciais
- ✅ Atualização de status e atribuição de responsáveis

### 🔄 **Changes**
- ✅ CRUD completo
- ✅ Filtros por tipo, prioridade, status, impacto
- ✅ Workflow de aprovação e execução
- ✅ Programação de datas
- ✅ Controle de impacto

### 👥 **Usuários**
- ✅ CRUD completo
- ✅ Autenticação básica (preparado para expansão)
- ✅ Controle de grupos e permissões
- ✅ Ativação/desativação de usuários
- ✅ Alteração de senhas

### 📊 **Dashboard**
- ✅ Visão geral do sistema
- ✅ Estatísticas por módulo
- ✅ Métricas de SLA
- ✅ Alertas automáticos
- ✅ Health check do sistema

## 🛠️ Tecnologias

- **Flask 3.0.0** - Framework web
- **PyMongo 4.6.0** - Driver MongoDB
- **Pydantic 2.5.0** - Validação de dados
- **Python-dotenv** - Variáveis de ambiente
- **Flask-CORS** - Cross-Origin Resource Sharing

## 📋 Pré-requisitos

- Python 3.7+
- MongoDB 4.4+
- pip (gerenciador de pacotes Python)

## 🚀 Instalação e Configuração

### 1. **Clonar e Configurar**
```bash
cd back-end
python -m venv venv
source venv/bin/activate  # Linux/Mac
# ou
venv\Scripts\activate     # Windows
```

### 2. **Instalar Dependências**
```bash
pip install -r requirements.txt
```

### 3. **Configurar Variáveis de Ambiente**
```bash
# Copiar arquivo de exemplo
cp env_example.txt .env

# Editar .env com suas configurações
MONGODB_URI=mongodb://localhost:27017
MONGODB_DB=sistema_chamados
DEBUG=true
SECRET_KEY=sua-chave-secreta-aqui
```

### 4. **Iniciar MongoDB**
```bash
# Certifique-se de que o MongoDB está rodando
mongod
```

### 5. **Popular Banco com Dados de Exemplo**
```bash
python populate_database.py
```

### 6. **Executar Aplicação**
```bash
python app.py
```

## 🌐 Endpoints da API

### **Incidentes**
```
GET    /api/incidentes              # Listar incidentes com filtros
POST   /api/incidentes              # Criar novo incidente
GET    /api/incidentes/{id}         # Buscar incidente por ID
PUT    /api/incidentes/{id}         # Atualizar incidente
DELETE /api/incidentes/{id}         # Remover incidente
PATCH  /api/incidentes/{id}/status  # Atualizar status
PATCH  /api/incidentes/{id}/assign  # Atribuir responsável
GET    /api/incidentes/stats/summary # Estatísticas
```

### **Changes**
```
GET    /api/changes                 # Listar changes com filtros
POST   /api/changes                 # Criar nova change
GET    /api/changes/{id}            # Buscar change por ID
PUT    /api/changes/{id}            # Atualizar change
DELETE /api/changes/{id}            # Remover change
PATCH  /api/changes/{id}/status     # Atualizar status
PATCH  /api/changes/{id}/approve    # Aprovar change
PATCH  /api/changes/{id}/start      # Iniciar execução
PATCH  /api/changes/{id}/complete   # Marcar como concluída
GET    /api/changes/upcoming        # Changes programadas
GET    /api/changes/stats/summary   # Estatísticas
```

### **Usuários**
```
GET    /api/usuarios                # Listar usuários com filtros
POST   /api/usuarios                # Criar novo usuário
GET    /api/usuarios/{id}           # Buscar usuário por ID
PUT    /api/usuarios/{id}           # Atualizar usuário
DELETE /api/usuarios/{id}           # Remover usuário
PATCH  /api/usuarios/{id}/activate  # Ativar usuário
PATCH  /api/usuarios/{id}/deactivate # Desativar usuário
PATCH  /api/usuarios/{id}/change-password # Alterar senha
POST   /api/usuarios/login          # Autenticar usuário
GET    /api/usuarios/groups         # Listar grupos disponíveis
GET    /api/usuarios/stats/summary  # Estatísticas
```

### **Dashboard**
```
GET    /api/dashboard/overview      # Visão geral
GET    /api/dashboard/incidentes    # Dashboard de incidentes
GET    /api/dashboard/changes       # Dashboard de changes
GET    /api/dashboard/usuarios      # Dashboard de usuários
GET    /api/dashboard/trends        # Tendências (futuro)
GET    /api/dashboard/alerts        # Alertas do sistema
GET    /api/dashboard/metrics       # Métricas específicas
GET    /api/dashboard/health        # Status de saúde
```

## 🔍 Exemplos de Uso

### **Filtrar Incidentes**
```bash
# Por fila
GET /api/incidentes?fila=P2K

# Por prioridade
GET /api/incidentes?prioridade=Crítico

# Por status
GET /api/incidentes?status=Em andamento

# Combinar filtros
GET /api/incidentes?fila=P2K&prioridade=Crítico&status=Em andamento

# Com paginação
GET /api/incidentes?page=1&per_page=10
```

### **Criar Incidente**
```bash
POST /api/incidentes
Content-Type: application/json

{
  "titulo": "Problema na Fila P2K",
  "descricao": "Sistema apresentando lentidão",
  "prioridade": "alta",
  "status": "aberto",
  "tipo_tarefa": "manutencao",
  "grupo_designado": "TI Infraestrutura",
  "local_problema": "fila_p2k",
  "incidente_vendas": true
}
```

### **Atualizar Status**
```bash
PATCH /api/incidentes/INC-001/status
Content-Type: application/json

{
  "status": "em_andamento"
}
```

## 🧪 Testando a API

### **1. Teste Básico**
```bash
# Health check
curl http://localhost:5000/health

# Informações da API
curl http://localhost:5000/api

# Listar incidentes
curl http://localhost:5000/api/incidentes
```

### **2. Teste com Filtros**
```bash
# Filtrar por fila
curl "http://localhost:5000/api/incidentes?fila=P2K"

# Filtrar por prioridade
curl "http://localhost:5000/api/incidentes?prioridade=Crítico"

# Combinar filtros
curl "http://localhost:5000/api/incidentes?fila=P2K&prioridade=Crítico"
```

### **3. Teste de Criação**
```bash
curl -X POST http://localhost:5000/api/incidentes \
  -H "Content-Type: application/json" \
  -d '{
    "titulo": "Teste via API",
    "descricao": "Incidente de teste",
    "prioridade": "media",
    "status": "aberto",
    "tipo_tarefa": "teste",
    "grupo_designado": "TI Sistemas"
  }'
```

## 📊 Estrutura do Banco de Dados

### **Coleção: incidentes**
```json
{
  "_id": "ObjectId",
  "numero": "INC-001",
  "titulo": "String",
  "descricao": "String",
  "prioridade": "critica|alta|media|baixa",
  "status": "aberto|em_andamento|em_espera|resolvido|fechado|tks_remoto",
  "atribuido": "String",
  "tipo_tarefa": "manutencao|suporte|configuracao|atualizacao|investigacao",
  "grupo_designado": "String",
  "local_problema": "String",
  "incidente_vendas": "Boolean",
  "created_at": "DateTime",
  "updated_at": "DateTime"
}
```

### **Coleção: changes**
```json
{
  "_id": "ObjectId",
  "numero": "CHG-001",
  "titulo": "String",
  "descricao": "String",
  "tipo": "manutencao|atualizacao|configuracao|migracao|correcao",
  "prioridade": "critica|alta|media|baixa",
  "status": "pendente|aprovada|em_execucao|concluida|cancelada",
  "data_programada": "DateTime",
  "grupo_responsavel": "String",
  "impacto": "baixo|medio|alto|critico",
  "created_at": "DateTime",
  "updated_at": "DateTime"
}
```

### **Coleção: usuarios**
```json
{
  "_id": "ObjectId",
  "username": "String",
  "email": "String",
  "nome_completo": "String",
  "grupo": "String",
  "ativo": "Boolean",
  "password": "String",
  "created_at": "DateTime",
  "updated_at": "DateTime",
  "last_login": "DateTime"
}
```

## 🔧 Configurações Avançadas

### **Variáveis de Ambiente**
```bash
# MongoDB
MONGODB_URI=mongodb://localhost:27017
MONGODB_DB=sistema_chamados

# Aplicação
APP_NAME=Sistema de Chamados API
DEBUG=true
SECRET_KEY=sua-chave-secreta

# CORS
CORS_ORIGINS=["http://localhost:3000", "http://localhost:5173"]

# Logging
LOG_LEVEL=INFO
LOG_FORMAT=%(asctime)s - %(name)s - %(levelname)s - %(message)s
```

### **Configurações de MongoDB**
```python
MONGODB_SETTINGS = {
    'host': 'mongodb://localhost:27017',
    'db': 'sistema_chamados',
    'connect': False,
    'maxPoolSize': 10,
    'serverSelectionTimeoutMS': 5000,
    'socketTimeoutMS': 2000,
    'connectTimeoutMS': 2000,
}
```

## 🚀 Próximos Passos

### **Funcionalidades Planejadas**
- [ ] Autenticação JWT
- [ ] Autorização baseada em roles
- [ ] Rate limiting
- [ ] Cache com Redis
- [ ] Logs estruturados
- [ ] Métricas com Prometheus
- [ ] Documentação OpenAPI/Swagger
- [ ] Testes automatizados
- [ ] CI/CD pipeline

### **Melhorias de Performance**
- [ ] Índices otimizados
- [ ] Agregações MongoDB
- [ ] Paginação eficiente
- [ ] Compressão de respostas

### **Segurança**
- [ ] Validação de entrada robusta
- [ ] Sanitização de dados
- [ ] Headers de segurança
- [ ] Auditoria de ações

## 🐛 Solução de Problemas

### **Erro de Conexão MongoDB**
```bash
# Verificar se o MongoDB está rodando
mongod --version
systemctl status mongod  # Linux
brew services list       # Mac
```

### **Erro de Dependências**
```bash
# Atualizar pip
pip install --upgrade pip

# Reinstalar dependências
pip uninstall -r requirements.txt
pip install -r requirements.txt
```

### **Erro de Porta**
```bash
# Verificar se a porta 5000 está livre
lsof -i :5000
netstat -an | grep 5000
```

## 📚 Documentação Adicional

- [Flask Documentation](https://flask.palletsprojects.com/)
- [PyMongo Documentation](https://pymongo.readthedocs.io/)
- [Pydantic Documentation](https://pydantic-docs.helpmanual.io/)
- [MongoDB Documentation](https://docs.mongodb.com/)

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 📞 Suporte

Para suporte e dúvidas:
- Abra uma issue no repositório
- Entre em contato com a equipe de desenvolvimento

---

**Desenvolvido com ❤️ pela equipe de TI**
