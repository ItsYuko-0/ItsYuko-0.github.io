# 月光之境档案馆 - 产品需求文档

## 原始需求
Discord角色扮演服务器的存档网站。所有内容为中文。纯静态，从JSON文件读取数据，无后端。
- 整体氛围：简洁、优雅、有一点文学感
- 蓝色作为accent色
- 几乎没有图片，靠排版和留白撑视觉
- 加一些elegant的animation，视觉上好看舒适

## 用户角色
- **读者**：想要回顾RP故事的参与者或观众
- **角色爱好者**：想要查看特定角色故事线的用户
- **数据爱好者**：想要查看统计和可视化的用户

## 核心需求（静态）

### 数据文件
- scenes.json - 685个场景
- characters.json - 121个角色统计
- interactions.json - 角色关系边列表
- timeline.json - 120天活跃度数据

### 三个页面
1. **正文页（默认）** - 单页滚动，场景按时间顺序排列
2. **数据页** - 统计和可视化
3. **角色档案页** - 角色选择和详情

## 已实现功能

### 2026-04-02
- [x] 项目架构搭建（React + Tailwind）
- [x] JSON数据加载hooks
- [x] 正文页场景列表（含懒加载）
- [x] Fuse.js模糊搜索（场景标题、摘要、角色、对话）
- [x] 角色侧边栏筛选
- [x] 数据页统计展示（4个核心指标）
- [x] 角色发言量排行榜
- [x] react-force-graph-2d角色关系图
- [x] GitHub风格热力图时间线
- [x] 角色档案页（列表 + 详情）
- [x] 页面导航和路由
- [x] Lenis平滑滚动
- [x] Framer Motion动画
- [x] 阅读进度条
- [x] URL参数支持角色筛选

## 待办功能 (P0/P1/P2)

### P1 - 增强功能
- [ ] 场景书签/收藏功能
- [ ] 深色模式切换
- [ ] 导出为PDF功能
- [ ] 键盘快捷键导航

### P2 - 优化
- [ ] 更多角色placeholder文字填充
- [ ] 移动端体验优化
- [ ] PWA支持
- [ ] 更丰富的数据可视化

## 技术栈
- React 19 + React Router
- Tailwind CSS
- Framer Motion
- Fuse.js
- react-force-graph-2d
- Lenis smooth scroll

## 部署
- 可部署在GitHub Pages（纯静态）
- 数据文件位于 /public/data/
