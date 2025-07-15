from sqlalchemy import Column, String, DateTime, Boolean, Text, ForeignKey, Index
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid
from .user import Base


class ProjectCode(Base):
    __tablename__ = "project_codes"

    uuid = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    project_uuid = Column(
        String(36), ForeignKey("projects.uuid"), nullable=False, index=True
    )
    title = Column(String(255), nullable=False)
    code_content = Column(Text, nullable=False)
    language = Column(String(50), nullable=False, default="python")
    description = Column(Text, nullable=True)
    is_deleted = Column(Boolean, default=False, nullable=False, index=True)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    # リレーションシップ
    project = relationship("Project", back_populates="project_codes")

    # インデックス
    __table_args__ = (Index("ix_project_codes_project_uuid", "project_uuid"),)

    def __repr__(self):
        return f"<ProjectCode(uuid='{self.uuid}', title='{self.title}', project_uuid='{self.project_uuid}')>"
