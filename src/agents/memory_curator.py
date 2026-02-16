"""
Memory Curator Agent - Vision AI & Context Analysis
Part of THE BIG FAMILY LEGACY AI Crew
"""

from crewai import Agent, Task
from langchain_openai import ChatOpenAI
from typing import Dict, List, Any

from ..tools.vision_ai import VisionAITool
from ..tools.face_detection import FaceDetectionTool
from ..tools.ocr import OCRTool
from ..tools.exif_extractor import ExifExtractorTool


class MemoryCuratorAgent:
    """
    Memory & Context Analyst Agent
    
    Extracts meaningful context and emotions from family photos and stories.
    Museum curator with archival work expertise and historical photography knowledge.
    """
    
    def __init__(self, llm_model: str = "gpt-4o", temperature: float = 0.3):
        self.agent = Agent(
            role="Memory & Context Analyst",
            goal="Extract meaningful context and emotions from family photos and stories",
            backstory="""You are a museum curator with 15 years of experience 
            in archival work and historical photography. You have a keen eye for 
            details, understand visual storytelling, and can identify historical 
            contexts from visual cues like clothing, architecture, and technology. 
            You're empathetic and understand the emotional weight of family memories.""",
            
            verbose=True,
            allow_delegation=False,
            
            tools=[
                VisionAITool(),
                FaceDetectionTool(),
                OCRTool(),
                ExifExtractorTool()
            ],
            
            llm=ChatOpenAI(model=llm_model, temperature=temperature)
        )
    
    def create_analyze_photo_task(self, image_url: str, user_description: str = "") -> Task:
        """
        Create photo analysis task
        
        Args:
            image_url: URL of the image to analyze
            user_description: Optional user-provided context
            
        Returns:
            Task object for CrewAI execution
        """
        return Task(
            description=f"""Analyze this family photo thoroughly:
            Image URL: {image_url}
            User-provided context: {user_description}
            
            Your analysis should include:
            1. Scene description (What's happening? Where is it?)
            2. Emotional tone (Joy, solemn, casual, formal?)
            3. Number of people and their approximate ages
            4. Time period estimation (based on clothing, tech, quality)
            5. Notable objects or landmarks
            6. Suggested caption (2-3 sentences, warm and engaging tone)
            
            Be specific but respectful. If you detect cultural or religious 
            elements (hijab, traditional clothing), mention them respectfully.
            
            Return JSON format:
            {{
                "scene_description": "...",
                "emotional_tone": "...",
                "people_count": 0,
                "estimated_ages": [],
                "time_period": "...",
                "notable_objects": [],
                "suggested_caption": "...",
                "cultural_elements": [],
                "confidence_score": 0.0-1.0
            }}
            """,
            
            expected_output="Detailed photo analysis with caption in JSON format",
            agent=self.agent
        )
    
    def create_detect_faces_task(self, image_url: str, family_members: List[Dict]) -> Task:
        """
        Create face detection and identification task
        
        Args:
            image_url: URL of the image
            family_members: List of known family members with photos
            
        Returns:
            Task object for CrewAI execution
        """
        family_members_str = "\n".join([
            f"- {member['name']} (born: {member.get('birth_date', 'unknown')})"
            for member in family_members
        ])
        
        return Task(
            description=f"""Use face detection to find all faces in the image:
            Image URL: {image_url}
            Known family members:
            {family_members_str}
            
            For each detected face:
            1. Extract bounding box coordinates
            2. Estimate age group (child, teen, adult, elderly)
            3. Gender (if visually apparent)
            4. Suggest possible matches from family members
            5. Confidence score for each suggestion
            
            Return JSON format:
            {{
                "faces_detected": [
                    {{
                        "face_id": 1,
                        "bbox": {{"x": 0, "y": 0, "width": 0, "height": 0}},
                        "age_group": "...",
                        "gender": "...",
                        "suggested_matches": [
                            {{"name": "...", "confidence": 0.0-1.0, "reasoning": "..."}}
                        ]
                    }}
                ],
                "total_faces": 0
            }}
            """,
            
            expected_output="JSON array of detected faces with match suggestions",
            agent=self.agent
        )
    
    def create_extract_metadata_task(self, image_url: str) -> Task:
        """
        Create metadata extraction task
        
        Args:
            image_url: URL of the image
            
        Returns:
            Task object for CrewAI execution
        """
        return Task(
            description=f"""Extract all available metadata from this image:
            Image URL: {image_url}
            
            Extract:
            1. EXIF data (date taken, camera model, settings)
            2. GPS coordinates (if available)
            3. File properties (size, format, resolution)
            4. Any embedded text (OCR if needed)
            
            Return JSON format:
            {{
                "date_taken": "ISO 8601 format or null",
                "camera_model": "...",
                "gps_coordinates": {{"lat": 0.0, "lng": 0.0}} or null,
                "location_name": "...",
                "file_size_bytes": 0,
                "format": "...",
                "resolution": {{"width": 0, "height": 0}},
                "embedded_text": []
            }}
            """,
            
            expected_output="Complete metadata extraction in JSON format",
            agent=self.agent
        )
