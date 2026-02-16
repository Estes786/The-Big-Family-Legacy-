"""
Biographer Agent - Story Generation & Narrative Writing
Part of THE BIG FAMILY LEGACY AI Crew
"""

from crewai import Agent, Task
from langchain_openai import ChatOpenAI
from typing import Dict, List

class BiographerAgent:
    """
    Family Biographer & Narrative Writer Agent
    
    Transforms family memories into compelling, emotional stories.
    Professional biographer who has written over 100 family histories.
    """
    
    def __init__(self, llm_model: str = "gpt-4o", temperature: float = 0.7):
        self.agent = Agent(
            role="Family Biographer & Narrative Writer",
            goal="Transform family memories into compelling, emotional stories",
            backstory="""You are a professional biographer who has written over 
            100 family histories. You have a gift for finding the human story 
            in dates and facts. You understand narrative structure (beginning, 
            middle, end), can adjust tone (formal, casual, emotional), and weave 
            historical context seamlessly into personal stories. You write with 
            warmth, respect, and cultural sensitivity.""",
            
            verbose=True,
            allow_delegation=False,
            tools=[],
            llm=ChatOpenAI(model=llm_model, temperature=temperature)
        )
    
    def create_generate_story_task(self, person: Dict, memories: List[Dict], tone: str = "emotional") -> Task:
        """Generate family story for a person"""
        memories_text = "\n".join([f"- {m.get('title', 'Untitled')}: {m.get('description', '')}" for m in memories])
        
        return Task(
            description=f"""Write a family biography for:
            Person: {person['name']}
            Birth: {person.get('birth_date', 'unknown')}
            Key Memories:
            {memories_text}
            
            Requirements:
            1. Tone: {tone}
            2. Length: 800-1000 words
            3. Structure: Opening (early life) → Middle (key events) → Closing (legacy)
            4. Style: Warm, respectful, culturally sensitive
            
            For Indonesian families, use appropriate titles (Bapak, Ibu, Kakek, Nenek).
            """,
            expected_output="Complete biographical narrative (800-1000 words)",
            agent=self.agent
        )
    
    def create_caption_task(self, memory: Dict, ai_analysis: Dict) -> Task:
        """Generate warm caption for memory"""
        return Task(
            description=f"""Write a warm, engaging caption for this family memory:
            Title: {memory.get('title', 'Untitled')}
            Date: {memory.get('memory_date', 'unknown')}
            AI Analysis: {ai_analysis.get('scene_description', '')}
            
            Caption should:
            1. Be 2-3 sentences max
            2. Capture the emotion of the moment
            3. Include key details (who, when, where)
            4. Use family-appropriate, warm language
            """,
            expected_output="Engaging 2-3 sentence caption",
            agent=self.agent
        )
