// ---------- Imports ----------
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

// import db connection
const { testConnection } = require('./config/database');

// import routes
const routes = require('./routes/index');

const app = express();

// ---------- Remove local CORS handling ----------
// (Catalyst Appsail will manage CORS headers automatically)

// ---------- Middleware ----------
app.use(helmet());
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ---------- DB connection ----------
testConnection();

// ---------- Routes ----------
app.use('/api', routes);

// ---------- Health check ----------
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Supermarket API is running',
    timestamp: new Date().toISOString(),
  });
});

// ---------- 404 handler ----------
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
  });
});

// ---------- Global error handler ----------
app.use((error, req, res, next) => {
  console.error('Error:', error);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
  });
});

// ---------- Server listen ----------
const PORT = process.env.X_ZOHO_CATALYST_LISTEN_PORT || process.env.PORT || 5000;
const HOST = '0.0.0.0';

app.listen(PORT, HOST, () => {
  console.log(`Supermarket API server running at http://localhost:${PORT}/`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log('CORS managed by Catalyst Appsail platform');
  console.log(`Health check: http://localhost:${PORT}/health`);
});
