"""Relationship Validator Tool"""
from langchain.tools import BaseTool
from typing import Dict
from datetime import datetime

class RelationshipValidatorTool(BaseTool):
    name = "relationship_validator"
    description = "Validates family relationships for logical consistency"
    
    def _run(self, person1_birth: str, person2_birth: str, relationship_type: str) -> Dict:
        """Validate relationship"""
        try:
            if not person1_birth or not person2_birth:
                return {"is_valid": True, "reason": "Insufficient date information"}
            
            date1 = datetime.fromisoformat(person1_birth)
            date2 = datetime.fromisoformat(person2_birth)
            age_diff_years = abs((date1 - date2).days / 365.25)
            
            if relationship_type == "parent":
                if 15 <= age_diff_years <= 60:
                    return {"is_valid": True, "reason": "Age difference appropriate for parent-child"}
                else:
                    return {"is_valid": False, "reason": f"Age difference ({age_diff_years:.1f} years) outside typical range"}
            
            return {"is_valid": True, "reason": "Validation passed"}
        except Exception as e:
            return {"is_valid": False, "error": str(e)}
