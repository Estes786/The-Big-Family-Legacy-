# AI Agent Manifest
## THE BIG FAMILY LEGACY Platform - CrewAI Configuration

---

## 1. Agent Architecture Overview

### 1.1 The Legacy Crew

The Big Family Legacy menggunakan **multi-agent system** dengan CrewAI untuk memproses data keluarga menjadi narasi yang bermakna. Setiap agent memiliki expertise khusus dan bekerja dalam workflow yang ter-orkestrasi oleh LangGraph.

```
┌─────────────────────────────────────────────────────────────┐
│                    USER INPUT                                │
│         (Photo, Story, Chat Question)                        │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────┐
│                 LANGGRAPH ROUTER                             │
│        (Decides which agents to activate)                    │
└─────────────────┬───────────────────────────────────────────┘
                  │
        ┌─────────┴──────────┬──────────┬──────────┐
        ▼                    ▼          ▼          ▼
  ┌──────────┐        ┌──────────┐  ┌──────────┐  ┌──────────┐
  │ Privacy  │        │  Memory  │  │Genealogist│ │Biographer│
  │  Guard   │───────►│ Curator  │  │  Agent   │  │  Agent   │
  │  Agent   │        │  Agent   │  │          │  │          │
  └──────────┘        └────┬─────┘  └────┬─────┘  └────┬─────┘
                           │             │             │
                           └──────┬──────┴─────────────┘
                                  ▼
                         ┌─────────────────┐
                         │   FINAL OUTPUT   │
                         │  (Story/Caption) │
                         └─────────────────┘
```

---

## 2. Agent Definitions

### 2.1 Privacy Guard Agent 🛡️

#### Purpose
Memastikan data sensitif keluarga tidak bocor ke model AI eksternal atau output yang tidak aman.

#### Configuration

```python
from crewai import Agent, Task, Crew
from langchain_openai import ChatOpenAI

privacy_guard = Agent(
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
        PIIDetectionTool(),  # Custom tool to detect PII
        DataRedactionTool(),  # Redact sensitive info
        ComplianceCheckTool()  # Check against privacy rules
    ],
    
    llm=ChatOpenAI(model="gpt-4o-mini", temperature=0.0)  # Low temp for consistency
)
```

#### Tasks

**Task 1: Pre-Processing Privacy Check**
```python
privacy_check_task = Task(
    description="""Analyze the following family data for sensitive information:
    {input_data}
    
    Check for:
    1. ID numbers (KTP, SSN, passport)
    2. Detailed addresses with house numbers
    3. Financial information (account numbers, income)
    4. Health conditions (medical details)
    5. Exact GPS coordinates of private residences
    
    If found, flag them and suggest redaction strategy.
    Do NOT process if critically sensitive data is present.""",
    
    expected_output="Privacy risk assessment and redaction recommendations",
    agent=privacy_guard
)
```

**Task 2: Post-Processing Output Review**
```python
output_review_task = Task(
    description="""Review the generated output for accidental PII leakage:
    {generated_content}
    
    Ensure:
    1. No fabricated sensitive details
    2. No specific private addresses
    3. Appropriate disclaimers if data is uncertain
    4. Family-appropriate language
    
    Add disclaimers if needed: "Based on available memories, it appears that..."
    """,
    
    expected_output="Sanitized output with privacy disclaimers",
    agent=privacy_guard
)
```

---

### 2.2 Memory Curator Agent 🎨

#### Purpose
Menganalisis foto, video, dan dokumen untuk mengekstrak konteks, emosi, dan metadata.

#### Configuration

```python
memory_curator = Agent(
    role="Memory & Context Analyst",
    goal="Extract meaningful context and emotions from family photos and stories",
    backstory="""You are a museum curator with 15 years of experience 
    in archival work and historical photography. You have a keen eye for 
    details, understand visual storytelling, and can identify historical 
    contexts from visual cues like clothing, architecture, and technology. 
    You're empathetic and understand the emotional weight of family memories.""",
    
    verbose=True,
    allow_delegation=False,
    
    tools=[
        VisionAITool(),  # BLIP-2 for image captioning
        FaceDetectionTool(),  # RetinaFace for face detection
        OCRTool(),  # TrOCR for text in images
        ExifExtractorTool(),  # Extract metadata
        HistoricalContextTool()  # Date from visual cues
    ],
    
    llm=ChatOpenAI(model="gpt-4o", temperature=0.3)
)
```

