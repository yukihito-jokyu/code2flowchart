from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from schemas.auth import (
    SignupRequest,
    SignupResponse,
    LoginRequest,
    LoginResponse,
    LogoutResponse,
)
from auth.user_manager import UserManager
from auth.utils import create_access_token, blacklist_token
from auth.middleware import get_current_user, security
from utils.database import get_db
from models.user import User

router = APIRouter(prefix="/auth", tags=["authentication"])


@router.post("/signup", response_model=SignupResponse)
async def signup(signup_data: SignupRequest, db: Session = Depends(get_db)):
    """新規ユーザー登録"""
    user_manager = UserManager(db)

    # 既存ユーザーの確認
    existing_user = user_manager.get_user_by_email(signup_data.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User with this email already exists",
        )

    # 新規ユーザー作成
    user = user_manager.create_user(
        email=signup_data.email, password=signup_data.password
    )

    if not user:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create user",
        )

    return SignupResponse(
        id=user.uuid, email=user.email, message="User created successfully"
    )


@router.post("/login", response_model=LoginResponse)
async def login(login_data: LoginRequest, db: Session = Depends(get_db)):
    """ユーザーログイン"""
    user_manager = UserManager(db)

    # ユーザー認証
    user = user_manager.authenticate_user(
        email=login_data.email, password=login_data.password
    )

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )

    # JWTトークン生成
    access_token = create_access_token(data={"sub": user.uuid})

    return LoginResponse(
        id=user.uuid, email=user.email, token=access_token, message="Login successful"
    )


@router.post("/logout", response_model=LogoutResponse)
async def logout(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    current_user: User = Depends(get_current_user),
):
    """ユーザーログアウト"""
    # Authorizationヘッダーからトークンを取得してブラックリストに追加
    blacklist_token(credentials.credentials)

    return LogoutResponse(message="Logout successful")
