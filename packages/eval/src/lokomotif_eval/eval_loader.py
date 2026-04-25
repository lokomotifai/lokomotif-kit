"""Eval suite definition + loader.

Eval YAML format (v0):

    module: roles/finance/aml-analyst
    description: "Optional description."
    checks:
      - id: identity-mentions-aml
        judge: deterministic
        kind: regex
        target: /body/identity/en
        pattern: "AML|anti-money laundering"
        flags: i
      - id: identity-not-empty-tr
        judge: deterministic
        kind: not_empty
        target: /body/identity/tr
      - id: voice-sounds-senior
        judge: llm
        target: /body/identity
        rubric: "Identity should sound like a senior practitioner..."
        threshold: 0.7

Discriminator: each check carries `judge` ∈ {deterministic, llm}.
"""

from __future__ import annotations

from pathlib import Path
from typing import Annotated, Any, Literal, Union

import yaml
from pydantic import BaseModel, ConfigDict, Field, ValidationError


class EvalLoadError(Exception):
    """Raised when an eval YAML cannot be parsed or fails shape validation."""

    def __init__(self, message: str, *, path: Path | None = None, cause: Exception | None = None) -> None:
        super().__init__(message)
        self.path = path
        self.cause = cause


Severity = Literal["critical", "high", "medium", "low"]


class _BaseCheck(BaseModel):
    """Fields shared by every check."""

    model_config = ConfigDict(extra="forbid", frozen=True)

    id: str = Field(min_length=1)
    target: str = Field(min_length=1, description="JSON Pointer (RFC 6901) into the module.")
    description: str | None = None
    severity: Severity = "high"


class DeterministicCheck(_BaseCheck):
    """A deterministic check — judged purely by code, no LLM."""

    judge: Literal["deterministic"] = "deterministic"
    kind: Literal["regex", "not_empty", "array_length", "equals", "contains"]
    # Kind-specific arguments; only the matching pair is consumed.
    pattern: str | None = None
    flags: str | None = None
    min: int | None = None
    max: int | None = None
    expected: str | int | float | bool | None = None
    substring: str | None = None


class LLMCheck(_BaseCheck):
    """A check judged by an LLM against a rubric."""

    judge: Literal["llm"] = "llm"
    rubric: str = Field(min_length=1)
    threshold: float = Field(default=0.7, ge=0.0, le=1.0)


Check = Annotated[
    Union[DeterministicCheck, LLMCheck],
    Field(discriminator="judge"),
]


class EvalSuite(BaseModel):
    """All eval checks for a single module."""

    model_config = ConfigDict(extra="forbid", frozen=True)

    module: str = Field(min_length=1, description="Module ID under test.")
    description: str | None = None
    checks: list[Check] = Field(min_length=1)


def load_eval_suite(path: str | Path) -> EvalSuite:
    """Read and validate an eval YAML.

    Raises ``EvalLoadError`` for missing files, parse errors, and
    shape validation failures. The original error is attached as
    ``cause``.
    """

    p = Path(path)
    if not p.exists():
        raise EvalLoadError(f"eval file not found: {p}", path=p)
    try:
        raw: Any = yaml.safe_load(p.read_text(encoding="utf-8"))
    except yaml.YAMLError as exc:
        raise EvalLoadError(f"failed to parse YAML: {exc}", path=p, cause=exc) from exc
    try:
        return EvalSuite.model_validate(raw)
    except ValidationError as exc:
        raise EvalLoadError(f"eval suite shape invalid: {exc}", path=p, cause=exc) from exc
