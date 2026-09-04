const jwt = require('jsonwebtoken')

exports.protect = (req, res, next) => {
  let token

  // 1. Check if the Authorization header exists and starts with 'Bearer'
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // 2. Extract the token (splits "Bearer eyJhbG...")
      token = req.headers.authorization.split(' ')[1]

      // 3. Verify the token using your secret key
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'super_secret_gmart_key_2026'
      )

      // 4. Attach the decoded user ID to the request object for future use
      req.user = decoded

      // 5. Let the request proceed to the controller
      next()
    } catch (error) {
      return res.status(401).json({ message: 'Not authorized, token failed' })
    }
  }

  // If no token was found at all
  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' })
  }
}
