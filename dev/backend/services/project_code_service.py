from sqlalchemy.orm import Session
from sqlalchemy import and_
from typing import List, Optional
import uuid
from datetime import datetime

from models.project_code import ProjectCode
from models.project import Project
from schemas.project_code import ProjectCodeCreate, ProjectCodeUpdate


class ProjectCodeService:
    """プロジェクトコード関連のビジネスロジック"""

    @staticmethod
    def create_project_code(
        db: Session, project_code_data: ProjectCodeCreate, user_uuid: str
    ) -> ProjectCode:
        """新しいプロジェクトコードを作成"""
        # プロジェクトの存在確認とユーザー権限チェック
        project = (
            db.query(Project)
            .filter(
                and_(
                    Project.uuid == project_code_data.project_uuid,
                    Project.user_uuid == user_uuid,
                    Project.is_deleted.is_(False),
                )
            )
            .first()
        )

        if not project:
            raise Exception("プロジェクトが見つからないか、アクセス権限がありません")

        db_project_code = ProjectCode(
            uuid=str(uuid.uuid4()),
            project_uuid=project_code_data.project_uuid,
            title=project_code_data.title,
            code_content=project_code_data.code_content,
            language=project_code_data.language,
            description=project_code_data.description,
        )
        db.add(db_project_code)
        db.commit()
        db.refresh(db_project_code)
        return db_project_code

    @staticmethod
    def get_project_code_by_uuid(
        db: Session, code_uuid: str, user_uuid: str
    ) -> Optional[ProjectCode]:
        """UUIDでプロジェクトコードを取得（ソフトデリート済みは除外）"""
        return (
            db.query(ProjectCode)
            .join(Project)
            .filter(
                and_(
                    ProjectCode.uuid == code_uuid,
                    Project.user_uuid == user_uuid,
                    ProjectCode.is_deleted.is_(False),
                    Project.is_deleted.is_(False),
                )
            )
            .first()
        )

    @staticmethod
    def get_project_codes_by_project(
        db: Session, project_uuid: str, user_uuid: str, skip: int = 0, limit: int = 100
    ) -> List[ProjectCode]:
        """プロジェクトのコード一覧を取得（ソフトデリート済みは除外）"""
        return (
            db.query(ProjectCode)
            .join(Project)
            .filter(
                and_(
                    ProjectCode.project_uuid == project_uuid,
                    Project.user_uuid == user_uuid,
                    ProjectCode.is_deleted.is_(False),
                    Project.is_deleted.is_(False),
                )
            )
            .order_by(ProjectCode.updated_at.desc())
            .offset(skip)
            .limit(limit)
            .all()
        )

    @staticmethod
    def get_project_codes_count(db: Session, project_uuid: str, user_uuid: str) -> int:
        """プロジェクトのコード数を取得（ソフトデリート済みは除外）"""
        return (
            db.query(ProjectCode)
            .join(Project)
            .filter(
                and_(
                    ProjectCode.project_uuid == project_uuid,
                    Project.user_uuid == user_uuid,
                    ProjectCode.is_deleted.is_(False),
                    Project.is_deleted.is_(False),
                )
            )
            .count()
        )

    @staticmethod
    def update_project_code(
        db: Session,
        code_uuid: str,
        user_uuid: str,
        project_code_data: ProjectCodeUpdate,
    ) -> Optional[ProjectCode]:
        """プロジェクトコードを更新"""
        db_project_code = ProjectCodeService.get_project_code_by_uuid(
            db, code_uuid, user_uuid
        )
        if not db_project_code:
            return None

        update_data = project_code_data.model_dump(exclude_unset=True)
        if update_data:
            for field, value in update_data.items():
                setattr(db_project_code, field, value)
            db_project_code.updated_at = datetime.utcnow()
            db.commit()
            db.refresh(db_project_code)

        return db_project_code

    @staticmethod
    def soft_delete_project_code(db: Session, code_uuid: str, user_uuid: str) -> bool:
        """プロジェクトコードをソフトデリート"""
        db_project_code = ProjectCodeService.get_project_code_by_uuid(
            db, code_uuid, user_uuid
        )
        if not db_project_code:
            return False

        db_project_code.is_deleted = True
        db_project_code.updated_at = datetime.utcnow()
        db.commit()
        return True
