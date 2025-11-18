# AI Form Builder - Backend

Flask backend for the AI-powered conversational form builder.

## Setup

1. **Install Dependencies**

```bash
cd backend
pip install -r requirements.txt
```

2. **Set Up Database**

Create a PostgreSQL database:

```bash
createdb ai_form_builder
```

Or use Supabase:
- Create a new project on Supabase
- Copy the connection string

3. **Environment Variables**

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

Required variables:
- `DATABASE_URL`: PostgreSQL connection string
- `OPENAI_API_KEY`: Your OpenAI API key
- `CLERK_SECRET_KEY`: Your Clerk secret key (for production auth)
- `SECRET_KEY`: Flask secret key (generate with `python -c "import secrets; print(secrets.token_hex(32))"`)

4. **Initialize Database**

```bash
python app.py
```

This will create all necessary tables.

5. **Run Development Server**

```bash
python app.py
```

The API will be available at `http://localhost:5000`

## API Endpoints

### Forms
- `GET /api/forms` - List all forms
- `GET /api/forms/:id` - Get form details
- `POST /api/forms` - Create new form
- `PUT /api/forms/:id` - Update form
- `DELETE /api/forms/:id` - Delete form
- `POST /api/forms/:id/duplicate` - Duplicate form

### Leads
- `GET /api/leads` - List all leads
- `GET /api/leads/:id` - Get lead details
- `GET /api/leads/export/:formId` - Export leads as CSV

### Chat
- `POST /api/chat/:formId` - Send message to AI
- `POST /api/chat/:formId/submit` - Submit form and create lead

### Analytics
- `GET /api/analytics/forms/:formId` - Get form analytics
- `GET /api/analytics/dashboard` - Get dashboard stats
- `POST /api/analytics/track` - Track custom event

### Documents
- `POST /api/documents/upload` - Upload document (PDF, DOCX, TXT)
- `GET /api/documents/:id` - Get document details
- `DELETE /api/documents/:id` - Delete document
- `POST /api/documents/:id/parse` - Re-parse document

## Production Deployment

### Using Gunicorn

```bash
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

### Using Docker

```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .

CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:5000", "app:app"]
```

### Environment Variables for Production

Make sure to set:
- Use a strong `SECRET_KEY`
- Set `FLASK_ENV=production`
- Use a production PostgreSQL database
- Configure proper CORS origins in `FRONTEND_URL`

## Database Schema

### Forms
- Stores form configuration, fields, AI context, and embed settings

### Leads
- Stores submitted form data with AI-extracted insights

### Documents
- Stores uploaded documents and parsed content

### Analytics
- Stores events for tracking form performance

### ChatSessions
- Stores conversation history for each user session

## AI Integration

The backend uses OpenAI's GPT-4 (or GPT-3.5-turbo) for:
- Conversational responses to user questions
- Lead qualification and analysis
- Extracting pain points and buying signals

Configure your OpenAI API key in the `.env` file.

## Authentication

The backend expects a Clerk JWT token in the `Authorization` header for authenticated endpoints.

In development mode, authentication is simplified. For production, implement proper JWT verification with Clerk's public keys.

