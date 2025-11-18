from flask import Blueprint, request, jsonify, send_file
from models import Lead, Form, db
from datetime import datetime
import csv
import io
import uuid

leads_bp = Blueprint('leads', __name__)

def generate_id():
    return str(uuid.uuid4())

@leads_bp.route('', methods=['GET'])
def get_leads():
    form_id = request.args.get('form_id')
    
    query = Lead.query
    
    if form_id:
        query = query.filter_by(form_id=form_id)
    else:
        # Get all forms for current user
        user_id = request.headers.get('Authorization', 'test-user')
        user_forms = Form.query.filter_by(user_id=user_id).all()
        form_ids = [f.id for f in user_forms]
        query = query.filter(Lead.form_id.in_(form_ids))
    
    leads = query.order_by(Lead.created_at.desc()).all()
    return jsonify([lead.to_dict() for lead in leads])

@leads_bp.route('/<lead_id>', methods=['GET'])
def get_lead(lead_id):
    lead = Lead.query.get_or_404(lead_id)
    return jsonify(lead.to_dict())

@leads_bp.route('/export/<form_id>', methods=['GET'])
def export_leads_csv(form_id):
    leads = Lead.query.filter_by(form_id=form_id).order_by(Lead.created_at.desc()).all()
    
    # Create CSV
    output = io.StringIO()
    writer = csv.writer(output)
    
    # Header
    writer.writerow([
        'ID',
        'Name',
        'Email',
        'Phone',
        'Qualification Level',
        'Pain Points',
        'Buying Signals',
        'Created At'
    ])
    
    # Rows
    for lead in leads:
        writer.writerow([
            lead.id,
            lead.contact_info.get('name', ''),
            lead.contact_info.get('email', ''),
            lead.contact_info.get('phone', ''),
            lead.qualification_level,
            '; '.join(lead.pain_points),
            '; '.join(lead.buying_signals),
            lead.created_at.isoformat()
        ])
    
    # Create response
    output.seek(0)
    return send_file(
        io.BytesIO(output.getvalue().encode('utf-8')),
        mimetype='text/csv',
        as_attachment=True,
        download_name=f'leads_{form_id}_{datetime.now().strftime("%Y%m%d")}.csv'
    )

@leads_bp.route('', methods=['POST'])
def create_lead():
    data = request.get_json()
    
    lead = Lead(
        id=generate_id(),
        form_id=data.get('form_id'),
        session_id=data.get('session_id'),
        contact_info=data.get('contact_info', {}),
        responses=data.get('responses', {}),
        conversation_history=data.get('conversation_history', []),
        pain_points=data.get('pain_points', []),
        buying_signals=data.get('buying_signals', []),
        qualification_level=data.get('qualification_level', 'cold')
    )
    
    db.session.add(lead)
    db.session.commit()
    
    return jsonify(lead.to_dict()), 201

