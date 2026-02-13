# npm Audit Report

**Date:** 2026-02-12

## Initial Scan

Ran `npm audit` and found **8 vulnerabilities** (1 low, 5 moderate, 2 high):

| Package | Severity | Issue |
|---------|----------|-------|
| @eslint/plugin-kit | Low | ReDoS via ConfigCommentParser ([GHSA-xffm-g5w8-qvg7](https://github.com/advisories/GHSA-xffm-g5w8-qvg7)) |
| ai | Moderate | Filetype whitelist bypass on file upload ([GHSA-rwvc-j5jr-mgvh](https://github.com/advisories/GHSA-rwvc-j5jr-mgvh)) |
| js-yaml | Moderate | Prototype pollution in merge ([GHSA-mh29-5h37-fv8m](https://github.com/advisories/GHSA-mh29-5h37-fv8m)) |
| jsondiffpatch | Moderate | XSS via HtmlFormatter::nodeBegin ([GHSA-33vc-wfww-vjfv](https://github.com/advisories/GHSA-33vc-wfww-vjfv)) |
| mdast-util-to-hast | Moderate | Unsanitized class attribute ([GHSA-4fh9-h7wg-q85m](https://github.com/advisories/GHSA-4fh9-h7wg-q85m)) |
| next | High | 5 vulnerabilities including SSRF, DoS, cache key confusion, content injection ([GHSA-g5qg-72qw-gw5v](https://github.com/advisories/GHSA-g5qg-72qw-gw5v), [GHSA-xv57-4mr9-wg8v](https://github.com/advisories/GHSA-xv57-4mr9-wg8v), [GHSA-4342-x723-ch2f](https://github.com/advisories/GHSA-4342-x723-ch2f), [GHSA-9g9p-9gw9-jx7f](https://github.com/advisories/GHSA-9g9p-9gw9-jx7f), [GHSA-h25m-26qc-wcjf](https://github.com/advisories/GHSA-h25m-26qc-wcjf)) |
| tar | High | Arbitrary file overwrite, symlink poisoning, hardlink path traversal ([GHSA-8qq5-rm4j-mr97](https://github.com/advisories/GHSA-8qq5-rm4j-mr97), [GHSA-r6q2-hw4h-h46w](https://github.com/advisories/GHSA-r6q2-hw4h-h46w), [GHSA-34x7-hfp2-rc4v](https://github.com/advisories/GHSA-34x7-hfp2-rc4v)) |
| vite | Moderate | 3 vulnerabilities: public dir bypass, server.fs.deny bypass, HTML file settings bypass ([GHSA-g4jq-h2w9-997c](https://github.com/advisories/GHSA-g4jq-h2w9-997c), [GHSA-jqfw-vq24-v9c3](https://github.com/advisories/GHSA-jqfw-vq24-v9c3), [GHSA-93m4-6634-74q7](https://github.com/advisories/GHSA-93m4-6634-74q7)) |

## Fixes Applied

Ran `npm audit fix` — resolved **5 vulnerabilities** without breaking changes:

- @eslint/plugin-kit
- js-yaml
- mdast-util-to-hast
- tar
- vite

## Remaining Vulnerabilities (3)

These require breaking changes (`npm audit fix --force`) and were not applied automatically:

| Package | Severity | Fix Available | Notes |
|---------|----------|---------------|-------|
| ai (<=5.0.51) | Moderate | Upgrade to ai@6.0.85 | Breaking change — major version bump |
| jsondiffpatch (<0.7.2) | Moderate | Upgrade via ai@6.0.85 | Transitive dependency of `ai` |
| next (<=15.5.9) | High | Upgrade to next@15.5.12 | Outside stated dependency range |

## Test Verification

All **205 tests pass** across 11 test files after applying fixes.

## Recommended Next Steps

1. **next** (high severity): Upgrade `next` to `>=15.5.10` — test thoroughly as it may include breaking changes
2. **ai** (moderate severity): Upgrade `ai` to `>=6.0.0` — this is a major version bump requiring code changes to the Vercel AI SDK integration
