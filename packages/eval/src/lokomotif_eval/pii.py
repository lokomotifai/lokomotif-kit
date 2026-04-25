"""Turkey-aware PII detector — heuristic stub.

This module ships in Phase 5 as a placeholder. The real detector lands
with the canonical ``guardrails/pii-tr`` module in Phase 6, at which
point this file delegates to the module's regex set.

The patterns here intentionally lean toward false-positives — better
to flag and let the operator clear than to miss real personal data.

Patterns:

- TC Kimlik No: 11 contiguous digits. The full algorithm includes a
  checksum (digits 1–9 follow a rule; digit 11 is mod-10 of digits
  1–10). The strict checksum lives in `guardrails/pii-tr` once Phase 6
  ships; here we surface every 11-digit run as a candidate.
- IBAN TR: ``TR`` followed by 24 digits (any spacing).
- Turkish mobile: ``+90 5XX XXX XX XX`` and common variants.
- Generic email — surfaced because we try not to ship customer-
  identifiable strings even when they look benign.
"""

from __future__ import annotations

import re
from dataclasses import dataclass
from typing import Final

# 11 consecutive digits, but require non-digit boundaries so we don't
# match longer all-digit runs.
_TC_KIMLIK = re.compile(r"(?<!\d)\d{11}(?!\d)")

# IBAN TR: country code + 2 check digits + 22 digits, possibly spaced
# in groups of 4. We accept the unspaced form too.
_IBAN_TR = re.compile(r"\bTR\d{2}(?:[ -]?\d{4}){5}\d{2}\b", re.IGNORECASE)

# Turkish mobile numbers — common forms.
_TR_PHONE = re.compile(
    r"(?<!\d)(?:\+?90|0)?[\s-]?5\d{2}[\s-]?\d{3}[\s-]?\d{2}[\s-]?\d{2}(?!\d)"
)

# Generic email — kept loose; intent is signal, not parser-grade.
_EMAIL = re.compile(r"[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}")

_PATTERNS: Final[tuple[tuple[str, re.Pattern[str]], ...]] = (
    ("tc_kimlik_candidate", _TC_KIMLIK),
    ("iban_tr", _IBAN_TR),
    ("tr_phone", _TR_PHONE),
    ("email", _EMAIL),
)


@dataclass(frozen=True, slots=True)
class PIIFinding:
    """One match. Line and column are 1-based."""

    pattern_name: str
    match: str
    line: int
    column: int


def scan_for_pii(text: str) -> list[PIIFinding]:
    """Return every match across the configured patterns.

    Empty input yields an empty list. Multi-line input is scanned line
    by line so locations are reportable.
    """

    findings: list[PIIFinding] = []
    for line_no, line in enumerate(text.splitlines(), start=1):
        for name, pattern in _PATTERNS:
            for match in pattern.finditer(line):
                findings.append(
                    PIIFinding(
                        pattern_name=name,
                        match=match.group(),
                        line=line_no,
                        column=match.start() + 1,
                    )
                )
    return findings
