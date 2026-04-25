"""Discover modules and their eval files in a Lokomotif Kit repo."""

from __future__ import annotations

from collections.abc import Iterator
from pathlib import Path


def find_repo_root(start: Path) -> Path:
    """Walk upward looking for a `.git/` or `pnpm-workspace.yaml` marker.

    Returns the discovered root, or ``start`` if neither is found within
    a bounded number of hops.
    """

    current = start.resolve()
    for _ in range(64):
        if (current / ".git").exists() or (current / "pnpm-workspace.yaml").exists():
            return current
        parent = current.parent
        if parent == current:
            return start.resolve()
        current = parent
    return start.resolve()


def find_modules_dir(root: Path) -> Path | None:
    """Return ``<root>/modules`` if it exists and is a directory."""
    candidate = root / "modules"
    if candidate.exists() and candidate.is_dir():
        return candidate
    return None


def eval_path_for_module(module_path: Path) -> Path:
    """Conventional path of the eval file for a module.

    ``modules/.../foo.yaml`` -> ``modules/.../__tests__/foo.eval.yaml``.
    """
    return module_path.parent / "__tests__" / f"{module_path.stem}.eval.yaml"


def discover_eval_suites(modules_dir: Path) -> Iterator[tuple[Path, Path]]:
    """Yield ``(module_path, eval_path)`` pairs for every module that
    has a sibling ``__tests__/<name>.eval.yaml`` file.

    Modules without an eval file are silently skipped — Phase 6 modules
    must include evals; the runner enforces that elsewhere.
    """

    for module_path in sorted(modules_dir.rglob("*.yaml")):
        # Skip the eval files themselves and anything inside __tests__.
        if "__tests__" in module_path.parts:
            continue
        eval_path = eval_path_for_module(module_path)
        if eval_path.exists():
            yield module_path, eval_path


def list_modules(modules_dir: Path) -> list[Path]:
    """Return every module path (excluding __tests__ contents)."""
    return [p for p in sorted(modules_dir.rglob("*.yaml")) if "__tests__" not in p.parts]
