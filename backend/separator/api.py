import demucs
import demucs.api
from typing import Dict
from torch import Tensor


def separate_file(file_path: demucs.api.Path) -> tuple[Dict[str, Tensor], int]:
    separator = demucs.api.Separator()
    _, separated = separator.separate_audio_file(file_path)
    return separated, separator.samplerate

def save_separated_files(file_path: str, separated: Dict[str, Tensor], sample_rate) -> None:
    for stem, source in separated.items():
        demucs.api.save_audio(
            source,
            f"{stem}_{file_path.split('/')[-1]}",
            samplerate=sample_rate,
        )