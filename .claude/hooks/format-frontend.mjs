// Hook PostToolUse (Write|Edit): formatea con Prettier el archivo editado
// si está dentro de frontend/. Lee el payload JSON del hook por stdin.
import { execFileSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import path from 'node:path'

let input = ''
for await (const chunk of process.stdin) input += chunk

const payload = JSON.parse(input)
const filePath = payload.tool_input?.file_path ?? payload.tool_response?.filePath
if (!filePath) process.exit(0)

const projectDir = process.env.CLAUDE_PROJECT_DIR ?? process.cwd()
const frontendDir = path.join(projectDir, 'frontend')
const relative = path.relative(frontendDir, path.resolve(filePath))
if (relative.startsWith('..') || path.isAbsolute(relative)) process.exit(0)

const prettier = path.join(frontendDir, 'node_modules', '.bin', 'prettier')
if (!existsSync(prettier)) process.exit(0)

// cwd en frontend/ para que Prettier use .prettierrc.json y .prettierignore
execFileSync(prettier, ['--write', '--ignore-unknown', relative], {
  cwd: frontendDir,
  stdio: ['ignore', 'ignore', 'inherit'],
})
