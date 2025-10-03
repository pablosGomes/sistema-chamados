"""
Rotas para gerenciamento de changes
"""
from flask import Blueprint, request, jsonify
from services.change_service import ChangeService
from models.change_model import ChangeCreate, ChangeUpdate
from utils.error_handler import ErrorHandler, ValidationError, NotFoundError
from utils.validators import Validators
import logging

# Criar blueprint
change_bp = Blueprint('changes', __name__, url_prefix='/api/changes')

# Instanciar serviço
change_service = ChangeService()


@change_bp.route('/', methods=['GET'])
def list_changes():
    """Lista changes com filtros opcionais"""
    try:
        # Extrair parâmetros de query
        filters = {}
        
        # Filtros de tipo
        if request.args.get('tipo'):
            filters['tipo'] = request.args.get('tipo')
        
        # Filtros de prioridade
        if request.args.get('prioridade'):
            filters['prioridade'] = request.args.get('prioridade')
        
        # Filtros de status
        if request.args.get('status'):
            filters['status'] = request.args.get('status')
        
        # Filtros de grupo
        if request.args.get('grupo_responsavel'):
            filters['grupo_responsavel'] = request.args.get('grupo_responsavel')
        
        # Filtros de impacto
        if request.args.get('impacto'):
            filters['impacto'] = request.args.get('impacto')
        
        # Parâmetros de paginação
        page = int(request.args.get('page', 1))
        per_page = int(request.args.get('per_page', 50))
        
        # Validar parâmetros de paginação
        page, per_page = Validators.validate_pagination_params(page, per_page)
        
        # Calcular skip
        skip = (page - 1) * per_page
        
        # Buscar changes
        changes = change_service.get_changes(filters, per_page, skip)
        
        # Contar total de changes
        total = change_service.get_change_count(filters)
        
        # Log da operação
        logging.info(f"Listadas {len(changes)} changes com filtros: {filters}")
        
        return jsonify({
            "data": [change.dict() for change in changes],
            "pagination": {
                "page": page,
                "per_page": per_page,
                "total": total,
                "pages": (total + per_page - 1) // per_page
            },
            "filters": filters
        }), 200
        
    except Exception as e:
        logging.error(f"Erro ao listar changes: {str(e)}")
        return jsonify(ErrorHandler.handle_generic_error(e)), 500


@change_bp.route('/', methods=['POST'])
def create_change():
    """Cria uma nova change"""
    try:
        # Validar dados de entrada
        data = request.get_json()
        if not data:
            raise ValidationError("Dados da change são obrigatórios")
        
        # Criar modelo de validação
        change_data = ChangeCreate(**data)
        
        # Criar change
        created_change = change_service.create_change(change_data)
        
        # Log da operação
        logging.info(f"Change criada com sucesso: {created_change.numero}")
        
        return jsonify({
            "message": "Change criada com sucesso",
            "data": created_change.dict()
        }), 201
        
    except ValidationError as e:
        return jsonify(ErrorHandler.handle_validation_error(e)), 400
    except ValueError as e:
        return jsonify(ErrorHandler.handle_value_error(e)), 400
    except Exception as e:
        logging.error(f"Erro ao criar change: {str(e)}")
        return jsonify(ErrorHandler.handle_generic_error(e)), 500


@change_bp.route('/<change_id>', methods=['GET'])
def get_change(change_id):
    """Busca uma change específica por ID"""
    try:
        # Validar ID
        if not Validators.is_valid_object_id(change_id):
            raise ValidationError("ID de change inválido")
        
        # Buscar change
        change = change_service.get_change_by_id(change_id)
        
        if not change:
            raise NotFoundError("Change não encontrada")
        
        # Log da operação
        logging.info(f"Change consultada: {change.numero}")
        
        return jsonify({
            "data": change.dict()
        }), 200
        
    except ValidationError as e:
        return jsonify(ErrorHandler.handle_validation_error(e)), 400
    except NotFoundError as e:
        return jsonify(ErrorHandler.handle_not_found_error(e)), 404
    except Exception as e:
        logging.error(f"Erro ao buscar change: {str(e)}")
        return jsonify(ErrorHandler.handle_generic_error(e)), 500


