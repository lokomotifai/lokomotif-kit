# Golden regression set

This directory holds anonymized real-world cases that the eval harness re-runs on every release. The intent is to catch silent regressions in module behavior over time — the same input + the same module + the same eval suite should still produce the same outcome a year from now.

## What lives here

- **Anonymized fixtures.** Real engagement artifacts stripped of customer data, names, and identifiers. The PII detector (`lokomotif-eval scan-pii`) runs on every file in this directory in CI; a finding fails the build.
- **Versioned snapshots.** Each fixture carries its own subdirectory; the directory name is the regression case ID and the date it was captured.
- **No vendor strings, no secrets.** The same rules that bind `modules/` apply here.

## Layout

```
golden/
├── README.md
├── <case-id>/
│   ├── module.yaml      # the module under test (frozen)
│   ├── eval.yaml         # the eval suite (frozen)
│   ├── input.json        # any external input the eval references
│   └── expected.json     # captured outcome — what the eval should produce
└── ...
```

Subdirectories will be added by Phase 6 alongside the canonical modules. Until then this README is the only file in the directory.

## Refresh policy

- A golden case is **never silently rewritten**. If the expected outcome is genuinely wrong, the case is deleted in one PR (with an RFC-grade explanation in the commit body) and a new case is captured in a follow-up PR.
- A golden case is **never sourced from a live customer system**. Every fixture here is synthesized or anonymized by hand. Source-material references go in the parent module's `source_reference` field, never in the golden set.
- A failing golden case is treated as a release blocker. Releases ship from `main`; if main has a red golden, the release waits.
