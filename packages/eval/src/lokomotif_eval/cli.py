"""``lokomotif-eval`` — click-based CLI entry."""

from __future__ import annotations

import sys
from pathlib import Path

import click

from lokomotif_eval import __version__
from lokomotif_eval.discovery import (
    discover_eval_suites,
    find_modules_dir,
    find_repo_root,
)
from lokomotif_eval.pii import scan_for_pii
from lokomotif_eval.reporter import console_report, render_json
from lokomotif_eval.runner import EvalRunner


@click.group()
@click.version_option(version=__version__, prog_name="lokomotif-eval")
def main() -> None:
    """Lokomotif Kit eval harness."""


def _resolve_modules_dir(root: str) -> Path:
    repo_root = find_repo_root(Path(root))
    modules_dir = find_modules_dir(repo_root)
    if modules_dir is None:
        click.echo(f"error: no modules/ directory found under {repo_root}", err=True)
        sys.exit(1)
    return modules_dir


@main.command()
@click.option(
    "--root",
    type=click.Path(exists=True, file_okay=False),
    default=".",
    show_default=True,
    help="Repository root (or any path inside it).",
)
@click.option(
    "--module",
    "module_filter",
    default=None,
    help="Run only the eval for this module ID (e.g. roles/finance/aml-analyst).",
)
@click.option(
    "--reporter",
    type=click.Choice(["console", "json"]),
    default="console",
    show_default=True,
)
def run(root: str, module_filter: str | None, reporter: str) -> None:
    """Run eval suites against modules."""

    modules_dir = _resolve_modules_dir(root)
    pairs = list(discover_eval_suites(modules_dir))

    if module_filter is not None:
        pairs = [
            (mp, ep)
            for (mp, ep) in pairs
            if mp.relative_to(modules_dir).with_suffix("").as_posix() == module_filter
        ]

    if not pairs:
        if reporter == "json":
            click.echo(render_json([], _empty_summary()))
        else:
            click.echo("No eval suites found. (Phase 6 ships canonical modules + evals.)")
        return

    runner = EvalRunner(modules_dir=modules_dir)
    results, summary = runner.run_paths(pairs)

    if reporter == "json":
        click.echo(render_json(results, summary))
    else:
        console_report(results, summary)

    sys.exit(0 if summary.ok else 1)


@main.command(name="list")
@click.option(
    "--root",
    type=click.Path(exists=True, file_okay=False),
    default=".",
    show_default=True,
)
@click.option("--json", "as_json", is_flag=True, default=False)
def list_cmd(root: str, as_json: bool) -> None:
    """List discovered eval suites."""

    modules_dir = _resolve_modules_dir(root)
    pairs = list(discover_eval_suites(modules_dir))
    payload = [
        {
            "module_path": str(mp),
            "eval_path": str(ep),
            "module_id": mp.relative_to(modules_dir).with_suffix("").as_posix(),
        }
        for mp, ep in pairs
    ]
    if as_json:
        import json as _json

        click.echo(_json.dumps({"suites": payload}, indent=2, ensure_ascii=False))
        return
    if not pairs:
        click.echo("No eval suites found.")
        return
    for entry in payload:
        click.echo(f"{entry['module_id']}  ({entry['eval_path']})")


@main.command(name="scan-pii")
@click.argument("path", type=click.Path(exists=True))
@click.option("--json", "as_json", is_flag=True, default=False)
def scan_pii(path: str, as_json: bool) -> None:
    """Scan a file or directory for PII candidates."""

    target = Path(path)
    if target.is_file():
        files = [target]
    else:
        files = sorted(p for p in target.rglob("*") if p.is_file())

    findings: list[dict[str, str | int]] = []
    for f in files:
        try:
            text = f.read_text(encoding="utf-8")
        except (OSError, UnicodeDecodeError):
            continue
        for finding in scan_for_pii(text):
            findings.append(
                {
                    "file": str(f),
                    "pattern": finding.pattern_name,
                    "match": finding.match,
                    "line": finding.line,
                    "column": finding.column,
                }
            )

    if as_json:
        import json as _json

        click.echo(_json.dumps({"findings": findings, "count": len(findings)}, indent=2))
        return

    if not findings:
        click.echo("No PII candidates found.")
        return

    for f in findings:
        click.echo(f"{f['file']}:{f['line']}:{f['column']}  [{f['pattern']}]  {f['match']!r}")
    click.echo(f"\n{len(findings)} candidate(s) found.")
    sys.exit(1)


def _empty_summary():
    from lokomotif_eval.runner import RunSummary

    return RunSummary(
        total_modules=0,
        passed_modules=0,
        failed_modules=0,
        total_checks=0,
        passed_checks=0,
        failed_checks=0,
    )