@change_bp.route('/<change_id>', methods=['PUT'])
def update_change(change_id):
    """Atualiza uma change existente"""
    try:
        # Validar ID
        if not Validators.is_valid_object_id(change_id):
            raise ValidationError("ID de change inválido")
        
        # Validar dados de entrada
        data = request.get_json()
        if not data:
            raise ValidationError("Dados de atualização são obrigatórios")
        
        # Criar modelo de validação
        update_data = ChangeUpdate(**data)
        
        # Atualizar change
        updated_change = change_service.update_change(change_id, update_data)
        
        if not updated_change:
            raise NotFoundError("Change não encontrada")
        
        # Log da operação
        logging.info(f"Change atualizada: {updated_change.numero}")
        
        return jsonify({
            "message": "Change atualizada com sucesso",
            "data": updated_change.dict()
        }), 200
        
    except ValidationError as e:
        return jsonify(ErrorHandler.handle_validation_error(e)), 400
    except ValueError as e:
        return jsonify(ErrorHandler.handle_value_error(e)), 400
    except NotFoundError as e:
        return jsonify(ErrorHandler.handle_not_found_error(e)), 404
    except Exception as e:
        logging.error(f"Erro ao atualizar change: {str(e)}")
        return jsonify(ErrorHandler.handle_generic_error(e)), 500


@change_bp.route('/<change_id>', methods=['DELETE'])
def delete_change(change_id):
    """Remove uma change"""
    try:
        # Validar ID
        if not Validators.is_valid_object_id(change_id):
            raise ValidationError("ID de change inválido")
        
        # Deletar change
        deleted = change_service.delete_change(change_id)
        
        if not deleted:
            raise NotFoundError("Change não encontrada")
        
        # Log da operação
        logging.info(f"Change deletada: {change_id}")
        
        return jsonify({
            "message": "Change deletada com sucesso"
        }), 200
        
    except ValidationError as e:
        return jsonify(ErrorHandler.handle_validation_error(e)), 400
    except NotFoundError as e:
        return jsonify(ErrorHandler.handle_not_found_error(e)), 404
    except Exception as e:
        logging.error(f"Erro ao deletar change: {str(e)}")
        return jsonify(ErrorHandler.handle_generic_error(e)), 500


@change_bp.route('/<change_id>/status', methods=['PATCH'])
def update_change_status(change_id):
    """Atualiza apenas o status de uma change"""
    try:
        # Validar ID
        if not Validators.is_valid_object_id(change_id):
            raise ValidationError("ID de change inválido")
        
        # Validar dados de entrada
        data = request.get_json()
        if not data or 'status' not in data:
            raise ValidationError("Status é obrigatório")
        
        # Validar status
        new_status = data['status']
        if not Validators.is_valid_change_status(new_status):
            raise ValidationError(f"Status inválido: {new_status}")
        
        # Criar modelo de atualização
        update_data = ChangeUpdate(status=new_status)
        
        # Atualizar change
        updated_change = change_service.update_change(change_id, update_data)
        
        if not updated_change:
            raise NotFoundError("Change não encontrada")
        
        # Log da operação
        logging.info(f"Status da change {updated_change.numero} alterado para: {new_status}")
        
        return jsonify({
            "message": "Status da change atualizado com sucesso",
            "data": updated_change.dict()
        }), 200
        
    except ValidationError as e:
        return jsonify(ErrorHandler.handle_validation_error(e)), 400
    except NotFoundError as e:
        return jsonify(ErrorHandler.handle_not_found_error(e)), 404
    except Exception as e:
        logging.error(f"Erro ao atualizar status da change: {str(e)}")
        return jsonify(ErrorHandler.handle_generic_error(e)), 500


