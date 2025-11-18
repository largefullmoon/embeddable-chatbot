# AI Form Builder - Conversational Forms SaaS Platform

A complete SaaS application for creating intelligent, AI-powered conversational forms that engage leads naturally, understand their needs, and qualify them automatically.

## 🚀 Features

### Core Features (V1)

✅ **Conversational Form Builder**
- Create forms with clear CTA goals (book a call, register for webinar, etc.)
- Multiple field types: text, email, phone, dropdown, radio, textarea
- Required/optional field configuration
- Pre-built templates (Strategy Call, Webinar, Waitlist, Lead Qualification, etc.)

✅ **AI-Powered Conversations**
- LLM-based chat experience using OpenAI GPT-4
- Context-aware responses based on uploaded content
- Dynamic follow-up questions
- Natural conversation flow

✅ **Context Management**
- Rich text input for offer context
- Document upload support (PDF, DOCX, TXT)
- AI leverages uploaded content for intelligent responses

✅ **Lead Intelligence**
- Automatic lead qualification (hot/warm/cold)
- Pain point extraction
- Buying signal detection
- Complete conversation history
- Contact information capture

✅ **Embed & Integration**
- Inline embedding on any website
- Popup modal trigger option
- Customizable styling (colors, width, button text)
- Simple embed code generation

✅ **Analytics Dashboard**
- View/completion rates
- Drop-off analysis
- Top questions asked
- Common objection patterns
- Performance metrics per form

✅ **User Panel** (`/user`)
- Forms management page
- Content upload functionality
- Embed code generator
- Form duplication and editing

✅ **Admin Panel** (`/admin`)
- Platform-wide analytics dashboard
- View all forms across users
- User management with role assignment
- Performance metrics and charts

## 🏗️ Tech Stack

### Frontend
- **Framework**: Next.js 14 (React)
- **Styling**: Tailwind CSS
- **Authentication**: Supabase Auth
- **State Management**: Zustand
- **Data Fetching**: TanStack Query (React Query)
- **Forms**: React Hook Form
- **Charts**: Chart.js + React-Chartjs-2
- **Language**: TypeScript

### Backend
- **Framework**: Flask (Python)
- **Database**: PostgreSQL (via Supabase)
- **ORM**: SQLAlchemy
- **AI**: OpenAI GPT-4 API
- **Document Parsing**: PyPDF2, python-docx
- **Authentication**: Supabase JWT validation

### Infrastructure
- **Hosting**: Vercel (Frontend) + Any Python host (Backend)
- **Database**: Supabase PostgreSQL
- **Storage**: Supabase Storage (for documents)
- **Auth**: Supabase Authentication

## 📦 Project Structure

```
.
├── app/                          # Next.js app directory
│   ├── dashboard/                # Admin dashboard
│   │   ├── forms/               # Form management
│   │   ├── leads/               # Lead management
│   │   └── analytics/           # Analytics views
│   ├── widget/                  # Embeddable widget
│   ├── globals.css              # Global styles
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Landing page
├── components/                   # React components
│   ├── forms/                   # Form builder components
│   ├── widget/                  # Chat widget
│   └── providers/               # Context providers
├── lib/                         # Utilities and helpers
│   ├── api.ts                   # API client
│   ├── templates.ts             # Form templates
│   └── utils.ts                 # Utility functions
├── public/                      # Static assets
│   └── embed.js                 # Embed script
├── backend/                     # Flask backend
│   ├── routes/                  # API routes
│   │   ├── forms.py            # Form CRUD
│   │   ├── leads.py            # Lead management
│   │   ├── chat.py             # AI chat
│   │   ├── analytics.py        # Analytics
│   │   └── documents.py        # Document upload
│   ├── services/               # Business logic
│   │   ├── ai_service.py      # OpenAI integration
│   │   └── document_parser.py # Document parsing
│   ├── models.py               # Database models
│   ├── app.py                  # Flask app
│   └── requirements.txt        # Python dependencies
├── package.json                 # Node dependencies
├── tsconfig.json               # TypeScript config
├── tailwind.config.ts          # Tailwind config
└── README.md                   # This file
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- Python 3.11+
- Supabase account (for database and authentication)
- OpenAI API key

### 1. Clone and Install Dependencies

```bash
# Clone the repository
git clone <your-repo-url>
cd ai-form-builder

# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
pip install -r requirements.txt
cd ..
```

### 2. Set Up Supabase

1. Create a new project on [Supabase](https://supabase.com)
2. Go to **Settings > API** and copy:
   - Project URL
   - `anon` public key
   - JWT Secret (from Settings > API > JWT Settings)
3. Go to **Settings > Database** and copy the connection string

### 3. Set Up Environment Variables

#### Frontend (.env.local)

```bash
# Create .env.local in root directory
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

#### Backend (backend/.env)

```bash
# Create .env in backend directory
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres
OPENAI_API_KEY=sk-xxxxx
SUPABASE_JWT_SECRET=your-jwt-secret
FLASK_ENV=development
SECRET_KEY=your-secret-key-here
FRONTEND_URL=http://localhost:3000
```

### 4. Set Up User Roles (Optional for Admin Panel)

To create admin users, you need to set the `role` in user metadata:

