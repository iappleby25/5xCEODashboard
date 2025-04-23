import pandas as pd
import io
import json
import logging
from typing import Dict, List, Any, Optional

# Configure logging
logging.basicConfig(level=logging.INFO,
                    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

def process_csv_data(file_content: str, survey_type: str, period: str) -> Dict[str, Any]:
    """
    Process CSV data from uploaded file
    
    Args:
        file_content: String containing CSV content
        survey_type: Type of survey (Employee Survey, Customer Feedback, etc.)
        period: Survey period (Q1 2023, etc.)
        
    Returns:
        Dictionary containing processed data
    """
    try:
        # Parse CSV content
        df = pd.read_csv(io.StringIO(file_content))
        
        # Clean column names
        df.columns = [col.strip().lower().replace(' ', '_') for col in df.columns]
        
        # Basic data validation
        if df.empty:
            raise ValueError("CSV file is empty")
        
        # Process based on survey type
        if survey_type == 'Employee Survey':
            return process_employee_survey(df, period)
        elif survey_type == 'Customer Feedback':
            return process_customer_feedback(df, period)
        else:
            return process_generic_survey(df, period)
    
    except Exception as e:
        logger.error(f"Error processing CSV data: {str(e)}")
        raise

def process_employee_survey(df: pd.DataFrame, period: str) -> Dict[str, Any]:
    """
    Process employee survey data
    
    Args:
        df: DataFrame containing survey data
        period: Survey period
        
    Returns:
        Dictionary containing processed data
    """
    # Extract departments
    departments = df['department'].unique().tolist() if 'department' in df.columns else ['Unspecified']
    
    # Calculate aggregated metrics
    total_responses = len(df)
    avg_scores = {}
    department_data = {}
    
    # Process likert-scale questions (assuming 1-5 scale)
    numeric_cols = df.select_dtypes(include=['number']).columns
    
    for col in numeric_cols:
        avg_scores[col] = df[col].mean()
    
    # Process by department
    for dept in departments:
        dept_df = df[df['department'] == dept] if 'department' in df.columns else df
        
        dept_data = {
            'responses': len(dept_df),
            'averages': {}
        }
        
        for col in numeric_cols:
            dept_data['averages'][col] = dept_df[col].mean()
        
        # Process text responses if available
        text_cols = df.select_dtypes(include=['object']).columns
        text_cols = [col for col in text_cols if col != 'department']
        
        if text_cols:
            dept_data['text_responses'] = {}
            for col in text_cols:
                dept_data['text_responses'][col] = dept_df[col].dropna().tolist()
        
        department_data[dept] = dept_data
    
    # Prepare the final response
    result = {
        'survey_type': 'Employee Survey',
        'period': period,
        'total_responses': total_responses,
        'departments': departments,
        'overall_averages': avg_scores,
        'department_data': department_data
    }
    
    return result

def process_customer_feedback(df: pd.DataFrame, period: str) -> Dict[str, Any]:
    """
    Process customer feedback data
    
    Args:
        df: DataFrame containing feedback data
        period: Survey period
        
    Returns:
        Dictionary containing processed data
    """
    # Similar processing logic as employee survey but with customer-specific fields
    # This is a simplified version
    
    # Calculate aggregated metrics
    total_responses = len(df)
    
    # Process numeric ratings
    numeric_cols = df.select_dtypes(include=['number']).columns
    avg_ratings = {col: df[col].mean() for col in numeric_cols}
    
    # Process categories if available
    categories = []
    if 'category' in df.columns:
        categories = df['category'].unique().tolist()
        category_data = {}
        
        for cat in categories:
            cat_df = df[df['category'] == cat]
            cat_data = {
                'responses': len(cat_df),
                'averages': {col: cat_df[col].mean() for col in numeric_cols}
            }
            category_data[cat] = cat_data
    else:
        category_data = {'Unspecified': {'responses': total_responses, 'averages': avg_ratings}}
    
    # Process text feedback if available
    feedback_data = {}
    text_cols = df.select_dtypes(include=['object']).columns
    text_cols = [col for col in text_cols if col != 'category']
    
    for col in text_cols:
        feedback_data[col] = df[col].dropna().tolist()
    
    # Prepare the final response
    result = {
        'survey_type': 'Customer Feedback',
        'period': period,
        'total_responses': total_responses,
        'categories': categories if categories else ['Unspecified'],
        'overall_averages': avg_ratings,
        'category_data': category_data,
        'feedback_data': feedback_data
    }
    
    return result

def process_generic_survey(df: pd.DataFrame, period: str) -> Dict[str, Any]:
    """
    Process generic survey data
    
    Args:
        df: DataFrame containing survey data
        period: Survey period
        
    Returns:
        Dictionary containing processed data
    """
    # Basic processing for any type of survey
    
    # Calculate aggregated metrics
    total_responses = len(df)
    
    # Process numeric questions
    numeric_cols = df.select_dtypes(include=['number']).columns
    avg_values = {col: df[col].mean() for col in numeric_cols}
    
    # Process categorical questions
    categorical_data = {}
    cat_cols = df.select_dtypes(include=['object']).columns
    
    for col in cat_cols:
        value_counts = df[col].value_counts().to_dict()
        categorical_data[col] = value_counts
    
    # Prepare the final response
    result = {
        'survey_type': 'Generic Survey',
        'period': period,
        'total_responses': total_responses,
        'numeric_averages': avg_values,
        'categorical_data': categorical_data
    }
    
    return result

def calculate_kpi_data(data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Calculate KPI data from processed survey data
    
    Args:
        data: Processed survey data
        
    Returns:
        Dictionary containing KPI data
    """
    # Extract completion rate
    total_participants = 0
    completed_participants = 0
    
    if data['survey_type'] == 'Employee Survey':
        for dept, dept_data in data['department_data'].items():
            # Assume responses are completed participants
            dept_total = dept_data.get('total', dept_data.get('responses', 0))
            dept_completed = dept_data.get('completed', dept_data.get('responses', 0))
            
            total_participants += dept_total
            completed_participants += dept_completed
    else:
        # For other survey types, use total responses as completed participants
        total_participants = data.get('total_responses', 0)
        completed_participants = total_participants
    
    # Calculate participation rate
    participation_rate = 0
    if total_participants > 0:
        participation_rate = round((completed_participants / total_participants) * 100)
    
    # Calculate average score
    avg_score = 0
    score_count = 0
    
    if data['survey_type'] == 'Employee Survey':
        for metric, value in data.get('overall_averages', {}).items():
            # Only consider metrics that could be ratings (between 1-5)
            if 1 <= value <= 5:
                avg_score += value
                score_count += 1
    elif data['survey_type'] == 'Customer Feedback':
        for metric, value in data.get('overall_averages', {}).items():
            # Only consider metrics that could be ratings (between 1-5)
            if 1 <= value <= 5:
                avg_score += value
                score_count += 1
    
    if score_count > 0:
        avg_score = round(avg_score / score_count, 1)
    
    # Mock changes for demo purposes
    participation_change = 5
    score_change = 0.3
    
    # Prepare the KPI data
    result = {
        "participation": {
            "rate": participation_rate,
            "change": participation_change,
            "direction": "up" if participation_change >= 0 else "down"
        },
        "averageScore": {
            "score": avg_score,
            "change": score_change,
            "direction": "up" if score_change >= 0 else "down"
        }
    }
    
    return result
