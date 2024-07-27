from flask import Flask, request, jsonify
from werkzeug.utils import secure_filename
import os
from transformers import T5Tokenizer, T5ForConditionalGeneration
from pypdf import PdfReader
from docx import Document
import nltk
from collections import Counter
import spacy
from PIL import Image
import pytesseract

# Initialize Flask app
app = Flask(__name__)

# Configurations
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'pdf', 'docx', 'txt', 'png', 'jpg', 'jpeg'}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Initialize NLTK and SpaCy
nltk.download('punkt')
nlp = spacy.load("en_core_web_sm")

# Load T5 model and tokenizer
tokenizer = T5Tokenizer.from_pretrained('t5-base', legacy=False)
model = T5ForConditionalGeneration.from_pretrained('t5-base')

# Function to check allowed file extensions
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# Function to extract text from PDF
def extract_text_from_pdf(pdf_file):
    doc = PdfReader(pdf_file)
    text = ""
    for page in doc.pages:
        text += page.extract_text()
    return text

# Function to extract text from DOCX
def extract_text_from_word_document(docx_file):
    doc = Document(docx_file)
    text = ""
    for para in doc.paragraphs:
        text += para.text + "\n"
    return text

# Function to extract text from text file
def extract_text_from_text_file(txt_file):
    with open(txt_file, 'r') as file:
        return file.read()

# Function to extract text from images using OCR
def extract_text_from_image(image_file):
    image = Image.open(image_file)
    return pytesseract.image_to_string(image)

# Function to generate summary
def generate_summary(input_text, num_sentences):
    input_ids = tokenizer.encode("summarize: " + input_text, return_tensors="pt", max_length=512, truncation=True)
    summary_ids = model.generate(input_ids, max_length=150, min_length=40, length_penalty=2.0, num_beams=4, early_stopping=True)
    summary = tokenizer.decode(summary_ids[0], skip_special_tokens=True)
    return summary

# Function to extract keywords
def extract_keywords(text, num_keywords=5):
    doc = nlp(text)
    keywords = [token.text for token in doc if token.pos_ in ['NOUN', 'ADJ', 'VERB']]
    most_common_keywords = Counter(keywords).most_common(num_keywords)
    return [keyword for keyword, _ in most_common_keywords]

# Function to count sentences and words
def count_sentences_words(text):
    sentences = nltk.sent_tokenize(text)
    words = nltk.word_tokenize(text)
    return len(sentences), len(words)

# Function to summarize based on user input (text or file path)
def summarize_input(input_text_or_file, num_sentences):
    if os.path.isfile(input_text_or_file):
        _, file_extension = os.path.splitext(input_text_or_file)
        if file_extension == '.txt':
            text = extract_text_from_text_file(input_text_or_file)
        elif file_extension == '.pdf':
            text = extract_text_from_pdf(input_text_or_file)
        elif file_extension == '.docx':
            text = extract_text_from_word_document(input_text_or_file)
        elif file_extension in ('.png', '.jpg', '.jpeg'):
            text = extract_text_from_image(input_text_or_file)
        else:
            raise ValueError("Unsupported file format")
    else:
        text = input_text_or_file

    original_sentences, original_words = count_sentences_words(text)
    summary = generate_summary(text, num_sentences)
    summarized_sentences, summarized_words = count_sentences_words(summary)
    keywords = extract_keywords(summary)

    return {
        "summary": summary,
        "original_sentences": original_sentences,
        "original_words": original_words,
        "summarized_sentences": summarized_sentences,
        "summarized_words": summarized_words,
        "keywords": keywords
    }

@app.route('/')
def index():
    return 'Welcome to Text Summarization'

@app.route('/upload', methods=['POST', 'GET'])
def upload_file():
    if request.method == 'POST':
        if 'file' not in request.files:
            return jsonify({'error': 'No file part'}), 400

        file = request.files['file']

        if file.filename == '':
            return jsonify({'error': 'No selected file'}), 400

        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(filepath)

            try:
                extracted_text = None
                if filename.endswith(".pdf"):
                    extracted_text = extract_text_from_pdf(filepath)
                elif filename.endswith(".docx"):
                    extracted_text = extract_text_from_word_document(filepath)
                elif filename.endswith(".txt"):
                    extracted_text = extract_text_from_text_file(filepath)
                elif filename.endswith((".png", ".jpg", ".jpeg")):
                    extracted_text = extract_text_from_image(filepath)
                else:
                    return jsonify({'error': 'Unsupported file format'}), 415

                num_word, num_sent = count_sentences_words(extracted_text)
                keywords = extract_keywords(extracted_text, num_keywords=5)

                result = ",".join(keywords)

                user = request.args.get('type')
                sent_number = int(request.args.get('sent_number', 5))

                if user == "paragraph":
                    summary = generate_summary(extracted_text, sent_number)
                    summary_num_word, summary_num_sent = count_sentences_words(summary)
                    sentence_reduction_info = {
                        'reduction_word': (num_word - summary_num_word) / num_word * 100,
                        'reduction_sentence': (num_sent - summary_num_sent) / num_sent * 100
                    }
                    return jsonify({'text': summary, "Rnum_word": summary_num_word, "Rnum_sent": summary_num_sent, 'statistics': sentence_reduction_info})

                elif user == "keywords":
                    selected_keywords = request.args.get('selected_keyword')
                    if selected_keywords is not None:
                        selected_keywords = [keyword.strip() for keyword in selected_keywords.split(',')]
                        selected_keyword_summary = summarize_input(extracted_text, sent_number)
                        summary_text_words, summary_text_sentences = count_sentences_words(selected_keyword_summary)
                        sentence_reduction_info = {
                            'reduction_word': (num_word - summary_text_words) / num_word * 100,
                            'reduction_sentence': (num_sent - summary_text_sentences) / num_sent * 100
                        }
                        return jsonify({'keyword_summary': selected_keyword_summary, 'num_word': summary_text_words, 'num_sent': summary_text_sentences, 'statistics': sentence_reduction_info})
                    else:
                        return jsonify({'error': 'Invalid keywords'}), 400

                return jsonify({'text': extracted_text, "Lnum_word": num_word, "Lnum_sent": num_sent, 'keywords': result})

            except Exception as e:
                return jsonify({'error': str(e)}), 400

        else:
            return jsonify({'error': 'Invalid file type'}), 400

    elif request.method == 'GET':
        return jsonify({'message': 'GET request received'})

if __name__ == '__main__':
    os.makedirs(UPLOAD_FOLDER, exist_ok=True)
    app.run(host='0.0.0.0', port=8080, debug=True)
