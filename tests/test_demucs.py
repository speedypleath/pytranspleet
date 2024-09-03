from time import sleep
import src.backend.separator.api as demucs_api
import src.backend.utils.filesystem as fs
import src.backend.audio as player
from demucs.audio import prevent_clip
from pathlib import Path


def test_separate_file() -> None:
    audio_str = fs.load_audio_file(Path("/Users/andrei/Projects/pytranspleet/tests/rollwiththepunches.wav"))
    audio_path = Path(audio_str)
    separated, sample_rate = demucs_api.separate_file(audio_path)
    assert separated is not None
    assert len(separated) == 4
    for stem, source in separated.items():
        assert source is not None
        assert len(source) > 0
        assert stem in ["drums", "bass", "other", "vocals"]
        wav = prevent_clip(source, mode="rescale")
        play_object = player.play_audio(wav.numpy()[1], 1, 4, sample_rate)
        assert play_object.is_playing()
        play_object.stop()
        
    # Sleep for a while to allow the audio to play
    sleep(0.1)