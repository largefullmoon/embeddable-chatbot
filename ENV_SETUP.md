# Environment Variables Setup Guide

This guide provides templates for setting up your environment variables for both frontend and backend.

## Frontend Environment Variables

Create a `.env.local` file in the root directory with the following content:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Where to find these values:

1. **NEXT_PUBLIC_SUPABASE_URL**: Supabase Dashboard → Settings → API → Project URL
2. **NEXT_PUBLIC_SUPABASE_ANON_KEY**: Supabase Dashboard → Settings → API → Project API keys → `anon` `public`
3. **NEXT_PUBLIC_API_URL**: Your backend API URL (default: http://localhost:5000 for local development)
4. **NEXT_PUBLIC_APP_URL**: Your frontend URL (default: http://localhost:3000 for local development)

## Backend Environment Variables

Create a `.env` file in the `backend/` directory with the following content:

```bash
# Database Configuration
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres

# OpenAI Configuration
OPENAI_API_KEY=sk-xxxxx

# Supabase JWT Secret (from Supabase Dashboard > Settings > API > JWT Settings)
SUPABASE_JWT_SECRET=your-jwt-secret-here

# Flask Configuration
FLASK_ENV=development
SECRET_KEY=your-secret-key-here

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

### Where to find these values:

1. **DATABASE_URL**: Supabase Dashboard → Settings → Database → Connection string → URI
2. **OPENAI_API_KEY**: OpenAI Platform → API Keys → Create new secret key
3. **SUPABASE_JWT_SECRET**: Supabase Dashboard → Settings → API → JWT Settings → JWT Secret
4. **SECRET_KEY**: Generate a random string (e.g., using `openssl rand -hex 32`)
5. **FRONTEND_URL**: Your frontend URL (default: http://localhost:3000)

## Production Deployment

For production deployment:

### Frontend (Vercel)
Add all environment variables in your Vercel project settings under "Environment Variables"

### Backend (Railway/Render/Heroku)
Add all backend environment variables in your hosting platform's environment configuration

## Security Notes

⚠️ **Important:**
- Never commit `.env` or `.env.local` files to version control
- Keep your JWT secrets and API keys secure
- Use different values for development and production environments
- Rotate keys regularly in production