@change_bp.route('/<change_id>/approve', methods=['PATCH'])
def approve_change(change_id):
    """Aprova uma change"""
    try:
        # Validar ID
        if not Validators.is_valid_object_id(change_id):
            raise ValidationError("ID de change inválido")
        
        # Criar modelo de atualização
        update_data = ChangeUpdate(status="aprovada")
        
        # Atualizar change
        updated_change = change_service.update_change(change_id, update_data)
        
        if not updated_change:
            raise NotFoundError("Change não encontrada")
        
        # Log da operação
        logging.info(f"Change {updated_change.numero} aprovada")
        
        return jsonify({
            "message": "Change aprovada com sucesso",
            "data": updated_change.dict()
        }), 200
        
    except ValidationError as e:
        return jsonify(ErrorHandler.handle_validation_error(e)), 400
    except NotFoundError as e:
        return jsonify(ErrorHandler.handle_not_found_error(e)), 404
    except Exception as e:
        logging.error(f"Erro ao aprovar change: {str(e)}")
        return jsonify(ErrorHandler.handle_generic_error(e)), 500


@change_bp.route('/<change_id>/start', methods=['PATCH'])
def start_change(change_id):
    """Inicia a execução de uma change"""
    try:
        # Validar ID
        if not Validators.is_valid_object_id(change_id):
            raise ValidationError("ID de change inválido")
        
        # Criar modelo de atualização
        update_data = ChangeUpdate(status="em_execucao")
        
        # Atualizar change
        updated_change = change_service.update_change(change_id, update_data)
        
        if not updated_change:
            raise NotFoundError("Change não encontrada")
        
        # Log da operação
        logging.info(f"Change {updated_change.numero} iniciada")
        
        return jsonify({
            "message": "Change iniciada com sucesso",
            "data": updated_change.dict()
        }), 200
        
    except ValidationError as e:
        return jsonify(ErrorHandler.handle_validation_error(e)), 400
    except NotFoundError as e:
        return jsonify(ErrorHandler.handle_not_found_error(e)), 404
    except Exception as e:
        logging.error(f"Erro ao iniciar change: {str(e)}")
        return jsonify(ErrorHandler.handle_generic_error(e)), 500


@change_bp.route('/<change_id>/complete', methods=['PATCH'])
def complete_change(change_id):
    """Marca uma change como concluída"""
    try:
        # Validar ID
        if not Validators.is_valid_object_id(change_id):
            raise ValidationError("ID de change inválido")
        
        # Criar modelo de atualização
        update_data = ChangeUpdate(status="concluida")
        
        # Atualizar change
        updated_change = change_service.update_change(change_id, update_data)
        
        if not updated_change:
            raise NotFoundError("Change não encontrada")
        
        # Log da operação
        logging.info(f"Change {updated_change.numero} concluída")
        
        return jsonify({
            "message": "Change concluída com sucesso",
            "data": updated_change.dict()
        }), 200
        
    except ValidationError as e:
        return jsonify(ErrorHandler.handle_validation_error(e)), 400
    except NotFoundError as e:
        return jsonify(ErrorHandler.handle_not_found_error(e)), 404
    except Exception as e:
        logging.error(f"Erro ao concluir change: {str(e)}")
        return jsonify(ErrorHandler.handle_generic_error(e)), 500


@change_bp.route('/upcoming', methods=['GET'])
def get_upcoming_changes():
    """Retorna changes programadas para os próximos dias"""
    try:
        # Parâmetro de dias (padrão: 7 dias)
        days = int(request.args.get('days', 7))
        
        # Validar parâmetro
        if days < 1 or days > 30:
            days = 7
        
        # Buscar changes programadas
        changes = change_service.get_upcoming_changes(days)
        
        # Log da operação
        logging.info(f"Consultadas {len(changes)} changes programadas para os próximos {days} dias")
        
        return jsonify({
            "data": [change.dict() for change in changes],
            "days": days
        }), 200
        
    except Exception as e:
        logging.error(f"Erro ao buscar changes programadas: {str(e)}")
        return jsonify(ErrorHandler.handle_generic_error(e)), 500


@change_bp.route('/stats/summary', methods=['GET'])
def get_change_summary():
    """Retorna resumo estatístico das changes"""
    try:
        # Buscar estatísticas
        stats = change_service.get_dashboard_stats()
        
        # Log da operação
        logging.info("Estatísticas de changes consultadas")
        
        return jsonify({
            "data": stats
        }), 200
        
    except Exception as e:
        logging.error(f"Erro ao buscar estatísticas: {str(e)}")
        return jsonify(ErrorHandler.handle_generic_error(e)), 500
