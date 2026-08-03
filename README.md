# Smart Attendance

A production-quality BLE-based Smart Attendance Management System.

## Tech Stack

- React Native
- React + Vite
- Hono
- PostgreSQL
- Drizzle ORM
- TypeScript
- pnpm Workspaces
- Docker
- Kubernetes (planned)

## Project Structure

```text
apps/
packages/
docs/
infrastructure/
```

## Status

🚧 Under active development.

## Testing

Run the backend verification pipeline from the backend app folder:

```bash
pnpm build
pnpm test
pnpm verify
pnpm test:coverage
```

### What each command does

- `pnpm build` runs the TypeScript build.
- `pnpm test` runs the backend unit, repository, app, and integration tests.
- `pnpm verify` runs the build, then the full test suite, then coverage generation.
- `pnpm test:coverage` generates a coverage report for the backend source tree.

### Recommended workflow

```text
Developer changes code
↓
pnpm verify
↓
Commit
↓
Push
```
