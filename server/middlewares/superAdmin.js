/**
   * Check if a user is a super admin
   * @param {*} req - Request object
   * @param {*} res - Response object
   * @param {*} next - Next function
   * @returns {function} - Next middleware
   */
const superAdmin = (req, res, next) => {
  if (req.decoded.role !== 'superAdmin') {
    return res.status(403).json({
      message: 'Access denied'
    });
  }
  next();
};

export default superAdmin;
