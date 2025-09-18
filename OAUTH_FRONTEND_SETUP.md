# Google OAuth Frontend Integration Guide

## ✅ What's Been Implemented

### 1. **API Configuration**
- Added Google OAuth endpoints to `API_ENDPOINTS` constants
- Updated auth service with Google OAuth methods

### 2. **Authentication Service** (`src/services/auth.service.ts`)
- `loginWithGoogle()`: Redirects to backend OAuth endpoint
- `handleOAuthSuccess()`: Processes OAuth callback token

### 3. **Auth Hook** (`src/hooks/useAuth.ts`)
- `loginWithGoogle()`: Wrapper for Google OAuth initiation
- `handleOAuthSuccess()`: Handles OAuth token processing and user state

### 4. **Utility Functions** (`src/lib/utils/url.ts`)
- `getUrlParam()`: Extract URL parameters
- `removeUrlParams()`: Clean up URL after processing
- `isRedirectedFrom()`: Check if page accessed via redirect

### 5. **Callback Pages**
- `/login-success`: Handles successful OAuth callback
- `/login-error`: Handles OAuth error scenarios

### 6. **Updated Login Page**
- Functional Google OAuth button
- Loading states and error handling

## 🚀 How It Works

### User Flow:
1. User clicks "Sign in with Google" on `/login`
2. Frontend redirects to `YOUR_API_URL/api/users/auth/google`
3. Backend redirects user to Google OAuth consent screen
4. User grants permissions to Google
5. Google redirects to backend callback: `YOUR_API_URL/api/users/auth/google/callback`
6. Backend processes OAuth, creates/finds user, and redirects to:
   - Success: `YOUR_FRONTEND_URL/login-success?token=JWT_TOKEN`
   - Error: `YOUR_FRONTEND_URL/login-error?message=ERROR_MESSAGE`
7. Frontend callback pages process the result
8. User is logged in and redirected to home page

## 🔧 Environment Variables Required

Add to your `.env.local`:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

## 🧪 Testing the Integration

### 1. Start Both Servers
```bash
# Backend (from jubili-api directory)
npm run dev

# Frontend (from jubili-web-public directory)  
npm run dev
```

### 2. Test the Flow
1. Visit: `http://localhost:3000/login`
2. Click "Sign in with Google"
3. Complete Google OAuth consent
4. Verify you're redirected and logged in

### 3. Check Integration Points
- Google button on login page should be functional
- OAuth success/error pages should handle redirects properly
- User should be logged in after successful OAuth
- JWT token should be stored in localStorage
- User info should persist across page refreshes

## 🔧 Troubleshooting

### Common Issues:

1. **"API URL not found" Error**
   - Check `NEXT_PUBLIC_API_BASE_URL` in `.env.local`
   - Ensure backend is running on correct port

2. **Infinite Redirect Loop**
   - Verify Google Console redirect URIs match exactly
   - Check backend `GOOGLE_REDIRECT_URI` environment variable

3. **Authentication Failed**
   - Ensure backend Google OAuth credentials are correct
   - Check browser console for detailed error messages
   - Verify CORS settings allow your frontend domain

4. **Token Not Found**
   - Check if backend is properly redirecting to frontend callback
   - Verify frontend URL parameter extraction

## 📝 Code Structure

```
src/
├── app/
│   ├── login/page.tsx              # Login page with Google OAuth button
│   ├── login-success/page.tsx      # OAuth success callback
│   └── login-error/page.tsx        # OAuth error callback
├── services/
│   └── auth.service.ts             # Google OAuth methods
├── hooks/
│   └── useAuth.ts                  # OAuth hooks
├── lib/
│   ├── constants/api.ts            # API endpoints
│   └── utils/url.ts                # URL utilities
```

## 🎨 UI Components

The Google OAuth button is styled to match your existing design:
- Uses the same border and hover states as other social buttons
- Shows loading state during redirect
- Includes Google logo from CDN

## 🔐 Security Notes

- JWT tokens are stored in localStorage (consider httpOnly cookies for production)
- OAuth state parameter could be added for additional security
- Consider adding CSRF protection for production environments
- All redirects go through your backend for security validation

## 🚀 Production Deployment

When deploying to production:

1. Update Google Console OAuth settings:
   - Add production redirect URI: `https://yourdomain.com/api/users/auth/google/callback`
   
2. Update environment variables:
   ```env
   # Backend .env
   GOOGLE_REDIRECT_URI=https://yourdomain.com/api/users/auth/google/callback
   FRONTEND_URL=https://yourfrontend.com
   
   # Frontend .env.local
   NEXT_PUBLIC_API_BASE_URL=https://yourdomain.com
   ```

3. Ensure HTTPS is enabled for both frontend and backend

## ✨ Success!

Your Google OAuth integration is now complete and ready for testing! Users can seamlessly sign in with their Google accounts and be automatically logged into your Jubili platform.
