# Split stems and transcribe notes from audio files

This project uses Python 3.9 because of some old dependencies for demucs. Link poetry to a Python 3.9 executable and then install dependencies.

```bash
poetry env use <python>
poetry install
```

## Usage

### Run app

```bash
poetry run app
```

### Run tests

```bash
poetry run pytest
# with coverage
poetry run pytest --cov=backend tests/
```

### Run linter

```bash
poetry run ruff check backend tests
```

### Run type checker

```bash
poetry run mypy backend tests
```

### Run everything

```bash
poetry run tox
```
