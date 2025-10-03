"""
Rotas para gerenciamento de usuários
"""
from flask import Blueprint, request, jsonify
from services.user_service import UserService
from models.user_model import UserCreate, UserUpdate, UserLogin
from utils.error_handler import ErrorHandler, ValidationError, NotFoundError
from utils.validators import Validators
import logging

# Criar blueprint
user_bp = Blueprint('users', __name__, url_prefix='/api/usuarios')

# Instanciar serviço
user_service = UserService()


@user_bp.route('/', methods=['GET'])
def list_users():
    """Lista usuários com filtros opcionais"""
    try:
        # Extrair parâmetros de query
        filters = {}
        
        # Filtros de grupo
        if request.args.get('grupo'):
            filters['grupo'] = request.args.get('grupo')
        
        # Filtros de status
        if request.args.get('ativo'):
            ativo = request.args.get('ativo').lower()
            if ativo in ['true', 'false']:
                filters['ativo'] = ativo == 'true'
        
        # Filtros de busca por texto
        if request.args.get('search'):
            search_term = request.args.get('search')
            filters['nome_completo'] = search_term
        
        # Parâmetros de paginação
        page = int(request.args.get('page', 1))
        per_page = int(request.args.get('per_page', 50))
        
        # Validar parâmetros de paginação
        page, per_page = Validators.validate_pagination_params(page, per_page)
        
        # Calcular skip
        skip = (page - 1) * per_page
        
        # Buscar usuários
        users = user_service.get_users(filters, per_page, skip)
        
        # Contar total de usuários
        total = user_service.get_user_count(filters)
        
        # Log da operação
        logging.info(f"Listados {len(users)} usuários com filtros: {filters}")
        
        return jsonify({
            "data": [user.dict() for user in users],
            "pagination": {
                "page": page,
                "per_page": per_page,
                "total": total,
                "pages": (total + per_page - 1) // per_page
            },
            "filters": filters
        }), 200
        
    except Exception as e:
        logging.error(f"Erro ao listar usuários: {str(e)}")
        return jsonify(ErrorHandler.handle_generic_error(e)), 500


@user_bp.route('/', methods=['POST'])
def create_user():
    """Cria um novo usuário"""
    try:
        # Validar dados de entrada
        data = request.get_json()
        if not data:
            raise ValidationError("Dados do usuário são obrigatórios")
        
        # Criar modelo de validação
        user_data = UserCreate(**data)
        
        # Criar usuário
        created_user = user_service.create_user(user_data)
        
        # Log da operação
        logging.info(f"Usuário criado com sucesso: {created_user.username}")
        
        return jsonify({
            "message": "Usuário criado com sucesso",
            "data": created_user.dict()
        }), 201
        
    except ValidationError as e:
        return jsonify(ErrorHandler.handle_validation_error(e)), 400
    except ValueError as e:
        return jsonify(ErrorHandler.handle_value_error(e)), 400
    except Exception as e:
        logging.error(f"Erro ao criar usuário: {str(e)}")
        return jsonify(ErrorHandler.handle_generic_error(e)), 500


@user_bp.route('/<user_id>', methods=['GET'])
def get_user(user_id):
    """Busca um usuário específico por ID"""
    try:
        # Validar ID
        if not Validators.is_valid_object_id(user_id):
            raise ValidationError("ID de usuário inválido")
        
        # Buscar usuário
        user = user_service.get_user_by_id(user_id)
        
        if not user:
            raise NotFoundError("Usuário não encontrado")
        
        # Log da operação
        logging.info(f"Usuário consultado: {user.username}")
        
        return jsonify({
            "data": user.dict()
        }), 200
        
    except ValidationError as e:
        return jsonify(ErrorHandler.handle_validation_error(e)), 400
    except NotFoundError as e:
        return jsonify(ErrorHandler.handle_not_found_error(e)), 404
    except Exception as e:
        logging.error(f"Erro ao buscar usuário: {str(e)}")
        return jsonify(ErrorHandler.handle_generic_error(e)), 500


