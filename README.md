# Demonic Bot

"node -e \"fs.existsSync('dist') && fs.rmSync('dist', { recursive: true })\" && tsc-watch --onSuccess \"node dist/index.js\""

node dist/index.js | pino-pretty --colorize