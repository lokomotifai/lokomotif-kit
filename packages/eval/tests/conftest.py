"""Shared fixtures for the eval harness tests."""

from __future__ import annotations

from pathlib import Path

import pytest

VALID_MODULE_YAML = """\
id: roles/cross-industry/test-fixture
version: 1.0.0
kind: role
title: "Test fixture"
description: "A fixture used by eval-harness tests."
industry: ["cross-industry"]
languages: ["tr", "en"]
owner: lokomotif-core
license: Apache-2.0
body:
  identity:
    tr: "Bir AML uzmanı olarak hareket ediyorsun."
    en: "Acting as an AML analyst."
  expertise:
    - tr: "MASAK düzenlemeleri"
      en: "MASAK regulations"
    - tr: "Şüpheli işlem analizi"
      en: "Suspicious transaction analysis"
"""

VALID_EVAL_YAML = """\
module: roles/cross-industry/test-fixture
description: "Eval suite for the test fixture."
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
  - id: expertise-min-2
    judge: deterministic
    kind: array_length
    target: /body/expertise
    min: 2
"""

FAILING_EVAL_YAML = """\
module: roles/cross-industry/test-fixture
checks:
  - id: identity-mentions-soccer
    judge: deterministic
    kind: regex
    target: /body/identity/en
    pattern: "football|basketball"
"""


@pytest.fixture
def temp_repo(tmp_path: Path) -> Path:
    (tmp_path / ".git").mkdir()
    return tmp_path


@pytest.fixture
def repo_with_module(temp_repo: Path) -> tuple[Path, Path, Path]:
    modules_dir = temp_repo / "modules"
    role_dir = modules_dir / "roles" / "cross-industry"
    tests_dir = role_dir / "__tests__"
    role_dir.mkdir(parents=True)
    tests_dir.mkdir()

    module_path = role_dir / "test-fixture.yaml"
    eval_path = tests_dir / "test-fixture.eval.yaml"
    module_path.write_text(VALID_MODULE_YAML, encoding="utf-8")
    eval_path.write_text(VALID_EVAL_YAML, encoding="utf-8")

    return temp_repo, module_path, eval_path
