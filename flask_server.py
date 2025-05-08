from flask import Flask, request, jsonify
import pandas as pd
import json
import os
import logging
from openai_service import generate_insights, analyze_text
from luzmo_service import get_dashboard_embed
from data_processor import process_csv_data, calculate_kpi_data
from voice_processor import process_voice_command
from openai_solution_service import generate_triple_threat_solutions

app = Flask(__name__)

# Configure logging
logging.basicConfig(level=logging.INFO,
                    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# In-memory storage for uploaded data
survey_data = {}

@app.route('/upload-csv', methods=['POST'])
def upload_csv():
    """
    Handle CSV file upload and processing
    """
    try:
        data = request.json
        if not data or 'fileContent' not in data:
            return jsonify({"error": "No file content provided"}), 400
        
        file_content = data['fileContent']
        survey_type = data.get('surveyType', 'Employee Survey')
        period = data.get('period', 'Q4 2023')
        
        # Process the CSV data
        processed_data = process_csv_data(file_content, survey_type, period)
        
        # Store in memory
        survey_id = len(survey_data) + 1
        survey_data[survey_id] = {
            'id': survey_id,
            'type': survey_type,
            'period': period,
            'data': processed_data
        }
        
        # Generate insights
        insights = generate_insights(processed_data)
        
        return jsonify({
            "success": True,
            "surveyId": survey_id,
            "message": f"Successfully processed {survey_type} for {period}",
            "insights": insights
        })
    
    except Exception as e:
        logger.error(f"Error processing CSV upload: {str(e)}")
        return jsonify({"error": f"Failed to process CSV: {str(e)}"}), 500

@app.route('/process-voice', methods=['POST'])
def process_voice():
    """
    Process voice command from the frontend
    """
    try:
        data = request.json
        if not data or 'transcript' not in data:
            return jsonify({"error": "No voice transcript provided"}), 400
        
        transcript = data['transcript']
        context = data.get('context', {})
        
        # Process the voice command
        result = process_voice_command(transcript, context)
        
        return jsonify({
            "success": True,
            "action": result.get('action'),
            "parameters": result.get('parameters'),
            "response": result.get('response')
        })
    
    except Exception as e:
        logger.error(f"Error processing voice command: {str(e)}")
        return jsonify({"error": f"Failed to process voice command: {str(e)}"}), 500

@app.route('/generate-insights/<int:survey_id>', methods=['GET'])
def get_insights(survey_id):
    """
    Generate insights for a specific survey
    """
    try:
        if survey_id not in survey_data:
            # If we don't have data for this survey, return mock data
            return jsonify({
                "title": "Employee satisfaction has increased by 12% over the last quarter",
                "content": "Key factors contributing to this improvement include:\n- New flexible work policy implemented in July (mentioned in 47% of comments)\n- Leadership town halls have improved transparency scores by 18%\n- Improved onboarding process positively impacted new hire experience",
                "tags": ["Positive Trend", "Leadership Impact", "Q3 Results"],
                "isPositive": True
            })
        
        # Get the survey data
        data = survey_data[survey_id]['data']
        
        # Generate insights
        insights = generate_insights(data)
        
        return jsonify(insights)
    
    except Exception as e:
        logger.error(f"Error generating insights: {str(e)}")
        return jsonify({"error": f"Failed to generate insights: {str(e)}"}), 500

@app.route('/luzmo-dashboard/<int:survey_id>', methods=['GET'])
def get_luzmo_dashboard(survey_id):
    """
    Get the Luzmo dashboard embed code for a specific survey
    """
    try:
        # Get dashboard embedding information from Luzmo service
        embed_info = get_dashboard_embed(survey_id)
        
        return jsonify(embed_info)
    
    except Exception as e:
        logger.error(f"Error getting Luzmo dashboard: {str(e)}")
        return jsonify({"error": f"Failed to get Luzmo dashboard: {str(e)}"}), 500

@app.route('/kpi-data/<int:survey_id>', methods=['GET'])
def get_kpi_data(survey_id):
    """
    Get KPI data for a specific survey
    """
    try:
        if survey_id not in survey_data:
            # If we don't have data for this survey, return mock data
            return jsonify({
                "participation": {
                    "rate": 87,
                    "change": 5,
                    "direction": "up"
                },
                "averageScore": {
                    "score": 4.2,
                    "change": 0.3,
                    "direction": "up"
                }
            })
        
        # Get the survey data
        data = survey_data[survey_id]['data']
        
        # Calculate KPI data
        kpi_data = calculate_kpi_data(data)
        
        return jsonify(kpi_data)
    
    except Exception as e:
        logger.error(f"Error getting KPI data: {str(e)}")
        return jsonify({"error": f"Failed to get KPI data: {str(e)}"}), 500

@app.route('/triple-threat-solutions/<string:category_id>', methods=['GET'])
def get_triple_threat_solutions(category_id):
    """
    Generate Triple Threat Solutions for a specific 5xCEO category
    """
    try:
        company_name = request.args.get('company')
        
        # Generate solutions for the category
        solutions = generate_triple_threat_solutions(category_id, company_name)
        
        return jsonify({
            "success": True,
            "category": category_id,
            "solutions": solutions
        })
    
    except Exception as e:
        logger.error(f"Error generating Triple Threat Solutions: {str(e)}")
        return jsonify({"error": f"Failed to generate solutions: {str(e)}"}), 500

if __name__ == '__main__':
    # Make sure to run on port 8000 and be accessible from other processes
    logger.info("Starting Flask server on 0.0.0.0:8000")
    app.run(host='0.0.0.0', port=8000, debug=True, threaded=True)
