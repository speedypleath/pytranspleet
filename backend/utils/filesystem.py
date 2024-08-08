from pathlib import Path
from tempfile import NamedTemporaryFile


def load_audio_file(path: Path) -> str:
    file = path.read_bytes()
    
    with NamedTemporaryFile(delete=False) as temp:
        temp.write(file)
        temp.flush()
        return temp.name