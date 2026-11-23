"""Project-specific pronunciation correction after contextual Chinese G2P."""
def install_line_pronunciation(pipeline):
    original = pipeline.g2p
    def corrected(text, *args, **kwargs):
        phonemes, tokens = original(text, *args, **kwargs)
        if "一行" in text:
            phonemes = phonemes.replace("ㄧ4ㄒ应2", "ㄧ4ㄏㄤ2")
            assert "ㄧ4ㄏㄤ2" in phonemes, f"Unverified pronunciation for {text}: {phonemes}"
            assert "ㄧ4ㄒ应2" not in phonemes
        return phonemes, tokens
    pipeline.g2p = corrected
