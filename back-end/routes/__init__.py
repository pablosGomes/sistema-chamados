"""
Rotas da aplicação
"""
from .incident_routes import incident_bp
from .change_routes import change_bp
from .user_routes import user_bp
from .dashboard_routes import dashboard_bp

__all__ = ['incident_bp', 'change_bp', 'user_bp', 'dashboard_bp']

