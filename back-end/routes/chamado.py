from pydantic import BaseModel, Field
from typing import Optional, List

class ChamadoModel(BaseModel):
    titulo: str = Field(..., min_length=3, max_length=100)
    descricao: str = Field(..., min_length=5)
    local_problema: Optional[str] = Field(default="", pattern="^(fila_p2k|fila_crivo|sg5_ura|alarmes|tsk_vendas|sr|rit|)$")
    prioridade: Optional[str] = Field(default="baixa", pattern="^(baixa|media|alta|critica)$")
    status: Optional[str] = Field(default="aberto", pattern="^(aberto|fechado|em_andamento|em_espera|tks_remoto)$")
    incidente_vendas: Optional[bool] = False
    numero: Optional[int] = None
    imagens: Optional[List[str]] = []


