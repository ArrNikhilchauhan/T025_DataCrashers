from gtts import gTTS
import aiofiles
import uuid
import os
from pathlib import Path
import asyncio

class TextToSpeechService:
    def __init__(self):
        self.audio_cache_dir = "audio_cache"
        Path(self.audio_cache_dir).mkdir(exist_ok=True)
        
        # Language mappings for gTTS
        self.language_codes = {
            "hi": "hi",  # Hindi
            "pa": "pa"   # Punjabi
        }
    
    async def text_to_speech(self, text: str, language: str = "hi"):
        """Convert text to speech and save as MP3"""
        if language not in self.language_codes:
            language = "hi"  # Default to Hindi
        
        # Generate unique ID for this audio
        audio_id = str(uuid.uuid4())
        audio_path = os.path.join(self.audio_cache_dir, f"{audio_id}.mp3")
        
        try:
            # Run gTTS in thread pool to avoid blocking
            loop = asyncio.get_event_loop()
            tts = gTTS(text=text, lang=self.language_codes[language], slow=False)
            
            await loop.run_in_executor(None, tts.save, audio_path)
            
            return audio_id
            
        except Exception as e:
            raise Exception(f"TTS generation failed: {str(e)}")