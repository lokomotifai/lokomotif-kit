"""Tests for the JSON Pointer target resolver."""

from __future__ import annotations

import pytest

from lokomotif_eval.targets import PointerError, resolve_pointer


def test_root_pointer_returns_document() -> None:
    data = {"a": 1}
    assert resolve_pointer(data, "") is data
    assert resolve_pointer(data, "/") is data


def test_resolves_nested_keys() -> None:
    data = {"body": {"identity": {"en": "hello"}}}
    assert resolve_pointer(data, "/body/identity/en") == "hello"


def test_resolves_array_indexing() -> None:
    data = {"items": ["a", "b", "c"]}
    assert resolve_pointer(data, "/items/0") == "a"
    assert resolve_pointer(data, "/items/2") == "c"


def test_resolves_array_of_objects() -> None:
    data = {"expertise": [{"en": "first"}, {"en": "second"}]}
    assert resolve_pointer(data, "/expertise/1/en") == "second"


def test_unescapes_segments() -> None:
    data = {"weird/key": {"another~key": 42}}
    assert resolve_pointer(data, "/weird~1key/another~0key") == 42


def test_pointer_must_start_with_slash() -> None:
    with pytest.raises(PointerError):
        resolve_pointer({"a": 1}, "a")


def test_missing_key_raises() -> None:
    with pytest.raises(PointerError):
        resolve_pointer({"a": 1}, "/missing")


def test_array_index_out_of_range_raises() -> None:
    with pytest.raises(PointerError):
        resolve_pointer({"items": [1]}, "/items/5")


def test_non_integer_array_index_raises() -> None:
    with pytest.raises(PointerError):
        resolve_pointer({"items": [1]}, "/items/foo")


def test_traversing_non_collection_raises() -> None:
    with pytest.raises(PointerError):
        resolve_pointer({"value": 42}, "/value/something")
