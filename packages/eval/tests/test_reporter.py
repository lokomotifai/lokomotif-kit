"""Tests for the console and JSON reporters."""

from __future__ import annotations

import io
import json
from pathlib import Path

from lokomotif_eval.reporter import console_report, json_report, render_json
from lokomotif_eval.runner import CheckResult, EvalRunner, ModuleResult, RunSummary


def _make_results() -> tuple[list[ModuleResult], RunSummary]:
    passed = ModuleResult(
        module_id="roles/x/ok",
        module_path=Path("modules/roles/x/ok.yaml"),
        eval_path=Path("modules/roles/x/__tests__/ok.eval.yaml"),
        checks=(
            CheckResult(
                check_id="c1",
                judge="deterministic",
                judge_name="regex",
                target="/body",
                passed=True,
                score=1.0,
                reason="matched",
                duration_ms=1,
                severity="high",
            ),
        ),
    )
    failing = ModuleResult(
        module_id="roles/x/bad",
        module_path=Path("modules/roles/x/bad.yaml"),
        eval_path=Path("modules/roles/x/__tests__/bad.eval.yaml"),
        checks=(
            CheckResult(
                check_id="c2",
                judge="deterministic",
                judge_name="regex",
                target="/body",
                passed=False,
                score=0.0,
                reason="not matched",
                duration_ms=1,
                severity="high",
            ),
        ),
    )
    summary = EvalRunner._summarize([passed, failing])  # noqa: SLF001 — internal helper
    return [passed, failing], summary


def test_console_report_marks_pass_and_fail() -> None:
    results, summary = _make_results()
    out = io.StringIO()
    console_report(results, summary, out)
    text = out.getvalue()
    assert "✓ roles/x/ok" in text
    assert "✗ roles/x/bad" in text
    assert "Modules: 1/2 passed" in text


def test_json_report_shape() -> None:
    results, summary = _make_results()
    payload = json_report(results, summary)
    assert payload["summary"]["total_modules"] == 2
    assert payload["summary"]["failed_modules"] == 1
    assert payload["modules"][0]["module_id"] == "roles/x/ok"
    assert payload["modules"][1]["passed"] is False


def test_render_json_serializes_payload() -> None:
    results, summary = _make_results()
    text = render_json(results, summary)
    parsed = json.loads(text)
    assert parsed["summary"]["total_checks"] == 2
