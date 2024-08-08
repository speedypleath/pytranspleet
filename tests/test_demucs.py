import backend.separator.api as demucs_api
import backend.utils.filesystem as fs
from pathlib import Path

def test_separate_file() -> None:
    audio_str = fs.load_audio_file(Path("/Users/andrei/Projects/pytranspleet/tests/rollwiththepunches.wav"))
    audio_path = Path(audio_str)
    separated, _ = demucs_api.separate_file(audio_path)
    assert separated is not None
    assert len(separated) == 4
    for stem, source in separated.items():
        assert source is not None
        assert len(source) > 0
        assert stem in ["drums", "bass", "other", "vocals"]
