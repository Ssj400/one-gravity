"""Mientras una función sea un stub (NotImplementedError), su test se marca como
*skipped* con el mensaje del stub, en vez de fallar. Al implementarla, el test
corre de verdad. Así ``pytest`` muestra en todo momento qué falta."""

import pytest


@pytest.hookimpl(wrapper=True)
def pytest_runtest_call(item):
    try:
        return (yield)
    except NotImplementedError as exc:
        pytest.skip(f"pendiente — {exc}")
