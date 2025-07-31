from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import Dict
import os
from utils.database import get_db
from lib.auth.middleware import get_current_user
from models.user import User
from schemas.node import FlowchartGenerateRequest, FlowchartGenerateResponse
from services.flowchart_service import FlowchartService
from dotenv import load_dotenv

load_dotenv()

AZURE_OPENAI_API_KEY = os.getenv("AZURE_OPENAI_API_KEY")
AZURE_OPENAI_ENDPOINT = os.getenv("AZURE_OPENAI_ENDPOINT")
AZURE_OPENAI_API_VERSION = os.getenv("AZURE_OPENAI_API_VERSION")
AZURE_OPENAI_DEPLOYMENT_NAME = os.getenv("AZURE_OPENAI_DEPLOYMENT_NAME")

router = APIRouter(prefix="/api/flowchart", tags=["flowchart"])


def get_flowchart_service() -> FlowchartService:
    """
    FlowchartServiceのインスタンスを取得

    Returns:
        FlowchartService: フローチャートサービスのインスタンス

    Raises:
        HTTPException: Azure OpenAI設定が不正な場合
    """

    if not AZURE_OPENAI_API_KEY or not AZURE_OPENAI_ENDPOINT:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Azure OpenAI設定が不正です。API_KEYとENDPOINTを確認してください。",
        )

    return FlowchartService(
        api_key=AZURE_OPENAI_API_KEY,
        endpoint=AZURE_OPENAI_ENDPOINT,
        api_version=AZURE_OPENAI_API_VERSION,
        deployment_name=AZURE_OPENAI_DEPLOYMENT_NAME,
    )


@router.post("/generate", response_model=FlowchartGenerateResponse)
async def generate_flowchart(
    request: FlowchartGenerateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    flowchart_service: FlowchartService = Depends(get_flowchart_service),
) -> FlowchartGenerateResponse:
    """
    フローチャートを生成する

    Args:
        request: フローチャート生成リクエスト
        current_user: 現在のユーザー（認証済み）
        db: データベースセッション
        flowchart_service: フローチャートサービス

    Returns:
        FlowchartGenerateResponse: 生成されたフローチャート

    Raises:
        HTTPException: フローチャート生成に失敗した場合
    """
    try:
        # フローチャートを生成
        flowchart = await flowchart_service.generate_flowchart(
            code=request.code_content, language=request.language
        )

        return flowchart

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"フローチャート生成に失敗しました: {str(e)}",
        )


@router.get("/health")
async def health_check(
    flowchart_service: FlowchartService = Depends(get_flowchart_service),
) -> Dict[str, str]:
    """
    フローチャートサービスのヘルスチェック

    Args:
        flowchart_service: フローチャートサービス

    Returns:
        Dict[str, str]: ヘルスチェック結果
    """
    return {
        "status": "healthy",
        "service": "flowchart_generation",
        "message": "フローチャート生成サービスは正常に動作しています",
    }
