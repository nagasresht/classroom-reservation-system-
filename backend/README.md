# Classroom Reservation System - Backend

## Setup for Local Development

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure environment variables**
   - Copy `.env.example` to `.env`
   - Update the values:
     ```
     MONGO_URI=your_mongodb_connection_string
     EMAIL_USER=your_email@gmail.com
     EMAIL_PASS=your_gmail_app_password
     PORT=5000
     NODE_ENV=development
     FRONTEND_URL=http://localhost:5173
     ```

3. **Run the server**
   ```bash
   npm run dev
   ```

The server will start at `http://localhost:5000`

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGO_URI` | MongoDB connection string from MongoDB Atlas | `mongodb+srv://user:pass@cluster.mongodb.net/db` |
| `EMAIL_USER` | Gmail address for sending emails | `example@gmail.com` |
| `EMAIL_PASS` | Gmail App Password (16 characters) | `abcd efgh ijkl mnop` |
| `PORT` | Server port | `5000` |
| `NODE_ENV` | Environment mode | `development` or `production` |
| `FRONTEND_URL` | Frontend URL for CORS | `http://localhost:5173` (dev) or your Vercel URL (prod) |

## Getting Gmail App Password

1. Enable 2-Factor Authentication on your Google Account
2. Go to [Google App Passwords](https://myaccount.google.com/apppasswords)
3. Generate a new app password for "Mail"
4. Copy the 16-character password to `EMAIL_PASS`

## Deployment to Render

See [DEPLOYMENT.md](../DEPLOYMENT.md) for detailed deployment instructions.

### Quick Steps:
1. Push code to GitHub
2. Create new Web Service on Render
3. Set Root Directory to `backend`
4. Add environment variables
5. Deploy

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/verify-otp` - Verify email OTP
- `POST /api/auth/resend-otp` - Resend OTP
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password

### Bookings
- `GET /api/bookings` - Get all bookings
- `POST /api/bookings` - Create booking
- `PUT /api/bookings/:id` - Update booking
- `DELETE /api/bookings/:id` - Delete booking

### Calendar
- `GET /api/calendar` - Get academic calendar
- `POST /api/calendar` - Create calendar entry
- `PUT /api/calendar/:id` - Update calendar entry
- `DELETE /api/calendar/:id` - Delete calendar entry

### Classrooms
- `GET /api/classroom/map` - Get classroom mappings
- `POST /api/classroom/map` - Create mapping
- `PUT /api/classroom/map/:id` - Update mapping
- `DELETE /api/classroom/map/:id` - Delete mapping

### Notifications
- `GET /api/notifications` - Get user notifications
- `PUT /api/notifications/:id` - Mark as read
