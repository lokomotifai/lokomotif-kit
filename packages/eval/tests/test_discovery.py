"""Tests for module/eval discovery."""

from __future__ import annotations

from pathlib import Path

from lokomotif_eval.discovery import (
    discover_eval_suites,
    eval_path_for_module,
    find_modules_dir,
    find_repo_root,
    list_modules,
)


def test_eval_path_for_module_uses_convention(tmp_path: Path) -> None:
    module = tmp_path / "modules" / "roles" / "finance" / "aml.yaml"
    expected = tmp_path / "modules" / "roles" / "finance" / "__tests__" / "aml.eval.yaml"
    assert eval_path_for_module(module) == expected


def test_find_repo_root_locates_git_marker(tmp_path: Path) -> None:
    (tmp_path / ".git").mkdir()
    nested = tmp_path / "a" / "b" / "c"
    nested.mkdir(parents=True)
    assert find_repo_root(nested) == tmp_path


def test_find_repo_root_falls_back_to_start(tmp_path: Path) -> None:
    nested = tmp_path / "a" / "b"
    nested.mkdir(parents=True)
    assert find_repo_root(nested) == nested.resolve()


def test_find_modules_dir_returns_path_when_present(tmp_path: Path) -> None:
    (tmp_path / "modules").mkdir()
    assert find_modules_dir(tmp_path) == (tmp_path / "modules")


def test_find_modules_dir_returns_none_when_absent(tmp_path: Path) -> None:
    assert find_modules_dir(tmp_path) is None


def test_discover_eval_suites_pairs_modules_with_evals(tmp_path: Path) -> None:
    modules = tmp_path / "modules" / "roles" / "x"
    tests = modules / "__tests__"
    modules.mkdir(parents=True)
    tests.mkdir()

    paired_module = modules / "with-eval.yaml"
    paired_module.write_text("id: x\n", encoding="utf-8")
    (tests / "with-eval.eval.yaml").write_text("module: x\n", encoding="utf-8")

    orphan_module = modules / "without-eval.yaml"
    orphan_module.write_text("id: y\n", encoding="utf-8")

    pairs = list(discover_eval_suites(tmp_path / "modules"))
    assert len(pairs) == 1
    assert pairs[0][0] == paired_module


def test_list_modules_excludes_tests_dir(tmp_path: Path) -> None:
    modules = tmp_path / "modules" / "roles" / "x"
    tests = modules / "__tests__"
    modules.mkdir(parents=True)
    tests.mkdir()
    (modules / "real.yaml").write_text("id: x\n", encoding="utf-8")
    (tests / "fake.yaml").write_text("noise\n", encoding="utf-8")
    found = list_modules(tmp_path / "modules")
    assert [p.name for p in found] == ["real.yaml"]
