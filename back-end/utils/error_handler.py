"""
Handler global de erros para a aplicação
"""
from flask import jsonify, request
from werkzeug.exceptions import HTTPException
import logging
from typing import Union, Dict, Any


class ErrorHandler:
    """Classe para gerenciar erros da aplicação"""
    
    @staticmethod
    def handle_validation_error(error: Exception) -> tuple[Dict[str, Any], int]:
        """Trata erros de validação do Pydantic"""
        error_message = str(error)
        
        # Log do erro
        logging.warning(f"Erro de validação: {error_message} - Request: {request.url}")
        
        return {
            "error": "Erro de validação",
            "message": error_message,
            "type": "validation_error"
        }, 400
    
    @staticmethod
    def handle_value_error(error: ValueError) -> tuple[Dict[str, Any], int]:
        """Trata erros de valor"""
        error_message = str(error)
        
        # Log do erro
        logging.warning(f"Erro de valor: {error_message} - Request: {request.url}")
        
        return {
            "error": "Erro de valor",
            "message": error_message,
            "type": "value_error"
        }, 400
    
    @staticmethod
    def handle_not_found_error(error: Exception) -> tuple[Dict[str, Any], int]:
        """Trata erros de recurso não encontrado"""
        error_message = str(error)
        
        # Log do erro
        logging.info(f"Recurso não encontrado: {error_message} - Request: {request.url}")
        
        return {
            "error": "Recurso não encontrado",
            "message": error_message,
            "type": "not_found"
        }, 404
    
    @staticmethod
    def handle_database_error(error: Exception) -> tuple[Dict[str, Any], int]:
        """Trata erros de banco de dados"""
        error_message = str(error)
        
        # Log do erro
        logging.error(f"Erro de banco de dados: {error_message} - Request: {request.url}")
        
        return {
            "error": "Erro interno do servidor",
            "message": "Erro ao acessar banco de dados",
            "type": "database_error"
        }, 500
    
    @staticmethod
    def handle_generic_error(error: Exception) -> tuple[Dict[str, Any], int]:
        """Trata erros genéricos"""
        error_message = str(error)
        
        # Log do erro
        logging.error(f"Erro genérico: {error_message} - Request: {request.url}")
        
        return {
            "error": "Erro interno do servidor",
            "message": "Ocorreu um erro inesperado",
            "type": "internal_error"
        }, 500
    
    @staticmethod
    def handle_http_exception(error: HTTPException) -> tuple[Dict[str, Any], int]:
        """Trata exceções HTTP do Werkzeug"""
        error_message = error.description or str(error)
        
        # Log do erro
        logging.warning(f"Erro HTTP {error.code}: {error_message} - Request: {request.url}")
        
        return {
            "error": error.name,
            "message": error_message,
            "type": "http_error",
            "code": error.code
        }, error.code
    
    @staticmethod
    def register_error_handlers(app):
        """Registra todos os handlers de erro na aplicação Flask"""
        
        @app.errorhandler(400)
        def bad_request(error):
            return jsonify({
                "error": "Requisição inválida",
                "message": "Os dados enviados estão incorretos",
                "type": "bad_request"
            }), 400
        
        @app.errorhandler(401)
        def unauthorized(error):
            return jsonify({
                "error": "Não autorizado",
                "message": "Autenticação necessária",
                "type": "unauthorized"
            }), 401
        
        @app.errorhandler(403)
        def forbidden(error):
            return jsonify({
                "error": "Proibido",
                "message": "Acesso negado",
                "type": "forbidden"
            }), 403
        
        @app.errorhandler(404)
        def not_found(error):
            return jsonify({
                "error": "Não encontrado",
                "message": "O recurso solicitado não foi encontrado",
                "type": "not_found"
            }), 404
        
        @app.errorhandler(405)
        def method_not_allowed(error):
            return jsonify({
                "error": "Método não permitido",
                "message": "O método HTTP não é suportado para este recurso",
                "type": "method_not_allowed"
            }), 405
        
        @app.errorhandler(422)
        def unprocessable_entity(error):
            return jsonify({
                "error": "Entidade não processável",
                "message": "Os dados enviados não podem ser processados",
                "type": "unprocessable_entity"
            }), 422
        
        @app.errorhandler(429)
        def too_many_requests(error):
            return jsonify({
                "error": "Muitas requisições",
                "message": "Limite de requisições excedido",
                "type": "too_many_requests"
            }), 429
        
        @app.errorhandler(500)
        def internal_server_error(error):
            return jsonify({
                "error": "Erro interno do servidor",
                "message": "Ocorreu um erro inesperado",
                "type": "internal_error"
            }), 500
        
        @app.errorhandler(Exception)
        def handle_exception(error):
            """Handler genérico para exceções não tratadas"""
            app.logger.error(f"Exceção não tratada: {str(error)}")
            
            return jsonify({
                "error": "Erro interno do servidor",
                "message": "Ocorreu um erro inesperado",
                "type": "unhandled_exception"
            }), 500


class APIError(Exception):
    """Classe base para erros da API"""
    
    def __init__(self, message: str, status_code: int = 400, error_type: str = "api_error"):
        super().__init__(message)
        self.message = message
        self.status_code = status_code
        self.error_type = error_type
    
    def to_dict(self) -> Dict[str, Any]:
        """Converte o erro para dicionário"""
        return {
            "error": self.error_type,
            "message": self.message,
            "type": "api_error"
        }


class ValidationError(APIError):
    """Erro de validação"""
    
    def __init__(self, message: str):
        super().__init__(message, 400, "validation_error")


class NotFoundError(APIError):
    """Erro de recurso não encontrado"""
    
    def __init__(self, message: str):
        super().__init__(message, 404, "not_found")


class DatabaseError(APIError):
    """Erro de banco de dados"""
    
    def __init__(self, message: str):
        super().__init__(message, 500, "database_error")
