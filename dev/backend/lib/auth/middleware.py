from fastapi import HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from lib.auth.utils import verify_token
from lib.auth.user_manager import UserManager
from utils.database import get_db
from models.user import User
from typing import Optional

security = HTTPBearer()


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db),
) -> User:
    """現在のユーザーを取得（認証必須）"""
    token = credentials.credentials
    payload = verify_token(token)

    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

    user_uuid = payload.get("sub")
    if user_uuid is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

    user_manager = UserManager(db)
    user = user_manager.get_user_by_uuid(user_uuid)

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return user


async def get_current_user_optional(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(
        HTTPBearer(auto_error=False)
    ),
    db: Session = Depends(get_db),
) -> Optional[User]:
    """現在のユーザーを取得（認証オプショナル）"""
    if credentials is None:
        return None

    try:
        token = credentials.credentials
        payload = verify_token(token)

        if payload is None:
            return None

        user_uuid = payload.get("sub")
        if user_uuid is None:
            return None

        user_manager = UserManager(db)
        user = user_manager.get_user_by_uuid(user_uuid)

        return user
    except Exception:
        return None
