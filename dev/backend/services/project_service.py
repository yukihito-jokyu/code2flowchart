from sqlalchemy.orm import Session
from sqlalchemy import and_
from typing import List, Optional
import uuid
from datetime import datetime

from models.project import Project
from schemas.project import ProjectCreate, ProjectUpdate


class ProjectService:
    """プロジェクト関連のビジネスロジック"""

    @staticmethod
    def create_project(
        db: Session, project_data: ProjectCreate, user_uuid: str
    ) -> Project:
        """新しいプロジェクトを作成"""
        db_project = Project(
            uuid=str(uuid.uuid4()),
            user_uuid=user_uuid,
            name=project_data.name,
            description=project_data.description,
        )
        db.add(db_project)
        db.commit()
        db.refresh(db_project)
        return db_project

    @staticmethod
    def get_project_by_uuid(
        db: Session, project_uuid: str, user_uuid: str
    ) -> Optional[Project]:
        """UUIDでプロジェクトを取得（ソフトデリート済みは除外）"""
        return (
            db.query(Project)
            .filter(
                and_(
                    Project.uuid == project_uuid,
                    Project.user_uuid == user_uuid,
                    Project.is_deleted.is_(False),
                )
            )
            .first()
        )

    @staticmethod
    def get_projects_by_user(
        db: Session, user_uuid: str, skip: int = 0, limit: int = 100
    ) -> List[Project]:
        """ユーザーのプロジェクト一覧を取得（ソフトデリート済みは除外）"""
        return (
            db.query(Project)
            .filter(and_(Project.user_uuid == user_uuid, Project.is_deleted.is_(False)))
            .order_by(Project.updated_at.desc())
            .offset(skip)
            .limit(limit)
            .all()
        )

    @staticmethod
    def get_projects_count(db: Session, user_uuid: str) -> int:
        """ユーザーのプロジェクト数を取得（ソフトデリート済みは除外）"""
        return (
            db.query(Project)
            .filter(and_(Project.user_uuid == user_uuid, Project.is_deleted.is_(False)))
            .count()
        )

    @staticmethod
    def update_project(
        db: Session, project_uuid: str, user_uuid: str, project_data: ProjectUpdate
    ) -> Optional[Project]:
        """プロジェクトを更新"""
        db_project = ProjectService.get_project_by_uuid(db, project_uuid, user_uuid)
        if not db_project:
            return None

        update_data = project_data.model_dump(exclude_unset=True)
        if update_data:
            for field, value in update_data.items():
                setattr(db_project, field, value)
            db_project.updated_at = datetime.utcnow()
            db.commit()
            db.refresh(db_project)

        return db_project

    @staticmethod
    def soft_delete_project(db: Session, project_uuid: str, user_uuid: str) -> bool:
        """プロジェクトをソフトデリート"""
        db_project = ProjectService.get_project_by_uuid(db, project_uuid, user_uuid)
        if not db_project:
            return False

        db_project.is_deleted = True
        db_project.updated_at = datetime.utcnow()
        db.commit()
        return True

    @staticmethod
    def restore_project(db: Session, project_uuid: str, user_uuid: str) -> bool:
        """ソフトデリートされたプロジェクトを復元"""
        db_project = (
            db.query(Project)
            .filter(
                and_(
                    Project.uuid == project_uuid,
                    Project.user_uuid == user_uuid,
                    Project.is_deleted.is_(True),
                )
            )
            .first()
        )

        if not db_project:
            return False

        db_project.is_deleted = False
        db_project.updated_at = datetime.utcnow()
        db.commit()
        return True

    @staticmethod
    def get_deleted_projects(
        db: Session, user_uuid: str, skip: int = 0, limit: int = 100
    ) -> List[Project]:
        """削除済みプロジェクト一覧を取得"""
        return (
            db.query(Project)
            .filter(and_(Project.user_uuid == user_uuid, Project.is_deleted.is_(True)))
            .order_by(Project.updated_at.desc())
            .offset(skip)
            .limit(limit)
            .all()
        )

    @staticmethod
    def hard_delete_project(db: Session, project_uuid: str, user_uuid: str) -> bool:
        """プロジェクトを物理削除（完全削除）"""
        db_project = (
            db.query(Project)
            .filter(and_(Project.uuid == project_uuid, Project.user_uuid == user_uuid))
            .first()
        )

        if not db_project:
            return False

        db.delete(db_project)
        db.commit()
        return True
