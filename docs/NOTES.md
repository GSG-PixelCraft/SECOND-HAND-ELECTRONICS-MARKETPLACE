# 📁 `NOTES.md`

```markdown
# 📋 Developer Notes & CI/CD Guide

> Quick reference for local development, CI checks, and troubleshooting.

---

## 📑 Table of Contents

- [Before Committing](#-before-committing)
- [Quick Checklist](#-quick-checklist)
- [When Push Fails Locally](#-when-push-fails-locally)
- [When CI Fails on GitHub](#-when-ci-fails-on-github)
- [Fixing Prettier Failures](#-fixing-prettier-failures)
- [Fixing ESLint Failures](#-fixing-eslint-failures)
- [Fixing TypeScript Failures](#-fixing-typescript-failures)
- [Node Version](#-node-version)
- [Branch Workflow](#-branch-workflow)

---

## ✅ Before Committing

Run these commands locally before staging and committing (same checks as CI):
```

```bash
npm run format          # Auto-format all files
npm run check-format    # Verify formatting
npm run lint            # Run ESLint
npm run type-check      # TypeScript check
npm run test:run        # Run tests
npm run build           # Build project
```

**Or run everything at once:**

```bash
npm run validate
```

> ⚠️ **Warning:** If you skip these checks, your push will succeed but CI will fail on GitHub, blocking your PR from being merged.

---

## 📝 Quick Checklist

| Step | Command                | What it checks              |
| ---- | ---------------------- | --------------------------- |
| 1    | `npm ci`               | Clean install dependencies  |
| 2    | `npm run format`       | Auto-format code            |
| 3    | `npm run check-format` | Verify Prettier formatting  |
| 4    | `npm run lint`         | ESLint (0 warnings allowed) |
| 5    | `npm run type-check`   | TypeScript errors           |
| 6    | `npm run test:run`     | Unit tests                  |
| 7    | `npm run build`        | Production build            |

---

## ❌ When Push Fails Locally

This happens **before** code reaches GitHub (Git/auth related):

| Problem           | Cause                               | Fix                                    |
| ----------------- | ----------------------------------- | -------------------------------------- |
| Auth error        | Not logged in to GitHub             | Sign in (HTTPS token or SSH key)       |
| Permission denied | No repo access                      | Request access from repo owner         |
| Branch protected  | Direct push to `main`/`dev` blocked | Push to feature branch, open PR        |
| Non-fast-forward  | Remote branch ahead of local        | `git pull --rebase` then push          |
| Large files       | Pushing build artifacts             | Check `.gitignore`, remove large files |

---

## 🔴 When CI Fails on GitHub

Push succeeds, but GitHub Actions fails → blocks PR merge.

### CI Checks That Run

| Check      | Command                | Fails When                          |
| ---------- | ---------------------- | ----------------------------------- |
| Prettier   | `npm run check-format` | Files not formatted                 |
| ESLint     | `npm run lint`         | Errors OR warnings (max-warnings=0) |
| TypeScript | `npm run type-check`   | Type errors                         |
| Tests      | `npm run test:run`     | Test failures                       |
| Build      | `npm run build`        | Build errors                        |

### Branch Rules

| Action                 | Result                                   |
| ---------------------- | ---------------------------------------- |
| PR directly to `main`  | ❌ Blocked (must go through `dev` first) |
| PR to `dev`            | ✅ Allowed (CI must pass)                |
| Push to feature branch | ✅ Allowed (CI runs on PR)               |

---

## 🎨 Fixing Prettier Failures

### Identify the Problem

CI log shows:

```text
Run npm run check-format
[warn] src/components/Button.tsx
[warn] src/utils/helpers.ts
Code style issues found in 2 files.
Process completed with exit code 1.
```

### Fix It

**Option 1: Format all files**

```bash
npm run format
npm run check-format
git add .
git commit -m "style: format code"
git push
```

**Option 2: Format only specific files**

```bash
npx prettier --write src/components/Button.tsx src/utils/helpers.ts
npm run check-format
git add .
git commit -m "style: format code"
git push
```

---

## 🔧 Fixing ESLint Failures

### Identify the Problem

CI log shows:

```text
Run npm run lint
src/components/Button.tsx
  5:10  error  'unused' is defined but never used  @typescript-eslint/no-unused-vars

✖ 1 problem (1 error, 0 warnings)
```

### Fix It

**Option 1: Auto-fix what's possible**

```bash
npm run lint:fix
npm run lint
git add .
git commit -m "fix: resolve eslint errors"
git push
```

**Option 2: Manually fix**

Open the file and fix the issue, then:

```bash
npm run lint
git add .
git commit -m "fix: resolve eslint errors"
git push
```

> ⚠️ **Note:** `--max-warnings=0` means even warnings will fail CI!

---

## 📘 Fixing TypeScript Failures

### Identify the Problem

CI log shows:

```text
Run npm run type-check
src/api/auth.ts:15:5 - error TS2322: Type 'string' is not assignable to type 'number'.
```

### Fix It

1. Open the file mentioned in the error
2. Fix the type issue
3. Verify locally:

```bash
npm run type-check
git add .
git commit -m "fix: resolve type errors"
git push
```

---

## 📦 Node Version

CI uses **Node 20**. If your local results differ from CI:

```bash
# Check your version
node -v

# Use Node 20 (with nvm)
nvm install 20
nvm use 20

# Reinstall dependencies
rm -rf node_modules
npm ci

# Run checks again
npm run validate
```

---

## 🌿 Branch Workflow

```
feature/your-feature
        │
        ▼
       dev  ◄── PR required, CI must pass
        │
        ▼
      main  ◄── PR required, CI must pass, approval required
```

### Creating a Feature Branch

```bash
git checkout dev
git pull origin dev
git checkout -b feature/your-feature
# ... make changes ...
git add .
git commit -m "feat: add new feature"
git push origin feature/your-feature
# Open PR to dev
```

### After PR is Merged

```bash
git checkout dev
git pull origin dev
git branch -d feature/your-feature
```

---

## 🛠️ Useful Commands

| Command             | Description              |
| ------------------- | ------------------------ |
| `npm run dev`       | Start dev server         |
| `npm run build`     | Production build         |
| `npm run preview`   | Preview production build |
| `npm run validate`  | Run all checks           |
| `npm run format`    | Format all files         |
| `npm run lint:fix`  | Auto-fix lint issues     |
| `npm run test`      | Run tests in watch mode  |
| `npm run test:run`  | Run tests once           |
| `npm run storybook` | Start Storybook          |

---

## 📞 Need Help?

1. Check this guide first
2. Run `npm run validate` locally
3. Check CI logs on GitHub
4. Ask a team member

---

> Last updated: Based on current CI/CD configuration

```

---

## 📁 File Location

```

your-project/
├── .github/
│ └── workflows/
├── src/
├── NOTES.md ← Place here (root)
└── package.json

````

---

## 🗑️ Delete Old Files

```bash
# Remove the old separate files if they exist
rm -f docs/PUSH_CHECKS.md
rm -f docs/CODE_FORMATTING.md
# Or if they're in root
rm -f PUSH_CHECKS.md
rm -f CODE_FORMATTING.md
````
