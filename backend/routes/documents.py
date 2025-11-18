from flask import Blueprint, request, jsonify
from models import Document, Form, db
from werkzeug.utils import secure_filename
import os
import uuid
from services.document_parser import DocumentParser

documents_bp = Blueprint('documents', __name__)

UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'uploads')
ALLOWED_EXTENSIONS = {'pdf', 'docx', 'txt'}

# Create upload folder if it doesn't exist
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

document_parser = DocumentParser()

def generate_id():
    return str(uuid.uuid4())

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@documents_bp.route('/upload', methods=['POST'])
def upload_document():
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400
    
    file = request.files['file']
    form_id = request.form.get('form_id')
    
    if not form_id:
        return jsonify({'error': 'form_id is required'}), 400
    
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400
    
    if not allowed_file(file.filename):
        return jsonify({'error': 'File type not allowed'}), 400
    
    # Get form
    form = Form.query.get_or_404(form_id)
    
    # Save file
    filename = secure_filename(file.filename)
    unique_filename = f"{generate_id()}_{filename}"
    file_path = os.path.join(UPLOAD_FOLDER, unique_filename)
    file.save(file_path)
    
    # Parse document
    try:
        parsed_content = document_parser.parse(file_path, file.filename.rsplit('.', 1)[1].lower())
    except Exception as e:
        os.remove(file_path)
        return jsonify({'error': f'Failed to parse document: {str(e)}'}), 400
    
    # Create document record
    document = Document(
        id=generate_id(),
        form_id=form_id,
        filename=filename,
        file_type=file.filename.rsplit('.', 1)[1].lower(),
        file_path=file_path,
        parsed_content=parsed_content
    )
    
    db.session.add(document)
    
    # Update form context with document content
    if form.context:
        form.context += f"\n\n--- Content from {filename} ---\n{parsed_content}"
    else:
        form.context = f"--- Content from {filename} ---\n{parsed_content}"
    
    # Add document ID to form's context_documents
    if not form.context_documents:
        form.context_documents = []
    form.context_documents.append(document.id)
    
    db.session.commit()
    
    return jsonify(document.to_dict()), 201

@documents_bp.route('/<document_id>', methods=['GET'])
def get_document(document_id):
    document = Document.query.get_or_404(document_id)
    return jsonify(document.to_dict())

@documents_bp.route('/<document_id>', methods=['DELETE'])
def delete_document(document_id):
    document = Document.query.get_or_404(document_id)
    
    # Delete file
    if os.path.exists(document.file_path):
        os.remove(document.file_path)
    
    # Remove from form's context_documents
    form = Form.query.get(document.form_id)
    if form and form.context_documents and document.id in form.context_documents:
        form.context_documents.remove(document.id)
    
    db.session.delete(document)
    db.session.commit()
    
    return '', 204

@documents_bp.route('/<document_id>/parse', methods=['POST'])
def reparse_document(document_id):
    document = Document.query.get_or_404(document_id)
    
    try:
        parsed_content = document_parser.parse(document.file_path, document.file_type)
        document.parsed_content = parsed_content
        db.session.commit()
        
        return jsonify(document.to_dict())
    except Exception as e:
        return jsonify({'error': f'Failed to parse document: {str(e)}'}), 400

