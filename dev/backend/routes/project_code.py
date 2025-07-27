from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from utils.database import get_db
from lib.auth.middleware import get_current_user
from schemas.project_code import (
    ProjectCodeCreate,
    ProjectCodeUpdate,
    ProjectCodeResponse,
    ProjectCodeListResponse,
    ProjectCodeDeleteResponse,
)
from services.project_code_service import ProjectCodeService
from models.user import User

router = APIRouter()


@router.post("/make", response_model=ProjectCodeResponse, summary="プロジェクトコード作成")
async def create_project_code(
    project_code: ProjectCodeCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """新しいプロジェクトコードを作成"""
    try:
        new_project_code = ProjectCodeService.create_project_code(
            db, project_code, current_user.uuid
        )
        return new_project_code
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"プロジェクトコードの作成に失敗しました: {str(e)}"
        )


@router.get(
    "/project/{project_uuid}",
    response_model=ProjectCodeListResponse,
    summary="プロジェクトコード一覧取得",
)
async def get_project_codes(
    project_uuid: str,
    skip: int = Query(0, ge=0, description="スキップ件数"),
    limit: int = Query(100, ge=1, le=1000, description="取得件数"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """指定されたプロジェクトのコード一覧を取得（削除済みは除外）"""
    codes = ProjectCodeService.get_project_codes_by_project(
        db, project_uuid, current_user.uuid, skip, limit
    )
    total = ProjectCodeService.get_project_codes_count(
        db, project_uuid, current_user.uuid
    )

    return ProjectCodeListResponse(codes=codes, total=total)


@router.get(
    "/{code_uuid}",
    response_model=ProjectCodeResponse,
    summary="プロジェクトコード詳細取得",
)
async def get_project_code(
    code_uuid: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """指定されたプロジェクトコードの詳細を取得"""
    project_code = ProjectCodeService.get_project_code_by_uuid(
        db, code_uuid, current_user.uuid
    )
    if not project_code:
        raise HTTPException(
            status_code=404, detail="プロジェクトコードが見つかりません"
        )

    return project_code


@router.put(
    "/{code_uuid}", response_model=ProjectCodeResponse, summary="プロジェクトコード更新"
)
async def update_project_code(
    code_uuid: str,
    project_code_update: ProjectCodeUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """プロジェクトコードを更新"""
    updated_project_code = ProjectCodeService.update_project_code(
        db, code_uuid, current_user.uuid, project_code_update
    )
    if not updated_project_code:
        raise HTTPException(
            status_code=404, detail="プロジェクトコードが見つかりません"
        )

    return updated_project_code


@router.delete(
    "/{code_uuid}",
    response_model=ProjectCodeDeleteResponse,
    summary="プロジェクトコード削除（ソフト削除）",
)
async def delete_project_code(
    code_uuid: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """プロジェクトコードをソフトデリート"""
    success = ProjectCodeService.soft_delete_project_code(
        db, code_uuid, current_user.uuid
    )
    if not success:
        raise HTTPException(
            status_code=404, detail="プロジェクトコードが見つかりません"
        )

    return ProjectCodeDeleteResponse(
        message="プロジェクトコードが削除されました", uuid=code_uuid
    )
