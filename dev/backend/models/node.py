from sqlalchemy import (
    Column,
    String,
    DateTime,
    Boolean,
    Text,
    ForeignKey,
    Integer,
    Enum,
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid
from enum import Enum as PyEnum
from .user import Base


class NodeType(PyEnum):
    IF = "if"
    FOR_START = "for_start"
    FOR_END = "for_end"
    WHILE_START = "while_start"
    WHILE_END = "while_end"
    UNKNOWN = "unknown"
    NORMAL = "normal"


class Node(Base):
    __tablename__ = "nodes"

    uuid = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    project_uuid = Column(
        String(36), ForeignKey("projects.uuid"), nullable=False, index=True
    )
    code_uuid = Column(String(36), ForeignKey("codes.uuid"), nullable=False, index=True)
    node_id = Column(Integer, nullable=False)
    title = Column(String(255), nullable=False)
    code_snippet = Column(Text, nullable=True)
    info = Column(Text, nullable=True)
    type = Column(Enum(NodeType), default=NodeType.NORMAL, nullable=False, index=True)
    position_x = Column(Integer, default=0, nullable=False)
    position_y = Column(Integer, default=0, nullable=False)
    is_deleted = Column(Boolean, default=False, nullable=False, index=True)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    # リレーションシップ
    project = relationship("Project", back_populates="nodes")
    # Note: codesテーブルのモデルが作成されたら、以下のリレーションシップも追加する必要があります
    # code = relationship("Code", back_populates="nodes")

    def __repr__(self):
        return f"<Node(uuid='{self.uuid}', title='{self.title}', type='{self.type.value}')>"
