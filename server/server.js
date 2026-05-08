const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();

// 1. CORS at the very top
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.options('*', cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 2. Serve uploaded files
app.use('/uploads', express.static('uploads'));

// 3. Routes (Support both /api and root paths)
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const excelRoutes = require('./routes/excelRoutes');
const courseRoutes = require('./routes/courseRoutes');
const requestRoutes = require('./routes/requestRoutes');
const adminRoutes = require('./routes/adminRoutes');

app.use('/api/auth',    authRoutes);    app.use('/auth',    authRoutes);
app.use('/api/users',   userRoutes);    app.use('/users',   userRoutes);
app.use('/api/excel',   excelRoutes);   app.use('/excel',   excelRoutes);
app.use('/api/courses', courseRoutes);  app.use('/courses', courseRoutes);
app.use('/api/requests',requestRoutes); app.use('/requests',requestRoutes);
app.use('/api/admin',   adminRoutes);   app.use('/admin',   adminRoutes);

// Health check
app.get('/', (req, res) => {
  res.json({ message: '🎓 Academic Advising API is running...' });
});

const PORT = process.env.PORT || 5001;

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}

module.exports = app;

