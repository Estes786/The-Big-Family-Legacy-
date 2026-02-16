"""Database Query Tool - Query Supabase"""
from langchain.tools import BaseTool
from typing import Dict, Any
import os
from supabase import create_client, Client

class DatabaseQueryTool(BaseTool):
    name = "database_query"
    description = "Queries Supabase for family data"
    
    def __init__(self):
        super().__init__()
        self.supabase: Client = create_client(
            os.getenv("SUPABASE_URL"),
            os.getenv("SUPABASE_SERVICE_KEY")
        )
    
    def _run(self, query_type: str, params: Dict[str, Any]) -> Dict:
        """Execute database query"""
        try:
            if query_type == "get_family_members":
                result = self.supabase.table("family_members").select("*").eq("family_id", params["family_id"]).execute()
            elif query_type == "get_relationships":
                result = self.supabase.table("relationships").select("*").eq("family_id", params["family_id"]).execute()
            else:
                return {"success": False, "error": "Unknown query type"}
            
            return {"success": True, "data": result.data}
        except Exception as e:
            return {"success": False, "error": str(e)}
