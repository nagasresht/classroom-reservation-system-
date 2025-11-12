# 🚀 Quick Deployment Reference Card

## 📋 Environment Variables to Set

### 🔧 Render (Backend)
```
MONGO_URI=mongodb+srv://vnagasresht_db_user:nagasresht@cluster0.ommwsxc.mongodb.net/classroom?retryWrites=true&w=majority
PORT=5000
NODE_ENV=production
FRONTEND_URL=https://[YOUR-VERCEL-APP].vercel.app
EMAIL_USER=stakenaga123@gmail.com
EMAIL_PASS=iuzl ezxp wvog yenh
```

### ⚡ Vercel (Frontend)
```
VITE_API_BASE_URL=https://[YOUR-RENDER-APP].onrender.com
```

## 📝 Deployment Steps

1. **Deploy Backend First (Render)**
   - New Web Service
   - Connect GitHub repo
   - Add environment variables above
   - Deploy
   - Copy the Render URL

2. **Deploy Frontend (Vercel)**
   - New Project
   - Connect GitHub repo
   - Add `VITE_API_BASE_URL` with Render URL
   - Deploy
   - Copy the Vercel URL

3. **Update Backend CORS**
   - Go back to Render
   - Update `FRONTEND_URL` with Vercel URL
   - Redeploy

## ✅ Quick Test
- Visit Vercel URL
- Try login
- Create a booking
- Check if it saves

Done! 🎉
