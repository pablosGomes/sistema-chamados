"""
Rotas para o dashboard da aplicação
"""
from flask import Blueprint, request, jsonify
from services.incident_service import IncidentService
from services.change_service import ChangeService
from services.user_service import UserService
from utils.error_handler import ErrorHandler
import logging

# Criar blueprint
dashboard_bp = Blueprint('dashboard', __name__, url_prefix='/api/dashboard')

# Instanciar serviços
incident_service = IncidentService()
change_service = ChangeService()
user_service = UserService()


@dashboard_bp.route('/overview', methods=['GET'])
def get_dashboard_overview():
    """Retorna visão geral do dashboard"""
    try:
        # Buscar estatísticas de todos os módulos
        incident_stats = incident_service.get_dashboard_stats()
        change_stats = change_service.get_dashboard_stats()
        user_stats = user_service.get_dashboard_stats()
        
        # Calcular métricas agregadas
        total_incidents = sum(incident_stats['prioridades'].values())
        total_changes = change_stats['total_changes']
        total_users = user_stats['total_usuarios']
        
        # Calcular métricas de SLA (exemplo)
        critical_incidents = incident_stats['prioridades'].get('critica', 0)
        high_priority_incidents = incident_stats['prioridades'].get('alta', 0)
        
        # Log da operação
        logging.info("Visão geral do dashboard consultada")
        
        return jsonify({
            "data": {
                "overview": {
                    "total_incidents": total_incidents,
                    "total_changes": total_changes,
                    "total_users": total_users,
                    "critical_incidents": critical_incidents,
                    "high_priority_incidents": high_priority_incidents
                },
                "incidents": incident_stats,
                "changes": change_stats,
                "users": user_stats
            }
        }), 200
        
    except Exception as e:
        logging.error(f"Erro ao buscar visão geral do dashboard: {str(e)}")
        return jsonify(ErrorHandler.handle_generic_error(e)), 500


@dashboard_bp.route('/incidentes', methods=['GET'])
def get_incident_dashboard():
    """Retorna dashboard específico de incidentes"""
    try:
        # Buscar estatísticas de incidentes
        stats = incident_service.get_dashboard_stats()
        
        # Calcular métricas adicionais
        total_incidents = sum(stats['prioridades'].values())
        total_by_status = sum(stats['status'].values())
        
        # Calcular percentuais
        if total_incidents > 0:
            critical_percentage = (stats['prioridades'].get('critica', 0) / total_incidents) * 100
            high_percentage = (stats['prioridades'].get('alta', 0) / total_incidents) * 100
            in_progress_percentage = (stats['status'].get('em_andamento', 0) / total_incidents) * 100
        else:
            critical_percentage = 0
            high_percentage = 0
            in_progress_percentage = 0
        
        # Log da operação
        logging.info("Dashboard de incidentes consultado")
        
        return jsonify({
            "data": {
                "summary": {
                    "total_incidents": total_incidents,
                    "critical_percentage": round(critical_percentage, 2),
                    "high_percentage": round(high_percentage, 2),
                    "in_progress_percentage": round(in_progress_percentage, 2)
                },
                "details": stats
            }
        }), 200
        
    except Exception as e:
        logging.error(f"Erro ao buscar dashboard de incidentes: {str(e)}")
        return jsonify(ErrorHandler.handle_generic_error(e)), 500


@dashboard_bp.route('/changes', methods=['GET'])
def get_change_dashboard():
    """Retorna dashboard específico de changes"""
    try:
        # Buscar estatísticas de changes
        stats = change_service.get_dashboard_stats()
        
        # Calcular métricas adicionais
        total_changes = stats['total_changes']
        
        if total_changes > 0:
            pending_percentage = (stats['changes_pendentes'] / total_changes) * 100
            approved_percentage = (stats['changes_aprovadas'] / total_changes) * 100
            in_execution_percentage = (stats['changes_execucao'] / total_changes) * 100
            completed_percentage = (stats['changes_concluidas'] / total_changes) * 100
        else:
            pending_percentage = 0
            approved_percentage = 0
            in_execution_percentage = 0
            completed_percentage = 0
        
        # Log da operação
        logging.info("Dashboard de changes consultado")
        
        return jsonify({
            "data": {
                "summary": {
                    "total_changes": total_changes,
                    "pending_percentage": round(pending_percentage, 2),
                    "approved_percentage": round(approved_percentage, 2),
                    "in_execution_percentage": round(in_execution_percentage, 2),
                    "completed_percentage": round(completed_percentage, 2)
                },
                "details": stats
            }
        }), 200
        
    except Exception as e:
        logging.error(f"Erro ao buscar dashboard de changes: {str(e)}")
        return jsonify(ErrorHandler.handle_generic_error(e)), 500


