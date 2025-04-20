import json
import os
import logging
from openai import OpenAI

# the newest OpenAI model is "gpt-4o" which was released May 13, 2024.
# do not change this unless explicitly requested by the user

# Initialize OpenAI client
OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY")
openai = OpenAI(api_key=OPENAI_API_KEY)

def analyze_medical_document(text):
    """
    Analyze medical document text using OpenAI API.
    
    Args:
        text (str): The text extracted from the medical document
        
    Returns:
        str: JSON string containing the analysis results
    """
    try:
        # Truncate text if it's too long
        max_length = 8000
        if len(text) > max_length:
            logging.warning(f"Text too long ({len(text)} chars), truncating to {max_length} chars")
            text = text[:max_length] + "..."
        
        prompt = (
            "You are a medical AI assistant analyzing a medical document. "
            "Please extract and organize the following information in JSON format:\n\n"
            "1. Document type (e.g., Lab report, Consultation note, Discharge summary)\n"
            "2. Key medical terms and their meanings\n"
            "3. Main findings or diagnoses\n"
            "4. Recommended treatments or medications\n"
            "5. Important follow-up actions\n"
            "6. Critical values or abnormal results (if any)\n\n"
            "Respond with JSON in this format: "
            "{'document_type': string, 'key_terms': [{'term': string, 'meaning': string}], "
            "'main_findings': [string], 'treatments': [string], 'follow_up': [string], "
            "'critical_values': [string]}"
            f"\n\nHere's the document text:\n{text}"
        )
        
        response = openai.chat.completions.create(
            model="gpt-4o",
            messages=[{"role": "user", "content": prompt}],
            response_format={"type": "json_object"},
            temperature=0.1
        )
        
        return response.choices[0].message.content
    except Exception as e:
        logging.error(f"Error analyzing medical document: {e}")
        # Return error information in a structured format
        error_json = {
            "error": True,
            "message": f"Failed to analyze document: {str(e)}",
            "document_type": "Unknown",
            "key_terms": [],
            "main_findings": ["Analysis failed"],
            "treatments": [],
            "follow_up": ["Please consult with your healthcare provider directly"],
            "critical_values": []
        }
        return json.dumps(error_json)

def simplify_medical_text(text):
    """
    Simplify medical text to make it understandable for non-medical users.
    
    Args:
        text (str): The medical text to simplify
        
    Returns:
        str: Simplified version of the text
    """
    try:
        # Truncate text if it's too long
        max_length = 8000
        if len(text) > max_length:
            logging.warning(f"Text too long ({len(text)} chars), truncating to {max_length} chars")
            text = text[:max_length] + "..."
        
        prompt = (
            "You are a medical translator for patients. Your task is to simplify this medical document "
            "so a person without medical background can understand it. Explain medical terms in simple language, "
            "remove unnecessary jargon, and organize the information in a clear, easy-to-understand format. "
            "Include helpful explanations of what the results mean practically for the patient. "
            "Keep the content comprehensive but simple."
            f"\n\nHere's the medical text to simplify:\n{text}"
        )
        
        response = openai.chat.completions.create(
            model="gpt-4o",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.5
        )
        
        return response.choices[0].message.content
    except Exception as e:
        logging.error(f"Error simplifying medical text: {e}")
        return ("Sorry, we couldn't simplify this text automatically. "
                "Please consult with your healthcare provider to explain the content.")

def extract_medical_terms(text):
    """
    Extract and explain medical terms from the text.
    
    Args:
        text (str): Medical text containing terminology
        
    Returns:
        dict: Dictionary of medical terms and their explanations
    """
    try:
        # Truncate text if it's too long
        max_length = 8000
        if len(text) > max_length:
            logging.warning(f"Text too long ({len(text)} chars), truncating to {max_length} chars")
            text = text[:max_length] + "..."
        
        prompt = (
            "You are a medical terminology expert. Extract all medical terms from the text and provide "
            "simple explanations for each term. Respond with JSON in this format: "
            "{'terms': [{'term': string, 'explanation': string}]}"
            f"\n\nHere's the text:\n{text}"
        )
        
        response = openai.chat.completions.create(
            model="gpt-4o",
            messages=[{"role": "user", "content": prompt}],
            response_format={"type": "json_object"},
            temperature=0.1
        )
        
        return json.loads(response.choices[0].message.content)
    except Exception as e:
        logging.error(f"Error extracting medical terms: {e}")
        return {"terms": []}

def generate_patient_summary(analysis_results, simplified_content):
    """
    Generate a concise patient-friendly summary from analysis results and simplified content.
    
    Args:
        analysis_results (str): JSON string with analysis results
        simplified_content (str): The simplified version of the medical text
        
    Returns:
        str: Concise patient-friendly summary
    """
    try:
        # Parse analysis results
        if isinstance(analysis_results, str):
            analysis_data = json.loads(analysis_results)
        else:
            analysis_data = analysis_results
            
        # Extract key information
        main_findings = analysis_data.get('main_findings', [])
        treatments = analysis_data.get('treatments', [])
        follow_up = analysis_data.get('follow_up', [])
        
        # Take first 500 characters of simplified content as context
        simplified_preview = simplified_content[:500] + "..." if len(simplified_content) > 500 else simplified_content
        
        prompt = (
            "You are a health communication specialist. Create a concise, easy-to-understand summary "
            "for a patient based on their medical information. Focus on what the patient needs to know "
            "and what actions they should take. Use simple language and be encouraging but honest. "
            "Limit your response to 3-4 paragraphs maximum."
            f"\n\nMain findings: {main_findings}"
            f"\nRecommended treatments: {treatments}"
            f"\nFollow-up actions: {follow_up}"
            f"\nAdditional context: {simplified_preview}"
        )
        
        response = openai.chat.completions.create(
            model="gpt-4o",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.7,
            max_tokens=500
        )
        
        return response.choices[0].message.content
    except Exception as e:
        logging.error(f"Error generating patient summary: {e}")
        return ("We couldn't generate a custom summary. Please review the simplified content "
                "or consult with your healthcare provider for more information.")
