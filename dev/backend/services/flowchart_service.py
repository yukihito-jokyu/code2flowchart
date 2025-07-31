import ast
import json
import re
import logging
from typing import List, Dict, Any
from openai import AzureOpenAI
from schemas.node import (
    FlowchartNodeCreate,
    EdgeCreate,
    FlowchartGenerateResponse,
    NodeType,
)

logger = logging.getLogger(__name__)


class FlowchartService:
    def __init__(
        self, api_key: str, endpoint: str, api_version: str, deployment_name: str
    ):
        """
        Azure OpenAIクライアントを初期化

        Args:
            api_key: Azure OpenAI APIキー
            endpoint: Azure OpenAIエンドポイント
        """
        logger.info("FlowchartService初期化開始")
        try:
            self.client = AzureOpenAI(
                azure_endpoint=endpoint,
                api_key=api_key,
                api_version=api_version,
            )
            self.deployment_name = deployment_name
            logger.info(f"FlowchartService初期化完了 - deployment: {deployment_name}")
        except Exception as e:
            logger.error(f"FlowchartService初期化エラー: {e}")
            raise

    @staticmethod
    def _analyze_python_code(code: str) -> List[Dict[str, Any]]:
        """
        Pythonコードを静的解析してノード情報を抽出

        Args:
            code: 解析対象のPythonコード

        Returns:
            ノード情報のリスト
        """
        logger.info("Pythonコード静的解析開始")
        logger.debug(f"解析対象コード長: {len(code)}文字")

        try:
            tree = ast.parse(code)
            nodes = []
            node_id = 1

            for node in ast.walk(tree):
                if isinstance(node, ast.If):
                    nodes.append(
                        {
                            "id": node_id,
                            "type": NodeType.IF,
                            "title": f"条件分岐 {node_id}",
                            "code": ast.get_source_segment(code, node) or "",
                            "info": "if文による条件分岐",
                            "line": node.lineno if hasattr(node, "lineno") else 0,
                        }
                    )
                    node_id += 1

                elif isinstance(node, ast.For):
                    nodes.append(
                        {
                            "id": node_id,
                            "type": NodeType.FOR_START,
                            "title": f"for文開始 {node_id}",
                            "code": ast.get_source_segment(code, node) or "",
                            "info": "for文による繰り返し処理の開始",
                            "line": node.lineno if hasattr(node, "lineno") else 0,
                        }
                    )
                    node_id += 1

                elif isinstance(node, ast.While):
                    nodes.append(
                        {
                            "id": node_id,
                            "type": NodeType.WHILE_START,
                            "title": f"while文開始 {node_id}",
                            "code": ast.get_source_segment(code, node) or "",
                            "info": "while文による繰り返し処理の開始",
                            "line": node.lineno if hasattr(node, "lineno") else 0,
                        }
                    )
                    node_id += 1

                elif isinstance(node, ast.FunctionDef):
                    nodes.append(
                        {
                            "id": node_id,
                            "type": NodeType.NORMAL,
                            "title": f"関数定義: {node.name}",
                            "code": ast.get_source_segment(code, node) or "",
                            "info": f"関数 {node.name} の定義",
                            "line": node.lineno if hasattr(node, "lineno") else 0,
                        }
                    )
                    node_id += 1

            sorted_nodes = sorted(nodes, key=lambda x: x.get("line", 0))
            logger.info(f"Pythonコード静的解析完了 - 検出ノード数: {len(sorted_nodes)}")
            return sorted_nodes

        except SyntaxError as e:
            logger.warning(f"Pythonコード構文エラー: {e}")
            # 構文エラーの場合は基本的なノードを返す
            return [
                {
                    "id": 1,
                    "type": NodeType.UNKNOWN,
                    "title": "構文エラー",
                    "code": code[:100] + "..." if len(code) > 100 else code,
                    "info": "コードに構文エラーがあります",
                    "line": 0,
                }
            ]

    @staticmethod
    def _generate_edges(nodes: List[Dict[str, Any]]) -> List[EdgeCreate]:
        """
        ノード間のエッジを生成

        Args:
            nodes: ノード情報のリスト

        Returns:
            エッジのリスト
        """
        logger.info(f"エッジ生成開始 - ノード数: {len(nodes)}")
        edges = []

        for i in range(len(nodes) - 1):
            # 基本的に順次実行でエッジを作成
            edges.append(EdgeCreate(source=nodes[i]["id"], target=nodes[i + 1]["id"]))

        logger.info(f"エッジ生成完了 - 生成エッジ数: {len(edges)}")
        return edges

    @staticmethod
    def _calculate_positions(nodes: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        ノードの配置位置を計算

        Args:
            nodes: ノード情報のリスト

        Returns:
            位置情報を含むノード情報のリスト
        """
        logger.info(f"ノード位置計算開始 - ノード数: {len(nodes)}")
        positioned_nodes = []
        y_offset = 0
        x_base = 200

        for i, node in enumerate(nodes):
            # ノードタイプに応じて位置を調整
            if node["type"] in [NodeType.FOR_START, NodeType.WHILE_START]:
                x_position = x_base + 50
            elif node["type"] in [NodeType.FOR_END, NodeType.WHILE_END]:
                x_position = x_base - 50
            else:
                x_position = x_base

            positioned_node = node.copy()
            positioned_node["position"] = {"x": x_position, "y": y_offset}
            positioned_nodes.append(positioned_node)

            y_offset += 100

        logger.info("ノード位置計算完了")
        return positioned_nodes

    async def _generate_with_ai(self, code: str, language: str) -> Dict[str, Any]:
        """
        Azure ChatGPT APIを使用してフローチャートを生成

        Args:
            code: 解析対象のコード
            language: プログラミング言語

        Returns:
            フローチャート情報
        """
        logger.info(f"AI生成開始 - 言語: {language}, コード長: {len(code)}文字")

        prompt = f"""
        step by step で実行してください。
        ## タスク
        以下の{language}コードを処理や文法ごとに分割し、`node`と`node`同士を繋げる`edge`として定義してください。

        コード:
        ```{language}
        {code}
        ```

        ## nodeについて
        分割したコードを基に以下の内容を考察してください。
        - id: 0番目から
        - title: 分割したコードの一言説明
        - code: 分割したコード
        - info: 分割したコードの詳細な説明
        - type: 分割したコードの属性（if/for_start/for_end/while_start/while_end/unknown/normal）
        - position: 処理の最初の値は {{ x: 0, y: 0 }}それ以外のnodeはx>0, y>0の位置で値が被らないようにして下さい。
        ### typeの値について
        - if文もしくはelif文の場合: 'if'
        - for文始まりの場合: 'for_start'
        - for文終わりの場合: 'for_end'
        - while文始まりの場合: 'while_start'
        - while文終わりの場合: 'while_end'
        - 知識に無い不明関数の場合: 'unkown'
        - それ以外の場合: normal

        ### nodeの出力例
        {{
            "id": 0,
            "position": {{ "x": 0, "y": 0 }},
            "data": {{
                "title": "条件分岐",
                "code": "if x > 0:",
                "info": "xが0より大きい場合の分岐処理です。",
                "type": "if"
            }}
        }}

        ## edgeについて
        source: edgeが繋がる基のノードのid
        target: edgeが繋がる先のノードのid

        ### edgeの出力例
        {{
            "source": 0,
            "target": 1,
            "sourceHandle": "true" # typeがifのnodeに繋がるnodeで条件式の結果がtrueの場合。"false"の場合falseとなる。ifのnodeと関係ない場合"None"となる。while_startは勿論"None"になる。
        }}

        ## 注意点
        - while_startのnodeとwhile_endのnode同士は繋げないようにして下さい。
        - while_endのnodeはそのまま下のnodeに繋げて下さい。
        - if文がfalseの処理は右下にtrueの処理はそのまま下に配置される。
        - loop処理は下に配置される。
        - y軸が大きくなれば下にいき、x軸が大きくなれば横に行く。
        - nodeは基本的に順々にy軸の値が大きくなり、条件分岐などがある場合はx軸に大きくなるが、基本的にはx軸は0のままである。
        - y軸は200づつ、x軸は150づつ増やしていってください。
        - `else`にnodeは存在しない

        ## 出力
        出力は以下のようなjsonのみの形でお願いします。説明は不要です。
        {{
            nodes: [
                {{
                    id : int,
                    position:{{ x: int, y:int }},
                    title: str,
                    code: str,
                    info: str,
                    type: str,
                }},
                ...
            ],
            edges: [
                {{
                    source: int,
                    target: int,
                    sourceHandle: str,
                }},
                ...
            ]
        }}
        """

        try:
            logger.debug("Azure OpenAI APIへリクエスト送信")
            response = self.client.chat.completions.create(
                model=self.deployment_name,
                messages=[
                    {
                        "role": "system",
                        "content": "あなたはコード解析の専門家です。与えられたコードを解析してフローチャートを生成してください。",
                    },
                    {"role": "user", "content": prompt},
                ],
                max_tokens=2000,
                temperature=0.3,
            )

            content = response.choices[0].message.content
            logger.info("Azure OpenAI APIから応答を受信")

            # JSONの抽出
            json_match = re.search(r"\{.*\}", content, re.DOTALL)
            if json_match:
                result = json.loads(json_match.group())
                logger.info(
                    f"AI生成完了 - ノード数: {len(result.get('nodes', []))}, エッジ数: {len(result.get('edges', []))}"
                )
                return result
            else:
                logger.warning("AI応答からJSONを抽出できませんでした")
                raise ValueError("AI応答からJSONを抽出できませんでした")

        except Exception as e:
            logger.error(f"AI生成エラー: {e}")
            # AI生成に失敗した場合は静的解析にフォールバック
            logger.info("フォールバック処理に移行")
            return self._generate_fallback_flowchart(code, language)

    def _generate_fallback_flowchart(self, code: str, language: str) -> Dict[str, Any]:
        """
        AI生成に失敗した場合のフォールバック処理

        Args:
            code: 解析対象のコード
            language: プログラミング言語

        Returns:
            フローチャート情報
        """
        logger.info(f"フォールバック処理開始 - 言語: {language}")

        if language.lower() == "python":
            nodes = self._analyze_python_code(code)
        else:
            # Python以外の場合は基本的なノードを生成
            logger.info(f"Python以外の言語のため基本ノードを生成: {language}")
            nodes = [
                {
                    "id": 1,
                    "type": NodeType.NORMAL,
                    "title": f"{language}コード",
                    "code": code[:100] + "..." if len(code) > 100 else code,
                    "info": f"{language}プログラムの実行",
                    "line": 0,
                }
            ]

        positioned_nodes = self._calculate_positions(nodes)
        edges = self._generate_edges(positioned_nodes)

        result = {"nodes": positioned_nodes, "edges": [edge.dict() for edge in edges]}

        logger.info(
            f"フォールバック処理完了 - ノード数: {len(result['nodes'])}, エッジ数: {len(result['edges'])}"
        )
        return result

    async def generate_flowchart(
        self, code: str, language: str = "python"
    ) -> FlowchartGenerateResponse:
        """
        フローチャートを生成

        Args:
            code: 解析対象のコード
            language: プログラミング言語

        Returns:
            フローチャート生成結果
        """
        logger.info(
            f"フローチャート生成開始 - 言語: {language}, コード長: {len(code)}文字"
        )

        # AI生成を試行
        try:
            flowchart_data = await self._generate_with_ai(code, language)
        except Exception as e:
            logger.error(f"AI生成処理でエラー: {e}")
            # AI生成に失敗した場合はフォールバック処理
            flowchart_data = self._generate_fallback_flowchart(code, language)

        logger.info("レスポンス形式への変換開始")

        # レスポンス形式に変換
        nodes = []
        for node_data in flowchart_data.get("nodes", []):
            try:
                node = FlowchartNodeCreate(
                    id=node_data["id"],
                    title=node_data["data"]["title"],
                    code=node_data["data"]["code"],
                    info=node_data["data"]["info"],
                    type=NodeType(node_data["data"]["type"]),
                    position=node_data["position"],
                )
                nodes.append(node)
            except Exception as e:
                logger.warning(
                    f"ノード変換エラー (ID: {node_data.get('id', 'unknown')}): {e}"
                )

        edges = []
        for edge_data in flowchart_data.get("edges", []):
            try:
                edge = EdgeCreate(
                    source=edge_data["source"],
                    target=edge_data["target"],
                    source_handle=edge_data["sourceHandle"],
                )
                edges.append(edge)
            except Exception as e:
                logger.warning(f"エッジ変換エラー: {e}")

        result = FlowchartGenerateResponse(nodes=nodes, edges=edges)
        logger.info(
            f"フローチャート生成完了 - 最終ノード数: {len(nodes)}, 最終エッジ数: {len(edges)}"
        )

        return result
