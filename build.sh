Set-Location packages/eslint-plugin
pnpm build
Set-Location ../types
pnpm build
node ./dist/tool/backend-code-gen.js # 生成后端代码
node ./dist/tool/frontend-code-gen.js # 生成前端代码
Set-Location ../backend
pnpm build
Set-Location ../frontend
pnpm build
Set-Location ../upload-tool
pnpm build