@user_bp.route('/<user_id>', methods=['PUT'])
def update_user(user_id):
    """Atualiza um usuário existente"""
    try:
        # Validar ID
        if not Validators.is_valid_object_id(user_id):
            raise ValidationError("ID de usuário inválido")
        
        # Validar dados de entrada
        data = request.get_json()
        if not data:
            raise ValidationError("Dados de atualização são obrigatórios")
        
        # Criar modelo de validação
        update_data = UserUpdate(**data)
        
        # Atualizar usuário
        updated_user = user_service.update_user(user_id, update_data)
        
        if not updated_user:
            raise NotFoundError("Usuário não encontrado")
        
        # Log da operação
        logging.info(f"Usuário atualizado: {updated_user.username}")
        
        return jsonify({
            "message": "Usuário atualizado com sucesso",
            "data": updated_user.dict()
        }), 200
        
    except ValidationError as e:
        return jsonify(ErrorHandler.handle_validation_error(e)), 400
    except ValueError as e:
        return jsonify(ErrorHandler.handle_value_error(e)), 400
    except NotFoundError as e:
        return jsonify(ErrorHandler.handle_not_found_error(e)), 404
    except Exception as e:
        logging.error(f"Erro ao atualizar usuário: {str(e)}")
        return jsonify(ErrorHandler.handle_generic_error(e)), 500


@user_bp.route('/<user_id>', methods=['DELETE'])
def delete_user(user_id):
    """Remove um usuário"""
    try:
        # Validar ID
        if not Validators.is_valid_object_id(user_id):
            raise ValidationError("ID de usuário inválido")
        
        # Deletar usuário
        deleted = user_service.delete_user(user_id)
        
        if not deleted:
            raise NotFoundError("Usuário não encontrado")
        
        # Log da operação
        logging.info(f"Usuário deletado: {user_id}")
        
        return jsonify({
            "message": "Usuário deletado com sucesso"
        }), 200
        
    except ValidationError as e:
        return jsonify(ErrorHandler.handle_validation_error(e)), 400
    except NotFoundError as e:
        return jsonify(ErrorHandler.handle_not_found_error(e)), 404
    except Exception as e:
        logging.error(f"Erro ao deletar usuário: {str(e)}")
        return jsonify(ErrorHandler.handle_generic_error(e)), 500


@user_bp.route('/<user_id>/activate', methods=['PATCH'])
def activate_user(user_id):
    """Ativa um usuário"""
    try:
        # Validar ID
        if not Validators.is_valid_object_id(user_id):
            raise ValidationError("ID de usuário inválido")
        
        # Criar modelo de atualização
        update_data = UserUpdate(ativo=True)
        
        # Atualizar usuário
        updated_user = user_service.update_user(user_id, update_data)
        
        if not updated_user:
            raise NotFoundError("Usuário não encontrado")
        
        # Log da operação
        logging.info(f"Usuário {updated_user.username} ativado")
        
        return jsonify({
            "message": "Usuário ativado com sucesso",
            "data": updated_user.dict()
        }), 200
        
    except ValidationError as e:
        return jsonify(ErrorHandler.handle_validation_error(e)), 400
    except NotFoundError as e:
        return jsonify(ErrorHandler.handle_not_found_error(e)), 404
    except Exception as e:
        logging.error(f"Erro ao ativar usuário: {str(e)}")
        return jsonify(ErrorHandler.handle_generic_error(e)), 500


@user_bp.route('/<user_id>/deactivate', methods=['PATCH'])
def deactivate_user(user_id):
    """Desativa um usuário"""
    try:
        # Validar ID
        if not Validators.is_valid_object_id(user_id):
            raise ValidationError("ID de usuário inválido")
        
        # Criar modelo de atualização
        update_data = UserUpdate(ativo=False)
        
        # Atualizar usuário
        updated_user = user_service.update_user(user_id, update_data)
        
        if not updated_user:
            raise NotFoundError("Usuário não encontrado")
        
        # Log da operação
        logging.info(f"Usuário {updated_user.username} desativado")
        
        return jsonify({
            "message": "Usuário desativado com sucesso",
            "data": updated_user.dict()
        }), 200
        
    except ValidationError as e:
        return jsonify(ErrorHandler.handle_validation_error(e)), 400
    except NotFoundError as e:
        return jsonify(ErrorHandler.handle_not_found_error(e)), 404
    except Exception as e:
        logging.error(f"Erro ao desativar usuário: {str(e)}")
        return jsonify(ErrorHandler.handle_generic_error(e)), 500


