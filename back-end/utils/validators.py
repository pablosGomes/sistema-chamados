"""
Funções de validação úteis para a aplicação
"""
import re
from datetime import datetime
from typing import Any, Dict, List, Optional
from bson import ObjectId


class Validators:
    """Classe com funções de validação"""
    
    @staticmethod
    def is_valid_object_id(object_id: str) -> bool:
        """Verifica se uma string é um ObjectId válido do MongoDB"""
        return ObjectId.is_valid(object_id)
    
    @staticmethod
    def is_valid_email(email: str) -> bool:
        """Verifica se um email é válido"""
        pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        return re.match(pattern, email) is not None
    
    @staticmethod
    def is_valid_phone(phone: str) -> bool:
        """Verifica se um telefone é válido (formato brasileiro)"""
        # Remove caracteres especiais
        phone_clean = re.sub(r'[^\d]', '', phone)
        # Verifica se tem 10 ou 11 dígitos (com DDD)
        return len(phone_clean) in [10, 11] and phone_clean.isdigit()
    
    @staticmethod
    def is_valid_cpf(cpf: str) -> bool:
        """Verifica se um CPF é válido"""
        # Remove caracteres especiais
        cpf_clean = re.sub(r'[^\d]', '', cpf)
        
        # Verifica se tem 11 dígitos
        if len(cpf_clean) != 11:
            return False
        
        # Verifica se todos os dígitos são iguais
        if cpf_clean == cpf_clean[0] * 11:
            return False
        
        # Validação do primeiro dígito verificador
        soma = sum(int(cpf_clean[i]) * (10 - i) for i in range(9))
        resto = soma % 11
        digito1 = 0 if resto < 2 else 11 - resto
        
        if int(cpf_clean[9]) != digito1:
            return False
        
        # Validação do segundo dígito verificador
        soma = sum(int(cpf_clean[i]) * (11 - i) for i in range(10))
        resto = soma % 11
        digito2 = 0 if resto < 2 else 11 - resto
        
        if int(cpf_clean[10]) != digito2:
            return False
        
        return True
    
    @staticmethod
    def is_valid_date(date_string: str, format: str = "%Y-%m-%d") -> bool:
        """Verifica se uma string de data é válida"""
        try:
            datetime.strptime(date_string, format)
            return True
        except ValueError:
            return False
    
    @staticmethod
    def is_valid_datetime(datetime_string: str, format: str = "%Y-%m-%dT%H:%M:%S") -> bool:
        """Verifica se uma string de data/hora é válida"""
        try:
            datetime.strptime(datetime_string, format)
            return True
        except ValueError:
            return False
    
    @staticmethod
    def is_valid_priority(priority: str) -> bool:
        """Verifica se uma prioridade é válida"""
        valid_priorities = ['critica', 'alta', 'media', 'baixa']
        return priority.lower() in valid_priorities
    
    @staticmethod
    def is_valid_status(status: str) -> bool:
        """Verifica se um status é válido para incidentes"""
        valid_statuses = ['aberto', 'em_andamento', 'em_espera', 'resolvido', 'fechado', 'tks_remoto']
        return status.lower() in valid_statuses
    
    @staticmethod
    def is_valid_change_status(status: str) -> bool:
        """Verifica se um status é válido para changes"""
        valid_statuses = ['pendente', 'aprovada', 'em_execucao', 'concluida', 'cancelada']
        return status.lower() in valid_statuses
    
    @staticmethod
    def is_valid_task_type(task_type: str) -> bool:
        """Verifica se um tipo de tarefa é válido"""
        valid_types = ['manutencao', 'suporte', 'configuracao', 'atualizacao', 'investigacao']
        return task_type.lower() in valid_types
    
    @staticmethod
    def is_valid_change_type(change_type: str) -> bool:
        """Verifica se um tipo de change é válido"""
        valid_types = ['manutencao', 'atualizacao', 'configuracao', 'migracao', 'correcao']
        return change_type.lower() in valid_types
    
    @staticmethod
    def is_valid_impact(impact: str) -> bool:
        """Verifica se um impacto é válido"""
        valid_impacts = ['baixo', 'medio', 'alto', 'critico']
        return impact.lower() in valid_impacts
    
    @staticmethod
    def is_valid_group(group: str) -> bool:
        """Verifica se um grupo é válido"""
        valid_groups = [
            'TI Infraestrutura', 'TI Sistemas', 'TI Vendas', 'TI Monitoramento',
            'TI Dados', 'TI Segurança', 'TI Integração'
        ]
        return group in valid_groups
    
    @staticmethod
    def is_valid_fila(fila: str) -> bool:
        """Verifica se uma fila é válida"""
        valid_filas = ['fila_p2k', 'fila_crivo', 'sg5_ura', 'alarmes', 'tsk_vendas', 'sr', 'rit']
        return fila in valid_filas
    
    @staticmethod
    def sanitize_string(value: str, max_length: Optional[int] = None) -> str:
        """Sanitiza uma string removendo caracteres perigosos"""
        if not isinstance(value, str):
            return str(value)
        
        # Remove caracteres de controle
        sanitized = re.sub(r'[\x00-\x1f\x7f-\x9f]', '', value)
        
        # Remove tags HTML
        sanitized = re.sub(r'<[^>]*>', '', sanitized)
        
        # Remove caracteres especiais perigosos
        sanitized = re.sub(r'[<>"\']', '', sanitized)
        
        # Limita o tamanho se especificado
        if max_length and len(sanitized) > max_length:
            sanitized = sanitized[:max_length]
        
        return sanitized.strip()
    
    @staticmethod
    def validate_pagination_params(page: int, per_page: int, max_per_page: int = 100) -> tuple[int, int]:
        """Valida e normaliza parâmetros de paginação"""
        # Garantir que page seja pelo menos 1
        page = max(1, page)
        
        # Garantir que per_page esteja dentro dos limites
        per_page = max(1, min(per_page, max_per_page))
        
        return page, per_page
    
    @staticmethod
    def validate_filters(filters: Dict[str, Any]) -> Dict[str, Any]:
        """Valida e sanitiza filtros de busca"""
        validated_filters = {}
        
        for key, value in filters.items():
            if value is not None and value != "":
                # Sanitiza strings
                if isinstance(value, str):
                    validated_filters[key] = Validators.sanitize_string(value)
                else:
                    validated_filters[key] = value
        
        return validated_filters
    
    @staticmethod
    def is_valid_uuid(uuid_string: str) -> bool:
        """Verifica se uma string é um UUID válido"""
        pattern = r'^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
        return re.match(pattern, uuid_string.lower()) is not None
    
    @staticmethod
    def is_valid_cep(cep: str) -> bool:
        """Verifica se um CEP é válido (formato brasileiro)"""
        # Remove caracteres especiais
        cep_clean = re.sub(r'[^\d]', '', cep)
        # Verifica se tem 8 dígitos
        return len(cep_clean) == 8 and cep_clean.isdigit()
    
    @staticmethod
    def is_valid_cnpj(cnpj: str) -> bool:
        """Verifica se um CNPJ é válido"""
        # Remove caracteres especiais
        cnpj_clean = re.sub(r'[^\d]', '', cnpj)
        
        # Verifica se tem 14 dígitos
        if len(cnpj_clean) != 14:
            return False
        
        # Verifica se todos os dígitos são iguais
        if cnpj_clean == cnpj_clean[0] * 14:
            return False
        
        # Validação do primeiro dígito verificador
        multiplicadores = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
        soma = sum(int(cnpj_clean[i]) * multiplicadores[i] for i in range(12))
        resto = soma % 11
        digito1 = 0 if resto < 2 else 11 - resto
        
        if int(cnpj_clean[12]) != digito1:
            return False
        
        # Validação do segundo dígito verificador
        multiplicadores = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
        soma = sum(int(cnpj_clean[i]) * multiplicadores[i] for i in range(13))
        resto = soma % 11
        digito2 = 0 if resto < 2 else 11 - resto
        
        if int(cnpj_clean[13]) != digito2:
            return False
        
        return True
