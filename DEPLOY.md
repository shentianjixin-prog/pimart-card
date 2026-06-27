# PIMART CARD → Railway 部署指南

> 项目路径：`C:\Users\33092\Documents\card-shop`

Railway 支持 **SQLite 持久化 Volume**，无需改数据库，适合当前项目。

---

## 一、本地已准备好的文件

| 文件 | 作用 |
|------|------|
| `Dockerfile` | 构建 Next.js + better-sqlite3 |
| `railway.toml` | Railway 构建配置 |
| `scripts/railway-start.mjs` | 启动时把商品库复制到 Volume |
| `prisma/data/initial.db` | 当前 50 SKU 数据库快照（约 0.1MB） |
| `env.example` | 环境变量模板 |

首次部署：若 Volume 为空，会自动从 `initial.db` 复制。  
之后订单、库存写入 Volume，** redeploy 不会丢数据**。

---

## 二、推送到 GitHub

### 1. 安装 Git

下载：https://git-scm.com/download/win  
安装后重启终端。

### 2. 初始化并推送

```powershell
cd C:\Users\33092\Documents\card-shop

git init
git add .
git commit -m "准备 Railway 部署 PIMART CARD"

# 在 GitHub 新建空仓库 card-shop，然后：
git remote add origin https://github.com/你的用户名/card-shop.git
git branch -M main
git push -u origin main
```

> 不要提交 `.env`（已在 .gitignore）。Stripe 密钥只在 Railway 后台填写。

---

## 三、Railway 创建项目

1. 打开 https://railway.app 并登录（可用 GitHub 账号）
2. **New Project** → **Deploy from GitHub repo**
3. 选择 `card-shop` 仓库
4. Railway 会自动识别 `Dockerfile` 并开始构建

---

## 四、挂载持久化 Volume（重要）

1. 进入 Railway 项目 → 点击你的 **Service**
2. 打开 **Volumes** 标签 → **Add Volume**
3. **Mount Path** 填：`/data`
4. 保存后 **Redeploy** 一次

没有 Volume 时，每次重启可能丢失订单数据。

---

## 五、配置环境变量

在 Service → **Variables** 添加：

| 变量 | 值 | 说明 |
|------|-----|------|
| `STRIPE_SECRET_KEY` | `sk_test_...` | Stripe 密钥 |
| `STRIPE_WEBHOOK_SECRET` | `whsec_...` | Webhook 签名（部署后配置） |
| `ADMIN_SESSION_SECRET` | 随机长字符串 | 后台登录 Session |
| `NEXT_PUBLIC_STRIPE_LIVE` | `false` | 测试模式 Footer 提示 |

`DATABASE_URL` **不必手动设**——启动脚本会自动设为 `file:/data/dev.db`。

---

## 六、生成公网域名

1. Service → **Settings** → **Networking**
2. **Generate Domain** → 得到类似 `card-shop-production.up.railway.app`
3. 浏览器打开验证首页、商品、购物车

---

## 七、Stripe Webhook

1. Stripe Dashboard → Developers → Webhooks → Add endpoint
2. URL：`https://你的域名.up.railway.app/api/webhooks/stripe`
3. 事件：`checkout.session.completed`（及你代码里监听的事件）
4. 复制 **Signing secret** → 填入 Railway 的 `STRIPE_WEBHOOK_SECRET`
5. Redeploy

---

## 八、管理后台

- 地址：`https://你的域名/admin/login`
- 账号密码来自 seed / 你本地创建的管理员（在 `initial.db` 里）

---

## 九、更新商品后如何同步到线上

本地改完 `dev.db` 后：

```powershell
Copy-Item dev.db prisma\data\initial.db -Force
git add prisma/data/initial.db
git commit -m "更新商品数据库快照"
git push
```

然后在 Railway **删除 Volume 里的 dev.db** 或新建 Volume，再 Redeploy，才会用新快照。  
**更简单做法**：日常在 Railway 线上 `/admin/products` 改库存，不必每次推库。

---

## 十、费用参考

- Railway 有试用额度，小流量网店通常够用
- 超出后按用量计费，可在 Dashboard 设 spending limit

---

## 故障排查

| 现象 | 处理 |
|------|------|
| 构建失败 better-sqlite3 | Dockerfile 已含 g++，确认用 Docker 构建而非错误 builder |
| 商品为空 | 检查 Volume 是否挂载 `/data`；看 Deploy Logs 是否有「已从快照初始化数据库」 |
| 502 / 无法访问 | 等 healthcheck 通过；确认 PORT 由 Railway 注入（启动脚本已处理） |
| 支付成功但订单未更新 | 检查 Stripe Webhook URL 与 `STRIPE_WEBHOOK_SECRET` |

---

## 本地模拟 Railway 启动（可选）

```powershell
$env:RAILWAY_VOLUME_MOUNT_PATH="C:\temp\railway-data"
$env:PORT="3000"
npm run start:railway
```
