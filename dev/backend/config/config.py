import os
from pathlib import Path

# アプリケーションソースのルート。
APP_DIR = Path(__file__).resolve().parent.parent

# GoogleClientSecretFileの場所を指定する。
GOOGLE_CLIENT_SECRET_FILE = APP_DIR / "config" / "api_keys" / "client_secret.json"

# リダイレクトURI（Google Cloudの承認済みのリダイレクト URIと一致させる）
REDIRECT_URI = "http://localhost:8000/api/auth/google-oauth/callback"

# 認可スコープ
SCOPES = [
    "openid",
    "https://www.googleapis.com/auth/userinfo.email",
    "https://www.googleapis.com/auth/userinfo.profile",
]

# Azure OpenAI設定
AZURE_OPENAI_API_KEY = os.getenv("AZURE_OPENAI_API_KEY")
AZURE_OPENAI_ENDPOINT = os.getenv("AZURE_OPENAI_ENDPOINT")
AZURE_OPENAI_DEPLOYMENT = os.getenv("AZURE_OPENAI_DEPLOYMENT", "gpt-4")
AZURE_OPENAI_API_VERSION = os.getenv("AZURE_OPENAI_API_VERSION", "2024-02-15-preview")
