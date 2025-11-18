# Quick Setup Instructions

## Overview

This application now uses **Supabase Authentication** with separate **User** and **Admin** panels.

## Architecture

```
┌─────────────────────────────────────────────────┐
│              Landing Page (/)                    │
│                                                  │
│  ┌──────────────┐      ┌──────────────┐        │
│  │  Sign In     │      │  Sign Up     │        │
│  └──────────────┘      └──────────────┘        │
└─────────────┬───────────────────────────────────┘
              │
              ├─────────────┬─────────────┐
              │             │             │
              ▼             ▼             ▼
         ┌────────┐   ┌─────────┐   ┌────────┐
         │  User  │   │  Admin  │   │ Widget │
         │ Panel  │   │  Panel  │   │ (Public)│
         └────────┘   └─────────┘   └────────┘
         /user/*      /admin/*       /widget/:id
```

## User Panel (`/user`)

**Available to all authenticated users**

- **Forms Management** (`/user/forms`)
  - Create, edit, duplicate, delete forms
  - View form details and statistics
  
- **Content Upload** (`/user/content`)
  - Upload PDF, DOCX, TXT files
  - Files used for AI context in conversations
  
- **Embed Code** (`/user/embed`)
  - Generate inline or popup embed codes
  - Copy-paste ready for any website

## Admin Panel (`/admin`)

**Requires admin role in user metadata**

- **Analytics Dashboard** (`/admin/analytics`)
  - Platform-wide statistics
  - Performance metrics
  - Charts and visualizations
  
- **All Forms** (`/admin/forms`)
  - View all forms across platform
  - Monitor user activity
  
- **User Management** (`/admin/users`)
  - View all users
  - Assign admin roles

## Installation

### 1. Install Dependencies

```bash
npm install
cd backend && pip install -r requirements.txt
```

### 2. Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Wait for project to be ready (~2 minutes)

### 3. Set Up Environment Variables

**Frontend** - Create `.env.local` in root:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Backend** - Create `.env` in backend folder:

```bash
DATABASE_URL=postgresql://postgres:password@db.xxxxx.supabase.co:5432/postgres
OPENAI_API_KEY=sk-xxxxx
SUPABASE_JWT_SECRET=your-jwt-secret
FLASK_ENV=development
SECRET_KEY=your-random-secret
FRONTEND_URL=http://localhost:3000
```

### 4. Run the Application

**Terminal 1 - Backend:**
```bash
cd backend
python app.py
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

### 5. Access the Application

1. Open http://localhost:3000
2. Click "Get Started" to sign up
3. Check your email for verification link
4. Sign in and you'll be redirected to `/user/forms`

## Making an Admin User

1. Sign up for an account normally
2. Go to Supabase Dashboard → Authentication → Users
3. Click on your user
4. Scroll to "User Metadata" section
5. Add this JSON:
   ```json
   {
     "role": "admin"
   }
   ```
6. Save changes
7. Sign out and sign back in
8. You'll now be redirected to `/admin/analytics`

## Key Features

### Role-Based Access
- ✅ Automatic routing based on user role
- ✅ Admin users can access both `/user` and `/admin`
- ✅ Regular users only access `/user`
- ✅ Middleware protection on all protected routes

### Authentication
- ✅ Email/password authentication via Supabase
- ✅ Email verification required
- ✅ Secure JWT tokens
- ✅ Automatic session management

### User Panel Features
- ✅ Full form CRUD operations
- ✅ Document upload for AI context
- ✅ Embed code generator with preview
- ✅ Form duplication
- ✅ Form statistics

### Admin Panel Features
- ✅ Platform-wide analytics dashboard
- ✅ View all forms across users
- ✅ User management interface
- ✅ Performance metrics and charts
- ✅ Role assignment capability

## API Authentication

All API calls automatically include the Supabase JWT token in the Authorization header:

```typescript
// Automatic in lib/api.ts
api.interceptors.request.use(async (config) => {
  const supabase = createClient()
  const { data: { session } } = await supabase.auth.getSession()
  
  if (session?.access_token) {
    config.headers.Authorization = `Bearer ${session.access_token}`
  }
  return config
})
```

## Troubleshooting

### "No authorization token provided"
- Make sure you're signed in
- Check that Supabase credentials are correct
- Clear browser cache and cookies

### Cannot access admin panel
- Verify user metadata has `"role": "admin"`
- Sign out and sign back in
- Check browser console for errors

### Email not sending
- In development, check Supabase Dashboard → Authentication → Logs
- For production, configure email settings in Supabase

### Backend connection errors
- Ensure backend is running on port 5000
- Check DATABASE_URL is correct
- Verify SUPABASE_JWT_SECRET matches your project

## Next Steps

1. ✅ Create your first form in `/user/forms`
2. ✅ Upload context documents in `/user/content`
3. ✅ Get embed code in `/user/embed`
4. ✅ Test the form on your website
5. ✅ Check analytics in admin panel (if admin)

## Documentation

- `README.md` - Complete project documentation
- `ENV_SETUP.md` - Detailed environment variable guide
- `MIGRATION_GUIDE.md` - Migration from Clerk to Supabase
- `SETUP_INSTRUCTIONS.md` - This file

## Support

For issues or questions:
- Check the documentation files
- Review Supabase logs
- Inspect browser console
- Check backend terminal output

---

**Ready to build amazing forms! 🚀**

