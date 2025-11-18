# Deployment Checklist

Use this checklist to ensure everything is set up correctly before deployment.

## Pre-Deployment Checklist

### 1. Supabase Setup ✅
- [ ] Supabase project created
- [ ] Email authentication enabled
- [ ] Database connection string copied
- [ ] Project URL and anon key saved
- [ ] JWT secret copied
- [ ] Email templates configured (optional)
- [ ] Custom domain configured (optional)

### 2. Environment Variables ✅

#### Frontend (.env.local)
- [ ] `NEXT_PUBLIC_SUPABASE_URL` set
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` set
- [ ] `NEXT_PUBLIC_API_URL` set
- [ ] `NEXT_PUBLIC_APP_URL` set

#### Backend (.env)
- [ ] `DATABASE_URL` set
- [ ] `OPENAI_API_KEY` set
- [ ] `SUPABASE_JWT_SECRET` set
- [ ] `SECRET_KEY` set (use secure random string)
- [ ] `FRONTEND_URL` set
- [ ] `FLASK_ENV` set to 'production' for production

### 3. Dependencies ✅
- [ ] Frontend dependencies installed (`npm install`)
- [ ] Backend dependencies installed (`pip install -r requirements.txt`)
- [ ] No version conflicts
- [ ] All peer dependencies resolved

### 4. Local Testing ✅
- [ ] Backend starts without errors
- [ ] Frontend starts without errors
- [ ] Sign up flow works
- [ ] Email verification works
- [ ] Sign in flow works
- [ ] User panel accessible
- [ ] Forms can be created
- [ ] Content can be uploaded
- [ ] Embed codes generate correctly
- [ ] Admin role can be assigned
- [ ] Admin panel accessible with admin role
- [ ] Regular users cannot access admin panel
- [ ] Analytics display correctly

### 5. Security ✅
- [ ] `.env` and `.env.local` in `.gitignore`
- [ ] No secrets in code
- [ ] JWT secret is strong
- [ ] Database password is strong
- [ ] CORS configured correctly in backend
- [ ] Rate limiting configured (optional)
- [ ] SQL injection protection (using SQLAlchemy)

## Production Deployment

### Frontend (Vercel)

#### Step 1: Prepare Repository
- [ ] Code pushed to GitHub/GitLab/Bitbucket
- [ ] `.gitignore` includes `.env.local`
- [ ] No build errors locally

#### Step 2: Vercel Setup
- [ ] Import project in Vercel
- [ ] Select framework: Next.js
- [ ] Configure build settings (default should work)
- [ ] Add environment variables:
  ```
  NEXT_PUBLIC_SUPABASE_URL
  NEXT_PUBLIC_SUPABASE_ANON_KEY
  NEXT_PUBLIC_API_URL (your backend URL)
  NEXT_PUBLIC_APP_URL (your vercel domain)
  ```
- [ ] Deploy
- [ ] Custom domain configured (optional)

#### Step 3: Verify Deployment
- [ ] Site loads correctly
- [ ] Authentication works
- [ ] API calls reach backend
- [ ] No console errors

### Backend (Railway/Render/Heroku)

#### Option A: Railway

**Step 1: Setup**
- [ ] Install Railway CLI: `npm i -g @railway/cli`
- [ ] Login: `railway login`
- [ ] Initialize: `railway init`

**Step 2: Configure**
- [ ] Add Python buildpack
- [ ] Set start command: `gunicorn -w 4 -b 0.0.0.0:$PORT app:app`
- [ ] Add environment variables
- [ ] Add `gunicorn` to requirements.txt

**Step 3: Deploy**
- [ ] Run: `railway up`
- [ ] Get deployment URL
- [ ] Update frontend `NEXT_PUBLIC_API_URL`

#### Option B: Render

**Step 1: Create Web Service**
- [ ] Connect GitHub repository
- [ ] Select Python environment
- [ ] Set build command: `pip install -r requirements.txt`
- [ ] Set start command: `gunicorn -w 4 -b 0.0.0.0:$PORT app:app`

**Step 2: Configure**
- [ ] Add environment variables
- [ ] Set port to 5000 or $PORT
- [ ] Choose instance type

**Step 3: Deploy**
- [ ] Click "Create Web Service"
- [ ] Wait for deployment
- [ ] Get service URL
- [ ] Update frontend `NEXT_PUBLIC_API_URL`

#### Option C: Heroku

**Step 1: Prepare**
- [ ] Create `Procfile` in backend/:
  ```
  web: gunicorn app:app
  ```
- [ ] Ensure `gunicorn` in requirements.txt

**Step 2: Deploy**
- [ ] Install Heroku CLI
- [ ] Login: `heroku login`
- [ ] Create app: `heroku create your-app-name`
- [ ] Add environment variables: `heroku config:set VAR=value`
- [ ] Push to Heroku: `git push heroku main`

**Step 3: Verify**
- [ ] Check logs: `heroku logs --tail`
- [ ] Test API endpoints
- [ ] Verify database connection

### Database (Supabase)

#### Production Configuration
- [ ] Enable Row Level Security (RLS) if needed
- [ ] Set up database backups
- [ ] Configure connection pooling
- [ ] Review and optimize indexes
- [ ] Set up monitoring and alerts
- [ ] Configure database size limits
- [ ] Review retention policies

## Post-Deployment

### Testing
- [ ] Sign up with new account on production
- [ ] Verify email works
- [ ] Sign in works
- [ ] Create a form
- [ ] Upload content
- [ ] Generate embed code
- [ ] Test embed on external site
- [ ] Assign admin role
- [ ] Test admin panel access
- [ ] Test analytics display
- [ ] Test user management

### Monitoring
- [ ] Set up error tracking (Sentry, etc.)
- [ ] Configure logging
- [ ] Set up uptime monitoring
- [ ] Monitor API response times
- [ ] Check database performance
- [ ] Review Supabase logs

### Documentation
- [ ] Update README with production URLs
- [ ] Document admin procedures
- [ ] Create backup/restore guide
- [ ] Document troubleshooting steps

### Security Audit
- [ ] Review CORS settings
- [ ] Check JWT token expiration
- [ ] Test rate limiting
- [ ] Verify role-based access
- [ ] Check for exposed secrets
- [ ] Test authentication edge cases
- [ ] Review Supabase security rules

## Admin Setup

### Creating First Admin User

1. **Sign up normally on production**
2. **Go to Supabase Dashboard**
   - Select your project
   - Go to Authentication → Users
   - Find your user
   - Click to edit
3. **Set user metadata:**
   ```json
   {
     "role": "admin"
   }
   ```
4. **Save and test**
   - Sign out
   - Sign in again
   - Should redirect to /admin/analytics

### Additional Admins
- [ ] Document admin user creation process
- [ ] Create process for admin approval
- [ ] Set up admin notification system (optional)

## Maintenance

### Regular Tasks
- [ ] Monitor error logs weekly
- [ ] Review analytics monthly
- [ ] Update dependencies quarterly
- [ ] Rotate JWT secrets annually
- [ ] Review and revoke unused API keys
- [ ] Backup database regularly
- [ ] Test disaster recovery plan

### Updates
- [ ] Set up dependabot for security updates
- [ ] Test updates in staging first
- [ ] Document update procedure
- [ ] Keep changelog updated

## Rollback Plan

### If Issues Arise
1. **Identify the issue**
   - Check logs
   - Review recent changes
   - Test specific features

2. **Quick fixes**
   - Revert last commit if needed
   - Restore environment variables
   - Clear caches

3. **Full rollback**
   - Revert to previous Vercel deployment
   - Revert to previous backend deployment
   - Restore database backup if needed

4. **Communication**
   - Notify users of downtime
   - Document what went wrong
   - Plan fixes

## Support Contacts

### Services
- **Supabase Support**: https://supabase.com/support
- **Vercel Support**: https://vercel.com/support
- **OpenAI Support**: https://help.openai.com

### Documentation
- Project README
- Supabase Docs: https://supabase.com/docs
- Next.js Docs: https://nextjs.org/docs

---

## Quick Command Reference

```bash
# Local Development
npm run dev                    # Start frontend
cd backend && python app.py    # Start backend

# Production
vercel --prod                  # Deploy to Vercel
railway up                     # Deploy to Railway
heroku logs --tail            # View Heroku logs

# Database
psql $DATABASE_URL            # Connect to database
supabase db reset             # Reset local database

# Monitoring
curl https://your-api.com/api/health  # Check backend health
```

---

**Deployment checklist complete!** ✅

Review each section carefully before deploying to production.

