"""Tests for the deterministic judges."""

from __future__ import annotations

from lokomotif_eval.eval_loader import DeterministicCheck
from lokomotif_eval.judges.deterministic import (
    ArrayLengthJudge,
    ContainsJudge,
    EqualsJudge,
    NotEmptyJudge,
    RegexJudge,
    build_deterministic_judges,
)


def _check(kind: str, **kwargs: object) -> DeterministicCheck:
    return DeterministicCheck(id="c", judge="deterministic", kind=kind, target="/x", **kwargs)  # type: ignore[arg-type]


# ---------- regex ----------


def test_regex_matches_passes() -> None:
    judge = RegexJudge()
    result = judge.evaluate(_check("regex", pattern="hello"), "say hello world")
    assert result.passed
    assert result.score == 1.0
    assert result.judge_name == "regex"


def test_regex_no_match_fails() -> None:
    judge = RegexJudge()
    result = judge.evaluate(_check("regex", pattern="goodbye"), "hello")
    assert not result.passed
    assert result.score == 0.0


def test_regex_supports_case_insensitive_flag() -> None:
    judge = RegexJudge()
    result = judge.evaluate(_check("regex", pattern="HELLO", flags="i"), "hello there")
    assert result.passed


def test_regex_missing_pattern_fails() -> None:
    judge = RegexJudge()
    result = judge.evaluate(_check("regex"), "anything")
    assert not result.passed
    assert "missing 'pattern'" in result.reason


def test_regex_treats_none_as_empty_string() -> None:
    judge = RegexJudge()
    result = judge.evaluate(_check("regex", pattern="anything"), None)
    assert not result.passed


def test_regex_rejects_wrong_check_kind() -> None:
    judge = RegexJudge()
    result = judge.evaluate(_check("not_empty"), "hi")
    assert not result.passed


# ---------- not_empty ----------


def test_not_empty_string() -> None:
    assert NotEmptyJudge().evaluate(_check("not_empty"), "x").passed
    assert not NotEmptyJudge().evaluate(_check("not_empty"), "").passed


def test_not_empty_list() -> None:
    assert NotEmptyJudge().evaluate(_check("not_empty"), [1, 2]).passed
    assert not NotEmptyJudge().evaluate(_check("not_empty"), []).passed


def test_not_empty_none() -> None:
    assert not NotEmptyJudge().evaluate(_check("not_empty"), None).passed


def test_not_empty_treats_uncountable_as_present() -> None:
    assert NotEmptyJudge().evaluate(_check("not_empty"), 123).passed


# ---------- array_length ----------


def test_array_length_min() -> None:
    judge = ArrayLengthJudge()
    assert judge.evaluate(_check("array_length", min=2), [1, 2, 3]).passed
    assert not judge.evaluate(_check("array_length", min=5), [1, 2]).passed


def test_array_length_max() -> None:
    judge = ArrayLengthJudge()
    assert judge.evaluate(_check("array_length", max=3), [1, 2]).passed
    assert not judge.evaluate(_check("array_length", max=1), [1, 2]).passed


def test_array_length_rejects_non_list() -> None:
    judge = ArrayLengthJudge()
    result = judge.evaluate(_check("array_length", min=1), "not-a-list")
    assert not result.passed


# ---------- equals ----------


def test_equals_match() -> None:
    judge = EqualsJudge()
    assert judge.evaluate(_check("equals", expected="x"), "x").passed
    assert not judge.evaluate(_check("equals", expected="x"), "y").passed


def test_equals_mismatch_reports_both_values() -> None:
    judge = EqualsJudge()
    result = judge.evaluate(_check("equals", expected=1), 2)
    assert not result.passed
    assert "1" in result.reason and "2" in result.reason


# ---------- contains ----------


def test_contains_true() -> None:
    judge = ContainsJudge()
    assert judge.evaluate(_check("contains", substring="abc"), "xyzabcxyz").passed


def test_contains_false() -> None:
    judge = ContainsJudge()
    assert not judge.evaluate(_check("contains", substring="abc"), "xyz").passed


def test_contains_missing_substring_arg() -> None:
    judge = ContainsJudge()
    result = judge.evaluate(_check("contains"), "anything")
    assert not result.passed


# ---------- registry ----------


def test_build_deterministic_judges_covers_every_kind() -> None:
    registry = build_deterministic_judges()
    assert set(registry.keys()) == {"regex", "not_empty", "array_length", "equals", "contains"}
