"""Deterministic judges — judged purely by code."""

from __future__ import annotations

import re
from typing import Any

from lokomotif_eval.eval_loader import Check, DeterministicCheck
from lokomotif_eval.judges.base import Judge, JudgeResult


class _DeterministicJudgeBase:
    name = "deterministic"

    def _wrong_check_kind(self, check: DeterministicCheck) -> JudgeResult:
        return JudgeResult(
            passed=False,
            score=0.0,
            reason=f"judge '{self.name}' does not handle kind '{check.kind}'",
            judge_name=self.name,
        )


class RegexJudge(_DeterministicJudgeBase):
    name = "regex"

    def evaluate(self, check: Check, target_value: Any) -> JudgeResult:
        if not isinstance(check, DeterministicCheck) or check.kind != "regex":
            return self._wrong_check_kind(check)  # type: ignore[arg-type]
        if check.pattern is None:
            return JudgeResult(False, 0.0, "regex check is missing 'pattern'", self.name)
        flags = 0
        if check.flags is not None:
            for ch in check.flags:
                flags |= {"i": re.IGNORECASE, "m": re.MULTILINE, "s": re.DOTALL}.get(ch, 0)
        text = "" if target_value is None else str(target_value)
        match = re.search(check.pattern, text, flags)
        passed = match is not None
        return JudgeResult(
            passed=passed,
            score=1.0 if passed else 0.0,
            reason=(
                f"pattern matched at index {match.start()}"
                if match is not None
                else f"pattern {check.pattern!r} not found in target"
            ),
            judge_name=self.name,
        )


class NotEmptyJudge(_DeterministicJudgeBase):
    name = "not_empty"

    def evaluate(self, check: Check, target_value: Any) -> JudgeResult:
        if not isinstance(check, DeterministicCheck) or check.kind != "not_empty":
            return self._wrong_check_kind(check)  # type: ignore[arg-type]
        if target_value is None:
            return JudgeResult(False, 0.0, "target is None", self.name)
        try:
            length = len(target_value)
        except TypeError:
            return JudgeResult(
                True, 1.0, f"target is non-empty ({type(target_value).__name__})", self.name
            )
        passed = length > 0
        return JudgeResult(
            passed=passed,
            score=1.0 if passed else 0.0,
            reason=f"length={length}",
            judge_name=self.name,
        )


class ArrayLengthJudge(_DeterministicJudgeBase):
    name = "array_length"

    def evaluate(self, check: Check, target_value: Any) -> JudgeResult:
        if not isinstance(check, DeterministicCheck) or check.kind != "array_length":
            return self._wrong_check_kind(check)  # type: ignore[arg-type]
        if not isinstance(target_value, list):
            return JudgeResult(
                False, 0.0, f"target is not a list ({type(target_value).__name__})", self.name
            )
        length = len(target_value)
        if check.min is not None and length < check.min:
            return JudgeResult(False, 0.0, f"length {length} < min {check.min}", self.name)
        if check.max is not None and length > check.max:
            return JudgeResult(False, 0.0, f"length {length} > max {check.max}", self.name)
        return JudgeResult(True, 1.0, f"length={length} within bounds", self.name)


class EqualsJudge(_DeterministicJudgeBase):
    name = "equals"

    def evaluate(self, check: Check, target_value: Any) -> JudgeResult:
        if not isinstance(check, DeterministicCheck) or check.kind != "equals":
            return self._wrong_check_kind(check)  # type: ignore[arg-type]
        passed = target_value == check.expected
        return JudgeResult(
            passed=passed,
            score=1.0 if passed else 0.0,
            reason=(
                f"target equals expected ({check.expected!r})"
                if passed
                else f"target ({target_value!r}) != expected ({check.expected!r})"
            ),
            judge_name=self.name,
        )


class ContainsJudge(_DeterministicJudgeBase):
    name = "contains"

    def evaluate(self, check: Check, target_value: Any) -> JudgeResult:
        if not isinstance(check, DeterministicCheck) or check.kind != "contains":
            return self._wrong_check_kind(check)  # type: ignore[arg-type]
        if check.substring is None:
            return JudgeResult(False, 0.0, "contains check is missing 'substring'", self.name)
        text = "" if target_value is None else str(target_value)
        passed = check.substring in text
        return JudgeResult(
            passed=passed,
            score=1.0 if passed else 0.0,
            reason=(
                f"substring {check.substring!r} found"
                if passed
                else f"substring {check.substring!r} not in target"
            ),
            judge_name=self.name,
        )


def build_deterministic_judges() -> dict[str, Judge]:
    """Return a mapping from check `kind` to the matching judge."""
    return {
        "regex": RegexJudge(),
        "not_empty": NotEmptyJudge(),
        "array_length": ArrayLengthJudge(),
        "equals": EqualsJudge(),
        "contains": ContainsJudge(),
    }
