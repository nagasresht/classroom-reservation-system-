# 🚀 Deployment Guide

## Prerequisites
- GitHub account
- Vercel account (for frontend)
- Render account (for backend)
- MongoDB Atlas account (already set up)

---

## 📦 Backend Deployment (Render)

### Step 1: Prepare Backend
1. Ensure your code is pushed to GitHub
2. Make sure `.env` is in `.gitignore` (it should be)

### Step 2: Deploy to Render
1. Go to https://render.com
2. Click "New" → "Web Service"
3. Connect your GitHub repository
4. Select the `backend` directory (or root if backend is at root)
5. Configure:
   - **Name**: `classroom-booking-backend` (or your choice)
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node index.js`
   - **Instance Type**: Free

### Step 3: Set Environment Variables in Render
Go to "Environment" tab and add:

```
MONGO_URI=mongodb+srv://vnagasresht_db_user:nagasresht@cluster0.ommwsxc.mongodb.net/classroom?retryWrites=true&w=majority
PORT=5000
NODE_ENV=production
FRONTEND_URL=https://your-vercel-app.vercel.app
EMAIL_USER=stakenaga123@gmail.com
EMAIL_PASS=iuzl ezxp wvog yenh
```

**Important:** Update `FRONTEND_URL` after deploying frontend!

### Step 4: Deploy
- Click "Create Web Service"
- Wait for deployment to complete
- Copy your Render URL (e.g., `https://classroom-booking-backend.onrender.com`)

---

## 🌐 Frontend Deployment (Vercel)

### Step 1: Prepare Frontend
1. Ensure your code is pushed to GitHub

### Step 2: Deploy to Vercel
1. Go to https://vercel.com
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend` (if frontend is in subdirectory)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### Step 3: Set Environment Variables in Vercel
Go to "Settings" → "Environment Variables" and add:

```
VITE_API_BASE_URL=https://your-render-backend.onrender.com
```

**Important:** Replace with your actual Render backend URL!

### Step 4: Deploy
- Click "Deploy"
- Wait for deployment to complete
- Copy your Vercel URL (e.g., `https://classroom-booking.vercel.app`)

---

## 🔄 Update CORS (Important!)

### After Both Deployments:
1. Go back to Render dashboard
2. Update `FRONTEND_URL` environment variable with your actual Vercel URL
3. Save and redeploy backend

---

## ✅ Environment Variables Summary

### Backend (Render):
```env
MONGO_URI=<your-mongodb-connection-string>
PORT=5000
NODE_ENV=production
FRONTEND_URL=<your-vercel-url>
EMAIL_USER=<your-gmail>
EMAIL_PASS=<your-app-password>
```

### Frontend (Vercel):
```env
VITE_API_BASE_URL=<your-render-backend-url>
```

---

## 🧪 Testing After Deployment

1. Open your Vercel URL
2. Try to login
3. Create a booking
4. Check admin panel
5. Test email notifications

---

## 🐛 Troubleshooting

### CORS Errors
- Make sure `FRONTEND_URL` in Render matches your Vercel URL exactly
- Ensure backend is redeployed after updating FRONTEND_URL

### API Connection Failed
- Verify `VITE_API_BASE_URL` in Vercel is correct
- Check Render logs for backend errors

### Email Not Sending
- Verify `EMAIL_USER` and `EMAIL_PASS` are correct
- Make sure you're using Google App Password, not regular password

### Free Tier Limitations
- Render free tier: Backend sleeps after 15 min of inactivity (takes ~30s to wake up)
- Vercel free tier: Excellent for frontend, no sleep

---

## 📝 Post-Deployment Checklist

- [ ] Backend deployed to Render
- [ ] Frontend deployed to Vercel
- [ ] Environment variables set correctly
- [ ] CORS configured properly
- [ ] Login works
- [ ] Booking creation works
- [ ] Admin panel accessible
- [ ] Email notifications working
- [ ] Custom domain configured (optional)

---

## 🔗 Useful Links

- **Render Dashboard**: https://dashboard.render.com
- **Vercel Dashboard**: https://vercel.com/dashboard
- **MongoDB Atlas**: https://cloud.mongodb.com

---

## 💡 Tips

1. **Custom Domain**: You can add custom domains in both Vercel and Render settings
2. **Logs**: Check Render logs if backend has issues
3. **Automatic Deploys**: Both platforms auto-deploy when you push to GitHub
4. **Environment**: Keep development `.env` file safe and separate from production

---

## 🆘 Need Help?

If you encounter issues:
1. Check Render logs (Render Dashboard → Your Service → Logs)
2. Check Vercel deployment logs
3. Verify all environment variables are set correctly
4. Test backend API directly using Postman or curl
