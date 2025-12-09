const express = require('express');
const cors = require('cors');
const connectDB = require('./src/config/database');
const adminRoutes = require('./src/routes/admin');
const companyRoutes = require('./src/routes/company');
const publicVacancyRoutes = require('./src/routes/publicVacancy');
const publicApplicationFormRoutes = require('./src/routes/publicApplicationForm');
const publicApplicationSubmissionRoutes = require('./src/routes/publicApplicationSubmission');
const referralRoutes = require('./src/routes/referral');
const employeeAuthRoutes = require('./src/routes/employeeAuth');
require('dotenv').config();

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Routes
app.use('/api/admin', adminRoutes);
app.use('/api/company', companyRoutes);
app.use('/api/vacancy', publicVacancyRoutes);
app.use('/api/application-form', publicApplicationFormRoutes);
app.use('/api/application', publicApplicationSubmissionRoutes);
app.use('/api/referral', referralRoutes);
app.use('/api/employee-auth', employeeAuthRoutes);

// Health check route
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

