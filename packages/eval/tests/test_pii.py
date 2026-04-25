"""Tests for the Turkey-aware PII detector stub."""

from __future__ import annotations

from lokomotif_eval.pii import scan_for_pii


def test_empty_text_yields_no_findings() -> None:
    assert scan_for_pii("") == []


def test_detects_tc_kimlik_candidate() -> None:
    findings = scan_for_pii("ID: 12345678901 in this text.")
    names = [f.pattern_name for f in findings]
    assert "tc_kimlik_candidate" in names


def test_does_not_match_shorter_digit_runs() -> None:
    findings = scan_for_pii("year: 2026, code: 12345")
    assert all(f.pattern_name != "tc_kimlik_candidate" for f in findings)


def test_detects_iban_tr() -> None:
    text = "Account: TR33 0006 1005 1978 6457 8413 26"
    names = [f.pattern_name for f in scan_for_pii(text)]
    assert "iban_tr" in names


def test_detects_email() -> None:
    findings = scan_for_pii("Contact: user@example.com or other.user+tag@domain.co.uk.")
    matches = [f.match for f in findings if f.pattern_name == "email"]
    assert "user@example.com" in matches
    assert "other.user+tag@domain.co.uk" in matches


def test_detects_tr_phone() -> None:
    text = "Call +90 532 123 45 67 or 0532 999 88 77."
    names = [f.pattern_name for f in scan_for_pii(text)]
    assert names.count("tr_phone") >= 2


def test_reports_line_and_column() -> None:
    text = "first line\nsecond user@example.com after\n"
    findings = scan_for_pii(text)
    email = next(f for f in findings if f.pattern_name == "email")
    assert email.line == 2
    assert email.column == len("second ") + 1
