"""Tests for eval-suite loading and shape validation."""

from __future__ import annotations

from pathlib import Path

import pytest

from lokomotif_eval.eval_loader import (
    DeterministicCheck,
    EvalLoadError,
    EvalSuite,
    LLMCheck,
    load_eval_suite,
)


def _write(tmp_path: Path, name: str, content: str) -> Path:
    p = tmp_path / name
    p.write_text(content, encoding="utf-8")
    return p


def test_loads_a_minimal_suite(tmp_path: Path) -> None:
    path = _write(
        tmp_path,
        "ok.eval.yaml",
        """\
module: roles/cross-industry/x
checks:
  - id: not-empty
    judge: deterministic
    kind: not_empty
    target: /body/identity/en
""",
    )
    suite = load_eval_suite(path)
    assert isinstance(suite, EvalSuite)
    assert suite.module == "roles/cross-industry/x"
    assert len(suite.checks) == 1
    assert isinstance(suite.checks[0], DeterministicCheck)


def test_loads_an_llm_check(tmp_path: Path) -> None:
    path = _write(
        tmp_path,
        "llm.eval.yaml",
        """\
module: roles/cross-industry/x
checks:
  - id: voice-rubric
    judge: llm
    target: /body/identity
    rubric: "Identity should sound like a senior practitioner."
    threshold: 0.6
""",
    )
    suite = load_eval_suite(path)
    assert isinstance(suite.checks[0], LLMCheck)
    assert suite.checks[0].threshold == 0.6


def test_missing_file_raises(tmp_path: Path) -> None:
    with pytest.raises(EvalLoadError):
        load_eval_suite(tmp_path / "does-not-exist.yaml")


def test_invalid_yaml_raises(tmp_path: Path) -> None:
    path = _write(tmp_path, "bad.yaml", "module: roles/x\nchecks: [\n")
    with pytest.raises(EvalLoadError):
        load_eval_suite(path)


def test_shape_violation_raises_on_missing_kind(tmp_path: Path) -> None:
    path = _write(
        tmp_path,
        "shape.yaml",
        """\
module: roles/cross-industry/x
checks:
  - id: c1
    judge: deterministic
    target: /body
""",
    )
    with pytest.raises(EvalLoadError):
        load_eval_suite(path)


def test_extra_fields_rejected(tmp_path: Path) -> None:
    path = _write(
        tmp_path,
        "extra.yaml",
        """\
module: roles/cross-industry/x
unknown_top_level: value
checks:
  - id: c1
    judge: deterministic
    kind: not_empty
    target: /body
""",
    )
    with pytest.raises(EvalLoadError):
        load_eval_suite(path)


def test_threshold_must_be_in_range(tmp_path: Path) -> None:
    path = _write(
        tmp_path,
        "out-of-range.yaml",
        """\
module: roles/cross-industry/x
checks:
  - id: bad
    judge: llm
    target: /body
    rubric: "x"
    threshold: 1.5
""",
    )
    with pytest.raises(EvalLoadError):
        load_eval_suite(path)
