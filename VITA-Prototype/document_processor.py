import os
import logging
from typing import Optional, List
import pypdf

# Configure the upload folder path
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'pdf', 'jpg', 'jpeg', 'png', 'txt'}

def allowed_file(filename: str) -> bool:
    """
    Check if a file has an allowed extension.
    
    Args:
        filename (str): The name of the file to check
        
    Returns:
        bool: True if the file extension is allowed, False otherwise
    """
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def process_pdf(file_path: str) -> Optional[str]:
    """
    Extract text from a PDF file.
    
    Args:
        file_path (str): Path to the PDF file
        
    Returns:
        Optional[str]: Extracted text or None if processing failed
    """
    try:
        # Open the PDF file
        with open(file_path, 'rb') as file:
            # Create a PDF reader object
            pdf_reader = pypdf.PdfReader(file)
            
            # Get the number of pages
            num_pages = len(pdf_reader.pages)
            
            # Extract text from each page
            text = ""
            for page_num in range(num_pages):
                # Get the page
                page = pdf_reader.pages[page_num]
                
                # Extract text from the page
                page_text = page.extract_text()
                
                # Append the page text to the overall text
                if page_text:
                    text += page_text + "\n\n"
            
            return text
    except Exception as e:
        logging.error(f"Error processing PDF: {e}")
        return None

def extract_images_from_pdf(file_path: str) -> List[bytes]:
    """
    Extract images from a PDF file.
    
    Args:
        file_path (str): Path to the PDF file
        
    Returns:
        List[bytes]: List of image data as bytes
    """
    # Note: This is a placeholder function. Implementing PDF image extraction
    # is complex and would require additional libraries like fitz (PyMuPDF)
    logging.warning("PDF image extraction not implemented")
    return []

def process_image(file_path: str) -> Optional[str]:
    """
    Process an image file for OCR (placeholder).
    
    Args:
        file_path (str): Path to the image file
        
    Returns:
        Optional[str]: Extracted text or None if processing failed
    """
    # Note: This would require an OCR library like tesseract
    logging.warning("Image OCR not implemented")
    return None

def process_text_file(file_path: str) -> Optional[str]:
    """
    Read text from a text file.
    
    Args:
        file_path (str): Path to the text file
        
    Returns:
        Optional[str]: The file content or None if processing failed
    """
    try:
        with open(file_path, 'r', encoding='utf-8') as file:
            return file.read()
    except Exception as e:
        logging.error(f"Error processing text file: {e}")
        return None

def clean_medical_text(text: str) -> str:
    """
    Clean and preprocess medical text for better analysis.
    
    Args:
        text (str): The text to clean
        
    Returns:
        str: Cleaned text
    """
    if not text:
        return ""
    
    # Remove excessive whitespace
    cleaned_text = ' '.join(text.split())
    
    # Remove any control characters
    cleaned_text = ''.join(c for c in cleaned_text if ord(c) >= 32 or c == '\n')
    
    return cleaned_text
