FROM node:20-slim

USER node
WORKDIR /home/node/app

# ディレクトリの権限を設定
RUN mkdir -p /home/node/app/node_modules

# package.jsonとpackage-lock.jsonを先にコピー
COPY --chown=node:node package*.json ./

# 依存関係をインストール
RUN npm install

# ソースコードをコピー
COPY --chown=node:node . .

# 開発サーバーを起動
EXPOSE 3000

CMD ["npm", "run", "dev"]