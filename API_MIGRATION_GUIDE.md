# API URL Migration Guide

## ✅ Files Already Updated:
- ✅ Login.jsx
- ✅ Register.jsx
- ✅ VerifyOTP.jsx
- ✅ frontend/.env
- ✅ frontend/src/config/api.js

## 📝 Files That Need Manual Update:

Replace `'http://localhost:5000'` or `"http://localhost:5000"` with `getApiUrl('')`

Also add this import at the top:
```javascript
import { getApiUrl } from './config/api';
```

### Files to Update:

1. **ForgotPassword.jsx** (1 occurrence)
2. **ResetPassword.jsx** (if exists)
3. **HomePage.jsx** (3 occurrences)
4. **AdminPanel.jsx** (4 occurrences)
5. **AdminTimetable.jsx** (5 occurrences)
6. **AdminCalendarPanel.jsx** (2 occurrences)
7. **AdminDashboard.jsx** (1 occurrence)
8. **AdminTimetableView.jsx** (1 occurrence)
9. **AdminHistory.jsx** (1 occurrence)
10. **NotificationBell.jsx** (2 occurrences)

## 🔄 Example Replacement Pattern:

### Before:
```javascript
const res = await fetch('http://localhost:5000/api/bookings');
```

### After:
```javascript
import { getApiUrl } from './config/api';
// ... (at top of file)

const res = await fetch(getApiUrl('/api/bookings'));
```

## 🚀 Quick Deploy Steps After Update:

1. Push changes to GitHub
2. Vercel will auto-deploy
3. Make sure `VITE_API_BASE_URL` is set in Vercel environment variables to:
   ```
   https://classroom-reservation-system-nine.vercel.app
   ```

## ⚙️ Current Configuration:

**Backend URL (Vercel):**
https://classroom-reservation-system-nine.vercel.app

**Frontend .env:**
```env
VITE_API_BASE_URL=https://classroom-reservation-system-nine.vercel.app
```

This means all API calls will now point to your deployed backend!
