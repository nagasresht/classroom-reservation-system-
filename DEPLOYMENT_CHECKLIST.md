 🚀 Deployment Checklist

## Pre-Deployment ✅

- [ ] MongoDB Atlas database created and accessible
- [ ] Gmail App Password generated
- [ ] Code pushed to GitHub repository
- [ ] All environment variables documented

---

## Backend Deployment (Render) 🔧

### Step 1: Create Service
- [ ] Go to [Render Dashboard](https://dashboard.render.com/)
- [ ] Create new Web Service
- [ ] Connect GitHub repository
- [ ] Select correct repository and branch

### Step 2: Configure
- [ ] Set Root Directory: `backend`
- [ ] Set Build Command: `npm install`
- [ ] Set Start Command: `npm start`
- [ ] Select Free plan

### Step 3: Environment Variables
Add these in Render Environment tab:
- [ ] `MONGO_URI` - MongoDB connection string
- [ ] `EMAIL_USER` - Gmail address
- [ ] `EMAIL_PASS` - Gmail App Password
- [ ] `PORT` - `5000`
- [ ] `NODE_ENV` - `production`
- [ ] `FRONTEND_URL` - (will update after frontend deployment)

### Step 4: Deploy & Verify
- [ ] Click "Create Web Service"
- [ ] Wait for deployment to complete
- [ ] Check logs for errors
- [ ] Copy backend URL: `https://______________.onrender.com`

---

## Frontend Deployment (Vercel) 🎨

### Step 1: Update Environment
- [ ] Update `frontend/.env`:
  ```
  VITE_API_BASE_URL=https://your-backend-url.onrender.com
  ```

### Step 2: Create Project
- [ ] Go to [Vercel Dashboard](https://vercel.com/dashboard)
- [ ] Click "Add New" → "Project"
- [ ] Import GitHub repository
- [ ] Select correct repository

### Step 3: Configure
- [ ] Set Framework Preset: Vite
- [ ] Set Root Directory: `frontend`
- [ ] Build Command: `npm run build`
- [ ] Output Directory: `dist`

### Step 4: Environment Variables
Add in Vercel Environment Variables:
- [ ] `VITE_API_BASE_URL` - Your Render backend URL

### Step 5: Deploy & Verify
- [ ] Click "Deploy"
- [ ] Wait for deployment to complete
- [ ] Copy frontend URL: `https://______________.vercel.app`

---

## Final Configuration 🔄

### Update Backend CORS
- [ ] Go to Render backend service
- [ ] Update `FRONTEND_URL` environment variable with Vercel URL
- [ ] Redeploy backend service

---

## Post-Deployment Testing 🧪

### Authentication Flow
- [ ] Visit your Vercel URL
- [ ] Test user registration
- [ ] Check email for OTP
- [ ] Verify OTP works
- [ ] Test login functionality
- [ ] Test logout

### Admin Features
- [ ] Login with admin account (@admin.com)
- [ ] Check admin dashboard
- [ ] Test booking approval/rejection
- [ ] Verify calendar management
- [ ] Test timetable editing

### Booking System
- [ ] Create a new booking
- [ ] Check notification system
- [ ] Verify booking appears in admin panel
- [ ] Test booking modifications
- [ ] Test booking deletion

### Password Reset
- [ ] Test "Forgot Password" flow
- [ ] Verify phone number validation
- [ ] Test password reset functionality

---

## Monitoring & Verification ✅

### Backend Health
- [ ] Check Render logs for errors
- [ ] Verify MongoDB connection
- [ ] Test API endpoints directly
- [ ] Check email sending works

### Frontend Health
- [ ] No console errors in browser
- [ ] All API calls working
- [ ] No CORS errors
- [ ] UI loads properly on mobile

### Database
- [ ] MongoDB Atlas shows connections
- [ ] Data is being saved correctly
- [ ] No connection timeouts

---

## Common Issues & Solutions 🔧

### CORS Errors
- [ ] Verify `FRONTEND_URL` in backend matches Vercel URL exactly
- [ ] No trailing slashes in URLs
- [ ] Redeploy backend after URL update

### Backend Sleeping (Free Tier)
- [ ] First request may take 30-60 seconds
- [ ] Consider upgrading for production use
- [ ] Or use a service to ping periodically

### Email Not Sending
- [ ] Verify Gmail App Password (16 chars, no spaces)
- [ ] Check 2FA is enabled on Gmail
- [ ] Verify EMAIL_USER and EMAIL_PASS are correct

### Database Connection Issues
- [ ] Check MongoDB Atlas Network Access (allow 0.0.0.0/0)
- [ ] Verify connection string format
- [ ] Check database user permissions

---

## Security Checklist 🔒

- [ ] `.env` files NOT committed to git
- [ ] MongoDB credentials secure
- [ ] Gmail App Password (not regular password)
- [ ] CORS properly configured
- [ ] Environment variables properly set

---

## Optional Enhancements 🌟

- [ ] Set up custom domain
- [ ] Configure SSL/TLS (automatic on Vercel/Render)
- [ ] Set up monitoring/alerts
- [ ] Configure automated backups
- [ ] Set up CI/CD pipeline

---

## 📝 Notes

**Backend URL**: _______________________________________________

**Frontend URL**: ______________________________________________

**MongoDB Database**: __________________________________________

**Deployment Date**: ___________________________________________

**Last Updated**: ______________________________________________

---

## 🎉 Success Criteria

Your deployment is successful when:
- ✅ Users can register and receive OTP emails
- ✅ Login/logout works correctly
- ✅ Bookings can be created and managed
- ✅ Admin panel functions properly
- ✅ No console errors or CORS issues
- ✅ Email notifications working
- ✅ Password reset functional

---

**Congratulations! Your Classroom Reservation System is live! 🚀**
