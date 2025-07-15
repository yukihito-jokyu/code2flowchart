# Node モデル

## 概要

フローチャートのノード情報を管理するための SQLAlchemy モデルです。プロジェクトに属するコードから生成されたフローチャートの各ノードの詳細情報を格納し、ソフトデリート機能を提供します。

## モデルのアーキテクチャ

### テーブル名
`nodes`

### カラム構成

| カラム名 | 型 | 制約 | 説明 |
|----------|-------------|------|------|
| uuid | String(36) | Primary Key | ノード識別子（UUID4形式） |
| project_uuid | String(36) | Foreign Key, Not Null, Index | プロジェクトUUID |
| code_uuid | String(36) | Foreign Key, Not Null, Index | コードUUID |
| node_id | Integer | Not Null | フローチャート内でのノードID |
| title | String(255) | Not Null | ノードタイトル |
| code_snippet | Text | Nullable | ノードに対応するコード片 |
| info | Text | Nullable | ノードの詳細情報 |
| type | Enum(NodeType) | Not Null, Default: NORMAL, Index | ノードタイプ |
| position_x | Integer | Not Null, Default: 0 | フローチャート上のX座標 |
| position_y | Integer | Not Null, Default: 0 | フローチャート上のY座標 |
| is_deleted | Boolean | Not Null, Default: False, Index | ソフトデリートフラグ |
| created_at | DateTime | Server Default: now() | 作成日時 |
| updated_at | DateTime | Server Default: now(), OnUpdate: now() | 更新日時 |

### ノードタイプ (NodeType Enum)

| 値 | 説明 |
|-----|------|
| IF | if文（条件分岐処理） |
| FOR_START | for文開始（繰り返し処理の開始点） |
| FOR_END | for文終了（繰り返し処理の終了点） |
| WHILE_START | while文開始（条件繰り返し処理の開始点） |
| WHILE_END | while文終了（条件繰り返し処理の終了点） |
| UNKNOWN | 未知の関数など（外部関数や不明な処理） |
| NORMAL | その他一般処理（通常の処理ステップ） |

### リレーションシップ

- **Project**: `project` - ノードが属するプロジェクトへの参照（back_populates="nodes"）
- **Code**: `code` - ノードが関連するコードへの参照（将来実装予定）

### 主要機能

1. **UUID主キー**: セキュアで予測困難な識別子
2. **外部キー制約**: プロジェクトテーブルとコードテーブルとの整合性保証
3. **ソフトデリート**: データの論理削除（物理削除ではない）
4. **インデックス**: project_uuid, code_uuid, type, is_deleted にインデックスを設定し、検索性能を向上
5. **自動タイムスタンプ**: 作成・更新日時の自動記録
6. **座標管理**: フローチャート上の位置情報管理

### 特徴

- ノードタイトルは最大255文字まで
- コードスニペットと詳細情報はText型で長文に対応
- is_deletedフラグによるソフトデリート機能
- プロジェクトとの多対1の関係性
- コードとの多対1の関係性
- フローチャートの座標情報（position_x, position_y）を保持
- ノードタイプによるフローチャートでの表示形式の制御

## 依存関係にあるファイル

- `models/project.py` - Project モデル（リレーションシップ）
- `models/user.py` - Base クラス（継承）
- `schemas/node.py` - Node 関連の Pydantic スキーマ
- `services/node_service.py` - Node ビジネスロジック（将来実装予定）
- `routes/node.py` - Node API エンドポイント（将来実装予定）

## ドキュメント更新履歴

- 2025-01-15: 初版作成
  - nodesテーブルのtype列をfor/while分割形式に変更
  - NodeTypeEnumを追加
  - SQLAlchemyモデルとPydanticスキーマの作成