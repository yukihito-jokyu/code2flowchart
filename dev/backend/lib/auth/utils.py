from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
from fastapi import HTTPException
from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
import secrets
from dotenv import load_dotenv
import os
import string

load_dotenv()

CLIENT_ID = os.getenv("CLIENT_ID")

SECRET_KEY = secrets.token_urlsafe(32)
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """JWTアクセストークンの作成"""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def verify_token(token: str) -> Optional[dict]:
    """JWTトークンの検証"""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        return None


def get_id_info(id_token_str: str) -> dict:
    try:
        # Google の公開鍵と照合して検証
        id_info = id_token.verify_oauth2_token(
            id_token_str,
            google_requests.Request(),
            audience=CLIENT_ID,  # ← フロントエンドと一致させる
        )
        return id_info
    except ValueError:
        raise HTTPException(status_code=401, detail="Invalid ID token")


def generate_random_password(length: int = 16) -> str:
    """英数字・記号を含んだランダムな安全なパスワードを生成"""
    if length < 8:
        raise ValueError("パスワードは最低8文字以上にしてください")

    alphabet = string.ascii_letters + string.digits + string.punctuation

    # 少なくとも1文字ずつ含める（強度担保のため）
    while True:
        password = "".join(secrets.choice(alphabet) for _ in range(length))
        if (
            any(c.islower() for c in password)
            and any(c.isupper() for c in password)
            and any(c.isdigit() for c in password)
            and any(c in string.punctuation for c in password)
        ):
            return password
