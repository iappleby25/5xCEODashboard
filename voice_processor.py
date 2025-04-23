import json
import logging
import re
import nltk
import spacy
from typing import Dict, Any, List
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
from collections import Counter

# Configure logging
logging.basicConfig(level=logging.INFO,
                    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Initialize NLP components
try:
    nlp = spacy.load("en_core_web_sm")
    stop_words = set(stopwords.words('english'))
except (OSError, LookupError) as e:
    logger.error(f"NLP initialization error: {str(e)}")
    logger.warning("Using fallback NLP components")
    nlp = None
    stop_words = set(["a", "an", "the", "and", "or", "but", "is", "are", "was", "were"])

def process_voice_command(transcript: str, context: Dict[str, Any] = None) -> Dict[str, Any]:
    """
    Process voice command using NLP for intent recognition
    
    Args:
        transcript: Text transcript of the voice command
        context: Current dashboard context (filters, etc.)
        
    Returns:
        Dictionary with recognized action, parameters, and response
    """
    try:
        # Default context if not provided
        if context is None:
            context = {
                "currentView": "dashboard",
                "currentFilters": {
                    "level": "All Companies",
                    "timePeriod": "Last 30 days"
                }
            }
        
        # Extract keywords and entities from the transcript
        keywords = extract_intent_keywords(transcript)
        
        # Process with spaCy for better entity recognition if available
        entities = {}
        if nlp:
            doc = nlp(transcript)
            
            # Extract named entities
            for ent in doc.ents:
                if ent.label_ in ["DATE", "TIME"]:
                    entities["time"] = ent.text
                elif ent.label_ in ["ORG", "PRODUCT"]:
                    entities["department"] = ent.text
        
        # Determine action based on keywords
        action = "unknown"
        parameters = {}
        response = "I'm not sure what you want. Could you rephrase that?"
        
        # Handle filter action
        if "filter" in keywords:
            action = "filter"
            parameters["type"] = "data_filter"
            
            # Extract department if mentioned
            department_keywords = ["engineering", "marketing", "sales", "hr", "product"]
            for dept in department_keywords:
                if dept in keywords:
                    parameters["department"] = dept.capitalize()
                    break
            
            # Extract time period if mentioned
            if "week" in keywords:
                parameters["timePeriod"] = "Last 7 days"
            elif "month" in keywords:
                parameters["timePeriod"] = "Last 30 days"
            elif "quarter" in keywords:
                parameters["timePeriod"] = "Last 90 days"
            elif "year" in keywords:
                parameters["timePeriod"] = "Last 12 months"
            
            # Extract level if mentioned
            if "individual" in transcript.lower():
                parameters["level"] = "Individual"
            elif "company" in transcript.lower() and "all" not in transcript.lower():
                parameters["level"] = "Company"
            elif "all" in transcript.lower() and "company" in transcript.lower():
                parameters["level"] = "All Companies"
            
            response = f"Filtering data to show "
            if "department" in parameters:
                response += f"{parameters['department']} department "
            
            if "timePeriod" in parameters:
                response += f"for {parameters['timePeriod']} "
            
            if "level" in parameters:
                response += f"at {parameters['level']} level"
            
            if response.endswith(" "):
                response = response.strip() + " data"
        
        # Handle insight action
        elif "insight" in keywords or "summary" in keywords or "analyze" in keywords:
            action = "insight"
            
            if "compare" in keywords:
                parameters["type"] = "comparison"
                time_periods = ["q1", "q2", "q3", "q4", "quarter", "month", "year"]
                periods_found = [kw for kw in keywords if kw in time_periods]
                
                if len(periods_found) >= 2:
                    parameters["period1"] = periods_found[0]
                    parameters["period2"] = periods_found[1]
                    response = f"Comparing {parameters['period1']} and {parameters['period2']} data"
                else:
                    response = "Generating insights for the current data"
            else:
                parameters["type"] = "general"
                response = "Generating insights for the current survey data"
        
        # Handle navigation action
        elif any(kw in transcript.lower() for kw in ["go to", "navigate", "show me", "take me"]):
            action = "navigate"
            
            destinations = {
                "dashboard": ["dashboard", "home", "main"],
                "history": ["history", "activities", "timeline"],
                "upload": ["upload", "import", "new survey"]
            }
            
            for dest, keywords in destinations.items():
                if any(kw in transcript.lower() for kw in keywords):
                    parameters["destination"] = dest
                    response = f"Navigating to the {dest} page"
                    break
            
            if "destination" not in parameters:
                parameters["destination"] = "dashboard"
                response = "Returning to the main dashboard"
        
        logger.info(f"Processed voice command: '{transcript}' -> {action}")
        
        return {
            "action": action,
            "parameters": parameters,
            "response": response
        }
    
    except Exception as e:
        logger.error(f"Error processing voice command: {str(e)}")
        
        # Fallback response
        return {
            "action": "unknown",
            "parameters": {},
            "response": "I'm sorry, I couldn't understand that command. Please try again."
        }

def extract_intent_keywords(transcript: str) -> List[str]:
    """
    Extract key intent words from the transcript
    
    Args:
        transcript: Text transcript of the voice command
        
    Returns:
        List of keywords
    """
    # Convert to lowercase
    text = transcript.lower()
    
    # Tokenize and remove punctuation
    text = re.sub(r'[^\w\s]', '', text)
    tokens = word_tokenize(text)
    
    # Remove stop words
    filtered_tokens = [word for word in tokens if word not in stop_words]
    
    # Look for specific command keywords
    keywords = []
    
    # Filter commands
    filter_words = ["filter", "show", "display", "view", "only", "see"]
    for word in filter_words:
        if word in text:
            keywords.append("filter")
            break
    
    # Department focus
    departments = ["engineering", "marketing", "sales", "hr", "human resources", "product"]
    for dept in departments:
        if dept in text:
            keywords.append(dept)
    
    # Time periods
    time_periods = ["day", "week", "month", "quarter", "year", "q1", "q2", "q3", "q4"]
    for period in time_periods:
        if period in text:
            keywords.append(period)
    
    # Compare commands
    compare_words = ["compare", "comparison", "versus", "vs", "against"]
    for word in compare_words:
        if word in text:
            keywords.append("compare")
            break
    
    # Insight commands
    insight_words = ["insight", "analyze", "analysis", "summary", "summarize"]
    for word in insight_words:
        if word in text:
            keywords.append("insight")
            break
    
    # Add most frequent non-stop words
    word_freq = Counter(filtered_tokens)
    most_common = [word for word, count in word_freq.most_common(5) if word not in keywords]
    keywords.extend(most_common)
    
    return keywords
