import server.transcriber.api as transcriber_api
from pathlib import Path


def test_transcribe_file():
    file_path = Path("/Users/andrei/Projects/pytranspleet/other_rollwiththepunches.wav")
    transcriber_api.predict_pitch(file_path)