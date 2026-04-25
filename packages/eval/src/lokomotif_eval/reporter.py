"""Eval reporters — console (default) and JSON (CI / programmatic)."""

from __future__ import annotations

import json
import sys
from typing import Any, TextIO

from lokomotif_eval.runner import ModuleResult, RunSummary


def console_report(
    results: list[ModuleResult],
    summary: RunSummary,
    stream: TextIO | None = None,
) -> None:
    """Write a human-readable summary to ``stream`` (default ``sys.stdout``)."""

    out = stream or sys.stdout

    for module in results:
        marker = "✓" if module.passed else "✗"
        out.write(f"{marker} {module.module_id}\n")
        if not module.passed:
            for check in module.failed_checks:
                out.write(
                    f"  ✗ [{check.severity}] {check.check_id} ({check.judge_name})\n"
                    f"      target: {check.target}\n"
                    f"      reason: {check.reason}\n"
                )

    out.write("\n")
    out.write(
        f"Modules: {summary.passed_modules}/{summary.total_modules} passed · "
        f"Checks: {summary.passed_checks}/{summary.total_checks} passed\n"
    )
    if summary.failed_modules > 0:
        out.write(f"{summary.failed_modules} module(s) failed.\n")


def json_report(results: list[ModuleResult], summary: RunSummary) -> dict[str, Any]:
    """Return a JSON-serializable dict capturing every result.

    Stable shape; safe to consume from CI metadata wrappers.
    """

    return {
        "summary": {
            "ok": summary.ok,
            "total_modules": summary.total_modules,
            "passed_modules": summary.passed_modules,
            "failed_modules": summary.failed_modules,
            "total_checks": summary.total_checks,
            "passed_checks": summary.passed_checks,
            "failed_checks": summary.failed_checks,
        },
        "modules": [
            {
                "module_id": m.module_id,
                "module_path": str(m.module_path),
                "eval_path": str(m.eval_path),
                "passed": m.passed,
                "checks": [
                    {
                        "id": c.check_id,
                        "judge": c.judge,
                        "judge_name": c.judge_name,
                        "target": c.target,
                        "passed": c.passed,
                        "score": c.score,
                        "reason": c.reason,
                        "duration_ms": c.duration_ms,
                        "severity": c.severity,
                    }
                    for c in m.checks
                ],
            }
            for m in results
        ],
    }


def render_json(results: list[ModuleResult], summary: RunSummary) -> str:
    """Convenience: return the JSON report as a formatted string."""
    return json.dumps(json_report(results, summary), indent=2, ensure_ascii=False)