1. Go to Supabase Dashboard > Authentication > Users
2. Find your user and click to edit
3. In the **User Metadata** section, add:
   ```json
   {
     "role": "admin"
   }
   ```
4. Save changes

Regular users will have `role: "user"` by default.

### 5. Get OpenAI API Key

1. Create account at [OpenAI](https://platform.openai.com)
2. Generate an API key
3. Update `OPENAI_API_KEY` in `backend/.env`

### 6. Run the Application

**Terminal 1 - Backend:**

```bash
cd backend
python app.py
```

Backend runs on `http://localhost:5000`

**Terminal 2 - Frontend:**

```bash
npm run dev
```

Frontend runs on `http://localhost:3000`

### 7. Access the Application

1. Open `http://localhost:3000`
2. Sign up with your email and password (Supabase Auth)
3. Check your email for verification link
4. Sign in and start creating forms!

#### Panel Access

- **User Panel**: `http://localhost:3000/user` - Manage forms, upload content, get embed codes
- **Admin Panel**: `http://localhost:3000/admin` - View analytics, manage all forms and users (requires admin role)

## 📖 Usage Guide

### Creating a Form

1. **Navigate to Dashboard** - Sign in and go to `/dashboard`
2. **Click "Create Form"** - Choose a template or start from scratch
3. **Configure Form**:
   - Set title and description
   - Add form fields
   - Configure AI context
   - Customize embed settings
4. **Get Embed Code** - Copy the embed code for your website

### Embedding on Your Website

**Inline Embed:**

```html
<div id="ai-form-YOUR_FORM_ID"></div>
<script src="http://localhost:3000/embed.js"></script>
<script>
  AIFormBuilder.init({
    formId: 'YOUR_FORM_ID',
    containerId: 'ai-form-YOUR_FORM_ID'
  });
</script>
```

**Popup Embed:**

```html
<button id="ai-form-trigger-YOUR_FORM_ID">Open Form</button>
<script src="http://localhost:3000/embed.js"></script>
<script>
  AIFormBuilder.initPopup({
    formId: 'YOUR_FORM_ID',
    triggerId: 'ai-form-trigger-YOUR_FORM_ID'
  });
</script>
```

### Viewing Leads

1. Go to **Dashboard > Leads**
2. View lead details including:
   - Contact information
   - Qualification level
   - Pain points
   - Buying signals
   - Conversation history
3. Export to CSV for CRM import

### Analytics

1. Go to **Dashboard > Analytics**
2. View metrics:
   - Total views and completions
   - Completion rate
   - Drop-off rate
   - Top questions
   - Common objections

## 🎨 Customization

### Form Templates

Add custom templates in `lib/templates.ts`:

```typescript
{
  id: 'your-template',
  name: 'Your Template',
  description: 'Description',
  cta_type: 'Your CTA',
  fields: [...],
  context: 'AI instructions...'
}
```

### AI Behavior

Modify AI behavior in `backend/services/ai_service.py`:
- Adjust temperature for creativity
- Change max_tokens for response length
- Customize system prompts
- Add custom extraction logic

### Styling

Customize colors in `tailwind.config.ts`:

```typescript
theme: {
  extend: {
    colors: {
      primary: {
        // Your custom colors
      }
    }
  }
}
```

## 🚀 Production Deployment

### Frontend (Vercel)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy!

### Backend (Railway/Render/Heroku)

**Railway:**

```bash
railway login
railway init
railway add
railway up
```

**Render:**

1. Create new Web Service
2. Connect repository
3. Set build command: `pip install -r requirements.txt`
4. Set start command: `gunicorn -w 4 -b 0.0.0.0:$PORT app:app`
5. Add environment variables

### Database (Supabase)

Already production-ready! Just update `DATABASE_URL` with production credentials.

## 📊 Database Schema

### Forms Table
- Form configuration, fields, AI context, embed settings

### Leads Table
- Submitted data, contact info, qualification, insights

### Documents Table
- Uploaded files and parsed content

### Analytics Table
- Event tracking for performance metrics

### Chat Sessions Table
- Conversation history per user session

## 🔒 Security

- Clerk handles authentication and session management
- JWT tokens for API authentication
- SQL injection protection via SQLAlchemy ORM
- CORS configuration for API access
- File upload validation and sanitization

## 🛠️ API Documentation

See `backend/README.md` for detailed API documentation.

## 🎯 Roadmap (Post-V1)

- [ ] Multi-step conditional flows
- [ ] User role permissions (team features)
- [ ] Native CRM integrations (Salesforce, HubSpot)
- [ ] Form A/B testing
- [ ] Custom branding per form
- [ ] Email notifications
- [ ] Webhook support
- [ ] Calendar integration (Calendly)
- [ ] Multi-language support
- [ ] Advanced analytics (funnel visualization)

## 📝 License

MIT License - feel free to use this for your projects!

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 💬 Support

For issues and questions:
- Create an issue on GitHub
- Email: support@yourapp.com

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Authentication by [Supabase Auth](https://supabase.com/auth)
- AI powered by [OpenAI](https://openai.com)
- Database & Infrastructure by [Supabase](https://supabase.com)

---

**Happy Form Building! 🚀**

