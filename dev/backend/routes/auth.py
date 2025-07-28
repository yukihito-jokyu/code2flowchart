from fastapi import APIRouter, Depends, Request
from fastapi.responses import RedirectResponse, JSONResponse
from sqlalchemy.orm import Session
from google_auth_oauthlib.flow import Flow
from lib.auth.user_manager import UserManager
from lib.auth.utils import (
    create_access_token,
    get_id_info,
    generate_random_password,
)
from utils.database import get_db
from config.config import SCOPES, GOOGLE_CLIENT_SECRET_FILE, REDIRECT_URI
from dotenv import load_dotenv
import os

load_dotenv()

FRONT_DOMAIN = os.getenv("FRONT_DOMAIN")

router = APIRouter()


@router.get("/login")
def request_show_google_login_page():
    """
    Google OAuth2 のログイン画面を表示するようにGoogleへ要求する。

    Args:
        void

    Returns:
        dict: 認証結果などを含むレスポンス。
    """
    flow = Flow.from_client_secrets_file(
        GOOGLE_CLIENT_SECRET_FILE,
        scopes=SCOPES,
        redirect_uri=REDIRECT_URI,
    )

    auth_url, _ = flow.authorization_url(
        access_type="offline",
        include_granted_scopes="true",
    )

    return RedirectResponse(auth_url)


@router.get("/google-oauth/callback")
def callback(request: Request, db: Session = Depends(get_db)):
    """
    Google OAuth2 のコールバックエンドポイント。

    Args:
        request (Request): FastAPI のリクエストオブジェクト。

    Returns:
        リダイレクトレスポンス
    """

    # 認可コードを取得（クエリパラメータ）
    code = request.query_params.get("code")
    if not code:
        return JSONResponse(
            content={"error": "認可コードが見つかりません"}, status_code=400
        )

    # Flowを再生成（同じclient_secretとredirect_uriで）
    flow = Flow.from_client_secrets_file(
        GOOGLE_CLIENT_SECRET_FILE,
        scopes=SCOPES,
        redirect_uri=REDIRECT_URI,
    )

    # 認可コードを使ってトークンを取得
    flow.fetch_token(code=code)

    # アクセストークンなどの情報を取り出す
    credentials = flow.credentials
    id_info = get_id_info(credentials.id_token)

    email = id_info["email"]
    name = id_info.get("name")
    user_manager = UserManager(db)

    user = user_manager.get_user_by_email(email=email)
    if not user:
        password = generate_random_password()
        user = user_manager.create_user(email=email, password=password, user_name=name)

    # JWTトークン生成
    access_token = create_access_token(data={"sub": user.uuid})

    redirect_url = f"{FRONT_DOMAIN}/dashboard?token={access_token}&email={user.email}&id={user.uuid}"

    # フロントエンドに処理を返してダッシュボードへ画面遷移させる。
    return RedirectResponse(url=redirect_url)


