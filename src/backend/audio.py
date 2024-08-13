from simpleaudio import play_buffer, PlayObject


def play_audio(audio: bytes, no_channels: int, bytes_per_sample: int, sample_rate: int) -> PlayObject:
    play_object = play_buffer(audio, no_channels, bytes_per_sample, sample_rate)
    return play_object
