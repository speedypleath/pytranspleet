from basic_pitch.inference import predict_and_save
from basic_pitch import ICASSP_2022_MODEL_PATH
from pathlib import Path


def predict_pitch(audio: Path):
    output_dir = audio.parent.joinpath("output")
    if not output_dir.exists():
        output_dir.mkdir()
    
    midi_path = output_dir.joinpath(f"{audio.name.removesuffix('.wav')}_basic_pitch").with_suffix(".mid")
    
    if midi_path.exists():
        midi_path.unlink()
    
    print(f"Saving midi to {midi_path}")
    predict_and_save(
        [audio], 
        output_dir,
        save_midi=True, 
        sonify_midi=False, 
        save_model_outputs=False, 
        save_notes=False,
        model_or_model_path=ICASSP_2022_MODEL_PATH) # type: ignore
