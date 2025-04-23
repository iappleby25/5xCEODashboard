import nltk
import spacy

# Download required NLTK resources
print("Downloading NLTK resources...")
nltk.download('punkt')
nltk.download('stopwords')
nltk.download('vader_lexicon')
nltk.download('wordnet')

# Download spaCy model
print("Downloading spaCy model...")
spacy.cli.download("en_core_web_sm")

print("NLP setup complete!")