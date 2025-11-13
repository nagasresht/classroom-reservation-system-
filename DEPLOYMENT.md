# Deployment Guide

## Backend Deployment (Render)

### Prerequisites
- MongoDB Atlas account with a database created
- Gmail account with App Password generated

### Steps to Deploy on Render

1. **Push your code to GitHub** (if not already done)

2. **Create a New Web Service on Render**
   - Go to [Render Dashboard](https://dashboard.render.com/)
   - Click "New +" and select "Web Service"
   - Connect your GitHub repository
   - Select the repository containing your project

3. **Configure the Service**
   - **Name**: Choose a name (e.g., `classroom-booking-backend`)
   - **Region**: Select closest to you
   - **Branch**: `main` (or your default branch)
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

4. **Add Environment Variables**
   Go to the "Environment" tab and add:
   ```
   MONGO_URI=mongodb+srv://vnagasresht_db_user:nagasresht@cluster0.ommwsxc.mongodb.net/classroom?retryWrites=true&w=majority
   EMAIL_USER=stakenaga123@gmail.com
   EMAIL_PASS=iuzl ezxp wvog yenh
   PORT=5000
   NODE_ENV=production
   FRONTEND_URL=https://your-vercel-app.vercel.app
   ```

5. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment to complete
   - Copy your Render backend URL (e.g., `https://classroom-booking-backend.onrender.com`)

6. **Update FRONTEND_URL**
   - After deploying frontend, come back and update the `FRONTEND_URL` environment variable

---

## Frontend Deployment (Vercel)

### Prerequisites
- Backend deployed on Render with URL available

### Steps to Deploy on Vercel

1. **Update Frontend Environment Variable**
   - Open `frontend/.env`
   - Replace `VITE_API_BASE_URL` with your Render backend URL:
     ```
     VITE_API_BASE_URL=https://your-backend-app.onrender.com
     ```

2. **Deploy to Vercel**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "Add New..." and select "Project"
   - Import your GitHub repository
   - Configure the project:
     - **Framework Preset**: Vite
     - **Root Directory**: `frontend`
     - **Build Command**: `npm run build`
     - **Output Directory**: `dist`

3. **Add Environment Variables**
   - In the project settings, go to "Environment Variables"
   - Add:
     ```
     VITE_API_BASE_URL=https://your-backend-app.onrender.com
     ```

4. **Deploy**
   - Click "Deploy"
   - Wait for deployment to complete
   - Copy your Vercel URL (e.g., `https://classroom-booking.vercel.app`)

5. **Update Backend CORS**
   - Go back to Render dashboard
   - Update the `FRONTEND_URL` environment variable with your Vercel URL
   - Redeploy the backend service

---

## Important Notes

### For Backend (Render):
- Free tier may sleep after inactivity - first request might be slow
- Ensure MongoDB Atlas allows connections from anywhere (0.0.0.0/0) in Network Access
- Email functionality requires Gmail App Password (not regular password)

### For Frontend (Vercel):
- Automatic deployments on git push
- Environment variables are baked into the build
- Any change to env vars requires redeployment

### Security Reminders:
- Never commit `.env` files to version control
- Keep `.env.example` for reference only
- Use strong passwords for production databases
- Regularly rotate API keys and passwords

---

## Testing After Deployment

1. Visit your Vercel URL
2. Try registering a new user
3. Check email for OTP
4. Test login functionality
5. Verify booking features work correctly

---

## Troubleshooting

### Backend Issues:
- Check Render logs for errors
- Verify all environment variables are set
- Test MongoDB connection string
- Ensure email credentials are correct

### Frontend Issues:
- Check browser console for errors
- Verify `VITE_API_BASE_URL` points to correct backend
- Clear browser cache and rebuild
- Check CORS settings in backend

### CORS Errors:
- Ensure `FRONTEND_URL` in backend matches your Vercel URL exactly
- No trailing slashes in URLs
- Redeploy backend after updating `FRONTEND_URL`
