"""Lokomotif Kit — Python eval harness.

Validate that RTCSG modules behave as their authors intended. Runs
deterministic checks (regex, structural shape, presence) and LLM-judged
checks (rubric-based scoring). Wired to the `lokomotif eval run` CLI
through the `lokomotif-eval` script entry point.

Public surface:
- `EvalSuite`, `Check`, `EvalLoadError` — eval definition model
- `Judge`, `JudgeResult`, deterministic judge classes, `LLMJudge`
  protocol with `StubLLMJudge` fallback
- `EvalRunner`, `ModuleResult`, `CheckResult` — orchestration
- `discover_eval_suites`, `eval_path_for_module` — file discovery
- `resolve_pointer` — JSON Pointer (RFC 6901) target resolver
- `scan_for_pii`, `PIIFinding` — Turkey-aware PII detector stub
- `console_report`, `json_report` — output reporters
"""

from __future__ import annotations

__version__ = "0.1.0"

from lokomotif_eval.discovery import discover_eval_suites, eval_path_for_module
from lokomotif_eval.eval_loader import (
    Check,
    DeterministicCheck,
    EvalLoadError,
    EvalSuite,
    LLMCheck,
    load_eval_suite,
)
from lokomotif_eval.judges.base import Judge, JudgeResult
from lokomotif_eval.judges.deterministic import (
    ArrayLengthJudge,
    ContainsJudge,
    EqualsJudge,
    NotEmptyJudge,
    RegexJudge,
    build_deterministic_judges,
)
from lokomotif_eval.judges.llm import LLMJudge, StubLLMJudge
from lokomotif_eval.pii import PIIFinding, scan_for_pii
from lokomotif_eval.reporter import console_report, json_report
from lokomotif_eval.runner import CheckResult, EvalRunner, ModuleResult, RunSummary
from lokomotif_eval.targets import PointerError, resolve_pointer

__all__ = [
    "ArrayLengthJudge",
    "Check",
    "CheckResult",
    "ContainsJudge",
    "DeterministicCheck",
    "EqualsJudge",
    "EvalLoadError",
    "EvalRunner",
    "EvalSuite",
    "Judge",
    "JudgeResult",
    "LLMCheck",
    "LLMJudge",
    "ModuleResult",
    "NotEmptyJudge",
    "PIIFinding",
    "PointerError",
    "RegexJudge",
    "RunSummary",
    "StubLLMJudge",
    "__version__",
    "build_deterministic_judges",
    "console_report",
    "discover_eval_suites",
    "eval_path_for_module",
    "json_report",
    "load_eval_suite",
    "resolve_pointer",
    "scan_for_pii",
]
