"""Validate notebook JSON structure and Python-cell syntax without extra packages."""

from __future__ import annotations

import ast
import json
from pathlib import Path


NOTEBOOK = Path(__file__).resolve().parents[1] / "Project.ipynb"


def compilable_source(lines: list[str]) -> str:
    """Remove notebook-only shell and magic lines before Python syntax checking."""
    return "".join(
        "pass\n" if line.lstrip().startswith(("!", "%")) else line
        for line in lines
    )


def main() -> None:
    notebook = json.loads(NOTEBOOK.read_text(encoding="utf-8"))
    assert notebook.get("nbformat") == 4, "Project.ipynb must use notebook format 4"
    assert isinstance(notebook.get("metadata"), dict), "Notebook metadata is missing"
    assert isinstance(notebook.get("cells"), list), "Notebook cells are missing"

    code_cells = 0
    for index, cell in enumerate(notebook["cells"]):
        assert cell.get("cell_type") in {"code", "markdown", "raw"}, (
            f"Cell {index} has an invalid cell_type"
        )
        assert isinstance(cell.get("source"), list), f"Cell {index} source must be a list"
        if cell["cell_type"] == "code":
            ast.parse(compilable_source(cell["source"]), filename=f"cell-{index}")
            code_cells += 1

    print(f"Validated {len(notebook['cells'])} cells ({code_cells} Python code cells).")


if __name__ == "__main__":
    main()
