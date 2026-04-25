"""Tests for the EvalRunner orchestration."""

from __future__ import annotations

from pathlib import Path

from lokomotif_eval.runner import EvalRunner

from tests.conftest import FAILING_EVAL_YAML  # noqa: TID252 — same package


def test_runner_passes_a_well_formed_module(repo_with_module: tuple[Path, Path, Path]) -> None:
    repo, module_path, eval_path = repo_with_module
    runner = EvalRunner(modules_dir=repo / "modules")
    results, summary = runner.run_paths([(module_path, eval_path)])

    assert summary.ok
    assert summary.passed_modules == 1
    assert summary.failed_modules == 0
    assert results[0].passed
    assert all(c.passed for c in results[0].checks)


def test_runner_reports_per_check_failures(repo_with_module: tuple[Path, Path, Path]) -> None:
    repo, module_path, eval_path = repo_with_module
    eval_path.write_text(FAILING_EVAL_YAML, encoding="utf-8")
    runner = EvalRunner(modules_dir=repo / "modules")
    results, summary = runner.run_paths([(module_path, eval_path)])

    assert not summary.ok
    assert summary.failed_modules == 1
    assert results[0].failed_checks
    failed = results[0].failed_checks[0]
    assert failed.judge == "deterministic"
    assert failed.judge_name == "regex"


def test_runner_handles_missing_target_pointer(repo_with_module: tuple[Path, Path, Path]) -> None:
    repo, module_path, eval_path = repo_with_module
    eval_path.write_text(
        """\
module: roles/cross-industry/test-fixture
checks:
  - id: missing-pointer
    judge: deterministic
    kind: not_empty
    target: /body/does/not/exist
""",
        encoding="utf-8",
    )
    runner = EvalRunner(modules_dir=repo / "modules")
    results, summary = runner.run_paths([(module_path, eval_path)])
    assert not summary.ok
    failed = results[0].failed_checks[0]
    assert "not found" in failed.reason


def test_runner_records_load_errors_as_failing_check(tmp_path: Path) -> None:
    module_path = tmp_path / "missing-module.yaml"
    eval_path = tmp_path / "missing-eval.yaml"
    runner = EvalRunner(modules_dir=tmp_path)
    results, summary = runner.run_paths([(module_path, eval_path)])
    assert not summary.ok
    assert results[0].checks[0].judge == "loader"


def test_llm_check_runs_through_stub(repo_with_module: tuple[Path, Path, Path]) -> None:
    repo, module_path, eval_path = repo_with_module
    eval_path.write_text(
        """\
module: roles/cross-industry/test-fixture
checks:
  - id: identity-mentions-aml-llm
    judge: llm
    target: /body/identity/en
    rubric: "Identity should mention AML and analyst."
    threshold: 0.4
""",
        encoding="utf-8",
    )
    runner = EvalRunner(modules_dir=repo / "modules")
    results, summary = runner.run_paths([(module_path, eval_path)])
    assert summary.passed_checks == 1
    assert results[0].checks[0].judge == "llm"
    assert results[0].checks[0].judge_name == "stub"
