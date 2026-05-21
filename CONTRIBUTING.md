# Contributing to RN Debug Labs

Thank you for helping grow the challenge library! There are two ways to submit a problem.

## 1. Web form (no git required)

1. Open [/contribute/submit](https://github.com/Subramanyarao11/rn-codelab) on the deployed site (or run locally at `/contribute/submit`).
2. Fill in the challenge metadata, broken code, solution, and test notes.
3. Click **Submit for review** — this opens a GitHub issue labeled `problem-submission`.

Maintainers will review, request changes, accept, or decline on that issue.

## 2. Pull request

For contributors comfortable with git:

1. Fork the repo and create a branch.
2. Add a new file under `lib/community-problems/` (see `_template.ts` if present, or copy an existing core problem structure).
3. Export it from `lib/community-problems/index.ts`.
4. Use a unique numeric `id` (community challenges use **100+**).
5. Set `origin: 'community'` and `contributor: { name, github? }`.
6. Ensure `brokenCode` fails your `testCases` and `solutionCode` passes them.
7. Open a PR describing the bug scenario and link any related issue.

Run locally:

```bash
npm install --legacy-peer-deps
npm run dev
# visit /problems/<id> and click Check on broken + solution
npm run build
```

## Security

Submissions are scanned automatically for:

- Size limits and plain-text metadata (no HTML)
- Dangerous APIs (`eval`, `fetch`, `document`, dynamic `import`, etc.)
- Valid JSX that transpiles and defines an `App` component

Maintainers should still preview submissions in the workspace before merging. Never merge code you have not run through **Check** locally.

## Review criteria

We accept challenges that:

- Teach a **real** React Native debugging skill (layout, lists, navigation, hooks, etc.)
- Reproduce in the in-browser preview (`react-native-web`)
- Have **automated tests** using `testID` selectors (see existing problems in `lib/problems.ts`)
- Include a fair hint — not the full solution
- Are distinct from existing challenges

## Credit

Accepted community challenges display a **Community challenge** credit on the problem panel with the contributor's name and optional GitHub link.

## Maintainer workflow (accept)

1. Verify preview + tests locally.
2. Add or merge the problem into `lib/community-problems/`.
3. Comment on the submission issue / PR.
4. Close the issue with `accepted` or apply label `accepted`.

## Labels

| Label | Meaning |
|-------|---------|
| `problem-submission` | New challenge proposal |
| `accepted` | Merged / shipped |
| `needs-changes` | Author should revise |
| `declined` | Not a fit (with reason) |

## Code of conduct

Be respectful in issues and PRs. We reserve the right to decline submissions that are low effort, duplicate, or inappropriate.
