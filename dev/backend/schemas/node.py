from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional
from enum import Enum


class NodeType(str, Enum):
    IF = "if"
    FOR_START = "for_start"
    FOR_END = "for_end"
    WHILE_START = "while_start"
    WHILE_END = "while_end"
    UNKNOWN = "unknown"
    NORMAL = "normal"


class NodeBase(BaseModel):
    node_id: int = Field(..., description="ノードID")
    title: str = Field(..., min_length=1, max_length=255, description="ノードタイトル")
    code_snippet: Optional[str] = Field(None, description="コードスニペット")
    info: Optional[str] = Field(None, description="ノード情報")
    type: NodeType = Field(NodeType.NORMAL, description="ノードタイプ")
    position_x: int = Field(0, description="X座標")
    position_y: int = Field(0, description="Y座標")


class NodeCreate(NodeBase):
    project_uuid: str = Field(..., description="プロジェクトUUID")
    code_uuid: str = Field(..., description="コードUUID")


class NodeUpdate(BaseModel):
    title: Optional[str] = Field(
        None, min_length=1, max_length=255, description="ノードタイトル"
    )
    code_snippet: Optional[str] = Field(None, description="コードスニペット")
    info: Optional[str] = Field(None, description="ノード情報")
    type: Optional[NodeType] = Field(None, description="ノードタイプ")
    position_x: Optional[int] = Field(None, description="X座標")
    position_y: Optional[int] = Field(None, description="Y座標")


class NodeResponse(NodeBase):
    uuid: str = Field(..., description="ノードUUID")
    project_uuid: str = Field(..., description="プロジェクトUUID")
    code_uuid: str = Field(..., description="コードUUID")
    is_deleted: bool = Field(..., description="削除フラグ")
    created_at: datetime = Field(..., description="作成日時")
    updated_at: datetime = Field(..., description="更新日時")

    class Config:
        from_attributes = True


class NodeListResponse(BaseModel):
    nodes: list[NodeResponse] = Field(..., description="ノードリスト")
    total: int = Field(..., description="総件数")


class NodeDeleteResponse(BaseModel):
    message: str = Field(..., description="削除完了メッセージ")
    uuid: str = Field(..., description="削除されたノードUUID")


# フローチャート生成用スキーマ
class EdgeCreate(BaseModel):
    source: int = Field(..., description="ソースノードID")
    target: int = Field(..., description="ターゲットノードID")
    source_handle: str = Field(..., description="ソースの種類")


class FlowchartNodeCreate(BaseModel):
    id: int = Field(..., description="ノードID")
    title: str = Field(..., min_length=1, max_length=255, description="ノードタイトル")
    code: Optional[str] = Field(None, description="コードスニペット")
    info: Optional[str] = Field(None, description="ノード説明")
    type: NodeType = Field(NodeType.NORMAL, description="ノードタイプ")
    position: dict = Field(..., description="ノード位置 (x, y座標)")


class FlowchartGenerateRequest(BaseModel):
    code_content: str = Field(..., min_length=1, description="解析対象のコード")
    language: str = Field(default="python", description="プログラミング言語")


class FlowchartGenerateResponse(BaseModel):
    nodes: list[FlowchartNodeCreate] = Field(
        ..., description="フローチャートノードリスト"
    )
    edges: list[EdgeCreate] = Field(..., description="フローチャートエッジリスト")
