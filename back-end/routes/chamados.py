from flask import Blueprint, request, jsonify
from bson import ObjectId
from config import mongo
from routes.chamado import ChamadoModel
from pydantic import ValidationError
from datetime import datetime

chamados_bp = Blueprint("chamados", __name__)

# Função para converter ObjectId em string e incluir todos os campos

def serialize_chamado(chamado):
    return {
        "_id": str(chamado["_id"]),
        "numero": chamado.get("numero"),
        "titulo": chamado["titulo"],
        "descricao": chamado["descricao"],
        "local": chamado.get("local_problema"),
        "prioridade": chamado.get("prioridade"),
        "status": chamado.get("status"),
        "incidente_vendas": chamado.get("incidente_vendas"),
        "imagens": chamado.get("imagens", [])
    }

# Criar chamado
@chamados_bp.route("/chamados", methods=["POST"])
def criar_chamado():
    try:
        data = request.get_json() or {}
        # Suportar alias 'local' vindo do frontend
        if "local" in data and "local_problema" not in data:
            data["local_problema"] = data["local"]
        chamado_data = ChamadoModel(**data)

        # Gerar número sequencial
        last_chamado = mongo.db.chamados.find_one(sort=[("numero", -1)])
        next_numero = (last_chamado["numero"] + 1) if last_chamado and "numero" in last_chamado else 1
        now = datetime.now()

        chamado_id = mongo.db.chamados.insert_one({
            "numero": next_numero,
            "titulo": chamado_data.titulo,
            "descricao": chamado_data.descricao,
            "local_problema": chamado_data.local_problema,
            "prioridade": chamado_data.prioridade,
            "status": chamado_data.status,
            "incidente_vendas": chamado_data.incidente_vendas,
            "imagens": chamado_data.imagens,
            "data_criacao": now
        }).inserted_id
        
        return jsonify({"msg": "Chamado criado com sucesso!", "_id": str(chamado_id), "numero": next_numero}), 201
    except ValidationError as e:
        return jsonify({"erro": e.errors()}), 400
    except Exception as e:
        return jsonify({"erro": str(e)}), 500

# Listar chamados
@chamados_bp.route("/chamados", methods=["GET"])
def listar_chamados():
    try:
        docs = mongo.db.chamados.find().sort("data_criacao", -1)
        return jsonify([serialize_chamado(c) for c in docs])
    except Exception as e:
        return jsonify({"erro": str(e)}), 500

# Buscar chamado por ID
@chamados_bp.route("/chamados/<id>", methods=["GET"])
def buscar_chamado(id):
    try:
        chamado = mongo.db.chamados.find_one({"_id": ObjectId(id)})
        if not chamado:
            return jsonify({"erro": "Chamado não encontrado"}), 404
        return jsonify(serialize_chamado(chamado))
    except Exception as e:
        return jsonify({"erro": "ID inválido ou erro interno"}), 400

# Atualizar chamado
@chamados_bp.route("/chamados/<id>", methods=["PUT"])
def atualizar_chamado(id):
    try:
        data = request.get_json() or {}
        # Suportar alias 'local'
        if "local" in data and "local_problema" not in data:
            data["local_problema"] = data["local"]
        update_data = ChamadoModel(**data).dict(exclude_unset=True)
        
        result = mongo.db.chamados.update_one({"_id": ObjectId(id)}, {"$set": update_data})
        if result.matched_count == 0:
            return jsonify({"erro": "Chamado não encontrado"}), 404
        return jsonify({"msg": "Chamado atualizado com sucesso!"})
    except ValidationError as e:
        return jsonify({"erro": e.errors()}), 400
    except Exception as e:
        return jsonify({"erro": "ID inválido ou erro interno"}), 400

