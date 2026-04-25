"""Smoke tests for the eval package scaffold.

These keep CI honest while the runner is being built. They are replaced by
real harness tests in Phase 5.
"""

from __future__ import annotations

import sys

import lokomotif_eval


def test_python_version_supported() -> None:
    assert sys.version_info >= (3, 12), "Lokomotif eval requires Python 3.12+"


def test_package_imports() -> None:
    # Version follows semver; assert shape, not a specific value, so the
    # check survives release bumps.
    parts = lokomotif_eval.__version__.split(".")
    assert len(parts) == 3
    assert all(part.isdigit() for part in parts)
