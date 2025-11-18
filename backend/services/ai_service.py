import os
from openai import OpenAI
import json
import re

class AIService:
    def __init__(self):
        self.client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))
        self.model = "gpt-4"  # or "gpt-3.5-turbo" for cost savings
    
    def generate_response(self, form, conversation_history, user_message, context_data):
        """
        Generate an AI response based on the conversation and form context
        """
        
        # Build system prompt
        system_prompt = f"""You are a helpful AI assistant for a conversational form.

Form Title: {form.title}
CTA: {form.cta_type}

Context and Instructions:
{form.context}

Your job is to:
1. Answer user questions naturally and helpfully
2. Guide the conversation towards collecting the required information
3. Identify pain points, buying signals, and qualification indicators
4. When you've gathered enough information, suggest moving to the form submission

Available form fields:
{self._format_fields(form.fields)}

Keep responses concise (2-3 sentences max). Be conversational and friendly.
"""
        
        # Build conversation messages
        messages = [{"role": "system", "content": system_prompt}]
        
        # Add conversation history (limit to last 10 messages for context window)
        for msg in conversation_history[-10:]:
            messages.append({
                "role": msg['role'],
                "content": msg['content']
            })
        
        # Get AI response
        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=messages,
                temperature=0.7,
                max_tokens=200
            )
            
            ai_message = response.choices[0].message.content
            
            # Determine if we should show the form
            # Simple heuristic: if conversation is long enough or user seems ready
            show_form = self._should_show_form(conversation_history, user_message, ai_message)
            
            # Extract any data mentioned
            extracted_data = self._extract_data(user_message, context_data)
            
            return {
                'message': ai_message,
                'show_form': show_form,
                'extracted_data': extracted_data
            }
            
        except Exception as e:
            print(f"OpenAI API Error: {str(e)}")
            # Fallback response
            return {
                'message': "I'd be happy to help! Could you tell me more about what you're looking for?",
                'show_form': False,
                'extracted_data': {}
            }
    
    def analyze_conversation(self, conversation_history, form_data):
        """
        Analyze the conversation to extract insights about the lead
        """
        
        # Build conversation text
        conversation_text = "\n".join([
            f"{msg['role']}: {msg['content']}"
            for msg in conversation_history
        ])
        
        analysis_prompt = f"""Analyze this conversation and form submission to identify:

1. Pain points mentioned by the user
2. Buying signals (urgency, budget mentions, decision authority, etc.)
3. Qualification level (hot/warm/cold)

Conversation:
{conversation_text}

Form Data:
{json.dumps(form_data, indent=2)}

Respond in JSON format:
{{
  "pain_points": ["list", "of", "pain", "points"],
  "buying_signals": ["list", "of", "buying", "signals"],
  "qualification_level": "hot|warm|cold",
  "summary": "Brief summary of the lead"
}}
"""
        
        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": "You are a sales analyst extracting insights from conversations."},
                    {"role": "user", "content": analysis_prompt}
                ],
                temperature=0.3,
                max_tokens=500
            )
            
            # Parse JSON response
            analysis_text = response.choices[0].message.content
            
            # Extract JSON from response (handle markdown code blocks)
            json_match = re.search(r'\{.*\}', analysis_text, re.DOTALL)
            if json_match:
                analysis = json.loads(json_match.group())
                return analysis
            else:
                return self._default_analysis()
                
        except Exception as e:
            print(f"Analysis Error: {str(e)}")
            return self._default_analysis()
    
    def _format_fields(self, fields):
        """Format form fields for the prompt"""
        field_list = []
        for field in fields:
            required = "required" if field.get('required') else "optional"
            field_list.append(f"- {field['label']} ({field['type']}, {required})")
        return "\n".join(field_list)
    
    def _should_show_form(self, conversation_history, user_message, ai_message):
        """
        Determine if we should show the form to the user
        Simple heuristic based on conversation length and keywords
        """
        
        # Show form after 4-5 exchanges
        if len(conversation_history) >= 8:
            return True
        
        # Show form if user expresses readiness
        ready_keywords = ['ready', 'sign up', 'register', 'book', 'schedule', 'interested', 'get started']
        if any(keyword in user_message.lower() for keyword in ready_keywords):
            return True
        
        return False
    
    def _extract_data(self, message, existing_data):
        """
        Extract structured data from user messages
        """
        extracted = {}
        
        # Email extraction
        email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
        email_match = re.search(email_pattern, message)
        if email_match:
            extracted['email'] = email_match.group()
        
        # Phone extraction (simple pattern)
        phone_pattern = r'\b\d{3}[-.]?\d{3}[-.]?\d{4}\b'
        phone_match = re.search(phone_pattern, message)
        if phone_match:
            extracted['phone'] = phone_match.group()
        
        return extracted
    
    def _default_analysis(self):
        """Return default analysis when AI analysis fails"""
        return {
            'pain_points': [],
            'buying_signals': [],
            'qualification_level': 'cold',
            'summary': 'Lead submitted form'
        }

