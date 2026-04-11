## Security rules

- NEVER read or process .env files or any file containing credentials
- STOP immediately if you encounter API keys, passwords, or secrets
- Do not access any file excluded by .claudeignore
- If unsure whether a file contains credentials, do not open it — ask

## This repo

Mono repo with frontend and backend for a bike tracking app. The frontend is built with Vue 3 and TypeScript, while the backend is a Node.js server using Express. The project includes features like real-time bike location tracking, user location, and customizable settings.

## Workflow rules

- Never merge generated code without human review
- Do not make architecture decisions autonomously — present options
- For complex tasks, break into steps and confirm before executing each one
- Do not touch files outside the scope of the task unless explicitly asked