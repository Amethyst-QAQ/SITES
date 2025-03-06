Set-Location packages/eslint-plugin
pnpm build
Set-Location ../types
pnpm build
node --experimental-detect-module ./dist/es/tool/backend-code-gen.js # 生成后端代码
node --experimental-detect-module ./dist/es/tool/frontend-code-gen.js # 生成前端代码
Set-Location ../backend
pnpm build
Set-Location ../frontend
pnpm build
Set-Location ../upload-tool
pnpm build