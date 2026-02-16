"""
Privacy Guard Agent - PII Detection & Data Redaction
Part of THE BIG FAMILY LEGACY AI Crew
"""

from crewai import Agent, Task
from langchain_openai import ChatOpenAI
from typing import Dict, List, Any
import re

from ..tools.pii_detection import PIIDetectionTool
from ..tools.data_redaction import DataRedactionTool
from ..tools.compliance_check import ComplianceCheckTool


class PrivacyGuardAgent:
    """
    Privacy & Compliance Officer Agent
    
    Protects family sensitive data and ensures privacy compliance.
    Specializes in GDPR and family data protection.
    """
    
    def __init__(self, llm_model: str = "gpt-4o-mini", temperature: float = 0.0):
        self.agent = Agent(
            role="Privacy & Compliance Officer",
            goal="Protect family sensitive data and ensure privacy compliance",
            backstory="""You are a privacy advocate with a legal background, 
            specializing in GDPR and family data protection. You've worked for 
            20 years protecting personal information and have zero tolerance 
            for data leaks. You understand the cultural and emotional 
            sensitivity of family data.""",
            
            verbose=True,
            allow_delegation=False,
            
            tools=[
                PIIDetectionTool(),
                DataRedactionTool(),
                ComplianceCheckTool()
            ],
            
            llm=ChatOpenAI(model=llm_model, temperature=temperature)
        )
    
    def create_privacy_check_task(self, input_data: str) -> Task:
        """
        Create pre-processing privacy check task
        
        Args:
            input_data: Family data to check for sensitive information
            
        Returns:
            Task object for CrewAI execution
        """
        return Task(
            description=f"""Analyze the following family data for sensitive information:
            {input_data}
            
            Check for:
            1. ID numbers (KTP, SSN, passport)
            2. Detailed addresses with house numbers
            3. Financial information (account numbers, income)
            4. Health conditions (medical details)
            5. Exact GPS coordinates of private residences
            
            If found, flag them and suggest redaction strategy.
            Do NOT process if critically sensitive data is present.
            
            Return JSON format:
            {{
                "is_safe": true/false,
                "pii_detected": [],
                "risk_level": "low/medium/high",
                "redaction_needed": true/false,
                "recommendations": []
            }}
            """,
            
            expected_output="Privacy risk assessment and redaction recommendations in JSON format",
            agent=self.agent
        )
    
    def create_output_review_task(self, generated_content: str) -> Task:
        """
        Create post-processing output review task
        
        Args:
            generated_content: AI-generated content to review
            
        Returns:
            Task object for CrewAI execution
        """
        return Task(
            description=f"""Review the generated output for accidental PII leakage:
            {generated_content}
            
            Ensure:
            1. No fabricated sensitive details
            2. No specific private addresses
            3. Appropriate disclaimers if data is uncertain
            4. Family-appropriate language
            
            Add disclaimers if needed: "Based on available memories, it appears that..."
            
            Return JSON format:
            {{
                "is_approved": true/false,
                "issues_found": [],
                "sanitized_content": "content with redactions",
                "disclaimers_added": []
            }}
            """,
            
            expected_output="Sanitized output with privacy disclaimers in JSON format",
            agent=self.agent
        )


# Utility functions for quick PII detection
def detect_indonesian_ktp(text: str) -> List[str]:
    """Detect Indonesian KTP (ID card) numbers"""
    pattern = r'\b\d{16}\b'
    return re.findall(pattern, text)


def detect_phone_numbers(text: str) -> List[str]:
    """Detect phone numbers"""
    pattern = r'\+?[\d\s\-\(\)]{10,}'
    return re.findall(pattern, text)


def detect_email_addresses(text: str) -> List[str]:
    """Detect email addresses"""
    pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
    return re.findall(pattern, text)


def quick_pii_scan(text: str) -> Dict[str, Any]:
    """
    Quick PII scan without LLM
    
    Args:
        text: Text to scan
        
    Returns:
        Dictionary with detected PII
    """
    return {
        "ktp_numbers": detect_indonesian_ktp(text),
        "phone_numbers": detect_phone_numbers(text),
        "email_addresses": detect_email_addresses(text),
        "has_pii": any([
            detect_indonesian_ktp(text),
            detect_phone_numbers(text),
            detect_email_addresses(text)
        ])
    }
