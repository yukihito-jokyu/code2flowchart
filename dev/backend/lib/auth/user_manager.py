from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from models.user import User
from typing import Optional


class UserManager:
    def __init__(self, db: Session):
        self.db = db

    def create_user(
        self, email: str, password: str, user_name: str = None
    ) -> Optional[User]:
        """新規ユーザーの作成（Google OAuth用）"""
        try:
            if user_name:
                username = user_name
            else:
                # usernameをemailから生成（@より前の部分）
                username = email.split("@")[0]

            # 同じusernameが既に存在する場合は数字を付加（削除済みユーザーも含めてチェック）
            base_username = username
            counter = 1
            while self.db.query(User).filter(User.username == username).first():
                username = f"{base_username}{counter}"
                counter += 1

            # パスワードはGoogle認証用のランダムな値を設定
            user = User(username=username, email=email, password_hash=password)

            self.db.add(user)
            self.db.commit()
            self.db.refresh(user)
            return user

        except IntegrityError:
            self.db.rollback()
            return None

    def get_user_by_email(
        self, email: str, include_deleted: bool = False
    ) -> Optional[User]:
        """メールアドレスでユーザーを取得"""
        query = self.db.query(User).filter(User.email == email)
        if not include_deleted:
            query = query.filter(User.is_deleted == include_deleted)
        return query.first()

    def get_user_by_uuid(
        self, uuid: str, include_deleted: bool = False
    ) -> Optional[User]:
        """UUIDでユーザーを取得"""
        query = self.db.query(User).filter(User.uuid == uuid)
        if not include_deleted:
            query = query.filter(User.is_deleted == include_deleted)
        return query.first()
