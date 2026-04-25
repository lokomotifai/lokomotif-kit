"""Tests for the LLM judge protocol and the deterministic stub."""

from __future__ import annotations

from lokomotif_eval.eval_loader import DeterministicCheck, LLMCheck
from lokomotif_eval.judges.base import Judge, JudgeResult
from lokomotif_eval.judges.llm import LLMJudge, StubLLMJudge


def _llm(rubric: str, threshold: float = 0.5) -> LLMCheck:
    return LLMCheck(
        id="llm-check",
        judge="llm",
        target="/body",
        rubric=rubric,
        threshold=threshold,
    )


def test_stub_runs_without_secrets() -> None:
    # The point of the stub: deterministic, no API key required.
    judge: LLMJudge = StubLLMJudge()
    result = judge.evaluate(
        _llm("senior practitioner identity"),
        "I act as a senior practitioner with deep identity expertise.",
    )
    assert result.judge_name == "stub"
    assert result.score > 0


def test_stub_passes_when_keywords_align() -> None:
    judge = StubLLMJudge()
    result = judge.evaluate(
        _llm("compliance review report"),
        "We provide a compliance review report based on the case data.",
        # threshold is the default 0.5
    )
    assert result.passed


def test_stub_fails_when_target_misses_keywords() -> None:
    judge = StubLLMJudge()
    result = judge.evaluate(_llm("compliance review report", threshold=0.9), "hello world")
    assert not result.passed


def test_stub_fails_on_empty_rubric() -> None:
    judge = StubLLMJudge()
    result = judge.evaluate(_llm("...", threshold=0.5), "anything")
    assert not result.passed
    assert "empty rubric" in result.reason


def test_stub_rejects_non_llm_check() -> None:
    judge = StubLLMJudge()
    result = judge.evaluate(
        DeterministicCheck(
            id="c",
            judge="deterministic",
            kind="not_empty",
            target="/x",
        ),
        "anything",
    )
    assert not result.passed
    assert "LLMCheck" in result.reason


def test_stub_satisfies_judge_protocol() -> None:
    judge: Judge = StubLLMJudge()  # noqa: F841 — type-narrowing assertion
    assert isinstance(judge.evaluate(_llm("x"), "x"), JudgeResult)
