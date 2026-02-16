"""
Genealogist Agent - Family Tree & Relationship Validation
Part of THE BIG FAMILY LEGACY AI Crew
"""

from crewai import Agent, Task
from langchain_openai import ChatOpenAI
from typing import Dict, List, Any

from ..tools.database_query import DatabaseQueryTool
from ..tools.relationship_validator import RelationshipValidatorTool


class GeneologistAgent:
    """
    Genealogy Specialist Agent
    
    Builds accurate family tree structures and validates relationships.
    Professional genealogist with 20 years of family history research experience.
    """
    
    def __init__(self, llm_model: str = "gpt-4o", temperature: float = 0.0):
        self.agent = Agent(
            role="Genealogy Specialist",
            goal="Build accurate family tree structures and validate relationships",
            backstory="""You are a professional genealogist with 20 years of 
            experience in family history research. You've helped hundreds of 
            families trace their lineage back generations. You understand complex 
            family structures (remarriages, adoptions, multi-generational households) 
            and have a mathematical mind for validating dates and relationships. 
            You're detail-oriented and never make assumptions without evidence.""",
            
            verbose=True,
            allow_delegation=False,
            
            tools=[
                DatabaseQueryTool(),
                RelationshipValidatorTool()
            ],
            
            llm=ChatOpenAI(model=llm_model, temperature=temperature)
        )
    
    def create_validate_relationship_task(self, person1: Dict, person2: Dict, relationship_type: str) -> Task:
        """Validate a proposed relationship between two people"""
        return Task(
            description=f"""Validate the following proposed relationship:
            Person 1: {person1['name']} (born: {person1.get('birth_date', 'unknown')})
            Person 2: {person2['name']} (born: {person2.get('birth_date', 'unknown')})
            Relationship: {relationship_type}
            
            Check for:
            1. Age consistency (parent should be 15-60 years older than child)
            2. No circular relationships (A is parent of B, B is parent of A)
            3. Duplicate relationships (already exists in database)
            4. Biological possibility (dates align)
            
            Return JSON:
            {{
                "is_valid": true/false,
                "reason": "...",
                "confidence_score": 0.0-1.0,
                "warnings": []
            }}
            """,
            expected_output="Validation result with reasoning in JSON format",
            agent=self.agent
        )
    
    def create_build_tree_task(self, family_id: str, focus_person_id: str = None) -> Task:
        """Build complete family tree"""
        return Task(
            description=f"""Build a complete family tree for:
            Family ID: {family_id}
            Focus Person: {focus_person_id or "all members"}
            
            Generate:
            1. Hierarchical tree structure (ancestors and descendants)
            2. Sibling groups
            3. Spouse relationships
            4. Statistics (total people, generations, living/deceased)
            
            Format: JSON suitable for D3.js visualization
            """,
            expected_output="Family tree JSON structure",
            agent=self.agent
        )
