import src.backend.transcriber.api as transcriber_api
from pathlib import Path


def test_transcribe_file() -> None:
    file_path = Path("/Users/andrei/Projects/pytranspleet/tests/rollwiththepunches.wav")
    transcriber_api.predict_pitch(file_path)