from sqlalchemy import Column, String, DateTime, Boolean, Text, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid
from .user import Base


class Project(Base):
    __tablename__ = "projects"

    uuid = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_uuid = Column(String(36), ForeignKey("users.uuid"), nullable=False, index=True)
    name = Column(String(100), nullable=False)
    description = Column(Text, nullable=True)
    is_deleted = Column(Boolean, default=False, nullable=False, index=True)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    # リレーションシップ
    user = relationship("User", back_populates="projects")
    project_codes = relationship("ProjectCode", back_populates="project")

    def __repr__(self):
        return f"<Project(uuid='{self.uuid}', name='{self.name}', user_uuid='{self.user_uuid}')>"
