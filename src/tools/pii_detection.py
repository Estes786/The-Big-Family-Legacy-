"""
PII Detection Tool for Privacy Guard Agent
"""

from langchain.tools import BaseTool
from typing import Dict, List, Any
import re


class PIIDetectionTool(BaseTool):
    name = "pii_detection"
    description = "Detects personally identifiable information (PII) in text"
    
    def _run(self, text: str) -> Dict[str, Any]:
        """
        Detect PII in text
        
        Args:
            text: Text to analyze
            
        Returns:
            Dictionary with detected PII types and locations
        """
        detected_pii = []
        
        # Indonesian KTP (16 digits)
        ktp_pattern = r'\b\d{16}\b'
        ktp_matches = re.finditer(ktp_pattern, text)
        for match in ktp_matches:
            detected_pii.append({
                "type": "ktp_number",
                "value": match.group(),
                "start": match.start(),
                "end": match.end(),
                "risk_level": "high"
            })
        
        # Phone numbers
        phone_pattern = r'\+?[\d\s\-\(\)]{10,}'
        phone_matches = re.finditer(phone_pattern, text)
        for match in phone_matches:
            detected_pii.append({
                "type": "phone_number",
                "value": match.group(),
                "start": match.start(),
                "end": match.end(),
                "risk_level": "medium"
            })
        
        # Email addresses
        email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
        email_matches = re.finditer(email_pattern, text)
        for match in email_matches:
            detected_pii.append({
                "type": "email_address",
                "value": match.group(),
                "start": match.start(),
                "end": match.end(),
                "risk_level": "medium"
            })
        
        # Credit card numbers (simple check)
        cc_pattern = r'\b\d{4}[\s\-]?\d{4}[\s\-]?\d{4}[\s\-]?\d{4}\b'
        cc_matches = re.finditer(cc_pattern, text)
        for match in cc_matches:
            detected_pii.append({
                "type": "credit_card",
                "value": match.group(),
                "start": match.start(),
                "end": match.end(),
                "risk_level": "critical"
            })
        
        # Detailed addresses with numbers
        address_pattern = r'\b\d+\s+[A-Za-z\s]+(?:Street|St|Road|Rd|Avenue|Ave|Jalan|Jl)\b'
        address_matches = re.finditer(address_pattern, text, re.IGNORECASE)
        for match in address_matches:
            detected_pii.append({
                "type": "detailed_address",
                "value": match.group(),
                "start": match.start(),
                "end": match.end(),
                "risk_level": "medium"
            })
        
        return {
            "detected_pii": detected_pii,
            "total_count": len(detected_pii),
            "risk_level": self._calculate_risk_level(detected_pii),
            "requires_redaction": len(detected_pii) > 0
        }
    
    def _calculate_risk_level(self, pii_list: List[Dict]) -> str:
        """Calculate overall risk level"""
        if not pii_list:
            return "none"
        
        risk_levels = [item["risk_level"] for item in pii_list]
        
        if "critical" in risk_levels:
            return "critical"
        elif "high" in risk_levels:
            return "high"
        elif "medium" in risk_levels:
            return "medium"
        else:
            return "low"
