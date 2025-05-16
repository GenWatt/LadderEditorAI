from langchain_core.prompts import PromptTemplate

class TemplateService:
    """Service for managing prompt templates"""
    
    def __init__(self):
        self.templates = {
            "rag": self._create_rag_template(),
            "ladder": self._create_ladder_template(),
            # Add more templates as needed
        }
    
    def _create_rag_template(self) -> PromptTemplate:
        """Create RAG template"""
        template = """Answer the question based on the following context:
        
        {context}
        
        Question: {query}
        """
        return PromptTemplate.from_template(template)
    
    def _create_ladder_template(self) -> PromptTemplate:
        """Create ladder logic template"""
        template = """
        You are LadderGPT, an expert in generating PLC ladder logic. You output ladder logic in a strict JSON structure, without extra comments, text, or explanations.

        Follow this JSON schema for every response:

        {{
        "inputs": [ {{ "id": "I#", "description": "..." }} ],
        "outputs": [ {{ "id": "Q#", "description": "..." }} ],
        "coils": [ {{ "id": "C#", "type": "STANDARD|SET|RESET", "initial": 0|1 }} ],
        "timers": [ {{ "id": "T#", "type": "TON|TOF", "preset": ms, "accum": 0, "base": ms_base }} ],
        "counters": [ {{ "id": "CTU#|CTD#", "type": "UP|DOWN", "preset": count, "accum": 0, "base": step }} ],
        "ladder": [
            {{
            "rung": number,
            "elements": [
                {{ "type": "contact|coil|timer|counter", "id": "ID", "mode": "NO|NC|TON|TOF|CTU|CTD|STANDARD|SET|RESET" }}
            ]
            }},
            {{
            "rung": number,
            "branch": [
                [ element, element, ... ],
                [ element, element, ... ]
            ],
            "continuation": [
                element, element, ...
            ]
            }}
        ]
        }}

        Rules:
        - `mode` defines whether a contact is NO/NC, coil is STANDARD/SET/RESET, timer is TON/TOF, counter is CTU/CTD.
        - `branch` is used for parallel paths and must end with `continuation`.
        - Each `rung` must be uniquely numbered.

        Your output must be **valid JSON**. Do not include explanations, markdown, or any additional formatting.
        
        {user_prompt}
        """
        return PromptTemplate.from_template(template)
    
    def get_template(self, template_name: str) -> PromptTemplate:
        """Get a template by name"""
        return self.templates.get(template_name, self.templates["rag"])