import json
import os
from typing import Dict, List, Any, Optional
import openai
from openai import OpenAI

# Initialize OpenAI client
OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY")

def initialize_openai_client():
    """
    Initialize the OpenAI client with API key
    
    Returns:
        OpenAI client if API key is available, None otherwise
    """
    if OPENAI_API_KEY:
        return OpenAI(api_key=OPENAI_API_KEY)
    else:
        print("Warning: OPENAI_API_KEY not found in environment variables.")
        return None

def generate_triple_threat_solutions(category: str, company_name: Optional[str] = None) -> List[str]:
    """
    Generate Triple Threat Solutions using OpenAI
    
    Args:
        category: The framework category (strategic-clarity, relentless-focus, etc.)
        company_name: Optional company name for more specific solutions
        
    Returns:
        List of 3 actionable solutions
    """
    # Format category name for better readability
    formatted_category = category.replace('-', ' ').title()
    
    # Default solutions in case OpenAI is not available
    default_solutions = {
        'strategic-clarity': [
            "Create a one-page strategic plan that every employee can understand and reference",
            "Schedule monthly strategic alignment sessions with all department heads",
            "Implement a strategic objectives dashboard visible to all team members"
        ],
        'relentless-focus': [
            "Institute a project prioritization matrix that aligns with strategic objectives",
            "Conduct weekly focus review meetings to eliminate low-value activities",
            "Use time-tracking analytics to identify and reduce time spent on non-core activities"
        ],
        'disciplined-execution': [
            "Implement a structured accountability framework with clear owners for each deliverable",
            "Establish a regular cadence of execution reviews with predefined metrics",
            "Create a recognition program specifically for execution excellence"
        ],
        'scalable-talent': [
            "Develop skill matrices for each role with clear development pathways", 
            "Implement quarterly capability assessments tied to growth objectives",
            "Create cross-functional mentoring pairs to accelerate knowledge transfer"
        ],
        'energized-culture': [
            "Launch a structured employee feedback program with action tracking",
            "Establish team-level culture champions with specific improvement metrics",
            "Create regular team-building activities aligned with company values"
        ]
    }
    
    # Try to generate solutions with OpenAI if available
    client = initialize_openai_client()
    if not client:
        return default_solutions.get(category, default_solutions['strategic-clarity'])
    
    try:
        # Create the prompt for OpenAI
        company_context = f" for {company_name}" if company_name else ""
        
        prompt = f"""
        You are a highly experienced business consultant specializing in the 5xCEO framework.
        
        Generate three specific, actionable solutions for improving '{formatted_category}'{company_context}.
        Each solution should be:
        1. Practical and implementable within 30-90 days
        2. Specific enough to be immediately actionable
        3. Focused on measurable outcomes
        4. Limited to one concise sentence (maximum 20 words)
        
        Return ONLY the three solutions, one per line. Do not include any explanations or numbering.
        """
        
        # the newest OpenAI model is "gpt-4o" which was released May 13, 2024.
        # do not change this unless explicitly requested by the user
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": "You are an expert business consultant who provides concise, actionable advice."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=250,
            temperature=0.7
        )
        
        # Parse and clean the response
        solutions_text = response.choices[0].message.content.strip()
        solutions = [line.strip() for line in solutions_text.split('\n') if line.strip()]
        
        # Ensure we have exactly 3 solutions
        if len(solutions) < 3:
            # Fill in with default solutions if needed
            solutions.extend(default_solutions[category][:3-len(solutions)])
        elif len(solutions) > 3:
            # Truncate to 3 solutions
            solutions = solutions[:3]
            
        return solutions
        
    except Exception as e:
        print(f"Error generating solutions with OpenAI: {str(e)}")
        # Fall back to default solutions
        return default_solutions.get(category, default_solutions['strategic-clarity'])

def generate_solutions_for_company(company_name: str) -> Dict[str, List[str]]:
    """
    Generate solutions for all 5xCEO categories for a specific company
    
    Args:
        company_name: Name of the company
        
    Returns:
        Dictionary with category as key and list of solutions as value
    """
    categories = [
        'strategic-clarity', 
        'relentless-focus', 
        'disciplined-execution',
        'scalable-talent',
        'energized-culture'
    ]
    
    return {
        category: generate_triple_threat_solutions(category, company_name)
        for category in categories
    }