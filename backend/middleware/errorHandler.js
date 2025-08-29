// middleware/errorHandler.js
const errorHandler = (err, req, res, next) => {
    console.error('❌ Error:', err.message);
    res.status(500).json({ success: false, message: 'Server error' });
};

module.exports = errorHandler;
