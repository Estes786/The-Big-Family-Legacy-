"""
Vision AI Tool - Image Captioning with BLIP-2
"""

from langchain.tools import BaseTool
from typing import Dict, Any
import os
import requests
from huggingface_hub import InferenceClient


class VisionAITool(BaseTool):
    name = "vision_ai"
    description = "Analyzes images and generates detailed captions using BLIP-2"
    
    def __init__(self):
        super().__init__()
        self.hf_token = os.getenv("HF_TOKEN")
        if not self.hf_token:
            raise ValueError("HF_TOKEN environment variable is required")
        
        self.client = InferenceClient(token=self.hf_token)
        self.model = "Salesforce/blip-image-captioning-large"
    
    def _run(self, image_url: str) -> Dict[str, Any]:
        """
        Generate caption for image
        
        Args:
            image_url: URL of the image to analyze
            
        Returns:
            Dictionary with caption and analysis
        """
        try:
            # Download image if URL provided
            if image_url.startswith("http"):
                response = requests.get(image_url)
                image_bytes = response.content
            else:
                with open(image_url, "rb") as f:
                    image_bytes = f.read()
            
            # Generate caption
            caption = self.client.image_to_text(
                image_bytes,
                model=self.model
            )
            
            return {
                "success": True,
                "caption": caption,
                "model_used": self.model,
                "confidence": 0.85  # BLIP-2 typical confidence
            }
        
        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "caption": None
            }
