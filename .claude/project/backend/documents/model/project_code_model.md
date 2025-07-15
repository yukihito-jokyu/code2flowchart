# ProjectCode Model

## 概要

ProjectCode モデルは、プロジェクトレベルで独立したコードを管理するためのSQLAlchemyモデルです。既存のcodesテーブルがノードと紐づくコードを管理するのに対し、ProjectCodeはノードと紐づかない独立したコードを管理します。

## モデルのアーキテクチャ

### テーブル構造

```python
class ProjectCode(Base):
    __tablename__ = "project_codes"
    
    uuid: Column(String(36), primary_key=True) # 主キー
    project_uuid: Column(String(36), ForeignKey, nullable=False, index=True) # プロジェクトUUID
    title: Column(String(255), nullable=False) # コードタイトル
    code_content: Column(Text, nullable=False) # コード内容
    language: Column(String(50), nullable=False, default="python") # プログラミング言語
    description: Column(Text, nullable=True) # コード説明
    is_deleted: Column(Boolean, default=False, nullable=False, index=True) # ソフトデリートフラグ
    created_at: Column(DateTime, server_default=func.now()) # 作成日時
    updated_at: Column(DateTime, server_default=func.now(), onupdate=func.now()) # 更新日時
```

### 主要な特徴

1. **独立性**: ノードと紐づかない独立したコード管理
2. **プロジェクト関連**: project_uuidでプロジェクトと関連付け
3. **ソフトデリート**: is_deletedによる論理削除
4. **インデックス最適化**: project_uuidにインデックスを設定
5. **多言語対応**: 複数のプログラミング言語をサポート

### リレーションシップ

```python
# プロジェクトとの関係
project = relationship("Project", back_populates="project_codes")
```

### インデックス

```python
__table_args__ = (
    Index("ix_project_codes_project_uuid", "project_uuid"),
)
```

## 依存関係にあるファイル

- `models/user.py` - Baseクラスの継承
- `models/project.py` - プロジェクトとのリレーション
- `schemas/project_code.py` - データ検証とシリアライゼーション
- `services/project_code_service.py` - ビジネスロジック
- `routes/project_code.py` - API エンドポイント
- `utils/database.py` - データベース接続

## ドキュメント更新履歴

- 2024-01-XX: 初版作成 - ProjectCode モデルの実装 (Issue #25)