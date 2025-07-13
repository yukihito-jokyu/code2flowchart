from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from models.user import Base
import os


DATABASE_URL = os.getenv(
    "DATABASE_URL", "mysql+pymysql://flowuser:flowpassword@localhost:3306/flow"
)

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db() -> Session:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def create_tables():
    Base.metadata.create_all(bind=engine)
