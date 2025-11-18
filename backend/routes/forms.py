from flask import Blueprint, request, jsonify
from models import Form, db
from datetime import datetime
import uuid

forms_bp = Blueprint('forms', __name__)

def generate_id():
    return str(uuid.uuid4())

@forms_bp.route('', methods=['GET'])
def get_forms():
    # In production, get user_id from JWT token
    user_id = request.headers.get('Authorization', 'test-user')
    
    forms = Form.query.filter_by(user_id=user_id).order_by(Form.created_at.desc()).all()
    return jsonify([form.to_dict() for form in forms])

@forms_bp.route('/<form_id>', methods=['GET'])
def get_form(form_id):
    form = Form.query.get_or_404(form_id)
    return jsonify(form.to_dict())

@forms_bp.route('', methods=['POST'])
def create_form():
    data = request.get_json()
    
    # In production, get user_id from JWT token
    user_id = request.headers.get('Authorization', 'test-user')
    
    form = Form(
        id=generate_id(),
        user_id=user_id,
        title=data.get('title'),
        description=data.get('description'),
        cta_type=data.get('cta_type', 'Submit'),
        fields=data.get('fields', []),
        context=data.get('context', ''),
        context_documents=data.get('context_documents', []),
        template_type=data.get('template_type'),
        embed_settings=data.get('embed_settings', {
            'primary_color': '#0ea5e9',
            'button_text': 'Start Chat',
            'position': 'inline',
            'width': '100%'
        })
    )
    
    db.session.add(form)
    db.session.commit()
    
    return jsonify(form.to_dict()), 201

@forms_bp.route('/<form_id>', methods=['PUT'])
def update_form(form_id):
    form = Form.query.get_or_404(form_id)
    data = request.get_json()
    
    # Update fields
    if 'title' in data:
        form.title = data['title']
    if 'description' in data:
        form.description = data['description']
    if 'cta_type' in data:
        form.cta_type = data['cta_type']
    if 'fields' in data:
        form.fields = data['fields']
    if 'context' in data:
        form.context = data['context']
    if 'context_documents' in data:
        form.context_documents = data['context_documents']
    if 'embed_settings' in data:
        form.embed_settings = data['embed_settings']
    
    form.updated_at = datetime.utcnow()
    
    db.session.commit()
    
    return jsonify(form.to_dict())

@forms_bp.route('/<form_id>', methods=['DELETE'])
def delete_form(form_id):
    form = Form.query.get_or_404(form_id)
    
    db.session.delete(form)
    db.session.commit()
    
    return '', 204

@forms_bp.route('/<form_id>/duplicate', methods=['POST'])
def duplicate_form(form_id):
    original_form = Form.query.get_or_404(form_id)
    
    new_form = Form(
        id=generate_id(),
        user_id=original_form.user_id,
        title=f"{original_form.title} (Copy)",
        description=original_form.description,
        cta_type=original_form.cta_type,
        fields=original_form.fields,
        context=original_form.context,
        context_documents=original_form.context_documents,
        template_type=original_form.template_type,
        embed_settings=original_form.embed_settings
    )
    
    db.session.add(new_form)
    db.session.commit()
    
    return jsonify(new_form.to_dict()), 201

