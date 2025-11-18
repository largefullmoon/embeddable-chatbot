from app import db
from datetime import datetime
import json

class Form(db.Model):
    __tablename__ = 'forms'
    
    id = db.Column(db.String(50), primary_key=True)
    user_id = db.Column(db.String(100), nullable=False, index=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    cta_type = db.Column(db.String(100), nullable=False)
    fields = db.Column(db.JSON, nullable=False)
    context = db.Column(db.Text, nullable=False)
    context_documents = db.Column(db.JSON)
    template_type = db.Column(db.String(50))
    embed_settings = db.Column(db.JSON, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    leads = db.relationship('Lead', backref='form', lazy=True, cascade='all, delete-orphan')
    analytics = db.relationship('Analytics', backref='form', lazy=True, cascade='all, delete-orphan')
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'title': self.title,
            'description': self.description,
            'cta_type': self.cta_type,
            'fields': self.fields,
            'context': self.context,
            'context_documents': self.context_documents,
            'template_type': self.template_type,
            'embed_settings': self.embed_settings,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat(),
        }


class Lead(db.Model):
    __tablename__ = 'leads'
    
    id = db.Column(db.String(50), primary_key=True)
    form_id = db.Column(db.String(50), db.ForeignKey('forms.id'), nullable=False)
    session_id = db.Column(db.String(100), nullable=False)
    contact_info = db.Column(db.JSON, nullable=False)
    responses = db.Column(db.JSON, nullable=False)
    conversation_history = db.Column(db.JSON, nullable=False)
    pain_points = db.Column(db.JSON, default=list)
    buying_signals = db.Column(db.JSON, default=list)
    qualification_level = db.Column(db.String(20), default='cold')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'form_id': self.form_id,
            'session_id': self.session_id,
            'contact_info': self.contact_info,
            'responses': self.responses,
            'conversation_history': self.conversation_history,
            'pain_points': self.pain_points,
            'buying_signals': self.buying_signals,
            'qualification_level': self.qualification_level,
            'created_at': self.created_at.isoformat(),
        }


class Document(db.Model):
    __tablename__ = 'documents'
    
    id = db.Column(db.String(50), primary_key=True)
    form_id = db.Column(db.String(50), db.ForeignKey('forms.id'), nullable=False)
    filename = db.Column(db.String(255), nullable=False)
    file_type = db.Column(db.String(50), nullable=False)
    file_path = db.Column(db.String(500), nullable=False)
    parsed_content = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'form_id': self.form_id,
            'filename': self.filename,
            'file_type': self.file_type,
            'created_at': self.created_at.isoformat(),
        }


class Analytics(db.Model):
    __tablename__ = 'analytics'
    
    id = db.Column(db.Integer, primary_key=True)
    form_id = db.Column(db.String(50), db.ForeignKey('forms.id'), nullable=False)
    event_type = db.Column(db.String(50), nullable=False)
    event_data = db.Column(db.JSON)
    session_id = db.Column(db.String(100))
    timestamp = db.Column(db.DateTime, default=datetime.utcnow, index=True)
    
    def to_dict(self):
        return {
            'id': self.id,
            'form_id': self.form_id,
            'event_type': self.event_type,
            'event_data': self.event_data,
            'session_id': self.session_id,
            'timestamp': self.timestamp.isoformat(),
        }


class ChatSession(db.Model):
    __tablename__ = 'chat_sessions'
    
    id = db.Column(db.String(50), primary_key=True)
    form_id = db.Column(db.String(50), db.ForeignKey('forms.id'), nullable=False)
    session_id = db.Column(db.String(100), nullable=False, unique=True)
    messages = db.Column(db.JSON, default=list)
    context_data = db.Column(db.JSON, default=dict)
    started_at = db.Column(db.DateTime, default=datetime.utcnow)
    last_activity = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'form_id': self.form_id,
            'session_id': self.session_id,
            'messages': self.messages,
            'context_data': self.context_data,
            'started_at': self.started_at.isoformat(),
            'last_activity': self.last_activity.isoformat(),
        }

