import io
from werkzeug.datastructures import FileStorage
from services.audio_service import AudioService

def test_sha256_is_64_hex_characters():
    upload = FileStorage(stream=io.BytesIO(b"sample audio bytes"), filename="sample.wav")
    result = AudioService().analyze(upload)
    assert len(result["sha256"]) == 64
    assert result["result"] == "NOT_ANALYZED"
    assert result["size_bytes"] == len(b"sample audio bytes")

def test_empty_file_is_rejected():
    upload = FileStorage(stream=io.BytesIO(b""), filename="empty.wav")
    try:
        AudioService().analyze(upload)
        assert False, "Expected ValueError"
    except ValueError as exc:
        assert "empty" in str(exc).lower()
