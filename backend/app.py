from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import os
from dotenv import load_dotenv
import jwt
from functools import wraps

load_dotenv()

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'postgresql://localhost/ai_form_builder')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev-secret-key')

CORS(app, origins=[os.getenv('FRONTEND_URL', 'http://localhost:3000')])

db = SQLAlchemy(app)

# Import models and routes
from models import Form, Lead, Document, Analytics
from routes.forms import forms_bp
from routes.leads import leads_bp
from routes.chat import chat_bp
from routes.analytics import analytics_bp
from routes.documents import documents_bp

# Register blueprints
app.register_blueprint(forms_bp, url_prefix='/api/forms')
app.register_blueprint(leads_bp, url_prefix='/api/leads')
app.register_blueprint(chat_bp, url_prefix='/api/chat')
app.register_blueprint(analytics_bp, url_prefix='/api/analytics')
app.register_blueprint(documents_bp, url_prefix='/api/documents')

# Supabase JWT verification
import requests

SUPABASE_JWT_SECRET = os.getenv('SUPABASE_JWT_SECRET')

def verify_token(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        token = request.headers.get('Authorization')
        
        if not token:
            return jsonify({'error': 'No authorization token provided'}), 401
        
        try:
            # Remove 'Bearer ' prefix if present
            if token.startswith('Bearer '):
                token = token[7:]
            
            # Verify Supabase JWT token
            # Note: In production, you should verify the JWT signature using the Supabase JWT secret
            decoded = jwt.decode(
                token,
                SUPABASE_JWT_SECRET,
                algorithms=['HS256'],
                audience='authenticated'
            ) if SUPABASE_JWT_SECRET else jwt.decode(token, options={"verify_signature": False})
            
            # Extract user ID from token
            request.user_id = decoded.get('sub')
            request.user_role = decoded.get('user_metadata', {}).get('role', 'user')
            
        except jwt.ExpiredSignatureError:
            return jsonify({'error': 'Token has expired'}), 401
        except jwt.InvalidTokenError as e:
            return jsonify({'error': f'Invalid token: {str(e)}'}), 401
        except Exception as e:
            return jsonify({'error': 'Invalid token'}), 401
        
        return f(*args, **kwargs)
    
    return decorated_function

def require_admin(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if not hasattr(request, 'user_role') or request.user_role != 'admin':
            return jsonify({'error': 'Admin access required'}), 403
        return f(*args, **kwargs)
    return decorated_function

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy', 'timestamp': datetime.utcnow().isoformat()})

# Create tables
with app.app_context():
    db.create_all()

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)

