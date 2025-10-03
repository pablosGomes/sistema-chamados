"""
Rotas para gerenciamento de incidentes
"""
from flask import Blueprint, request, jsonify
from services.incident_service import IncidentService
from models.incident_model import IncidentCreate, IncidentUpdate
from utils.error_handler import ErrorHandler, ValidationError, NotFoundError
from utils.validators import Validators
import logging

# Criar blueprint
incident_bp = Blueprint('incidents', __name__, url_prefix='/api/incidentes')

# Instanciar serviço
incident_service = IncidentService()


@incident_bp.route('/', methods=['GET'])
def list_incidents():
    """Lista incidentes com filtros opcionais"""
    try:
        # Extrair parâmetros de query
        filters = {}
        
        # Filtros de fila
        if request.args.get('fila'):
            filters['fila'] = request.args.get('fila')
        
        # Filtros de prioridade
        if request.args.get('prioridade'):
            filters['prioridade'] = request.args.get('prioridade')
        
        # Filtros de status
        if request.args.get('status'):
            filters['status'] = request.args.get('status')
        
        # Filtros de grupo
        if request.args.get('grupo_designado'):
            filters['grupo_designado'] = request.args.get('grupo_designado')
        
        # Filtros de responsável
        if request.args.get('atribuido'):
            filters['atribuido'] = request.args.get('atribuido')
        
        # Parâmetros de paginação
        page = int(request.args.get('page', 1))
        per_page = int(request.args.get('per_page', 50))
        
        # Validar parâmetros de paginação
        page, per_page = Validators.validate_pagination_params(page, per_page)
        
        # Calcular skip
        skip = (page - 1) * per_page
        
        # Buscar incidentes
        incidents = incident_service.get_incidents(filters, per_page, skip)
        
        # Contar total de incidentes
        total = incident_service.get_incident_count(filters)
        
        # Log da operação
        logging.info(f"Listados {len(incidents)} incidentes com filtros: {filters}")
        
        return jsonify({
            "data": [incident.dict() for incident in incidents],
            "pagination": {
                "page": page,
                "per_page": per_page,
                "total": total,
                "pages": (total + per_page - 1) // per_page
            },
            "filters": filters
        }), 200
        
    except Exception as e:
        logging.error(f"Erro ao listar incidentes: {str(e)}")
        return jsonify(ErrorHandler.handle_generic_error(e)), 500


@incident_bp.route('/', methods=['POST'])
def create_incident():
    """Cria um novo incidente"""
    try:
        # Validar dados de entrada
        data = request.get_json()
        if not data:
            raise ValidationError("Dados do incidente são obrigatórios")
        
        # Criar modelo de validação
        incident_data = IncidentCreate(**data)
        
        # Criar incidente
        created_incident = incident_service.create_incident(incident_data)
        
        # Log da operação
        logging.info(f"Incidente criado com sucesso: {created_incident.numero}")
        
        return jsonify({
            "message": "Incidente criado com sucesso",
            "data": created_incident.dict()
        }), 201
        
    except ValidationError as e:
        return jsonify(ErrorHandler.handle_validation_error(e)), 400
    except ValueError as e:
        return jsonify(ErrorHandler.handle_value_error(e)), 400
    except Exception as e:
        logging.error(f"Erro ao criar incidente: {str(e)}")
        return jsonify(ErrorHandler.handle_generic_error(e)), 500


@incident_bp.route('/<incident_id>', methods=['GET'])
def get_incident(incident_id):
    """Busca um incidente específico por ID"""
    try:
        # Validar ID
        if not Validators.is_valid_object_id(incident_id):
            raise ValidationError("ID de incidente inválido")
        
        # Buscar incidente
        incident = incident_service.get_incident_by_id(incident_id)
        
        if not incident:
            raise NotFoundError("Incidente não encontrado")
        
        # Log da operação
        logging.info(f"Incidente consultado: {incident.numero}")
        
        return jsonify({
            "data": incident.dict()
        }), 200
        
    except ValidationError as e:
        return jsonify(ErrorHandler.handle_validation_error(e)), 400
    except NotFoundError as e:
        return jsonify(ErrorHandler.handle_not_found_error(e)), 404
    except Exception as e:
        logging.error(f"Erro ao buscar incidente: {str(e)}")
        return jsonify(ErrorHandler.handle_generic_error(e)), 500


@incident_bp.route('/<incident_id>', methods=['PUT'])
def update_incident(incident_id):
    """Atualiza um incidente existente"""
    try:
        # Validar ID
        if not Validators.is_valid_object_id(incident_id):
            raise ValidationError("ID de incidente inválido")
        
        # Validar dados de entrada
        data = request.get_json()
        if not data:
            raise ValidationError("Dados de atualização são obrigatórios")
        
        # Criar modelo de validação
        update_data = IncidentUpdate(**data)
        
        # Atualizar incidente
        updated_incident = incident_service.update_incident(incident_id, update_data)
        
        if not updated_incident:
            raise NotFoundError("Incidente não encontrado")
        
        # Log da operação
        logging.info(f"Incidente atualizado: {updated_incident.numero}")
        
        return jsonify({
            "message": "Incidente atualizado com sucesso",
            "data": updated_incident.dict()
        }), 200
        
    except ValidationError as e:
        return jsonify(ErrorHandler.handle_validation_error(e)), 400
    except ValueError as e:
        return jsonify(ErrorHandler.handle_value_error(e)), 400
    except NotFoundError as e:
        return jsonify(ErrorHandler.handle_not_found_error(e)), 404
    except Exception as e:
        logging.error(f"Erro ao atualizar incidente: {str(e)}")
        return jsonify(ErrorHandler.handle_generic_error(e)), 500


