---
allowed-tools: Bash(git status:*), Bash(gh pr create:*)
description: Pull Request 作成タスク
---

## Context

- Current git status: !`git status`
- Current git diff (staged and unstaged changes): !`git diff HEAD`
- Current branch: !`git branch --show-current`
- Recent commits: !`git log --oneline -10`
- Pull Request の作成: !`gh pr create`

## Rule

- Pull Request は日本語で作成してください。
- Pull Request のテンプレートは @/.github/pull_request_template.md を参照してください。
- `その他`の部分に`resolves #Issue番号`と記載する。
- `#Issue番号`が分からない場合は記載しなくてよいです。

## Your task

1. ブランチで作業した内容を確認してください。
2. テンプレートに沿って Pull Request を提出してください。
