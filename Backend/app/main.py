from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
import os
from pathlib import Path

from models.water_models import WaterLevelRequest, WaterLevelResponse
from services.langchain_service import LangChainWaterSystem  # Updated import
from services.tts_service import TextToSpeechService

app = FastAPI(
    title="Water Level Analysis API",
    description="LangChain-based AI-powered water level analysis with multi-language support",
    version="3.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize services with LangChain
water_system = LangChainWaterSystem()
tts_service = TextToSpeechService()

# Create directories
Path("audio_cache").mkdir(exist_ok=True)
Path("data").mkdir(exist_ok=True)

# Mount audio cache for static files
app.mount("/audio", StaticFiles(directory="audio_cache"), name="audio")

@app.on_event("startup")
async def startup_event():
    """Initialize services on startup"""
    await water_system.initialize()
    print("✅ LangChain Water Level API started successfully")

@app.post("/api/water-level", response_model=WaterLevelResponse)
async def get_water_level_analysis(request: WaterLevelRequest):
    """
    Get water level analysis using LangChain RAG pipeline
    """
    try:
        water_data = await water_system.get_water_analysis(
            location=request.location,
            latitude=request.latitude,
            longitude=request.longitude,
            language=request.language
        )
        
        return WaterLevelResponse(
            success=True,
            data=water_data,
            message="Water level analysis completed successfully"
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing request: {str(e)}")

@app.get("/api/audio/{audio_id}")
async def get_audio_file(audio_id: str):
    """Serve generated audio files"""
    audio_path = f"audio_cache/{audio_id}.mp3"
    if os.path.exists(audio_path):
        return FileResponse(audio_path, media_type="audio/mpeg")
    raise HTTPException(status_code=404, detail="Audio file not found")

@app.post("/api/generate-audio")
async def generate_audio(text: str, language: str = "hi"):
    """Generate audio for text in specified language"""
    try:
        audio_id = await tts_service.text_to_speech(text, language)
        return {
            "success": True, 
            "audio_id": audio_id, 
            "url": f"/api/audio/{audio_id}"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating audio: {str(e)}")

@app.get("/")
async def root():
    return {
        "message": "🌊 LangChain Water Level Analysis API", 
        "status": "running",
        "version": "3.0.0"
    }

@app.get("/health")
async def health_check():
    import datetime
    return {
        "status": "healthy", 
        "timestamp": datetime.datetime.utcnow().isoformat(),
        "services": {
            "langchain_system": "initialized",
            "tts_service": "ready"
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)