# Deletar chamado
@chamados_bp.route("/chamados/<id>", methods=["DELETE"])
def deletar_chamado(id):
    try:
        result = mongo.db.chamados.delete_one({"_id": ObjectId(id)})
        if result.deleted_count == 0:
            return jsonify({"erro": "Chamado não encontrado"}), 404
        return jsonify({"msg": "Chamado deletado com sucesso!"})
    except Exception as e:
        return jsonify({"erro": "ID inválido ou erro interno"}), 400

# Rotas para o Dashboard
@chamados_bp.route("/dashboard/incidentes", methods=["GET"])
def get_incidentes_data():
    try:
        incidentes_vendas = mongo.db.chamados.count_documents({"incidente_vendas": True})
        
        filas = {
            "fila_p2k": mongo.db.chamados.count_documents({"local_problema": "fila_p2k"}),
            "fila_crivo": mongo.db.chamados.count_documents({"local_problema": "fila_crivo"}),
            "sg5_ura": mongo.db.chamados.count_documents({"local_problema": "sg5_ura"}),
            "alarmes": mongo.db.chamados.count_documents({"local_problema": "alarmes"}),
            "tsk_vendas": mongo.db.chamados.count_documents({"local_problema": "tsk_vendas"}),
            "sr": mongo.db.chamados.count_documents({"local_problema": "sr"}),
            "rit": mongo.db.chamados.count_documents({"local_problema": "rit"})
        }

        prioridades = {
            "critica": mongo.db.chamados.count_documents({"prioridade": "critica"}),
            "alta": mongo.db.chamados.count_documents({"prioridade": "alta"}),
            "media": mongo.db.chamados.count_documents({"prioridade": "media"}),
            "baixa": mongo.db.chamados.count_documents({"prioridade": "baixa"})
        }

        status = {
            "aberto": mongo.db.chamados.count_documents({"status": "aberto"}),
            "fechado": mongo.db.chamados.count_documents({"status": "fechado"}),
            "em_andamento": mongo.db.chamados.count_documents({"status": "em_andamento"}),
            "em_espera": mongo.db.chamados.count_documents({"status": "em_espera"}),
            "tks_remoto": mongo.db.chamados.count_documents({"status": "tks_remoto"})
        }

        return jsonify({
            "incidentes_vendas": incidentes_vendas,
            "filas": filas,
            "prioridades": prioridades,
            "status": status
        })
    except Exception as e:
        return jsonify({"erro": str(e)}), 500

@chamados_bp.route("/dashboard/changes", methods=["GET"])
def get_changes_data():
    try:
        changes_pendentes = mongo.db.chamados.count_documents({"status": "changes_pendentes"})
        changes_execucao = mongo.db.chamados.count_documents({"status": "changes_execucao"})
        changes_concluidas = mongo.db.chamados.count_documents({"status": "changes_concluidas"})

        return jsonify({
            "changes_pendentes": changes_pendentes,
            "changes_execucao": changes_execucao,
            "changes_concluidas": changes_concluidas
        })
    except Exception as e:
        return jsonify({"erro": str(e)}), 500

@chamados_bp.route("/dashboard/controle", methods=["GET"])
def get_controle_data():
    try:
        hoje = datetime.now()
        start_of_day = datetime(hoje.year, hoje.month, hoje.day, 0, 0, 0)
        end_of_day = datetime(hoje.year, hoje.month, hoje.day, 23, 59, 59)

        abertos_hoje = mongo.db.chamados.count_documents({"data_criacao": {"$gte": start_of_day, "$lte": end_of_day}})
        fechados_hoje = mongo.db.chamados.count_documents({"status": "fechado", "data_criacao": {"$gte": start_of_day, "$lte": end_of_day}})
        pendentes = mongo.db.chamados.count_documents({"status": {"$ne": "fechado"}})

        return jsonify({
            "abertos_hoje": abertos_hoje,
            "fechados_hoje": fechados_hoje,
            "pendentes": pendentes
        })
    except Exception as e:
        return jsonify({"erro": str(e)}), 500


