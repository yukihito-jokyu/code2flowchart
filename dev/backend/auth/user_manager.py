from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from models.user import User
from auth.utils import get_password_hash, verify_password
from typing import Optional


class UserManager:
    def __init__(self, db: Session):
        self.db = db

    def create_user(self, email: str, password: str) -> Optional[User]:
        """新規ユーザーの作成"""
        try:
            # usernameをemailから生成（@より前の部分）
            username = email.split("@")[0]

            # 同じusernameが既に存在する場合は数字を付加
            base_username = username
            counter = 1
            while self.db.query(User).filter(User.username == username).first():
                username = f"{base_username}{counter}"
                counter += 1

            hashed_password = get_password_hash(password)

            user = User(username=username, email=email, password_hash=hashed_password)

            self.db.add(user)
            self.db.commit()
            self.db.refresh(user)
            return user

        except IntegrityError:
            self.db.rollback()
            return None

    def get_user_by_email(self, email: str) -> Optional[User]:
        """メールアドレスでユーザーを取得"""
        return self.db.query(User).filter(User.email == email).first()

    def get_user_by_uuid(self, uuid: str) -> Optional[User]:
        """UUIDでユーザーを取得"""
        return self.db.query(User).filter(User.uuid == uuid).first()

    def authenticate_user(self, email: str, password: str) -> Optional[User]:
        """ユーザー認証"""
        user = self.get_user_by_email(email)
        if not user:
            return None
        if not verify_password(password, user.password_hash):
            return None
        return user
