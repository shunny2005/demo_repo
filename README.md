# demo_repo

A small demo service used as the target repository for **Company Brain**'s
Phase 07 (engineering change workflow) design-partner demo.

This is not a real product — it exists so the engineering-change workflow
(pull request → change packet → exact-version review → merge → observed
deployment → discrepancy detection) has a real, working GitHub repository to
observe, rather than a speculative/hypothetical one.

## What's here

- `src/index.js` — a minimal Express API (an "inventory" service) with a
  couple of intentionally simple endpoints, so pull requests against it read
  like real, small engineering changes.
- `.github/workflows/deploy.yml` — on every push to `main`, this creates a
  real GitHub Deployment and marks it `success` via the GitHub Deployments
  API. That gives Company Brain a genuine, observable "this commit was
  deployed" signal to react to, without needing any external hosting.

## Running it

```bash
npm install
npm start
```
