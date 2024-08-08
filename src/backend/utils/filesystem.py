from pathlib import Path
from tempfile import NamedTemporaryFile


def load_audio_bytes(path: Path) -> bytes:
    return path.read_bytes()


def load_audio_file(path: Path) -> str:
    file = path.read_bytes()
    
    with NamedTemporaryFile(delete=False) as temp:
        temp.write(file)
        temp.flush()
        return temp.name
    

def cut_audio_segment(path: Path, start: float, end: float) -> str:
    file = path.read_bytes()
    file = file[int(start * 44100):int(end * 44100)]
    
    with NamedTemporaryFile(delete=False) as temp:
        temp.write(file)
        temp.flush()
        return temp.name
