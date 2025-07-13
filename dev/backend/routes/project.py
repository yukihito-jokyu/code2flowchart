from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from utils.database import get_db
from auth.middleware import get_current_user
from schemas.project import (
    ProjectCreate,
    ProjectUpdate,
    ProjectResponse,
    ProjectListResponse,
    ProjectDeleteResponse,
)
from services.project_service import ProjectService
from models.user import User

router = APIRouter()


@router.post("/", response_model=ProjectResponse, summary="プロジェクト作成")
async def create_project(
    project: ProjectCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """新しいプロジェクトを作成"""
    try:
        new_project = ProjectService.create_project(db, project, current_user.uuid)
        return new_project
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"プロジェクトの作成に失敗しました: {str(e)}"
        )


@router.get("/", response_model=ProjectListResponse, summary="プロジェクト一覧取得")
async def get_projects(
    skip: int = Query(0, ge=0, description="スキップ件数"),
    limit: int = Query(100, ge=1, le=1000, description="取得件数"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """ユーザーのプロジェクト一覧を取得（削除済みは除外）"""
    projects = ProjectService.get_projects_by_user(db, current_user.uuid, skip, limit)
    total = ProjectService.get_projects_count(db, current_user.uuid)

    return ProjectListResponse(projects=projects, total=total)


@router.get(
    "/deleted",
    response_model=ProjectListResponse,
    summary="削除済みプロジェクト一覧取得",
)
async def get_deleted_projects(
    skip: int = Query(0, ge=0, description="スキップ件数"),
    limit: int = Query(100, ge=1, le=1000, description="取得件数"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """削除済みプロジェクト一覧を取得"""
    projects = ProjectService.get_deleted_projects(db, current_user.uuid, skip, limit)
    total = len(projects)  # 削除済みはページング用の総数は簡略化

    return ProjectListResponse(projects=projects, total=total)


@router.get(
    "/{project_uuid}", response_model=ProjectResponse, summary="プロジェクト詳細取得"
)
async def get_project(
    project_uuid: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """指定されたプロジェクトの詳細を取得"""
    project = ProjectService.get_project_by_uuid(db, project_uuid, current_user.uuid)
    if not project:
        raise HTTPException(status_code=404, detail="プロジェクトが見つかりません")

    return project


@router.put(
    "/{project_uuid}", response_model=ProjectResponse, summary="プロジェクト更新"
)
async def update_project(
    project_uuid: str,
    project_update: ProjectUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """プロジェクトを更新"""
    updated_project = ProjectService.update_project(
        db, project_uuid, current_user.uuid, project_update
    )
    if not updated_project:
        raise HTTPException(status_code=404, detail="プロジェクトが見つかりません")

    return updated_project


@router.delete(
    "/{project_uuid}",
    response_model=ProjectDeleteResponse,
    summary="プロジェクト削除（ソフト削除）",
)
async def delete_project(
    project_uuid: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """プロジェクトをソフトデリート"""
    success = ProjectService.soft_delete_project(db, project_uuid, current_user.uuid)
    if not success:
        raise HTTPException(status_code=404, detail="プロジェクトが見つかりません")

    return ProjectDeleteResponse(
        message="プロジェクトが削除されました", uuid=project_uuid
    )


@router.post(
    "/{project_uuid}/restore",
    response_model=ProjectResponse,
    summary="プロジェクト復元",
)
async def restore_project(
    project_uuid: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """削除済みプロジェクトを復元"""
    success = ProjectService.restore_project(db, project_uuid, current_user.uuid)
    if not success:
        raise HTTPException(
            status_code=404, detail="削除済みプロジェクトが見つかりません"
        )

    # 復元したプロジェクトを取得して返す
    restored_project = ProjectService.get_project_by_uuid(
        db, project_uuid, current_user.uuid
    )
    return restored_project


@router.delete(
    "/{project_uuid}/hard",
    response_model=ProjectDeleteResponse,
    summary="プロジェクト完全削除",
)
async def hard_delete_project(
    project_uuid: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """プロジェクトを物理削除（完全削除・復元不可）"""
    success = ProjectService.hard_delete_project(db, project_uuid, current_user.uuid)
    if not success:
        raise HTTPException(status_code=404, detail="プロジェクトが見つかりません")

    return ProjectDeleteResponse(
        message="プロジェクトが完全に削除されました", uuid=project_uuid
    )
