from __future__ import annotations

from collections.abc import Callable
from contextlib import contextmanager
from typing import (
    TYPE_CHECKING,
    Concatenate,
    Literal,
    Self,
    overload,
    override,
)

if TYPE_CHECKING:
    from collections.abc import Callable, Generator, Sequence


class StringBuilder:
    def __init__(self, indent_width: int = 4) -> None:
        self.strings: list[str] = []
        self.indent_width: int = indent_width
        self.indent_level: int = 0

    def print(self, *strings: str) -> None:
        self.strings.extend(strings)

    def println(self, *strings: str) -> None:
        self.strings.extend(strings)
        self.strings.append("\n")

    def iprint(self, *strings: str) -> None:
        self.strings.append(" " * self.indent_level * self.indent_width)
        self.strings.extend(strings)

    def iprintln(self, *strings: str) -> None:
        self.strings.append(" " * self.indent_level * self.indent_width)
        self.strings.extend(strings)
        self.strings.append("\n")

    @contextmanager
    def indent(self) -> Generator[None]:
        self.indent_level += 1
        yield
        self.indent_level -= 1

    @override
    def __str__(self) -> str:
        return "".join(self.strings)

    @overload
    def commasep[T, **P](
        self,
        items: Sequence[T],
        callback: Callable[Concatenate[T, P], None],
        pass_self: Literal[False] = False,
        *args: P.args,
        **kwargs: P.kwargs,
    ) -> None: ...
    @overload
    def commasep[T, **P](
        self,
        items: Sequence[T],
        callback: Callable[Concatenate[Self, T, P], None],
        pass_self: Literal[True],
        *args: P.args,
        **kwargs: P.kwargs,
    ) -> None: ...
    def commasep(
        self,
        items: Sequence[object],
        callback: Callable[..., None],
        pass_self: bool = False,
        *args: object,
        **kwargs: object,
    ) -> None:
        for i, item in enumerate(items):
            if pass_self:
                callback(self, item, *args, **kwargs)
            else:
                callback(item, *args, **kwargs)
            if i != len(items) - 1:
                self.print(", ")