#### Tasks

**Task 1: Analyze Photo**
```python
analyze_photo_task = Task(
    description="""Analyze this family photo thoroughly:
    Image URL: {image_url}
    User-provided context: {user_description}
    
    Your analysis should include:
    1. Scene description (What's happening? Where is it?)
    2. Emotional tone (Joy, solemn, casual, formal?)
    3. Number of people and their approximate ages
    4. Time period estimation (based on clothing, tech, quality)
    5. Notable objects or landmarks
    6. Suggested caption (2-3 sentences, warm and engaging tone)
    
    Be specific but respectful. If you detect cultural or religious 
    elements (hijab, traditional clothing), mention them respectfully.""",
    
    expected_output="Detailed photo analysis with caption",
    agent=memory_curator,
    context=[privacy_check_task]  # Runs after privacy check
)
```

**Task 2: Face Detection & Identification**
```python
detect_faces_task = Task(
    description="""Use face detection to find all faces in the image:
    Image URL: {image_url}
    Known family members: {family_members_list}
    
    For each detected face:
    1. Extract bounding box coordinates
    2. Estimate age group (child, teen, adult, elderly)
    3. Gender (if visually apparent)
    4. Suggest possible matches from family members
    5. Confidence score for each suggestion
    
    Output format: JSON with face detections and suggestions""",
    
    expected_output="JSON array of detected faces with match suggestions",
    agent=memory_curator
)
```

---

### 2.3 Genealogist Agent 🌳

#### Purpose
Memvalidasi dan membangun struktur silsilah keluarga yang akurat dan konsisten.

#### Configuration

```python
genealogist = Agent(
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
        DatabaseQueryTool(),  # Query family_members and relationships
        RelationshipValidatorTool(),  # Check for logical inconsistencies
        TreeBuilderTool(),  # Generate tree structure
        StatisticsCalculatorTool()  # Family stats
    ],
    
    llm=ChatOpenAI(model="gpt-4o", temperature=0.0)  # Very low temp for accuracy
)
```

#### Tasks

**Task 1: Validate Relationship**
```python
validate_relationship_task = Task(
    description="""Validate the following proposed relationship:
    Person 1: {person1_name} (born: {person1_birth_date})
    Person 2: {person2_name} (born: {person2_birth_date})
    Relationship: {relationship_type}
    
    Check for:
    1. Age consistency (parent should be 15-60 years older than child)
    2. No circular relationships (A is parent of B, B is parent of A)
    3. Duplicate relationships (already exists in database)
    4. Biological possibility (dates align)
    
    If invalid, explain why and suggest correction.
    If valid, provide confidence score and reasoning.""",
    
    expected_output="Validation result with reasoning",
    agent=genealogist
)
```

**Task 2: Build Family Tree**
```python
build_tree_task = Task(
    description="""Build a complete family tree for:
    Family ID: {family_id}
    Focus Person: {focus_person_id} (optional)
    Max Generations: {max_generations}
    
    Generate:
    1. Hierarchical tree structure (ancestors and descendants)
    2. Sibling groups
    3. Spouse relationships
    4. Statistics (total people, generations, living/deceased)
    
    Format: JSON suitable for D3.js visualization""",
    
    expected_output="Family tree JSON structure",
    agent=genealogist
)
```

---

### 2.4 Biographer Agent ✍️

#### Purpose
Mengubah data dan memori menjadi narasi yang emosional dan kohesif.

#### Configuration

```python
biographer = Agent(
    role="Family Biographer & Narrative Writer",
    goal="Transform family memories into compelling, emotional stories",
    backstory="""You are a professional biographer who has written over 
    100 family histories. You have a gift for finding the human story 
    in dates and facts. You understand narrative structure (beginning, 
    middle, end), can adjust tone (formal, casual, emotional), and weave 
    historical context seamlessly into personal stories. You write with 
    warmth, respect, and cultural sensitivity. You've been published in 
    literary magazines and have won awards for biographical writing.""",
    
    verbose=True,
    allow_delegation=False,
    
    tools=[
        MemoryRetrievalTool(),  # Fetch relevant memories
        HistoricalContextTool(),  # Add historical events
        NarrativeStructureTool(),  # Story arc template
        ToneAdjustmentTool()  # Adjust formality
    ],
    
    llm=ChatOpenAI(model="gpt-4o", temperature=0.7)  # Higher temp for creativity
)
```

