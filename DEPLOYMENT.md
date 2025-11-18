# Deployment Guide

This guide walks you through deploying the AI Form Builder to production.

## Overview

- **Frontend**: Deploy to Vercel
- **Backend**: Deploy to Railway, Render, or Heroku
- **Database**: Use Supabase (PostgreSQL)
- **Storage**: Supabase Storage for document uploads

## Prerequisites

1. GitHub repository with your code
2. Vercel account
3. Railway/Render/Heroku account
4. Supabase account
5. Clerk account (for auth)
6. OpenAI API key

## Step 1: Set Up Supabase

1. **Create Project**
   - Go to [Supabase](https://supabase.com)
   - Create new project
   - Wait for database to initialize

2. **Get Connection String**
   - Go to Settings > Database
   - Copy the connection string (URI format)
   - Replace `[YOUR-PASSWORD]` with your database password

3. **Enable Storage (Optional)**
   - Go to Storage
   - Create a new bucket called `documents`
   - Set appropriate permissions

## Step 2: Set Up Clerk

1. **Create Application**
   - Go to [Clerk Dashboard](https://dashboard.clerk.com)
   - Create new application
   - Choose authentication methods

2. **Get API Keys**
   - Go to API Keys
   - Copy:
     - Publishable Key (starts with `pk_`)
     - Secret Key (starts with `sk_`)

3. **Configure URLs**
   - Set application URLs to match your domains
   - Frontend: `https://your-app.vercel.app`
   - Backend: `https://your-api.railway.app`

## Step 3: Deploy Backend

### Option A: Railway

1. **Install Railway CLI**
```bash
npm install -g @railway/cli
```

2. **Login and Initialize**
```bash
railway login
cd backend
railway init
```

3. **Add Environment Variables**

Go to Railway dashboard and add:

```
DATABASE_URL=postgresql://...
OPENAI_API_KEY=sk-...
CLERK_SECRET_KEY=sk_...
SECRET_KEY=your-generated-secret
FLASK_ENV=production
FRONTEND_URL=https://your-app.vercel.app
```

Generate SECRET_KEY:
```bash
python -c "import secrets; print(secrets.token_hex(32))"
```

4. **Deploy**
```bash
railway up
```

5. **Note Your Backend URL**
   - Railway will provide a URL like `https://your-app.railway.app`
   - You'll need this for frontend configuration

### Option B: Render

1. **Create Web Service**
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click "New +" > "Web Service"
   - Connect your GitHub repository

2. **Configure Service**
   - Name: `ai-form-builder-api`
   - Root Directory: `backend`
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `gunicorn -w 4 -b 0.0.0.0:$PORT app:app`

3. **Add Environment Variables**
   - Same as Railway (above)

4. **Deploy**
   - Click "Create Web Service"

### Option C: Heroku

1. **Install Heroku CLI**
```bash
npm install -g heroku
```

2. **Create App**
```bash
cd backend
heroku create ai-form-builder-api
```

3. **Add PostgreSQL**
```bash
heroku addons:create heroku-postgresql:mini
```

4. **Set Environment Variables**
```bash
heroku config:set OPENAI_API_KEY=sk-...
heroku config:set CLERK_SECRET_KEY=sk_...
heroku config:set SECRET_KEY=your-generated-secret
heroku config:set FLASK_ENV=production
heroku config:set FRONTEND_URL=https://your-app.vercel.app
```

5. **Create Procfile**

Create `backend/Procfile`:
```
web: gunicorn app:app
```

6. **Deploy**
```bash
git push heroku main
```

## Step 4: Deploy Frontend (Vercel)

1. **Push to GitHub**
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

2. **Import to Vercel**
   - Go to [Vercel Dashboard](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository

3. **Configure Build Settings**
   - Framework Preset: Next.js
   - Root Directory: `./`
   - Build Command: `npm run build`
   - Output Directory: `.next`

4. **Add Environment Variables**

Add these in Vercel dashboard:

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
CLERK_SECRET_KEY=sk_live_...
NEXT_PUBLIC_API_URL=https://your-backend.railway.app
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

5. **Deploy**
   - Click "Deploy"
   - Wait for build to complete

6. **Configure Domain (Optional)**
   - Go to Settings > Domains
   - Add your custom domain
   - Update DNS records

## Step 5: Update CORS Settings

Update `backend/app.py` to allow your production frontend:

```python
CORS(app, origins=[
    os.getenv('FRONTEND_URL'),
    'https://your-app.vercel.app'
])
```

Redeploy backend after this change.

## Step 6: Initialize Database

The database tables will be created automatically on first run. To manually initialize:

1. **Railway**: Use Railway CLI
```bash
railway run python -c "from app import db; db.create_all()"
```

2. **Render/Heroku**: Use their respective CLI tools

## Step 7: Test Production Deployment

1. **Visit Your Site**
   - Go to `https://your-app.vercel.app`
   - Sign up/sign in with Clerk

2. **Test Form Creation**
   - Create a test form
   - Generate embed code
   - Test the AI chat

3. **Test Embed**
   - Copy embed code
   - Test on a test website
   - Verify chat works

## Environment Variables Summary

### Frontend (.env.local / Vercel)
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_xxxxx
CLERK_SECRET_KEY=sk_live_xxxxx
NEXT_PUBLIC_API_URL=https://your-backend.railway.app
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

### Backend (Railway/Render/Heroku)
```
DATABASE_URL=postgresql://user:pass@host:5432/db
OPENAI_API_KEY=sk-xxxxx
CLERK_SECRET_KEY=sk_live_xxxxx
SECRET_KEY=your-secret-key
FLASK_ENV=production
FRONTEND_URL=https://your-app.vercel.app
```

## Post-Deployment Checklist

- [ ] Frontend loads correctly
- [ ] Backend API responds to health check
- [ ] Authentication works (Clerk)
- [ ] Can create and edit forms
- [ ] AI chat responds correctly
- [ ] Document upload works
- [ ] Leads are saved
- [ ] Analytics display correctly
- [ ] CSV export works
- [ ] Embed code generates correctly
- [ ] Embedded widget works on external site

## Monitoring & Maintenance

### Backend Monitoring
- **Railway**: Built-in logs and metrics
- **Render**: Logging and monitoring dashboard
- **Heroku**: Use `heroku logs --tail`

### Frontend Monitoring
- Vercel provides automatic monitoring
- Check Analytics tab in Vercel dashboard

### Database Backups
- Supabase automatically backs up your database
- Configure backup schedule in Supabase dashboard

### Cost Optimization

**Free Tier Limits:**
- Vercel: Free for hobby projects
- Railway: $5/month credit (free trial)
- Render: Free tier available with limitations
- Supabase: Free tier with 500MB database
- OpenAI: Pay-per-use (monitor usage)

**Tips:**
- Use GPT-3.5-turbo instead of GPT-4 for lower costs
- Set up usage alerts in OpenAI dashboard
- Monitor Supabase database size
- Use CDN for static assets

## Troubleshooting

### CORS Errors
- Verify FRONTEND_URL is set correctly in backend
- Check Vercel URL matches CORS settings

### Database Connection Issues
- Verify DATABASE_URL format
- Check Supabase connection pooler settings
- Ensure database isn't paused (Supabase)

### Authentication Errors
- Verify Clerk keys are correct (live vs test)
- Check Clerk application URLs
- Ensure JWT middleware is working

### AI Not Responding
- Verify OPENAI_API_KEY is set
- Check OpenAI account has credits
- Review backend logs for errors

### File Upload Failures
- Check upload directory permissions
- Verify file size limits
- Check allowed file types

## Scaling Considerations

### When to Scale

**Backend:**
- Increase workers when response time > 1s
- Add more RAM if memory usage > 80%
- Scale horizontally for > 1000 concurrent users

**Database:**
- Upgrade Supabase plan when > 500MB
- Add read replicas for heavy read workloads
- Consider connection pooling (PgBouncer)

**Frontend:**
- Vercel auto-scales (no action needed)
- Consider CDN for global users

## Security Best Practices

1. **API Keys**
   - Never commit API keys to Git
   - Rotate keys regularly
   - Use different keys for dev/prod

2. **Database**
   - Use SSL connections (Supabase default)
   - Regular backups
   - Monitor for suspicious queries

3. **Authentication**
   - Enable MFA in Clerk
   - Review session settings
   - Monitor authentication logs

4. **Rate Limiting**
   - Implement on backend routes
   - Use Vercel Edge Middleware
   - Monitor for abuse

## Support

If you encounter issues:
1. Check logs in your hosting platform
2. Review error messages carefully
3. Consult service documentation
4. Reach out to support channels

---

**Congratulations! Your AI Form Builder is now live! 🎉**

