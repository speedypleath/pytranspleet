from pathlib import Path
from tempfile import NamedTemporaryFile
import wave


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
    
    with wave.open(path.as_posix(), "rb") as infile:
        # get file data
        nchannels = infile.getnchannels()
        sampwidth = infile.getsampwidth()
        framerate = infile.getframerate()
        # set position in wave to start of segment
        infile.setpos(int(start * framerate))
        # extract data
        data = infile.readframes(int((end - start) * framerate))
    
    
    file = file[int(start * 44100):int(end * 44100)]
    
    with NamedTemporaryFile(delete=False, suffix='.wav') as temp:
        with wave.open(temp.name, 'w') as outfile:
            outfile.setnchannels(nchannels)
            outfile.setsampwidth(sampwidth)
            outfile.setframerate(framerate)
            outfile.setnframes(int(len(data) / sampwidth))
            outfile.writeframes(data)
        return temp.name
