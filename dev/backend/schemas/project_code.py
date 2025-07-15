from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional


class ProjectCodeBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=255, description="コードタイトル")
    code_content: str = Field(..., min_length=1, description="コード内容")
    language: str = Field(
        default="python", max_length=50, description="プログラミング言語"
    )
    description: Optional[str] = Field(None, max_length=1000, description="コード説明")


class ProjectCodeCreate(ProjectCodeBase):
    project_uuid: str = Field(..., description="プロジェクトUUID")


class ProjectCodeUpdate(BaseModel):
    title: Optional[str] = Field(
        None, min_length=1, max_length=255, description="コードタイトル"
    )
    code_content: Optional[str] = Field(None, min_length=1, description="コード内容")
    language: Optional[str] = Field(
        None, max_length=50, description="プログラミング言語"
    )
    description: Optional[str] = Field(None, max_length=1000, description="コード説明")


class ProjectCodeResponse(ProjectCodeBase):
    uuid: str = Field(..., description="コードUUID")
    project_uuid: str = Field(..., description="プロジェクトUUID")
    is_deleted: bool = Field(..., description="削除フラグ")
    created_at: datetime = Field(..., description="作成日時")
    updated_at: datetime = Field(..., description="更新日時")

    class Config:
        from_attributes = True


class ProjectCodeListResponse(BaseModel):
    codes: list[ProjectCodeResponse] = Field(..., description="コードリスト")
    total: int = Field(..., description="総件数")


class ProjectCodeDeleteResponse(BaseModel):
    message: str = Field(..., description="削除完了メッセージ")
    uuid: str = Field(..., description="削除されたコードUUID")
