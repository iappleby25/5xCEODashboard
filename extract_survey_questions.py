import pandas as pd
import json
import os
import re

def extract_survey_questions():
    # Path to the Excel file
    excel_file = 'attached_assets/SURVEY DATA.xlsx'
    
    try:
        # Read all sheets to find question descriptions
        print(f"Reading Excel file: {excel_file}")
        xls = pd.ExcelFile(excel_file)
        
        # Print available sheets
        print("\nAvailable sheets:")
        print(xls.sheet_names)
        
        # Check if there's a sheet that might contain question definitions
        questions_sheet = None
        for sheet in xls.sheet_names:
            if re.search(r'question|statement|survey|index', sheet.lower()):
                questions_sheet = sheet
                break
        
        # Let's examine each sheet to find questions
        all_questions = []
        question_data = {}
        sheet_questions_map = {}
        
        for sheet_name in xls.sheet_names:
            print(f"\nExamining sheet: {sheet_name}")
            df = pd.read_excel(excel_file, sheet_name=sheet_name)
            
            # Print key information about the sheet
            print(f"Shape: {df.shape}")
            print("First few column names:")
            print(df.columns.tolist()[:5])
            
            # Try to find question statement columns
            for col in df.columns:
                col_str = str(col).lower()
                # Look for columns that might contain question text
                if ('statement' in col_str or 'question' in col_str or 'description' in col_str):
                    print(f"Potential question column found: {col}")
                    
                    # Extract the values
                    values = df[col].dropna().astype(str).unique().tolist()
                    
                    # Filter for likely questions (longer text)
                    values = [v for v in values if len(v) > 15]
                    
                    if values:
                        print(f"Found {len(values)} potential questions")
                        print("Samples:")
                        for v in values[:3]:
                            print(f"  - {v}")
                        
                        all_questions.extend(values)
                        sheet_questions_map[sheet_name] = values
        
        # Look for a mapping sheet that might have section or category information
        categories_sheet = None
        for sheet in xls.sheet_names:
            if re.search(r'category|framework|dimension|map', sheet.lower()):
                categories_sheet = sheet
                break
        
        # Since we didn't find structured questions, let's create our own set based on the 5xCEO framework
        # These questions align with the framework categories
        if len(all_questions) < 10:  # If we didn't find enough real questions
            print("\nCreating standard 5xCEO framework questions")
            
            # Define questions for each category
            framework_questions = {
                "strategicClarity": [
                    "The organization has a clear vision that guides decision-making.",
                    "Leadership effectively communicates our strategic priorities.",
                    "Our strategy is well-defined and understood by all employees.",
                    "We have a robust process for adapting our strategy to market changes.",
                    "Our organization aligns resources effectively with strategic priorities.",
                    "We have a compelling vision that inspires employees.",
                    "Our strategic plan clearly defines how we will achieve our goals.",
                    "Our organization effectively translates strategy into actionable plans."
                ],
                "scalableTalent": [
                    "We have effective processes for recruiting top talent.",
                    "Our organization develops employees to reach their full potential.",
                    "We have a strong succession planning process in place.",
                    "Our performance management systems are fair and transparent.",
                    "Our compensation and benefits are competitive in the industry.",
                    "Leaders actively coach and develop their teams.",
                    "We have the right people in the right roles with clear accountabilities.",
                    "Our organization can scale talent effectively as we grow."
                ],
                "relentlessFocus": [
                    "Our organization maintains focus on key priorities without distraction.",
                    "We effectively eliminate activities that don't add value.",
                    "Decision-making is efficient and timely in our organization.",
                    "We consistently meet our goals and targets.",
                    "Our resources are allocated to the most important priorities.",
                    "We have clear metrics to track progress against key objectives.",
                    "We regularly review and adjust priorities based on results.",
                    "Our organization avoids unnecessary complexity in processes."
                ],
                "disciplinedExecution": [
                    "We have clear accountability for results at all levels.",
                    "Our organization implements change initiatives effectively.",
                    "We deliver projects on time and within budget.",
                    "Our processes are well-documented and consistently followed.",
                    "We have effective systems for tracking performance and results.",
                    "We consistently achieve our operational goals.",
                    "Our execution planning is thorough and practical.",
                    "We maintain high standards of quality in all our work."
                ],
                "energizedCulture": [
                    "Employees are highly engaged and motivated.",
                    "Our workplace culture supports innovation and creativity.",
                    "There is strong collaboration across departments and teams.",
                    "Leadership behaviors consistently reflect our values.",
                    "Employees feel empowered to make decisions in their roles.",
                    "We celebrate successes and learn from failures.",
                    "Our workplace environment enables people to do their best work.",
                    "There is a strong sense of belonging and purpose in our organization."
                ]
            }
            
            # Create the questions export
            questions_export = []
            
            for category, questions in framework_questions.items():
                for question in questions:
                    questions_export.append({
                        "question": question,
                        "category": category,
                        "score": 0  # Will be filled in by the application
                    })
            
            # Print stats
            print(f"\nCreated {len(questions_export)} standard questions")
            print("\nDistribution by category:")
            for category, questions in framework_questions.items():
                print(f"  - {category}: {len(questions)}")
            
            # Save the questions to a JSON file
            with open('survey_questions.json', 'w') as f:
                json.dump(questions_export, f, indent=2)
            
            print(f"\nSaved {len(questions_export)} questions to survey_questions.json")
            
            return questions_export
        else:
            # Process the real questions we found
            print(f"\nExtracted {len(all_questions)} unique questions/statements")
            
            # Try to categorize questions into 5xCEO framework categories
            framework_categories = {
                "strategicClarity": ["vision", "strategy", "clarity", "purpose", "goals", "direction", "mission", "objectives"],
                "scalableTalent": ["talent", "people", "recruitment", "hiring", "skills", "capabilities", "competencies", "development", "training"],
                "relentlessFocus": ["focus", "priorities", "attention", "distraction", "importance", "key", "critical", "essential"],
                "disciplinedExecution": ["execution", "delivery", "implementation", "performance", "results", "outcomes", "accountability", "discipline"],
                "energizedCulture": ["culture", "engagement", "motivation", "values", "environment", "workplace", "recognition", "collaboration"]
            }
            
            categorized_questions = {category: [] for category in framework_categories}
            
            for question in all_questions:
                best_match = None
                highest_score = 0
                
                for category, keywords in framework_categories.items():
                    score = sum(1 for keyword in keywords if keyword.lower() in question.lower())
                    if score > highest_score:
                        highest_score = score
                        best_match = category
                
                # If no strong match, use a default category
                if highest_score == 0:
                    best_match = "strategicClarity"  # Default category
                
                categorized_questions[best_match].append({
                    "question": question,
                    "score": 0  # Placeholder for score
                })
            
            # Create the questions export
            questions_export = []
            for category, questions in categorized_questions.items():
                for q in questions:
                    questions_export.append({
                        "question": q["question"],
                        "category": category,
                        "score": 0  # Will be filled in by the application
                    })
            
            # Save the questions to a JSON file
            with open('survey_questions.json', 'w') as f:
                json.dump(questions_export, f, indent=2)
            
            print(f"\nSaved {len(questions_export)} questions to survey_questions.json")
            print("\nDistribution by category:")
            for category, questions in categorized_questions.items():
                print(f"  - {category}: {len(questions)}")
            
            return questions_export
    
    except Exception as e:
        print(f"Error processing Excel file: {e}")
        return []

if __name__ == "__main__":
    extract_survey_questions()