import json
import pandas as pd
import numpy as np
from pathlib import Path
import aiofiles
from typing import Dict, Any, List, Optional
from rapidfuzz import fuzz, process
import os
from dotenv import load_dotenv
import asyncio
import logging

# LangChain imports
from langchain_google_genai import ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings
from langchain_core.documents import Document
from langchain_huggingface import HuggingFaceEmbeddings  # Or use sentence-transformers directly
from langchain_chroma import Chroma
from langchain_core.prompts import PromptTemplate
from langchain.chains import create_retrieval_chain
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain.memory import ConversationBufferMemory
from langchain.text_splitter import RecursiveCharacterTextSplitter

from models.water_models import WaterData

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

load_dotenv()

class LangChainWaterSystem:
    def __init__(self):
        self.data = None
        self.llm = None
        self.embeddings = None
        self.vector_store = None
        self.qa_chain = None
        self.memory = None
        self.locations_list = []
        self.collection_name = "water_level_data"
        self.persist_directory = "chroma_db"
        
    async def initialize(self):
        """Initialize the LangChain RAG system with ChromaDB"""
        await self.load_sample_data()
        await self.initialize_langchain()
        await self.initialize_chroma_vectorstore()
        logger.info("✅ LangChain RAG System with ChromaDB initialized successfully")
    
    async def initialize_langchain(self):
        """Initialize LangChain components with Google Gemini"""
        try:
            api_key = os.getenv("GOOGLE_API_KEY")
            if not api_key:
                raise ValueError("GOOGLE_API_KEY not found in environment variables")
            
            # Initialize Google Gemini LLM
            self.llm = ChatGoogleGenerativeAI(
                model="gemini-pro",
                google_api_key=api_key,
                temperature=0.7,
                max_output_tokens=1000
            )
            
            # Initialize embeddings
            self.embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
            
            # Initialize memory for contextual conversations
            self.memory = ConversationBufferMemory(
                memory_key="chat_history",
                return_messages=True
            )
            
            logger.info("✅ LangChain components initialized successfully")
            
        except Exception as e:
            logger.error(f"❌ Failed to initialize LangChain: {str(e)}")
            raise
    
    async def load_sample_data(self):
        """Load or generate sample water level data"""
        sample_data_path = "data/sample_water_data.json"
        
        if not Path(sample_data_path).exists():
            await self.generate_sample_data()
        
        async with aiofiles.open(sample_data_path, 'r', encoding='utf-8') as f:
            content = await f.read()
            self.data = json.loads(content)
        
        # Create location strings for matching
        self.locations_list = [
            f"{item['blockName']}, {item['district']}, {item['state']}" 
            for item in self.data
        ]
        
        logger.info(f"✅ Loaded {len(self.data)} water data records")
    
    async def generate_sample_data(self):
        """Generate comprehensive sample water data"""
        sample_data = []
        
        states_districts = {
            "Punjab": {
                "districts": ["Amritsar", "Ludhiana", "Jalandhar", "Patiala", "Bathinda", "Mohali", "Sangrur"],
                "rainfall_range": (400, 800),
                "depth_range": (8, 25),
                "extraction_bias": 0.7
            },
            "Rajasthan": {
                "districts": ["Jaipur", "Jodhpur", "Udaipur", "Kota", "Bikaner", "Ajmer", "Alwar"],
                "rainfall_range": (200, 500),
                "depth_range": (15, 40),
                "extraction_bias": 0.6
            },
            "Haryana": {
                "districts": ["Gurgaon", "Faridabad", "Rohtak", "Panipat", "Karnal", "Hisar"],
                "rainfall_range": (500, 900),
                "depth_range": (10, 30),
                "extraction_bias": 0.65
            },
            "Uttar Pradesh": {
                "districts": ["Lucknow", "Kanpur", "Varanasi", "Agra", "Meerut", "Allahabad"],
                "rainfall_range": (700, 1100),
                "depth_range": (5, 20),
                "extraction_bias": 0.55
            },
            "Madhya Pradesh": {
                "districts": ["Bhopal", "Indore", "Gwalior", "Jabalpur", "Ujjain"],
                "rainfall_range": (800, 1200),
                "depth_range": (5, 15),
                "extraction_bias": 0.5
            }
        }
        
        id_counter = 1
        
        for state, state_info in states_districts.items():
            for district in state_info["districts"]:
                for block_num in range(1, 25):  # 24 blocks per district for better distribution
                    block_name = f"{district} Block {block_num}"
                    
                    rainfall = np.random.uniform(*state_info["rainfall_range"])
                    depth_to_water = np.random.uniform(*state_info["depth_range"])
                    
                    # Calculate risk level based on realistic parameters
                    if depth_to_water < 10 and rainfall > 700:
                        risk_level = "Green"
                    elif depth_to_water < 20 and rainfall > 450:
                        risk_level = "Yellow"
                    else:
                        risk_level = "Red"
                    
                    # Generate correlated water parameters
                    groundwater_recharge = rainfall * np.random.uniform(8, 12)
                    natural_discharges = groundwater_recharge * np.random.uniform(0.08, 0.12)
                    annual_extractable = groundwater_recharge - natural_discharges
                    
                    extraction_multiplier = state_info["extraction_bias"]
                    if risk_level == "Red":
                        extraction_multiplier *= 1.2
                    elif risk_level == "Green":
                        extraction_multiplier *= 0.8
                    
                    groundwater_extraction = annual_extractable * np.random.uniform(
                        extraction_multiplier - 0.1, extraction_multiplier + 0.1
                    )
                    groundwater_extraction = min(groundwater_extraction, annual_extractable * 0.95)
                    
                    stage_of_extraction = (groundwater_extraction / annual_extractable) * 100
                    
                    # Generate realistic coordinates within state regions
                    state_coords = {
                        "Punjab": {"lat_range": (30.0, 32.0), "lng_range": (74.0, 76.0)},
                        "Rajasthan": {"lat_range": (25.0, 28.0), "lng_range": (70.0, 78.0)},
                        "Haryana": {"lat_range": (28.0, 30.5), "lng_range": (75.5, 77.5)},
                        "Uttar Pradesh": {"lat_range": (25.0, 30.0), "lng_range": (77.0, 84.0)},
                        "Madhya Pradesh": {"lat_range": (21.0, 26.0), "lng_range": (74.0, 82.0)}
                    }
                    
                    coord_range = state_coords.get(state, {"lat_range": (20.0, 35.0), "lng_range": (70.0, 90.0)})
                    latitude = np.random.uniform(*coord_range["lat_range"])
                    longitude = np.random.uniform(*coord_range["lng_range"])
                    
                    sample_data.append({
                        "id": id_counter,
                        "blockName": block_name,
                        "district": f"{district} District",
                        "state": state,
                        "rainfall": round(rainfall, 2),
                        "groundwaterRecharge": round(groundwater_recharge, 2),
                        "naturalDischarges": round(natural_discharges, 2),
                        "annualExtractable": round(annual_extractable, 2),
                        "groundwaterExtraction": round(groundwater_extraction, 2),
                        "stageOfExtraction": round(stage_of_extraction, 2),
                        "depthToWater": round(depth_to_water, 2),
                        "riskLevel": risk_level,
                        "latitude": round(latitude, 4),
                        "longitude": round(longitude, 4),
                        "lastUpdated": "2024-01-15"
                    })
                    
                    id_counter += 1
        
        # Save sample data
        Path("data").mkdir(exist_ok=True)
        async with aiofiles.open("data/sample_water_data.json", 'w', encoding='utf-8') as f:
            await f.write(json.dumps(sample_data, indent=2, ensure_ascii=False))
        
        logger.info(f"✅ Generated {len(sample_data)} sample water data records")
        return sample_data
    
    async def initialize_chroma_vectorstore(self):
        """Initialize Chroma vector store with water data"""
        try:
            # Convert water data to LangChain documents
            documents = []
            for item in self.data:
                doc_text = f"""
                Location: {item['blockName']}, {item['district']}, {item['state']}
                Rainfall: {item['rainfall']} mm
                Groundwater Recharge: {item['groundwaterRecharge']} ham
                Natural Discharges: {item['naturalDischarges']} ham
                Annual Extractable: {item['annualExtractable']} ham
                Groundwater Extraction: {item['groundwaterExtraction']} ham
                Stage of Extraction: {item['stageOfExtraction']}%
                Depth to Water: {item['depthToWater']} meters
                Risk Level: {item['riskLevel']}
                Coordinates: {item['latitude']}, {item['longitude']}
                Last Updated: {item['lastUpdated']}
                """
                
                document = Document(
                    page_content=doc_text.strip(),
                    metadata={
                        "id": item["id"],
                        "block_name": item["blockName"],
                        "district": item["district"],
                        "state": item["state"],
                        "risk_level": item["riskLevel"],
                        "latitude": item["latitude"],
                        "longitude": item["longitude"],
                        "rainfall": item["rainfall"],
                        "depth_to_water": item["depthToWater"],
                        "stage_of_extraction": item["stageOfExtraction"]
                    }
                )
                documents.append(document)
            
            # Create or load Chroma vector store
            self.vector_store = Chroma.from_documents(
                documents=documents,
                embedding=self.embeddings,
                persist_directory=self.persist_directory,
                collection_name=self.collection_name
            )
            
            # Persist the database
            self.vector_store.persist()
            
            # Create QA chain with custom prompt
            prompt_template = self._create_qa_prompt()
            
            # Create retrieval QA chain
            self.qa_chain = RetrievalQA.from_chain_type(
                llm=self.llm,
                chain_type="stuff",
                retriever=self.vector_store.as_retriever(
                    search_type="similarity",
                    search_kwargs={"k": 3}
                ),
                chain_type_kwargs={"prompt": prompt_template},
                return_source_documents=True
            )
            
            logger.info("✅ Chroma vector store and QA chain initialized")
            
        except Exception as e:
            logger.error(f"❌ Failed to initialize Chroma vector store: {str(e)}")
            raise
    
    def _create_qa_prompt(self):
        """Create custom prompt template for water analysis"""
        template = """
        You are an agricultural water management expert helping farmers in India. 
        Analyze the provided water data and context to provide insights in {language}.

        Context Information:
        {context}

        User Question: {question}

        Important Instructions:
        1. Provide response in {language_name} language only
        2. Use simple, farmer-friendly language that is easy to understand
        3. Be empathetic and practical in your recommendations
        4. Focus on water conservation and sustainable agricultural practices
        5. Provide specific, actionable recommendations based on the risk level
        6. Explain the implications of the water data in simple terms

        Required JSON Response Format:
        {{
            "farmerMessage": "2-3 line simple message for farmers about current water situation and risk level",
            "action": "1-2 line specific, actionable recommendation for water conservation and irrigation", 
            "explanation": "2-3 line technical explanation of water trends and concerns in simple terms"
        }}

        Remember: The response must be in pure {language_name} without any English words or code.
        """

        return PromptTemplate(
            template=template,
            input_variables=["context", "question", "language", "language_name"]
        )
    
    async def find_similar_locations(self, query: str, k: int = 5):
        """Find similar locations using ChromaDB semantic search"""
        try:
            # Use ChromaDB for similarity search
            similar_docs = self.vector_store.similarity_search(query, k=k)
            
            similar_locations = []
            for doc in similar_docs:
                location_data = next(
                    (item for item in self.data if item["id"] == doc.metadata["id"]), 
                    None
                )
                if location_data:
                    # Calculate a similarity score based on content matching
                    similarity_score = self._calculate_similarity_score(query, doc.page_content)
                    similar_locations.append({
                        **location_data,
                        "similarity_score": similarity_score
                    })
            
            return similar_locations
            
        except Exception as e:
            logger.error(f"❌ ChromaDB semantic search failed: {str(e)}")
            # Fallback to fuzzy matching
            return await self._fuzzy_location_search(query, k)
    
    def _calculate_similarity_score(self, query: str, document_content: str) -> float:
        """Calculate similarity score between query and document content"""
        try:
            # Simple content-based similarity scoring
            query_terms = set(query.lower().split())
            doc_terms = set(document_content.lower().split())
            
            if not query_terms:
                return 0.0
                
            intersection = query_terms.intersection(doc_terms)
            similarity = len(intersection) / len(query_terms)
            
            return min(similarity * 1.5, 1.0)  # Normalize to 0-1 range
            
        except Exception:
            return 0.7  # Default medium confidence
    
    async def _fuzzy_location_search(self, query: str, k: int = 5):
        """Fallback fuzzy location search"""
        matches = process.extract(query, self.locations_list, scorer=fuzz.partial_ratio, limit=k)
        similar_locations = []
        
        for match in matches:
            if match[1] > 60:  # Similarity threshold
                location_str = match[0]
                location_data = next(
                    (item for item in self.data if 
                     f"{item['blockName']}, {item['district']}, {item['state']}" == location_str),
                    None
                )
                if location_data:
                    similar_locations.append({
                        **location_data,
                        "similarity_score": match[1] / 100
                    })
        
        return similar_locations
    
    async def get_water_analysis(self, location: str, latitude: float, longitude: float, language: str = "hi"):
        """Get comprehensive water analysis using LangChain RAG pipeline with ChromaDB"""
        try:
            # Find similar locations using ChromaDB
            similar_locations = await self.find_similar_locations(location)
            
            if not similar_locations:
                raise ValueError(f"❌ No water data found for location: {location}")
            
            # Use the most similar location
            best_match = max(similar_locations, key=lambda x: x.get('similarity_score', 0))
            
            # Generate AI-powered insights using LangChain RAG
            ai_insights = await self.generate_langchain_insights(best_match, language)
            
            return {
                **best_match,
                **ai_insights,
                "location": location,
                "searchedLatitude": latitude,
                "searchedLongitude": longitude,
                "matchedLocation": f"{best_match['blockName']}, {best_match['district']}",
                "confidenceScore": best_match.get('similarity_score', 0.8),
                "dataSource": "ChromaDB RAG System"
            }
            
        except Exception as e:
            logger.error(f"❌ Water analysis failed: {str(e)}")
            raise
    
    async def generate_langchain_insights(self, water_data: Dict[str, Any], language: str = "hi"):
        """Generate AI-powered insights using LangChain RAG pipeline with ChromaDB"""
        
        # Language configurations
        lang_config = {
            "hi": {
                "name": "Hindi",
                "risk_translations": {"Green": "हरा", "Yellow": "पीला", "Red": "लाल"},
                "fallback": {
                    "farmerMessage": f"आपके क्षेत्र में जल स्तर {water_data['riskLevel']} जोखिम स्तर पर है। जल संरक्षण पर ध्यान दें।",
                    "action": "ड्रिप सिंचाई का उपयोग करें और वर्षा जल संचयन करें।",
                    "explanation": f"जल स्तर {water_data['depthToWater']} मीटर गहराई पर है। वर्तमान में {water_data['stageOfExtraction']}% निष्कर्षण दर है।"
                }
            },
            "pa": {
                "name": "Punjabi", 
                "risk_translations": {"Green": "ਹਰਾ", "Yellow": "ਪੀਲਾ", "Red": "ਲਾਲ"},
                "fallback": {
                    "farmerMessage": f"ਤੁਹਾਡੇ ਖੇਤਰ ਵਿੱਚ ਪਾਣੀ ਦਾ ਪੱਧਰ {water_data['riskLevel']} ਖਤਰੇ ਦੇ ਪੱਧਰ 'ਤੇ ਹੈ। ਪਾਣੀ ਦੀ ਬਚਤ 'ਤੇ ਧਿਆਨ ਦਿਓ।",
                    "action": "ਡ੍ਰਿਪ ਸਿੰਚਾਈ ਦੀ ਵਰਤੋਂ ਕਰੋ ਅਤੇ ਬਾਰਿਸ਼ ਦੇ ਪਾਣੀ ਨੂੰ ਜਮ੍ਹਾ ਕਰੋ।",
                    "explanation": f"ਪਾਣੀ ਦਾ ਪੱਧਰ {water_data['depthToWater']} ਮੀਟਰ ਡੂੰਘਾਈ 'ਤੇ ਹੈ। ਵਰਤਮਾਨ ਵਿੱਚ {water_data['stageOfExtraction']}% ਨਿਸ਼ਕਰਸ਼ਣ ਦਰ ਹੈ।"
                }
            }
        }
        
        config = lang_config.get(language, lang_config["hi"])
        
        try:
            # Prepare context from water data
            context_text = f"""
            Location: {water_data['blockName']}, {water_data['district']}, {water_data['state']}
            Rainfall: {water_data['rainfall']} mm
            Groundwater Recharge: {water_data['groundwaterRecharge']} ham
            Natural Discharges: {water_data['naturalDischarges']} ham  
            Annual Extractable: {water_data['annualExtractable']} ham
            Groundwater Extraction: {water_data['groundwaterExtraction']} ham
            Stage of Extraction: {water_data['stageOfExtraction']}%
            Depth to Water: {water_data['depthToWater']} meters
            Risk Level: {water_data['riskLevel']} ({config['risk_translations'][water_data['riskLevel']]})
            """
            
            # Create question for the RAG system
            question = f"""
            Analyze this water data and provide farmer-friendly insights in {config['name']}. 
            Consider the risk level '{water_data['riskLevel']}' and provide practical water conservation advice.
            """
            
            # Use RetrievalQA chain with ChromaDB
            result = await asyncio.get_event_loop().run_in_executor(
                None,
                lambda: self.qa_chain.invoke({
                    "query": question,
                    "language": language,
                    "language_name": config['name']
                })
            )
            
            # Parse the response
            response_text = result["result"]
            
            # Extract JSON from response
            try:
                if "```json" in response_text:
                    response_text = response_text.split("```json")[1].split("```")[0].strip()
                elif "```" in response_text:
                    response_text = response_text.split("```")[1].strip()
                
                insights = json.loads(response_text)
                
                # Validate required fields
                required_fields = ["farmerMessage", "action", "explanation"]
                if all(field in insights for field in required_fields):
                    return insights
                else:
                    raise ValueError("Missing required fields in LangChain response")
                    
            except json.JSONDecodeError as e:
                logger.warning(f"⚠️ Failed to parse JSON from LangChain response: {e}")
                # Try to extract structured data from text
                return self._extract_insights_from_text(response_text, config)
                
        except Exception as e:
            logger.warning(f"⚠️ LangChain RAG with ChromaDB failed, using fallback: {str(e)}")
            return config["fallback"]
    
    def _extract_insights_from_text(self, text: str, config: Dict) -> Dict:
        """Extract insights from unstructured text response"""
        try:
            lines = [line.strip() for line in text.split('\n') if line.strip()]
            farmer_message = ""
            action = ""
            explanation = ""
            
            current_section = ""
            for line in lines:
                lower_line = line.lower()
                
                if any(keyword in lower_line for keyword in ["farmer", "message", "संदेश", "ਸੰਦੇਸ਼"]):
                    current_section = "farmerMessage"
                    farmer_message = line.split(':', 1)[1].strip() if ':' in line else line
                elif any(keyword in lower_line for keyword in ["action", "recommendation", "कार्य", "ਕਾਰਵਾਈ"]):
                    current_section = "action"
                    action = line.split(':', 1)[1].strip() if ':' in line else line
                elif any(keyword in lower_line for keyword in ["explanation", "why", "व्याख्या", "ਸਪਸ਼ਟੀਕਰਨ"]):
                    current_section = "explanation"
                    explanation = line.split(':', 1)[1].strip() if ':' in line else line
                elif current_section:
                    # Continue adding to the current section
                    if current_section == "farmerMessage":
                        farmer_message += " " + line
                    elif current_section == "action":
                        action += " " + line
                    elif current_section == "explanation":
                        explanation += " " + line
            
            # Clean up the extracted text
            farmer_message = farmer_message.strip() if farmer_message else ""
            action = action.strip() if action else ""
            explanation = explanation.strip() if explanation else ""
            
            # If we couldn't extract structured data, use fallback
            if not all([farmer_message, action, explanation]):
                return config["fallback"]
            
            return {
                "farmerMessage": farmer_message,
                "action": action,
                "explanation": explanation
            }
            
        except Exception as e:
            logger.error(f"❌ Error extracting insights from text: {e}")
            return config["fallback"]
    
    async def search_similar_locations_by_coordinates(self, lat: float, lng: float, radius_km: float = 50):
        """Search for locations near given coordinates"""
        try:
            similar_locations = []
            
            for location in self.data:
                distance = self._calculate_distance(
                    lat, lng, 
                    location["latitude"], location["longitude"]
                )
                
                if distance <= radius_km:
                    similarity_score = max(0, 1 - (distance / radius_km))
                    similar_locations.append({
                        **location,
                        "similarity_score": similarity_score,
                        "distance_km": distance
                    })
            
            return sorted(similar_locations, key=lambda x: x["distance_km"])[:5]
            
        except Exception as e:
            logger.error(f"❌ Coordinate-based search failed: {str(e)}")
            return []
    
    def _calculate_distance(self, lat1: float, lon1: float, lat2: float, lon2: float) -> float:
        """Calculate distance between two coordinates using Haversine formula"""
        from math import radians, sin, cos, sqrt, atan2
        
        R = 6371  # Earth radius in kilometers
        
        lat1_rad = radians(lat1)
        lon1_rad = radians(lon1)
        lat2_rad = radians(lat2)
        lon2_rad = radians(lon2)
        
        dlat = lat2_rad - lat1_rad
        dlon = lon2_rad - lon1_rad
        
        a = sin(dlat/2)**2 + cos(lat1_rad) * cos(lat2_rad) * sin(dlon/2)**2
        c = 2 * atan2(sqrt(a), sqrt(1-a))
        
        return R * c
    
    def get_collection_stats(self):
        """Get ChromaDB collection statistics"""
        try:
            if hasattr(self.vector_store, '_collection'):
                collection = self.vector_store._collection
                count = collection.count()
                return {
                    "total_documents": count,
                    "collection_name": self.collection_name,
                    "persist_directory": self.persist_directory
                }
            return {"error": "Collection not accessible"}
        except Exception as e:
            return {"error": str(e)}