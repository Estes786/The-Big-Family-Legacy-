"""
EXIF Extractor Tool - Extract metadata from images
"""

from langchain.tools import BaseTool
from typing import Dict, Any
import os
from PIL import Image
from PIL.ExifTags import TAGS
import requests
from io import BytesIO


class ExifExtractorTool(BaseTool):
    name = "exif_extractor"
    description = "Extracts EXIF metadata from images"
    
    def _run(self, image_url: str) -> Dict[str, Any]:
        """
        Extract EXIF data from image
        
        Args:
            image_url: URL or path of the image
            
        Returns:
            Dictionary with EXIF data
        """
        try:
            # Load image
            if image_url.startswith("http"):
                response = requests.get(image_url)
                image = Image.open(BytesIO(response.content))
            else:
                image = Image.open(image_url)
            
            # Extract EXIF data
            exif_data = {}
            if hasattr(image, '_getexif') and image._getexif():
                exif = image._getexif()
                for tag_id, value in exif.items():
                    tag = TAGS.get(tag_id, tag_id)
                    exif_data[tag] = str(value)
            
            # Extract basic metadata
            return {
                "success": True,
                "file_format": image.format,
                "size_bytes": len(image.tobytes()) if image_url.startswith("http") else os.path.getsize(image_url),
                "resolution": {
                    "width": image.width,
                    "height": image.height
                },
                "mode": image.mode,
                "exif": exif_data,
                "date_taken": exif_data.get("DateTime", None),
                "camera_model": exif_data.get("Model", None),
                "gps_info": self._extract_gps(exif_data)
            }
        
        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "exif": {}
            }
    
    def _extract_gps(self, exif_data: Dict) -> Dict[str, Any]:
        """Extract GPS coordinates from EXIF if available"""
        # Placeholder for GPS extraction
        # TODO: Implement proper GPS coordinate extraction
        return {
            "latitude": None,
            "longitude": None,
            "altitude": None
        }
