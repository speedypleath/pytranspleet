from basic_pitch.inference import predict_and_save
from basic_pitch import ICASSP_2022_MODEL_PATH
from pathlib import Path


def predict_pitch(audio: Path):
    print(audio.parent.joinpath("output"))
    _, midi_data, _ = predict_and_save(
        [audio], 
        audio.parent.joinpath("output"), 
        save_midi=True, 
        sonify_midi=True, 
        save_model_outputs=False, 
        save_notes=True,
        model_or_model_path=ICASSP_2022_MODEL_PATH)
    midi_data.write(audio.with_suffix(".mid"))
