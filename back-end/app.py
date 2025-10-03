"""
Aplicação principal Flask - Sistema de Chamados
"""
from flask import Flask, jsonify
from config import FlaskConfig, settings
from extensions import init_extensions, close_mongodb
from routes import incident_bp, change_bp, user_bp, dashboard_bp
from utils.error_handler import ErrorHandler
import atexit
import logging

def create_app():
    """Factory function para criar a aplicação Flask"""
    
    # Criar aplicação Flask
    app = Flask(__name__)
    
    # Configurar aplicação
    app.config.from_object(FlaskConfig)
    
    # Inicializar extensões
    init_extensions(app)
    
    # Registrar blueprints
    app.register_blueprint(incident_bp)
    app.register_blueprint(change_bp)
    app.register_blueprint(user_bp)
    app.register_blueprint(dashboard_bp)
    
    # Registrar handlers de erro
    ErrorHandler.register_error_handlers(app)
    
    # Rota raiz
    @app.route('/')
    def root():
        """Rota raiz da aplicação"""
        return jsonify({
            "message": f"Bem-vindo ao {settings.APP_NAME}",
            "version": "1.0.0",
            "status": "operational",
            "endpoints": {
                "incidentes": "/api/incidentes",
                "changes": "/api/changes",
                "usuarios": "/api/usuarios",
                "dashboard": "/api/dashboard"
            },
            "documentation": "Consulte a documentação da API para mais detalhes"
        })
    
    # Rota de health check
    @app.route('/health')
    def health_check():
        """Health check da aplicação"""
        return jsonify({
            "status": "healthy",
            "service": settings.APP_NAME,
            "version": "1.0.0"
        })
    
    # Rota de informações da API
    @app.route('/api')
    def api_info():
        """Informações sobre a API"""
        return jsonify({
            "api_name": f"{settings.APP_NAME} API",
            "version": "1.0.0",
            "description": "API REST para gerenciamento de incidentes, changes e usuários",
            "endpoints": {
                "incidentes": {
                    "base_url": "/api/incidentes",
                    "methods": ["GET", "POST", "PUT", "DELETE", "PATCH"],
                    "description": "Gerenciamento de incidentes"
                },
                "changes": {
                    "base_url": "/api/changes",
                    "methods": ["GET", "POST", "PUT", "DELETE", "PATCH"],
                    "description": "Gerenciamento de changes"
                },
                "usuarios": {
                    "base_url": "/api/usuarios",
                    "methods": ["GET", "POST", "PUT", "DELETE", "PATCH"],
                    "description": "Gerenciamento de usuários"
                },
                "dashboard": {
                    "base_url": "/api/dashboard",
                    "methods": ["GET"],
                    "description": "Métricas e estatísticas do sistema"
                }
            },
            "authentication": "Será implementado em versões futuras",
            "rate_limiting": "Será implementado em versões futuras"
        })
    
    # Rota de erro 404 personalizada
    @app.errorhandler(404)
    def not_found(error):
        """Handler para rotas não encontradas"""
        return jsonify({
            "error": "Endpoint não encontrado",
            "message": "A rota solicitada não existe",
            "available_endpoints": [
                "/",
                "/health",
                "/api",
                "/api/incidentes",
                "/api/changes",
                "/api/usuarios",
                "/api/dashboard"
            ]
        }), 404
    
    # Rota de erro 405 personalizada
    @app.errorhandler(405)
    def method_not_allowed(error):
        return jsonify({
            "error": "Método não permitido",
            "message": "O método HTTP usado não é suportado para este endpoint",
            "allowed_methods": error.valid_methods if hasattr(error, 'valid_methods') else []
        }), 405
    
    # Log de inicialização
    app.logger.info(f"🚀 {settings.APP_NAME} inicializado com sucesso")
    app.logger.info(f"📊 Modo Debug: {settings.DEBUG}")
    app.logger.info(f"🗄️ Banco de dados: {settings.MONGODB_DB}")
    app.logger.info(f"🌐 CORS Origins: {settings.CORS_ORIGINS}")
    
    return app


def main():
    
    try:
        # Criar aplicação
        app = create_app()
        
        # Configurar callback para fechar conexões ao sair
        atexit.register(close_mongodb)
        
        # Executar aplicação
        app.run(
            host='0.0.0.0',
            port=5000,
            debug=settings.DEBUG,
            use_reloader=False  # Desabilitar reloader para evitar problemas com MongoDB
        )
        
    except KeyboardInterrupt:
        print("\n🛑 Aplicação interrompida pelo usuário")
        close_mongodb()
    except Exception as e:
        print(f"❌ Erro ao executar aplicação: {e}")
        logging.error(f"Erro fatal na aplicação: {e}")
        close_mongodb()
        raise


if __name__ == '__main__':
    main()

