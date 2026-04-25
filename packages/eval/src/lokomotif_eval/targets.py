"""JSON Pointer (RFC 6901) target resolution.

Eval checks address fields inside a module via JSON Pointer:

    /body/identity/en           ->  module["body"]["identity"]["en"]
    /body/expertise/0           ->  module["body"]["expertise"][0]
    /body/expertise/0/en        ->  module["body"]["expertise"][0]["en"]

The empty pointer ("" or "/") returns the document root.

We use JSON Pointer (not dotted-path) because the Lokomotif schema
already reports validation errors with JSON Pointers; same vocabulary
across surfaces lowers the cognitive cost.
"""

from __future__ import annotations

from typing import Any


class PointerError(Exception):
    """Raised when a JSON Pointer cannot be resolved against the data."""

    def __init__(self, pointer: str, message: str) -> None:
        super().__init__(f"{message} (pointer: {pointer!r})")
        self.pointer = pointer


def _unescape_segment(segment: str) -> str:
    # Per RFC 6901 §4: ~1 -> '/', ~0 -> '~'. Order matters.
    return segment.replace("~1", "/").replace("~0", "~")


def resolve_pointer(data: Any, pointer: str) -> Any:
    """Resolve a JSON Pointer against ``data``.

    ``pointer`` must be an empty string, "/", or start with "/". Any
    other prefix raises ``PointerError``.

    Raises ``PointerError`` when a path segment is missing, when an
    array index is out of range or non-integer, or when a non-collection
    is traversed.
    """

    if pointer in ("", "/"):
        return data
    if not pointer.startswith("/"):
        raise PointerError(pointer, "JSON Pointer must start with '/'")

    current: Any = data
    raw_segments = pointer.split("/")[1:]
    for raw in raw_segments:
        segment = _unescape_segment(raw)
        if isinstance(current, list):
            try:
                idx = int(segment)
            except ValueError as exc:
                raise PointerError(pointer, f"expected integer index at '{segment}'") from exc
            if idx < 0 or idx >= len(current):
                raise PointerError(pointer, f"array index {idx} out of range")
            current = current[idx]
        elif isinstance(current, dict):
            if segment not in current:
                raise PointerError(pointer, f"key '{segment}' not found")
            current = current[segment]
        else:
            raise PointerError(
                pointer,
                f"cannot traverse non-collection at '{segment}' (got {type(current).__name__})",
            )
    return current
