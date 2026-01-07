# When can a push fail? What to do if it fails

> This short guide is based on the current project setup (GitHub Actions + npm scripts).

## 1) `git push` fails locally (on your machine)
This happens before the code reaches GitHub, and is usually Git/auth related:

- Auth/permissions: not logged in to GitHub or no repo access.
  - Fix: sign in (HTTPS token or SSH key) and confirm you have permissions.
- Branch protection: direct pushes to a protected branch (e.g. `main`) are blocked.
  - Fix: push to a feature branch or `dev`, then open a Pull Request.
- Non-fast-forward: remote branch moved ahead of your local branch.
  - Fix: `git pull --rebase` then try again.
- Network/large files: connection issues or pushing very large files.
  - Fix: retry; don’t commit build artefacts (check `.gitignore`).

> Note: this repo does not include local git hooks (like Husky) that block pushes.

## 2) Push succeeds, but CI fails afterward (on GitHub)
Here `git push` works, but GitHub Actions fails and can block merging the PR.

### Guaranteed failure cases (from workflows)
- **Opening a PR directly into `main`**: always fails (direct PRs to `main` are blocked).
  - Fix: open the PR against `dev`.

### On `dev` (push) or PR into `dev`
CI fails if any of these fail:

- **Prettier**: `npm run check-format`
- **ESLint**: `npm run lint` (important: `--max-warnings=0` means warnings fail the job)
- **TypeScript**: `npm run type-check`
- **Build**: `npm run build`

## Quick checklist when it fails
Run the same checks locally to reproduce the issue:

1. Clean install:
   - `npm ci`
2. Formatting:
   - If `check-format` fails: run `npm run format`, then commit/push.
3. Lint:
   - Run `npm run lint` and fix errors (make sure there are no warnings).
4. Types/build:
   - `npm run type-check`
   - `npm run build`

## Node version note
CI uses **Node 20**. If local results differ from CI:
- Use Node 20 (e.g., via nvm) and rerun the commands above.
