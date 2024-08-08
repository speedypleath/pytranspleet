import backend.separator.api as demucs_api
from pathlib import Path

def test_separate_file():
    file_path = Path("/Users/andrei/Projects/pytranspleet/tests/rollwiththepunches.wav")
    demucs_api.separate_file(file_path)
