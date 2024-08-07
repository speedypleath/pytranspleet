import server.separator.api as demucs_api


def test_separate_file():
    file_path = "/Users/andrei/Projects/pytranspleet/tests/rollwiththepunches.wav"
    demucs_api.separate_file(file_path)
