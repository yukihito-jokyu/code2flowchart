from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional


class ProjectBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100, description="プロジェクト名")
    description: Optional[str] = Field(
        None, max_length=1000, description="プロジェクト説明"
    )


class ProjectCreate(ProjectBase):
    pass


class ProjectUpdate(BaseModel):
    name: Optional[str] = Field(
        None, min_length=1, max_length=100, description="プロジェクト名"
    )
    description: Optional[str] = Field(
        None, max_length=1000, description="プロジェクト説明"
    )


class ProjectResponse(ProjectBase):
    uuid: str = Field(..., description="プロジェクトUUID")
    user_uuid: str = Field(..., description="ユーザーUUID")
    is_deleted: bool = Field(..., description="削除フラグ")
    created_at: datetime = Field(..., description="作成日時")
    updated_at: datetime = Field(..., description="更新日時")

    class Config:
        from_attributes = True


class ProjectListResponse(BaseModel):
    projects: list[ProjectResponse] = Field(..., description="プロジェクトリスト")
    total: int = Field(..., description="総件数")


class ProjectDeleteResponse(BaseModel):
    message: str = Field(..., description="削除完了メッセージ")
    uuid: str = Field(..., description="削除されたプロジェクトUUID")
