"""
Compliance Check Tool for Privacy Guard Agent
"""

from langchain.tools import BaseTool
from typing import Dict, List, Any


class ComplianceCheckTool(BaseTool):
    name = "compliance_check"
    description = "Checks if data processing complies with privacy regulations"
    
    def _run(self, data_type: str, processing_purpose: str, user_consent: bool) -> Dict[str, Any]:
        """
        Check compliance with GDPR and privacy regulations
        
        Args:
            data_type: Type of data being processed
            processing_purpose: Purpose of processing
            user_consent: Whether user has given consent
            
        Returns:
            Compliance check result
        """
        compliance_rules = {
            "family_photos": {
                "requires_consent": True,
                "can_share_publicly": False,
                "retention_period": "indefinite",
                "gdpr_category": "personal_data"
            },
            "biometric_data": {
                "requires_consent": True,
                "can_share_publicly": False,
                "retention_period": "limited",
                "gdpr_category": "special_category"
            },
            "health_data": {
                "requires_consent": True,
                "can_share_publicly": False,
                "retention_period": "limited",
                "gdpr_category": "special_category"
            },
            "location_data": {
                "requires_consent": True,
                "can_share_publicly": False,
                "retention_period": "limited",
                "gdpr_category": "personal_data"
            }
        }
        
        rules = compliance_rules.get(data_type, {
            "requires_consent": True,
            "can_share_publicly": False,
            "retention_period": "limited",
            "gdpr_category": "personal_data"
        })
        
        # Check compliance
        is_compliant = True
        warnings = []
        
        if rules["requires_consent"] and not user_consent:
            is_compliant = False
            warnings.append("User consent required but not provided")
        
        if rules["gdpr_category"] == "special_category":
            warnings.append("Special category data requires extra protection")
        
        return {
            "is_compliant": is_compliant,
            "data_type": data_type,
            "gdpr_category": rules["gdpr_category"],
            "requires_consent": rules["requires_consent"],
            "can_share_publicly": rules["can_share_publicly"],
            "retention_period": rules["retention_period"],
            "warnings": warnings,
            "recommendations": self._get_recommendations(rules, user_consent)
        }
    
    def _get_recommendations(self, rules: Dict, user_consent: bool) -> List[str]:
        """Get privacy recommendations"""
        recommendations = []
        
        if rules["requires_consent"] and not user_consent:
            recommendations.append("Obtain explicit user consent before processing")
        
        if rules["gdpr_category"] == "special_category":
            recommendations.append("Implement additional security measures")
            recommendations.append("Log all access to this data")
        
        if not rules["can_share_publicly"]:
            recommendations.append("Do not expose this data in public APIs")
            recommendations.append("Use Row-Level Security in database")
        
        return recommendations
