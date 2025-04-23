import logging
import sys

# Configure logging
logging.basicConfig(level=logging.INFO,
                    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

try:
    logger.info("Initializing NLP environment...")
    import nltk
    import spacy
    
    # Download required NLTK resources
    nltk.download('punkt', quiet=True)
    nltk.download('stopwords', quiet=True)
    nltk.download('vader_lexicon', quiet=True)
    nltk.download('wordnet', quiet=True)
    
    # Load spaCy model
    try:
        nlp = spacy.load("en_core_web_sm")
    except OSError:
        logger.info("Downloading spaCy model...")
        spacy.cli.download("en_core_web_sm")
    
    logger.info("NLP environment initialized successfully")
    
    # Import flask_server's main code without running app.run() again 
    # (flask_server already has app.run() in its __main__ block)
    import flask_server
    logger.info("Imported Flask server successfully, starting from flask_server.py...")
    
except ImportError as e:
    logger.error(f"Failed to import required modules: {str(e)}")
    logger.error("Please make sure all dependencies are installed.")
    sys.exit(1)
except Exception as e:
    logger.error(f"An error occurred during startup: {str(e)}")
    sys.exit(1)