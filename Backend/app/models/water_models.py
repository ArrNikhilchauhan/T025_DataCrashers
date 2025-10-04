from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List

class WaterLevelRequest(BaseModel):
    location: str = Field(..., description="Location name for water level analysis")
    latitude: float = Field(..., description="Latitude coordinate")
    longitude: float = Field(..., description="Longitude coordinate")
    language: str = Field("hi", description="Language code: 'hi' for Hindi, 'pa' for Punjabi")

class WaterLevelResponse(BaseModel):
    success: bool
    data: Dict[str, Any]
    message: str

class WaterData(BaseModel):
    id: int
    blockName: str
    district: str
    state: str
    rainfall: float
    groundwaterRecharge: float
    naturalDischarges: float
    annualExtractable: float
    groundwaterExtraction: float
    stageOfExtraction: float
    depthToWater: float
    riskLevel: str
    latitude: float
    longitude: float
    lastUpdated: str

class AIInsights(BaseModel):
    farmerMessage: str
    action: str
    explanation: str