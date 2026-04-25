"""Judge protocol and result type."""

from __future__ import annotations

from dataclasses import dataclass
from typing import Any, Protocol, runtime_checkable

from lokomotif_eval.eval_loader import Check


@dataclass(frozen=True, slots=True)
class JudgeResult:
    """The outcome of one judge call.

    - ``passed`` — pass/fail signal used by the runner aggregate.
    - ``score`` — normalized [0.0, 1.0]. Deterministic judges typically
      return 0.0 or 1.0; LLM judges return continuous values.
    - ``reason`` — short human-readable rationale, surfaced in reports.
    - ``judge_name`` — identifies the judge implementation; recorded as
      OTel attribute by emitters.
    """

    passed: bool
    score: float
    reason: str
    judge_name: str


@runtime_checkable
class Judge(Protocol):
    """A judge consumes one ``Check`` plus the resolved target value
    and returns a ``JudgeResult``.

    Implementations must be pure with respect to (check, target) — same
    inputs yield the same output. An LLM-backed implementation breaks
    this contract intentionally; the harness records the LLM judge name
    so consumers know to expect non-determinism.
    """

    def evaluate(self, check: Check, target_value: Any) -> JudgeResult: ...
