# Changesets

Each PR that changes the published package adds a changeset:

```bash
npx changeset
```

Pick the bump type (patch, minor, or major) and write one or two sentences for users. That text goes into `CHANGELOG.md` and the changelog page on the showcase.

When changesets land on `main`, the Release workflow opens a "Version Packages" PR that bumps `package.json` and updates `CHANGELOG.md`. Merging that PR publishes to npm with provenance.
