"""Tests for the click CLI entry."""

from __future__ import annotations

import json
from pathlib import Path

from click.testing import CliRunner

from lokomotif_eval.cli import main
from tests.conftest import VALID_EVAL_YAML, VALID_MODULE_YAML  # noqa: TID252


def test_version_flag_prints_version() -> None:
    runner = CliRunner()
    result = runner.invoke(main, ["--version"])
    assert result.exit_code == 0
    assert "lokomotif-eval" in result.output


def test_help_lists_commands() -> None:
    runner = CliRunner()
    result = runner.invoke(main, ["--help"])
    assert result.exit_code == 0
    for cmd in ("run", "list", "scan-pii"):
        assert cmd in result.output


def test_run_with_no_modules_dir_errors(tmp_path: Path) -> None:
    runner = CliRunner()
    result = runner.invoke(main, ["run", "--root", str(tmp_path)])
    assert result.exit_code == 1
    assert "no modules/ directory" in result.output


def test_run_with_modules_passes(tmp_path: Path) -> None:
    (tmp_path / ".git").mkdir()
    role_dir = tmp_path / "modules" / "roles" / "cross-industry"
    role_dir.mkdir(parents=True)
    (role_dir / "__tests__").mkdir()
    (role_dir / "test-fixture.yaml").write_text(VALID_MODULE_YAML, encoding="utf-8")
    (role_dir / "__tests__" / "test-fixture.eval.yaml").write_text(
        VALID_EVAL_YAML, encoding="utf-8"
    )

    runner = CliRunner()
    result = runner.invoke(main, ["run", "--root", str(tmp_path), "--reporter", "json"])
    payload = json.loads(result.output)
    assert payload["summary"]["ok"] is True


def test_list_command_emits_json(tmp_path: Path) -> None:
    (tmp_path / ".git").mkdir()
    role_dir = tmp_path / "modules" / "roles" / "cross-industry"
    role_dir.mkdir(parents=True)
    (role_dir / "__tests__").mkdir()
    (role_dir / "x.yaml").write_text(VALID_MODULE_YAML, encoding="utf-8")
    (role_dir / "__tests__" / "x.eval.yaml").write_text(VALID_EVAL_YAML, encoding="utf-8")

    runner = CliRunner()
    result = runner.invoke(main, ["list", "--root", str(tmp_path), "--json"])
    assert result.exit_code == 0
    payload = json.loads(result.output)
    assert len(payload["suites"]) == 1


def test_scan_pii_reports_findings(tmp_path: Path) -> None:
    target = tmp_path / "data.txt"
    target.write_text("ID: 12345678901\nemail: user@example.com\n", encoding="utf-8")

    runner = CliRunner()
    result = runner.invoke(main, ["scan-pii", str(target), "--json"])
    payload = json.loads(result.output)
    assert payload["count"] >= 2


def test_scan_pii_clean_input_exits_zero(tmp_path: Path) -> None:
    target = tmp_path / "clean.txt"
    target.write_text("nothing sensitive here\n", encoding="utf-8")
    runner = CliRunner()
    result = runner.invoke(main, ["scan-pii", str(target)])
    assert result.exit_code == 0
    assert "No PII candidates" in result.output
