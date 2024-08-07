import demucs
import demucs.api
from typing import cast


def separate_file(file_path: str):
    separator = demucs.api.Separator()
    print(file_path)
    _, separated = separator.separate_audio_file(cast(demucs.api.Path, file_path))
    for stem, source in separated.items():
        demucs.api.save_audio(
            source,
            f"{stem}_{file_path.split('/')[-1]}",
            samplerate=separator.samplerate,
        )
