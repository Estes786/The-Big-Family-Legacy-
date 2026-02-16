"""
LangGraph Workflows for THE BIG FAMILY LEGACY
Memory Processing, Story Generation, and Chat workflows
"""

from langgraph.graph import StateGraph, END
from typing import TypedDict, Dict, List, Any


# State definitions
class MemoryState(TypedDict):
    memory_id: str
    image_url: str
    user_description: str
    privacy_approved: bool
    ai_caption: str
    detected_faces: List[Dict]
    final_output: Dict[str, Any]


class StoryState(TypedDict):
    person_id: str
    memories: List[Dict]
    relationships: List[Dict]
    tone: str
    story_draft: str
    final_story: str


# Memory Processing Workflow
def create_memory_workflow(privacy_agent, curator_agent, biographer_agent):
    """Create memory processing workflow"""
    
    def privacy_check_node(state: MemoryState) -> MemoryState:
        # Run Privacy Guard Agent
        task = privacy_agent.create_privacy_check_task(state["user_description"])
        # result = task.execute()
        state['privacy_approved'] = True  # Placeholder
        return state
    
    def analyze_memory_node(state: MemoryState) -> MemoryState:
        # Run Memory Curator Agent
        task = curator_agent.create_analyze_photo_task(
            state["image_url"], 
            state["user_description"]
        )
        # caption = task.execute()
        state['ai_caption'] = "A joyful family gathering"  # Placeholder
        state['detected_faces'] = []
        return state
    
    def finalize_node(state: MemoryState) -> MemoryState:
        # Run Biographer for final caption
        state['final_output'] = {
            'caption': state['ai_caption'],
            'faces': state['detected_faces']
        }
        return state
    
    # Build workflow graph
    workflow = StateGraph(MemoryState)
    workflow.add_node("privacy_check", privacy_check_node)
    workflow.add_node("analyze_memory", analyze_memory_node)
    workflow.add_node("finalize", finalize_node)
    
    workflow.set_entry_point("privacy_check")
    workflow.add_conditional_edges(
        "privacy_check",
        lambda state: "analyze" if state['privacy_approved'] else "reject",
        {
            "analyze": "analyze_memory",
            "reject": END
        }
    )
    workflow.add_edge("analyze_memory", "finalize")
    workflow.add_edge("finalize", END)
    
    return workflow.compile()


# Story Generation Workflow
def create_story_workflow(genealogist_agent, curator_agent, biographer_agent, privacy_agent):
    """Create story generation workflow"""
    
    def gather_context_node(state: StoryState) -> StoryState:
        # Run Genealogist Agent
        state['relationships'] = []  # Placeholder
        return state
    
    def curate_memories_node(state: StoryState) -> StoryState:
        # Memory Curator analyzes relevant memories
        state['memories'] = state.get('memories', [])
        return state
    
    def write_story_node(state: StoryState) -> StoryState:
        # Biographer writes the story
        state['story_draft'] = "Once upon a time..."  # Placeholder
        return state
    
    def review_story_node(state: StoryState) -> StoryState:
        # Privacy Guard final review
        state['final_story'] = state['story_draft']
        return state
    
    # Build workflow
    story_workflow = StateGraph(StoryState)
    story_workflow.add_node("gather_context", gather_context_node)
    story_workflow.add_node("curate_memories", curate_memories_node)
    story_workflow.add_node("write_story", write_story_node)
    story_workflow.add_node("review_story", review_story_node)
    
    story_workflow.set_entry_point("gather_context")
    story_workflow.add_edge("gather_context", "curate_memories")
    story_workflow.add_edge("curate_memories", "write_story")
    story_workflow.add_edge("write_story", "review_story")
    story_workflow.add_edge("review_story", END)
    
    return story_workflow.compile()
