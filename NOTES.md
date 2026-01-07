# Code Formatting Guidelines

## Before Committing

Before you stage the changes and write a commit, please run:

```js
npm run format
npm run check-format
```

This ensures that all files are properly formatted according to the project's Prettier configuration. This helps maintain code consistency and prevents formatting-related issues in the commit history.

These commands will automatically format your code and check for any formatting issues before you commit your changes.

## Important Warning

If you do not run these commands before committing and pushing your changes, the push to GitHub will fail due to automated formatting checks enforced in the repository.
