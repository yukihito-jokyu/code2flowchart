from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from mangum import Mangum
from routes.auth import router as auth_router
from routes.project import router as project_router
from routes.project_code import router as project_code_router
from utils.database import create_tables

app = FastAPI()

# CORS設定（React側からアクセスできるようにする）
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # ReactのURL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# データベーステーブルの作成
create_tables()

# ルーターの追加
app.include_router(auth_router, prefix="/api/auth", tags=["認証"])
app.include_router(project_router, prefix="/api/projects", tags=["プロジェクト"])
app.include_router(
    project_code_router, prefix="/api/project-codes", tags=["プロジェクトコード"]
)


@app.get("/api/hello")
async def hello():
    return {"message": "Hello from FastAPI!"}

handler = Mangum(app)
