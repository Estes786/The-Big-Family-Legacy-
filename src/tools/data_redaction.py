"""
Data Redaction Tool for Privacy Guard Agent
"""

from langchain.tools import BaseTool
from typing import Dict, List, Any


class DataRedactionTool(BaseTool):
    name = "data_redaction"
    description = "Redacts sensitive information from text"
    
    def _run(self, text: str, pii_list: List[Dict[str, Any]]) -> Dict[str, str]:
        """
        Redact PII from text
        
        Args:
            text: Original text
            pii_list: List of PII detected (from PIIDetectionTool)
            
        Returns:
            Dictionary with original and redacted text
        """
        redacted_text = text
        
        # Sort PII by position (descending) to avoid index shifting
        sorted_pii = sorted(pii_list, key=lambda x: x["start"], reverse=True)
        
        for pii_item in sorted_pii:
            start = pii_item["start"]
            end = pii_item["end"]
            pii_type = pii_item["type"]
            
            # Replace with appropriate redaction
            redaction_text = self._get_redaction_text(pii_type)
            redacted_text = redacted_text[:start] + redaction_text + redacted_text[end:]
        
        return {
            "original_text": text,
            "redacted_text": redacted_text,
            "redactions_made": len(sorted_pii)
        }
    
    def _get_redaction_text(self, pii_type: str) -> str:
        """Get appropriate redaction text for PII type"""
        redaction_map = {
            "ktp_number": "[REDACTED_ID_NUMBER]",
            "phone_number": "[REDACTED_PHONE]",
            "email_address": "[REDACTED_EMAIL]",
            "credit_card": "[REDACTED_CC]",
            "detailed_address": "[REDACTED_ADDRESS]"
        }
        
        return redaction_map.get(pii_type, "[REDACTED]")
