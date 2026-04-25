"""Eval runner — orchestrate checks against modules."""

from __future__ import annotations

import time
from collections.abc import Mapping
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any

import yaml

from lokomotif_eval.eval_loader import (
    Check,
    DeterministicCheck,
    EvalLoadError,
    EvalSuite,
    LLMCheck,
    load_eval_suite,
)
from lokomotif_eval.judges.base import Judge, JudgeResult
from lokomotif_eval.judges.deterministic import build_deterministic_judges
from lokomotif_eval.judges.llm import LLMJudge, StubLLMJudge
from lokomotif_eval.targets import PointerError, resolve_pointer


@dataclass(frozen=True, slots=True)
class CheckResult:
    """Outcome of a single check, with timing and rationale."""

    check_id: str
    judge: str  # 'deterministic' or 'llm'
    judge_name: str  # specific implementation, e.g. 'regex' or 'stub'
    target: str
    passed: bool
    score: float
    reason: str
    duration_ms: int
    severity: str


@dataclass(frozen=True, slots=True)
class ModuleResult:
    """All check outcomes for one module."""

    module_id: str
    module_path: Path
    eval_path: Path
    checks: tuple[CheckResult, ...]

    @property
    def passed(self) -> bool:
        return all(c.passed for c in self.checks)

    @property
    def failed_checks(self) -> tuple[CheckResult, ...]:
        return tuple(c for c in self.checks if not c.passed)


@dataclass(frozen=True, slots=True)
class RunSummary:
    """Aggregate over all modules in one run."""

    total_modules: int
    passed_modules: int
    failed_modules: int
    total_checks: int
    passed_checks: int
    failed_checks: int

    @property
    def ok(self) -> bool:
        return self.failed_modules == 0


@dataclass
class EvalRunner:
    """Run eval suites against modules.

    The runner wires deterministic judges (one per ``kind``) and a
    single LLM judge to handle ``judge='llm'`` checks. The default LLM
    judge is the stub — it does not call an external service.
    """

    modules_dir: Path
    deterministic_judges: Mapping[str, Judge] = field(default_factory=build_deterministic_judges)
    llm_judge: LLMJudge = field(default_factory=StubLLMJudge)

    def run_suite(self, suite: EvalSuite, module_data: Any, *, eval_path: Path, module_path: Path) -> ModuleResult:
        """Run every check in ``suite`` against ``module_data``."""
        results: list[CheckResult] = []
        for check in suite.checks:
            results.append(self._run_check(check, module_data))
        return ModuleResult(
            module_id=suite.module,
            module_path=module_path,
            eval_path=eval_path,
            checks=tuple(results),
        )

    def run_paths(self, eval_paths: list[tuple[Path, Path]]) -> tuple[list[ModuleResult], RunSummary]:
        """Load and execute a list of ``(module_path, eval_path)`` pairs.

        Each load failure becomes a single failing CheckResult so the
        summary still aggregates correctly. The runner never raises for
        eval-time problems; it raises only for programmer errors.
        """
        results: list[ModuleResult] = []
        for module_path, eval_path in eval_paths:
            results.append(self._run_pair(module_path, eval_path))
        summary = self._summarize(results)
        return results, summary

    def _run_pair(self, module_path: Path, eval_path: Path) -> ModuleResult:
        try:
            suite = load_eval_suite(eval_path)
        except EvalLoadError as exc:
            return _result_from_load_error("eval", module_path, eval_path, str(exc))

        try:
            module_data = yaml.safe_load(module_path.read_text(encoding="utf-8"))
        except (OSError, yaml.YAMLError) as exc:
            return _result_from_load_error("module", module_path, eval_path, str(exc))

        return self.run_suite(suite, module_data, eval_path=eval_path, module_path=module_path)

    def _run_check(self, check: Check, module_data: Any) -> CheckResult:
        started = time.perf_counter()

        try:
            target_value = resolve_pointer(module_data, check.target)
        except PointerError as exc:
            return _make_check_result(check, False, 0.0, str(exc), "n/a", started)

        if isinstance(check, DeterministicCheck):
            judge = self.deterministic_judges.get(check.kind)
            if judge is None:
                return _make_check_result(
                    check,
                    False,
                    0.0,
                    f"no judge registered for kind '{check.kind}'",
                    "n/a",
                    started,
                )
            outcome = judge.evaluate(check, target_value)
        elif isinstance(check, LLMCheck):
            outcome = self.llm_judge.evaluate(check, target_value)
        else:  # pragma: no cover — discriminated union, exhaustive above
            return _make_check_result(check, False, 0.0, "unknown check shape", "n/a", started)

        return _make_check_result_from_outcome(check, outcome, started)

    @staticmethod
    def _summarize(results: list[ModuleResult]) -> RunSummary:
        total_modules = len(results)
        passed_modules = sum(1 for r in results if r.passed)
        total_checks = sum(len(r.checks) for r in results)
        passed_checks = sum(1 for r in results for c in r.checks if c.passed)
        return RunSummary(
            total_modules=total_modules,
            passed_modules=passed_modules,
            failed_modules=total_modules - passed_modules,
            total_checks=total_checks,
            passed_checks=passed_checks,
            failed_checks=total_checks - passed_checks,
        )


def _make_check_result(
    check: Check, passed: bool, score: float, reason: str, judge_name: str, started: float
) -> CheckResult:
    duration_ms = int((time.perf_counter() - started) * 1000)
    return CheckResult(
        check_id=check.id,
        judge=check.judge,
        judge_name=judge_name,
        target=check.target,
        passed=passed,
        score=score,
        reason=reason,
        duration_ms=duration_ms,
        severity=check.severity,
    )


def _make_check_result_from_outcome(check: Check, outcome: JudgeResult, started: float) -> CheckResult:
    return _make_check_result(
        check,
        outcome.passed,
        outcome.score,
        outcome.reason,
        outcome.judge_name,
        started,
    )


def _result_from_load_error(stage: str, module_path: Path, eval_path: Path, message: str) -> ModuleResult:
    failure = CheckResult(
        check_id=f"_load:{stage}",
        judge="loader",
        judge_name="loader",
        target="/",
        passed=False,
        score=0.0,
        reason=message,
        duration_ms=0,
        severity="critical",
    )
    return ModuleResult(
        module_id=module_path.stem,
        module_path=module_path,
        eval_path=eval_path,
        checks=(failure,),
    )