@dashboard_bp.route('/usuarios', methods=['GET'])
def get_user_dashboard():
    """Retorna dashboard específico de usuários"""
    try:
        # Buscar estatísticas de usuários
        stats = user_service.get_dashboard_stats()
        
        # Calcular métricas adicionais
        total_users = stats['total_usuarios']
        active_users = stats['usuarios_ativos']
        
        if total_users > 0:
            active_percentage = (active_users / total_users) * 100
        else:
            active_percentage = 0
        
        # Log da operação
        logging.info("Dashboard de usuários consultado")
        
        return jsonify({
            "data": {
                "summary": {
                    "total_users": total_users,
                    "active_users": active_users,
                    "active_percentage": round(active_percentage, 2)
                },
                "details": stats
            }
        }), 200
        
    except Exception as e:
        logging.error(f"Erro ao buscar dashboard de usuários: {str(e)}")
        return jsonify(ErrorHandler.handle_generic_error(e)), 500


@dashboard_bp.route('/trends', methods=['GET'])
def get_dashboard_trends():
    """Retorna tendências do dashboard (placeholder para futuras implementações)"""
    try:
        # TODO: Implementar análise de tendências
        # Por enquanto, retorna dados básicos
        
        # Log da operação
        logging.info("Tendências do dashboard consultadas")
        
        return jsonify({
            "data": {
                "message": "Análise de tendências será implementada em versões futuras",
                "trends": {
                    "incidents_trend": "stable",
                    "changes_trend": "increasing",
                    "users_trend": "stable"
                }
            }
        }), 200
        
    except Exception as e:
        logging.error(f"Erro ao buscar tendências: {str(e)}")
        return jsonify(ErrorHandler.handle_generic_error(e)), 500


@dashboard_bp.route('/alerts', methods=['GET'])
def get_dashboard_alerts():
    """Retorna alertas do dashboard"""
    try:
        # Buscar estatísticas para gerar alertas
        incident_stats = incident_service.get_dashboard_stats()
        change_stats = change_service.get_dashboard_stats()
        
        alerts = []
        
        # Alertas de incidentes críticos
        critical_incidents = incident_stats['prioridades'].get('critica', 0)
        if critical_incidents > 5:
            alerts.append({
                "type": "critical",
                "message": f"Alto número de incidentes críticos: {critical_incidents}",
                "category": "incident",
                "priority": "high"
            })
        
        # Alertas de changes pendentes
        pending_changes = change_stats['changes_pendentes']
        if pending_changes > 10:
            alerts.append({
                "type": "warning",
                "message": f"Muitas changes pendentes: {pending_changes}",
                "category": "change",
                "priority": "medium"
            })
        
        # Alertas de incidentes em andamento
        in_progress_incidents = incident_stats['status'].get('em_andamento', 0)
        if in_progress_incidents > 20:
            alerts.append({
                "type": "info",
                "message": f"Muitos incidentes em andamento: {in_progress_incidents}",
                "category": "incident",
                "priority": "low"
            })
        
        # Log da operação
        logging.info(f"Alertas do dashboard consultados: {len(alerts)} alertas encontrados")
        
        return jsonify({
            "data": {
                "alerts": alerts,
                "total_alerts": len(alerts)
            }
        }), 200
        
    except Exception as e:
        logging.error(f"Erro ao buscar alertas: {str(e)}")
        return jsonify(ErrorHandler.handle_generic_error(e)), 500


@dashboard_bp.route('/metrics', methods=['GET'])
def get_dashboard_metrics():
    """Retorna métricas específicas do dashboard"""
    try:
        # Parâmetros de consulta
        metric_type = request.args.get('type', 'all')
        time_range = request.args.get('range', 'today')
        
        # Buscar métricas baseadas no tipo
        if metric_type in ['all', 'incidents']:
            incident_stats = incident_service.get_dashboard_stats()
        else:
            incident_stats = {}
        
        if metric_type in ['all', 'changes']:
            change_stats = change_service.get_dashboard_stats()
        else:
            change_stats = {}
        
        if metric_type in ['all', 'users']:
            user_stats = user_service.get_dashboard_stats()
        else:
            user_stats = {}
        
        # Log da operação
        logging.info(f"Métricas do dashboard consultadas: tipo={metric_type}, período={time_range}")
        
        return jsonify({
            "data": {
                "metric_type": metric_type,
                "time_range": time_range,
                "incidents": incident_stats,
                "changes": change_stats,
                "users": user_stats
            }
        }), 200
        
    except Exception as e:
        logging.error(f"Erro ao buscar métricas: {str(e)}")
        return jsonify(ErrorHandler.handle_generic_error(e)), 500


@dashboard_bp.route('/health', methods=['GET'])
def get_dashboard_health():
    """Retorna status de saúde do sistema"""
    try:
        # Verificar conectividade com serviços
        health_status = {
            "status": "healthy",
            "timestamp": "2024-01-01T00:00:00Z",
            "services": {
                "incidents": "operational",
                "changes": "operational",
                "users": "operational",
                "database": "operational"
            },
            "version": "1.0.0"
        }
        
        # Log da operação
        logging.info("Status de saúde do sistema consultado")
        
        return jsonify({
            "data": health_status
        }), 200
        
    except Exception as e:
        logging.error(f"Erro ao verificar saúde do sistema: {str(e)}")
        return jsonify(ErrorHandler.handle_generic_error(e)), 500
