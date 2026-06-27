# PIMART CARD Railway 一键配置（需先 railway login）
# 用法：cd card-shop; .\scripts\railway-setup.ps1

$ErrorActionPreference = "Stop"
Set-Location (Join-Path $PSScriptRoot "..")

Write-Host "==> 检查 Railway 登录..." -ForegroundColor Cyan
$whoami = npx @railway/cli whoami 2>&1
if ($LASTEXITCODE -ne 0) {
  Write-Host "请先运行: npx @railway/cli login" -ForegroundColor Yellow
  exit 1
}
Write-Host $whoami

Write-Host "`n==> 关联项目（若未关联，按提示选择 zooming-respect / pimart-card）..." -ForegroundColor Cyan
if (-not (Test-Path ".railway")) {
  npx @railway/cli link
}

Write-Host "`n==> 读取本地 .env ..." -ForegroundColor Cyan
if (-not (Test-Path ".env")) {
  Write-Host "缺少 .env 文件" -ForegroundColor Red
  exit 1
}

$envMap = @{}
Get-Content ".env" | ForEach-Object {
  if ($_ -match '^\s*([^#][^=]+)=(.*)$') {
    $k = $matches[1].Trim()
    $v = $matches[2].Trim().Trim('"')
    $envMap[$k] = $v
  }
}

# 生产用随机 ADMIN_SESSION_SECRET（若仍是 dev 默认值）
$adminSecret = $envMap["ADMIN_SESSION_SECRET"]
if ($adminSecret -match "dev-only|change-me") {
  $adminSecret = [guid]::NewGuid().ToString("N") + [guid]::NewGuid().ToString("N")
  Write-Host "已生成新的 ADMIN_SESSION_SECRET" -ForegroundColor Green
}

Write-Host "`n==> 设置 Railway 环境变量..." -ForegroundColor Cyan
npx @railway/cli variables set `
  "STRIPE_SECRET_KEY=$($envMap['STRIPE_SECRET_KEY'])" `
  "STRIPE_WEBHOOK_SECRET=$($envMap['STRIPE_WEBHOOK_SECRET'])" `
  "ADMIN_SESSION_SECRET=$adminSecret" `
  "NEXT_PUBLIC_STRIPE_LIVE=false"

Write-Host "`n==> 触发重新部署..." -ForegroundColor Cyan
npx @railway/cli redeploy --yes

Write-Host "`n完成。请在 Railway Dashboard 确认：" -ForegroundColor Green
Write-Host "  1. Volumes 已挂载 /data"
Write-Host "  2. Settings -> Networking -> Generate Domain"
Write-Host "  3. Stripe Webhook 指向 https://<你的域名>/api/webhooks/stripe"
