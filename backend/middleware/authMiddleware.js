// Middleware to verify user authentication
const verifyUser = (req, res, next) => {
  const user = req.body.user || req.headers['x-user-data'];
  
  if (!user) {
    return res.status(401).json({ message: 'Unauthorized - No user data provided' });
  }

  try {
    const userData = typeof user === 'string' ? JSON.parse(user) : user;
    
    if (!userData.email || !userData.name) {
      return res.status(401).json({ message: 'Unauthorized - Invalid user data' });
    }

    req.user = userData;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized - Invalid user format' });
  }
};

// Middleware to verify admin role
const verifyAdmin = (req, res, next) => {
  const user = req.user || req.body.user || req.headers['x-user-data'];
  
  if (!user) {
    return res.status(401).json({ message: 'Unauthorized - No user data provided' });
  }

  try {
    const userData = typeof user === 'string' ? JSON.parse(user) : user;
    
    // Check if user is admin
    const isAdmin = userData.role === 'admin' || userData.email?.toLowerCase().endsWith('@admin.com');
    
    if (!isAdmin) {
      return res.status(403).json({ message: 'Forbidden - Admin access required' });
    }

    req.user = userData;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized - Invalid user format' });
  }
};

module.exports = { verifyUser, verifyAdmin };
