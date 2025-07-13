from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.auth import router as auth_router
from utils.database import create_tables

app = FastAPI()

# CORS設定（React側からアクセスできるようにする）
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # ReactのURL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# データベーステーブルの作成
create_tables()

# ルーターの追加
app.include_router(auth_router, prefix="/api")


@app.get("/api/hello")
async def hello():
    return {"message": "Hello from FastAPI!"}
