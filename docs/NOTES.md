# Code Formatting Guidelines

## Before Committing

Before you stage the changes and write a commit, run these locally (same checks as CI):

```bash
npm ci
npm run format
npm run check-format
npm run lint
npm run type-check
```

This ensures that all files are properly formatted according to the project's Prettier configuration. This helps maintain code consistency and prevents formatting-related issues in the commit history.

These commands will automatically format your code and check for any formatting issues before you commit your changes.

## If `check-format` fails (what happened / how to fix)

If CI shows something like:

```text
Run npm run check-format
...
[warn] <file>
Code style issues found in X files.
Process completed with exit code 1
```

That means **Prettier formatting differs** from the repo rules.

Fix it locally:

1. Run auto-format:

```bash
npm run format
```

2. Re-check:

```bash
npm run check-format
```

3. Commit the formatting changes and push again.

Tip (faster): you can format only the files Prettier listed in the warning lines:

```bash
npx prettier --write <file1> <file2> <file3>
```

## Important Warning

If you do not run these commands before committing and pushing your changes, the push to GitHub will fail due to automated formatting checks enforced in the repository.
