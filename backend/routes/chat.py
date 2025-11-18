from flask import Blueprint, request, jsonify
from models import Form, Lead, ChatSession, Analytics, db
from services.ai_service import AIService
from datetime import datetime
import uuid

chat_bp = Blueprint('chat', __name__)

ai_service = AIService()

def generate_id():
    return str(uuid.uuid4())

@chat_bp.route('/<form_id>', methods=['POST'])
def send_message(form_id):
    data = request.get_json()
    session_id = data.get('session_id')
    message = data.get('message')
    context = data.get('context', {})
    
    # Get form
    form = Form.query.get_or_404(form_id)
    
    # Get or create chat session
    chat_session = ChatSession.query.filter_by(session_id=session_id).first()
    if not chat_session:
        chat_session = ChatSession(
            id=generate_id(),
            form_id=form_id,
            session_id=session_id,
            messages=[],
            context_data=context
        )
        db.session.add(chat_session)
    
    # Add user message to history
    user_message = {
        'role': 'user',
        'content': message,
        'timestamp': datetime.utcnow().isoformat()
    }
    chat_session.messages.append(user_message)
    
    # Get AI response
    ai_response = ai_service.generate_response(
        form=form,
        conversation_history=chat_session.messages,
        user_message=message,
        context_data=chat_session.context_data
    )
    
    # Add AI message to history
    ai_message = {
        'role': 'assistant',
        'content': ai_response['message'],
        'timestamp': datetime.utcnow().isoformat()
    }
    chat_session.messages.append(ai_message)
    
    # Update context data
    if 'extracted_data' in ai_response:
        chat_session.context_data.update(ai_response['extracted_data'])
    
    chat_session.last_activity = datetime.utcnow()
    
    # Track analytics
    analytics = Analytics(
        form_id=form_id,
        event_type='message_sent',
        event_data={'message_length': len(message)},
        session_id=session_id
    )
    db.session.add(analytics)
    
    db.session.commit()
    
    return jsonify({
        'message': ai_response['message'],
        'show_form': ai_response.get('show_form', False),
        'extracted_data': ai_response.get('extracted_data', {})
    })

@chat_bp.route('/<form_id>/submit', methods=['POST'])
def submit_form(form_id):
    data = request.get_json()
    session_id = data.get('session_id')
    form_data = data.get('data', {})
    
    # Get chat session
    chat_session = ChatSession.query.filter_by(session_id=session_id).first()
    
    # Analyze conversation for insights
    insights = ai_service.analyze_conversation(
        conversation_history=chat_session.messages if chat_session else [],
        form_data=form_data
    )
    
    # Create lead
    lead = Lead(
        id=generate_id(),
        form_id=form_id,
        session_id=session_id,
        contact_info={
            'name': form_data.get('name'),
            'email': form_data.get('email'),
            'phone': form_data.get('phone')
        },
        responses=form_data,
        conversation_history=chat_session.messages if chat_session else [],
        pain_points=insights.get('pain_points', []),
        buying_signals=insights.get('buying_signals', []),
        qualification_level=insights.get('qualification_level', 'cold')
    )
    
    db.session.add(lead)
    
    # Track analytics
    analytics = Analytics(
        form_id=form_id,
        event_type='form_completed',
        event_data={'fields_count': len(form_data)},
        session_id=session_id
    )
    db.session.add(analytics)
    
    db.session.commit()
    
    return jsonify(lead.to_dict()), 201

