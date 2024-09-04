import jwt from 'jsonwebtoken';

// Middleware to decode and log token details
const logTokenDetails = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Assuming token is passed as "Bearer <token>"

  if (!token) {
    console.log('No token provided');
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    // Decode token without verifying to log details
    const decoded = jwt.decode(token, { complete: true });

    // Log the header and payload
    console.log('Token Header:', decoded?.header);
    console.log('Token Payload:', decoded?.payload);

    // Optionally, you can verify the token if needed
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Verified Payload:', verified);

    // Attach user info to the request for use in other routes
    req.user = verified;
    next();
  } catch (error) {
    console.error('Token error:', error.message);
    res.status(401).json({ message: 'Invalid token' });
  }
};

export default logTokenDetails;
