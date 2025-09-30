# 私域增长闭环实战营 - 部署项目

## 📁 项目结构
```
deploy-project/
├── index.html           # 官网首页（销售页面）
├── admin.html           # 后台管理系统
├── admin-login.html     # 管理员登录页
├── data_manager.js      # 统一数据管理（官网和后台共享）
├── vercel.json          # Vercel 部署配置
└── README.md            # 项目说明
```

## 🔗 访问路径
部署后的访问地址：
- **官网首页**：`https://your-domain.vercel.app/`
- **后台管理**：`https://your-domain.vercel.app/admin`
- **管理员登录**：`https://your-domain.vercel.app/admin/login`

## ✅ 数据互通说明
- 所有页面使用同一个 `data_manager.js` 文件
- 数据存储在浏览器的 `localStorage` 中
- 因为所有页面在同一域名下，`localStorage` 数据完全共享
- 官网提交的咨询和报名数据会实时同步到后台管理系统

## 🚀 部署到 Vercel

### 方法一：通过 Vercel CLI（命令行）
```bash
# 1. 安装 Vercel CLI
npm i -g vercel

# 2. 进入项目目录
cd deploy-project

# 3. 登录 Vercel
vercel login

# 4. 部署项目
vercel

# 5. 部署到生产环境
vercel --prod
```

### 方法二：通过 Vercel 网页界面（推荐）
1. 访问 https://vercel.com 并注册/登录账号
2. 点击 "Add New" → "Project"
3. 选择 "Import Git Repository" 或 "Upload Files"
4. 如果选择上传文件：
   - 将 `deploy-project` 文件夹打包成 ZIP
   - 上传 ZIP 文件
5. Vercel 会自动检测配置并部署
6. 部署完成后获得域名，如：`your-project.vercel.app`

### 方法三：通过 GitHub（最推荐）
1. 将项目推送到 GitHub 仓库
2. 在 Vercel 中导入 GitHub 仓库
3. Vercel 会自动部署，并在每次 push 时自动更新

## 🔐 安全建议
部署到生产环境后，建议：
1. 为后台管理系统添加访问密码（已包含登录页面）
2. 考虑使用真实的后端数据库替代 localStorage
3. 启用 HTTPS（Vercel 自动提供）
4. 配置自定义域名

## 📱 浏览器兼容性
- Chrome 60+
- Firefox 60+
- Safari 12+
- Edge 79+
- 移动端全面支持

## 💡 技术特点
- **零后端**：纯前端方案，部署简单
- **数据共享**：同域名下 localStorage 完全共享
- **实时同步**：官网和后台数据实时同步
- **响应式设计**：支持桌面和移动端

---

**版本**: v1.0.0
**最后更新**: 2024年9月