#### Tasks

**Task 1: Generate Family Story**
```python
generate_story_task = Task(
    description="""Write a family biography for:
    Focus Person: {person_name}
    Birth: {birth_date} in {birth_place}
    Death: {death_date} (if applicable)
    Key Memories: {memory_summaries}
    Family Context: {family_relationships}
    Historical Events: {relevant_historical_context}
    
    Requirements:
    1. Tone: {tone} (formal/casual/emotional)
    2. Length: {length} (short=300 words, medium=800, long=2000)
    3. Include: {include_historical_context} (yes/no)
    4. Structure:
       - Opening: Set the scene of their birth/early life
       - Middle: Key life events, relationships, achievements
       - Closing: Legacy and impact on family
    
    Style guide:
    - Use vivid but respectful language
    - Weave in historical context naturally
    - Include specific details from memories
    - Maintain chronological flow
    - End with emotional reflection
    
    For Indonesian families, be mindful of:
    - Family titles (Bapak, Ibu, Kakek, Nenek, Om, Tante)
    - Cultural values (respect for elders, family unity)
    - Religious mentions (if appropriate from data)""",
    
    expected_output="Complete biographical narrative (800-2000 words)",
    agent=biographer,
    context=[genealogist.tasks, memory_curator.tasks]  # Use their outputs
)
```

**Task 2: Generate Memory Caption**
```python
caption_memory_task = Task(
    description="""Write a warm, engaging caption for this family memory:
    Memory Type: {memory_type}
    Date: {memory_date}
    Location: {location}
    People: {people_names}
    AI Analysis: {ai_analysis}
    User Description: {user_description}
    
    Caption should:
    1. Be 2-3 sentences max
    2. Capture the emotion of the moment
    3. Include key details (who, when, where)
    4. Use family-appropriate, warm language
    
    Examples:
    - "Grandpa Joe celebrates his 80th birthday surrounded by three 
       generations of family at Lake Tahoe. The joy on everyone's faces 
       reflects a lifetime of love and togetherness."
    - "A quiet moment in 1975: Grandma teaching young Bobby how to bake 
       her famous apple pie in the old kitchen. These simple moments 
       became cherished traditions.""",
    
    expected_output="Engaging 2-3 sentence caption",
    agent=biographer
)
```

---

### 2.5 Archivist Agent 📚 (Future)

#### Purpose
Mengorganisir dan menstrukturkan data yang berantakan dari berbagai sumber.

#### Configuration

```python
archivist = Agent(
    role="Data Organizer & Archivist",
    goal="Structure chaotic family data into organized, searchable archives",
    backstory="""You are a digital archivist with library science background. 
    You excel at categorization, tagging, and creating metadata. You can 
    handle messy inputs (WhatsApp dumps, random photos, scanned documents) 
    and transform them into structured, searchable databases.""",
    
    verbose=True,
    allow_delegation=False,
    
    tools=[
        DeduplicationTool(),
        AutoTaggingTool(),
        DateEstimationTool(),
        OCRTool()
    ],
    
    llm=ChatOpenAI(model="gpt-4o-mini", temperature=0.2)
)
```

---

### 2.6 Historian Agent 🎓 (Future)

#### Purpose
Menambahkan konteks sejarah yang relevan untuk memperkaya cerita.

#### Configuration

```python
historian = Agent(
    role="Historical Context Researcher",
    goal="Enrich family stories with relevant historical context",
    backstory="""You are a history professor specializing in 20th and 
    21st century Indonesian and global history. You can connect personal 
    family stories to major historical events, cultural shifts, and 
    societal changes. You make history accessible and relevant.""",
    
    verbose=True,
    allow_delegation=False,
    
    tools=[
        WebSearchTool(),
        WikipediaTool(),
        HistoricalEventDatabaseTool()
    ],
    
    llm=ChatOpenAI(model="gpt-4o", temperature=0.4)
)
```

---

## 3. Workflow Orchestration (LangGraph)

### 3.1 Memory Processing Workflow

