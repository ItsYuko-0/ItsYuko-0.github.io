# 月光之境档案馆

Discord角色扮演服务器的存档网站。

## GitHub Pages 部署

此项目已配置好用于 GitHub Pages 部署。构建产物位于 `/docs` 目录。

### 部署步骤：

1. 将此仓库推送到 GitHub
2. 进入仓库设置 → Pages
3. Source 选择 "Deploy from a branch"
4. Branch 选择 `main`，目录选择 `/docs`
5. 点击 Save

网站将在几分钟后上线，地址为：`https://[用户名].github.io/[仓库名]/`

### 本地开发

```bash
cd frontend
yarn install
yarn start
```

### 重新构建

```bash
cd frontend
yarn build
rm -rf ../docs
cp -r build ../docs
cp ../docs/index.html ../docs/404.html
```

## 文件结构

```
/docs           # GitHub Pages 静态文件（构建产物）
  ├── index.html
  ├── 404.html
  ├── data/     # JSON 数据文件
  └── static/   # JS/CSS 资源
/frontend       # React 源代码
```
