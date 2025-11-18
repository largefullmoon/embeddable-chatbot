from flask import Blueprint, request, jsonify
from models import Analytics, Lead, Form, db
from sqlalchemy import func
from datetime import datetime, timedelta

analytics_bp = Blueprint('analytics', __name__)

@analytics_bp.route('/forms/<form_id>', methods=['GET'])
def get_form_analytics(form_id):
    # Get time range (default: last 30 days)
    days = request.args.get('days', 30, type=int)
    start_date = datetime.utcnow() - timedelta(days=days)
    
    # Total views (form loads)
    total_views = Analytics.query.filter(
        Analytics.form_id == form_id,
        Analytics.event_type == 'form_view',
        Analytics.timestamp >= start_date
    ).count()
    
    # Total completions
    total_completions = Analytics.query.filter(
        Analytics.form_id == form_id,
        Analytics.event_type == 'form_completed',
        Analytics.timestamp >= start_date
    ).count()
    
    # Calculate rates
    completion_rate = total_completions / total_views if total_views > 0 else 0
    drop_off_rate = 1 - completion_rate
    
    # Average completion time (mock for now - would need to track session durations)
    avg_completion_time = 120  # seconds
    
    # Top questions asked
    message_events = Analytics.query.filter(
        Analytics.form_id == form_id,
        Analytics.event_type == 'message_sent',
        Analytics.timestamp >= start_date
    ).all()
    
    # Mock top questions (in production, extract from actual messages)
    top_questions = [
        {'question': 'What are your pricing plans?', 'count': 15},
        {'question': 'Do you offer a free trial?', 'count': 12},
        {'question': 'How long does implementation take?', 'count': 10},
        {'question': 'What integrations do you support?', 'count': 8},
        {'question': 'Can I cancel anytime?', 'count': 6},
    ]
    
    # Common objections (extracted from leads)
    leads = Lead.query.filter_by(form_id=form_id).all()
    objections = {}
    for lead in leads:
        for pain_point in lead.pain_points:
            objections[pain_point] = objections.get(pain_point, 0) + 1
    
    common_objections = [
        {'objection': obj, 'count': count}
        for obj, count in sorted(objections.items(), key=lambda x: x[1], reverse=True)[:5]
    ]
    
    return jsonify({
        'form_id': form_id,
        'total_views': total_views,
        'total_completions': total_completions,
        'completion_rate': completion_rate,
        'drop_off_rate': drop_off_rate,
        'avg_completion_time': avg_completion_time,
        'top_questions': top_questions,
        'common_objections': common_objections
    })

@analytics_bp.route('/dashboard', methods=['GET'])
def get_dashboard_stats():
    # Get user's forms
    user_id = request.headers.get('Authorization', 'test-user')
    user_forms = Form.query.filter_by(user_id=user_id).all()
    form_ids = [f.id for f in user_forms]
    
    if not form_ids:
        return jsonify({
            'total_views': 0,
            'total_completions': 0,
            'completion_rate': 0,
            'avg_completion_time': 0
        })
    
    # Aggregate stats across all forms
    days = 30
    start_date = datetime.utcnow() - timedelta(days=days)
    
    total_views = Analytics.query.filter(
        Analytics.form_id.in_(form_ids),
        Analytics.event_type == 'form_view',
        Analytics.timestamp >= start_date
    ).count()
    
    total_completions = Analytics.query.filter(
        Analytics.form_id.in_(form_ids),
        Analytics.event_type == 'form_completed',
        Analytics.timestamp >= start_date
    ).count()
    
    completion_rate = total_completions / total_views if total_views > 0 else 0
    
    return jsonify({
        'total_views': total_views,
        'total_completions': total_completions,
        'completion_rate': completion_rate,
        'avg_completion_time': 120,
        'total_forms': len(user_forms),
        'total_leads': Lead.query.filter(Lead.form_id.in_(form_ids)).count()
    })

@analytics_bp.route('/track', methods=['POST'])
def track_event():
    data = request.get_json()
    
    analytics = Analytics(
        form_id=data.get('form_id'),
        event_type=data.get('event_type'),
        event_data=data.get('event_data', {}),
        session_id=data.get('session_id')
    )
    
    db.session.add(analytics)
    db.session.commit()
    
    return jsonify({'success': True}), 201

