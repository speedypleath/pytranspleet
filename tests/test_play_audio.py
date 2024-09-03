import src.backend.utils.filesystem as fs
import src.backend.audio as player
from pathlib import Path


def test_play_audio() -> None:
    audio = fs.load_audio_bytes(Path("/Users/andrei/Projects/pytranspleet/tests/rollwiththepunches.wav"))
    play_object = player.play_audio(audio, 2, 2, 44100)
    assert play_object.is_playing()
    play_object.stop()