```python
from langgraph.graph import StateGraph, END

class MemoryState(TypedDict):
    memory_id: str
    image_url: str
    user_description: str
    privacy_approved: bool
    ai_caption: str
    detected_faces: list
    final_output: dict

def privacy_check_node(state: MemoryState) -> MemoryState:
    # Run Privacy Guard Agent
    result = privacy_check_task.execute(state)
    state['privacy_approved'] = result['is_safe']
    return state

def analyze_memory_node(state: MemoryState) -> MemoryState:
    # Run Memory Curator Agent
    caption = analyze_photo_task.execute(state)
    faces = detect_faces_task.execute(state)
    state['ai_caption'] = caption
    state['detected_faces'] = faces
    return state

def finalize_node(state: MemoryState) -> MemoryState:
    # Run Biographer for final caption
    final_caption = caption_memory_task.execute(state)
    state['final_output'] = {
        'caption': final_caption,
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

app = workflow.compile()
```

---

### 3.2 Story Generation Workflow

```python
class StoryState(TypedDict):
    person_id: str
    memories: list
    relationships: list
    tone: str
    story_draft: str
    final_story: str

def gather_context_node(state: StoryState) -> StoryState:
    # Run Genealogist Agent
    tree = build_tree_task.execute(state)
    state['relationships'] = tree
    return state

def curate_memories_node(state: StoryState) -> StoryState:
    # Memory Curator analyzes relevant memories
    analyzed = [analyze_photo_task.execute(m) for m in state['memories']]
    state['memories'] = analyzed
    return state

def write_story_node(state: StoryState) -> StoryState:
    # Biographer writes the story
    story = generate_story_task.execute(state)
    state['story_draft'] = story
    return state

def review_story_node(state: StoryState) -> StoryState:
    # Privacy Guard final review
    reviewed = output_review_task.execute(state)
    state['final_story'] = reviewed
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

story_app = story_workflow.compile()
```

---

## 4. Agent Tools Implementation

### 4.1 Vision AI Tool

```python
from langchain.tools import BaseTool
from huggingface_hub import InferenceClient

class VisionAITool(BaseTool):
    name = "vision_ai"
    description = "Analyzes images and generates detailed captions"
    
    def _run(self, image_url: str) -> str:
        client = InferenceClient(token=os.getenv("HF_TOKEN"))
        
        result = client.image_to_text(
            image_url,
            model="Salesforce/blip-image-captioning-large"
        )
        
        return result
```

### 4.2 Database Query Tool

```python
class DatabaseQueryTool(BaseTool):
    name = "database_query"
    description = "Queries Supabase for family data"
    
    def _run(self, query: str, params: dict) -> dict:
        from supabase import create_client
        
        supabase = create_client(
            os.getenv("SUPABASE_URL"),
            os.getenv("SUPABASE_SERVICE_KEY")
        )
        
        result = supabase.rpc(query, params).execute()
        return result.data
```

---

## 5. Deployment Configuration

### 5.1 Northflank Deployment

**Dockerfile**:
```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY agents/ ./agents/
COPY workflows/ ./workflows/

ENV PYTHONUNBUFFERED=1

CMD ["uvicorn", "agents.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

**requirements.txt**:
```
crewai==0.11.0
langgraph==0.2.0
langchain==0.1.0
langchain-openai==0.0.5
huggingface-hub==0.20.0
supabase==2.3.0
fastapi==0.109.0
uvicorn==0.27.0
pydantic==2.5.0
python-dotenv==1.0.0
```

---

## 6. Cost Optimization Strategies

### 6.1 Model Selection by Task

| Task | Model | Cost (per 1M tokens) | Reasoning |
|------|-------|---------------------|-----------|
| **Privacy Check** | GPT-4o-mini | $0.15 | Need accuracy, low latency |
| **Image Caption** | BLIP-2 (HF) | Free | Good quality, cost-effective |
| **Story Writing** | GPT-4o | $2.50 | Best quality for narratives |
| **Simple Chat** | Llama 3.1 8B | Free (HF) | Sufficient for basic responses |

### 6.2 Caching Strategy

- Cache image analysis results for 30 days (Cloudflare KV)
- Cache story generations permanently (database)
- Cache chat responses for 1 hour (KV)

### 6.3 Batch Processing

- Process multiple photos in parallel (max 5 concurrent)
- Queue story generation jobs (Celery/BullMQ)
- Rate limit AI requests per user (100/day free tier)

---

**Status**: ✅ APPROVED - Ready for Deployment Guide

**Next Document**: [06_DEPLOYMENT.md](./06_DEPLOYMENT.md)
