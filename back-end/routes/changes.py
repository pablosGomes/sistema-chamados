from flask import Blueprint, request, jsonify
from bson import ObjectId
from config import mongo
from pydantic import BaseModel, ValidationError
from datetime import datetime
from typing import Optional, List

changes_bp = Blueprint("changes", __name__)

class ChangeModel(BaseModel):
    titulo: str
    descricao: str
    tipo: str  # manutencao, atualizacao, configuracao
    prioridade: str  # baixa, media, alta, critica
    status: str  # pendente, execucao, concluida, cancelada
    data_programada: Optional[str] = None
    responsavel: Optional[str] = None
    sistema_afetado: Optional[str] = None
    tempo_estimado: Optional[str] = None
    observacoes: Optional[str] = None

# Função para converter ObjectId em string
def serialize_change(change):
    return {
        "_id": str(change["_id"]),
        "numero": change.get("numero"),
        "titulo": change["titulo"],
        "descricao": change["descricao"],
        "tipo": change.get("tipo"),
        "prioridade": change.get("prioridade"),
        "status": change.get("status"),
        "data_programada": change.get("data_programada"),
        "responsavel": change.get("responsavel"),
        "sistema_afetado": change.get("sistema_afetado"),
        "tempo_estimado": change.get("tempo_estimado"),
        "observacoes": change.get("observacoes"),
        "data_criacao": change.get("data_criacao")
    }

# Criar change
@changes_bp.route("/changes", methods=["POST"])
def criar_change():
    try:
        data = request.get_json()
        change_data = ChangeModel(**data)

        # Gerar número sequencial
        last_change = mongo.db.changes.find_one(sort=[("numero", -1)])
        next_numero = (last_change["numero"] + 1) if last_change and "numero" in last_change else 1
        
        change_id = mongo.db.changes.insert_one({
            "numero": next_numero,
            "titulo": change_data.titulo,
            "descricao": change_data.descricao,
            "tipo": change_data.tipo,
            "prioridade": change_data.prioridade,
            "status": change_data.status,
            "data_programada": change_data.data_programada,
            "responsavel": change_data.responsavel,
            "sistema_afetado": change_data.sistema_afetado,
            "tempo_estimado": change_data.tempo_estimado,
            "observacoes": change_data.observacoes,
            "data_criacao": datetime.now()
        }).inserted_id
        
        return jsonify({"msg": "Change criada com sucesso!", "_id": str(change_id), "numero": next_numero}), 201
    except ValidationError as e:
        return jsonify({"erro": e.errors()}), 400
    except Exception as e:
        return jsonify({"erro": str(e)}), 500

# Listar changes
@changes_bp.route("/changes", methods=["GET"])
def listar_changes():
    try:
        return jsonify([serialize_change(c) for c in mongo.db.changes.find()])
    except Exception as e:
        return jsonify({"erro": str(e)}), 500

# Buscar change por ID
@changes_bp.route("/changes/<id>", methods=["GET"])
def buscar_change(id):
    try:
        change = mongo.db.changes.find_one({"_id": ObjectId(id)})
        if not change:
            return jsonify({"erro": "Change não encontrada"}), 404
        return jsonify(serialize_change(change))
    except Exception as e:
        return jsonify({"erro": "ID inválido ou erro interno"}), 400

# Atualizar change
@changes_bp.route("/changes/<id>", methods=["PUT"])
def atualizar_change(id):
    try:
        data = request.get_json()
        update_data = ChangeModel(**data).dict(exclude_unset=True)
        
        result = mongo.db.changes.update_one({"_id": ObjectId(id)}, {"$set": update_data})
        if result.matched_count == 0:
            return jsonify({"erro": "Change não encontrada"}), 404
        return jsonify({"msg": "Change atualizada com sucesso!"})
    except ValidationError as e:
        return jsonify({"erro": e.errors()}), 400
    except Exception as e:
        return jsonify({"erro": "ID inválido ou erro interno"}), 400

# Deletar change
@changes_bp.route("/changes/<id>", methods=["DELETE"])
def deletar_change(id):
    try:
        result = mongo.db.changes.delete_one({"_id": ObjectId(id)})
        if result.deleted_count == 0:
            return jsonify({"erro": "Change não encontrada"}), 404
        return jsonify({"msg": "Change deletada com sucesso!"})
    except Exception as e:
        return jsonify({"erro": "ID inválido ou erro interno"}), 400

# Dados do dashboard para changes
@changes_bp.route("/dashboard/changes", methods=["GET"])
def get_changes_dashboard():
    try:
        changes_pendentes = mongo.db.changes.count_documents({"status": "pendente"})
        changes_execucao = mongo.db.changes.count_documents({"status": "execucao"})
        changes_concluidas = mongo.db.changes.count_documents({"status": "concluida"})
        changes_canceladas = mongo.db.changes.count_documents({"status": "cancelada"})

        # Dados por tipo
        tipos = {
            "manutencao": mongo.db.changes.count_documents({"tipo": "manutencao"}),
            "atualizacao": mongo.db.changes.count_documents({"tipo": "atualizacao"}),
            "configuracao": mongo.db.changes.count_documents({"tipo": "configuracao"})
        }

        # Dados por prioridade
        prioridades = {
            "critica": mongo.db.changes.count_documents({"prioridade": "critica"}),
            "alta": mongo.db.changes.count_documents({"prioridade": "alta"}),
            "media": mongo.db.changes.count_documents({"prioridade": "media"}),
            "baixa": mongo.db.changes.count_documents({"prioridade": "baixa"})
        }

        return jsonify({
            "changes_pendentes": changes_pendentes,
            "changes_execucao": changes_execucao,
            "changes_concluidas": changes_concluidas,
            "changes_canceladas": changes_canceladas,
            "tipos": tipos,
            "prioridades": prioridades
        })
    except Exception as e:
        return jsonify({"erro": str(e)}), 500

