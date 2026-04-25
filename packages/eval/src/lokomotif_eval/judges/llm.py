"""LLM judge — protocol plus a deterministic stub for CI without API keys.

Real LLM-backed judges (Anthropic, OpenAI-compatible, local servers)
attach to this protocol. They live outside this package so the eval
harness stays vendor-neutral; users compose their preferred judge.
"""

from __future__ import annotations

import re
from typing import Any, Protocol, runtime_checkable

from lokomotif_eval.eval_loader import Check, LLMCheck
from lokomotif_eval.judges.base import JudgeResult


@runtime_checkable
class LLMJudge(Protocol):
    """A judge that evaluates a target against a rubric.

    The check carries the rubric and the threshold; implementations
    return a `JudgeResult` with `score` in [0.0, 1.0]. A real LLM
    implementation calls a model; the stub below answers from a
    keyword heuristic so CI runs without secrets.
    """

    def evaluate(self, check: Check, target_value: Any) -> JudgeResult: ...


_KEYWORD_PATTERN = re.compile(r"\b[a-zA-ZçğıöşüÇĞİÖŞÜ]{4,}\b")


class StubLLMJudge:
    """Deterministic stand-in for a real LLM judge.

    Heuristic: extract content words from the rubric and compute the
    fraction that appear in the target text. The intent is not
    semantic accuracy — it is **stable, no-secrets CI**. The judge
    name is recorded as ``stub`` so reports never confuse this with
    a real LLM run.

    Real LLM judges should be configured by the user (e.g. by
    constructing an Anthropic-backed judge, registering it under
    ``judge='llm'`` in the runner). The stub is the floor.
    """

    name = "stub"

    def evaluate(self, check: Check, target_value: Any) -> JudgeResult:
        if not isinstance(check, LLMCheck):
            return JudgeResult(
                passed=False,
                score=0.0,
                reason="StubLLMJudge requires an LLMCheck",
                judge_name=self.name,
            )

        rubric_words = {w.lower() for w in _KEYWORD_PATTERN.findall(check.rubric)}
        if not rubric_words:
            return JudgeResult(
                passed=False,
                score=0.0,
                reason="empty rubric (no content words detected)",
                judge_name=self.name,
            )

        target_text = "" if target_value is None else str(target_value).lower()
        matched = sum(1 for w in rubric_words if w in target_text)
        score = matched / len(rubric_words)
        passed = score >= check.threshold
        return JudgeResult(
            passed=passed,
            score=score,
            reason=(
                f"stub heuristic: {matched}/{len(rubric_words)} content words present "
                f"(score={score:.2f}, threshold={check.threshold:.2f})"
            ),
            judge_name=self.name,
        )
