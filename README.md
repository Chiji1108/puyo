# Puyo Game

ぷよぷよ風のパズルゲームを Next.js で実装したプロジェクトです。

## デプロイ

以下の URL でゲームをプレイできます：

- https://puyo-silk.vercel.app/

## 開発について

このプロジェクトは[Cline](https://github.com/Coline/Cline)と[Claude-3.7-sonnet](https://www.anthropic.com/claude)を使用して自動生成されたものです。AI アシスタントの力を活用して、コンポーネント設計からゲームロジックまで実装しています。

## 技術スタック

- [Next.js](https://nextjs.org) - React フレームワーク
- [TypeScript](https://www.typescriptlang.org/) - 型安全な JavaScript
- [Zustand](https://github.com/pmndrs/zustand) - 状態管理

## ローカル環境での実行方法

開発サーバーの起動:

```bash
npm run dev
# または
yarn dev
# または
pnpm dev
# または
bun dev
```

[http://localhost:3000](http://localhost:3000)をブラウザで開くとゲームが表示されます。

## ゲームの遊び方

- 矢印キーでぷよを操作
- 同じ色のぷよを 4 つ以上つなげると消去
- 連鎖を作ってハイスコアを目指しましょう

## 機能

- 色とりどりのぷよ
- 次のぷよ表示
- スコア計算
- 連鎖システム

---

このプロジェクトは[`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app)で初期化され、[Vercel](https://vercel.com/)にデプロイされています。
