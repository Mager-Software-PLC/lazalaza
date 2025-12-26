const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Handle Multer errors
  if (err.name === 'MulterError' || err.code === 'LIMIT_FILE_SIZE') {
    console.error('❌ Multer Error:', err);
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ 
        error: 'File too large. Maximum size is 100MB.',
        details: `File size limit exceeded. Maximum allowed: 100MB`,
        type: 'MulterError'
      });
    }
    return res.status(400).json({ 
      error: err.message || 'File upload error',
      details: err.message,
      type: err.name || 'MulterError'
    });
  }

  if (err.name === 'ValidationError') {
    return res.status(400).json({ error: err.message });
  }

  if (err.name === 'SequelizeUniqueConstraintError') {
    return res.status(409).json({ error: 'Duplicate entry' });
  }

  if (err.name === 'SequelizeValidationError') {
    return res.status(400).json({ error: err.errors[0].message });
  }

  // If error already has a response (from controller), don't override it
  // Check if response was already sent or if error has custom response data
  if (res.headersSent) {
    return;
  }

  // For Sequelize database errors, provide more details
  if (err.name === 'SequelizeDatabaseError' || err.name === 'SequelizeConnectionError' || err.name?.startsWith('Sequelize')) {
    const dbError = err.original?.message || err.original?.sqlMessage || err.message || 'Database error occurred';
    console.error('========== ERROR HANDLER - DATABASE ERROR ==========');
    console.error('Error Name:', err.name);
    console.error('Error Message:', err.message);
    console.error('Error Original:', err.original?.message || 'N/A');
    console.error('Error SQL Message:', err.original?.sqlMessage || 'N/A');
    console.error('Error SQL:', err.sql || 'N/A');
    console.error('Full Error Object:', JSON.stringify(err, Object.getOwnPropertyNames(err), 2));
    console.error('===================================================');
    
    return res.status(500).json({
      error: dbError,
      details: dbError,
      type: err.name,
      originalError: err.message,
      sqlError: err.original?.sqlMessage || err.original?.message
    });
  }

  // If error already has response data (from controller), use it
  // Otherwise, return detailed error
  const errorMessage = err.original?.message || err.message || 'Internal server error';
  console.error('Error Handler - Generic Error:', {
    name: err.name,
    message: err.message,
    original: err.original?.message,
    status: err.status
  });
  
  res.status(err.status || 500).json({
    error: errorMessage,
    details: errorMessage,
    type: err.name || 'Unknown',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

module.exports = errorHandler;