@user_bp.route('/<user_id>/change-password', methods=['PATCH'])
def change_user_password(user_id):
    """Altera a senha de um usuário"""
    try:
        # Validar ID
        if not Validators.is_valid_object_id(user_id):
            raise ValidationError("ID de usuário inválido")
        
        # Validar dados de entrada
        data = request.get_json()
        if not data:
            raise ValidationError("Dados de alteração de senha são obrigatórios")
        
        # Validar campos obrigatórios
        if 'current_password' not in data or 'new_password' not in data:
            raise ValidationError("current_password e new_password são obrigatórios")
        
        if len(data['new_password']) < 6:
            raise ValidationError("Nova senha deve ter pelo menos 6 caracteres")
        
        # Alterar senha
        changed = user_service.change_password(
            user_id, 
            data['current_password'], 
            data['new_password']
        )
        
        if not changed:
            raise NotFoundError("Usuário não encontrado")
        
        # Log da operação
        logging.info(f"Senha do usuário {user_id} alterada")
        
        return jsonify({
            "message": "Senha alterada com sucesso"
        }), 200
        
    except ValidationError as e:
        return jsonify(ErrorHandler.handle_validation_error(e)), 400
    except NotFoundError as e:
        return jsonify(ErrorHandler.handle_not_found_error(e)), 404
    except Exception as e:
        logging.error(f"Erro ao alterar senha: {str(e)}")
        return jsonify(ErrorHandler.handle_generic_error(e)), 500


@user_bp.route('/login', methods=['POST'])
def login_user():
    """Autentica um usuário"""
    try:
        # Validar dados de entrada
        data = request.get_json()
        if not data:
            raise ValidationError("Dados de login são obrigatórios")
        
        # Criar modelo de validação
        login_data = UserLogin(**data)
        
        # Autenticar usuário
        authenticated_user = user_service.authenticate_user(
            login_data.username, 
            login_data.password
        )
        
        if not authenticated_user:
            return jsonify({
                "error": "Credenciais inválidas",
                "message": "Usuário ou senha incorretos",
                "type": "authentication_error"
            }), 401
        
        # Log da operação
        logging.info(f"Usuário {authenticated_user.username} autenticado com sucesso")
        
        return jsonify({
            "message": "Login realizado com sucesso",
            "data": authenticated_user.dict()
        }), 200
        
    except ValidationError as e:
        return jsonify(ErrorHandler.handle_validation_error(e)), 400
    except Exception as e:
        logging.error(f"Erro no login: {str(e)}")
        return jsonify(ErrorHandler.handle_generic_error(e)), 500


@user_bp.route('/profile', methods=['GET'])
def get_user_profile():
    """Retorna o perfil do usuário autenticado (placeholder para autenticação)"""
    try:
        # TODO: Implementar autenticação real
        # Por enquanto, retorna erro de não autorizado
        
        return jsonify({
            "error": "Não autorizado",
            "message": "Autenticação necessária",
            "type": "unauthorized"
        }), 401
        
    except Exception as e:
        logging.error(f"Erro ao buscar perfil: {str(e)}")
        return jsonify(ErrorHandler.handle_generic_error(e)), 500


@user_bp.route('/stats/summary', methods=['GET'])
def get_user_summary():
    """Retorna resumo estatístico dos usuários"""
    try:
        # Buscar estatísticas
        stats = user_service.get_dashboard_stats()
        
        # Log da operação
        logging.info("Estatísticas de usuários consultadas")
        
        return jsonify({
            "data": stats
        }), 200
        
    except Exception as e:
        logging.error(f"Erro ao buscar estatísticas: {str(e)}")
        return jsonify(ErrorHandler.handle_generic_error(e)), 500


@user_bp.route('/groups', methods=['GET'])
def get_user_groups():
    """Retorna lista de grupos disponíveis"""
    try:
        groups = [
            'TI Infraestrutura',
            'TI Sistemas', 
            'TI Vendas',
            'TI Monitoramento',
            'TI Dados',
            'TI Segurança',
            'TI Integração'
        ]
        
        # Log da operação
        logging.info("Grupos de usuários consultados")
        
        return jsonify({
            "data": groups
        }), 200
        
    except Exception as e:
        logging.error(f"Erro ao buscar grupos: {str(e)}")
        return jsonify(ErrorHandler.handle_generic_error(e)), 500