@incident_bp.route('/<incident_id>', methods=['DELETE'])
def delete_incident(incident_id):
    """Remove um incidente"""
    try:
        # Validar ID
        if not Validators.is_valid_object_id(incident_id):
            raise ValidationError("ID de incidente inválido")
        
        # Deletar incidente
        deleted = incident_service.delete_incident(incident_id)
        
        if not deleted:
            raise NotFoundError("Incidente não encontrado")
        
        # Log da operação
        logging.info(f"Incidente deletado: {incident_id}")
        
        return jsonify({
            "message": "Incidente deletado com sucesso"
        }), 200
        
    except ValidationError as e:
        return jsonify(ErrorHandler.handle_validation_error(e)), 400
    except NotFoundError as e:
        return jsonify(ErrorHandler.handle_not_found_error(e)), 404
    except Exception as e:
        logging.error(f"Erro ao deletar incidente: {str(e)}")
        return jsonify(ErrorHandler.handle_generic_error(e)), 500


@incident_bp.route('/<incident_id>/status', methods=['PATCH'])
def update_incident_status(incident_id):
    """Atualiza apenas o status de um incidente"""
    try:
        # Validar ID
        if not Validators.is_valid_object_id(incident_id):
            raise ValidationError("ID de incidente inválido")
        
        # Validar dados de entrada
        data = request.get_json()
        if not data or 'status' not in data:
            raise ValidationError("Status é obrigatório")
        
        # Validar status
        new_status = data['status']
        if not Validators.is_valid_status(new_status):
            raise ValidationError(f"Status inválido: {new_status}")
        
        # Criar modelo de atualização
        update_data = IncidentUpdate(status=new_status)
        
        # Atualizar incidente
        updated_incident = incident_service.update_incident(incident_id, update_data)
        
        if not updated_incident:
            raise NotFoundError("Incidente não encontrado")
        
        # Log da operação
        logging.info(f"Status do incidente {updated_incident.numero} alterado para: {new_status}")
        
        return jsonify({
            "message": "Status do incidente atualizado com sucesso",
            "data": updated_incident.dict()
        }), 200
        
    except ValidationError as e:
        return jsonify(ErrorHandler.handle_validation_error(e)), 400
    except NotFoundError as e:
        return jsonify(ErrorHandler.handle_not_found_error(e)), 404
    except Exception as e:
        logging.error(f"Erro ao atualizar status do incidente: {str(e)}")
        return jsonify(ErrorHandler.handle_generic_error(e)), 500


@incident_bp.route('/<incident_id>/assign', methods=['PATCH'])
def assign_incident(incident_id):
    """Atribui um incidente a um responsável"""
    try:
        # Validar ID
        if not Validators.is_valid_object_id(incident_id):
            raise ValidationError("ID de incidente inválido")
        
        # Validar dados de entrada
        data = request.get_json()
        if not data or 'atribuido' not in data:
            raise ValidationError("Responsável é obrigatório")
        
        # Validar responsável
        responsavel = data['atribuido']
        if not responsavel or len(responsavel.strip()) == 0:
            raise ValidationError("Responsável não pode estar vazio")
        
        # Criar modelo de atualização
        update_data = IncidentUpdate(atribuido=responsavel.strip())
        
        # Atualizar incidente
        updated_incident = incident_service.update_incident(incident_id, update_data)
        
        if not updated_incident:
            raise NotFoundError("Incidente não encontrado")
        
        # Log da operação
        logging.info(f"Incidente {updated_incident.numero} atribuído a: {responsavel}")
        
        return jsonify({
            "message": "Incidente atribuído com sucesso",
            "data": updated_incident.dict()
        }), 200
        
    except ValidationError as e:
        return jsonify(ErrorHandler.handle_validation_error(e)), 400
    except NotFoundError as e:
        return jsonify(ErrorHandler.handle_not_found_error(e)), 404
    except Exception as e:
        logging.error(f"Erro ao atribuir incidente: {str(e)}")
        return jsonify(ErrorHandler.handle_generic_error(e)), 500


@incident_bp.route('/stats/summary', methods=['GET'])
def get_incident_summary():
    """Retorna resumo estatístico dos incidentes"""
    try:
        # Buscar estatísticas
        stats = incident_service.get_dashboard_stats()
        
        # Log da operação
        logging.info("Estatísticas de incidentes consultadas")
        
        return jsonify({
            "data": stats
        }), 200
        
    except Exception as e:
        logging.error(f"Erro ao buscar estatísticas: {str(e)}")
        return jsonify(ErrorHandler.handle_generic_error(e)), 500
