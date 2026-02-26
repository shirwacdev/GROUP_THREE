const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const AdminRoutes = require('./routes/AdminRoutes');
const StudentRoutes = require('./routes/StudentRoutes');

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/admin', AdminRoutes.router);
app.use('/api/student', StudentRoutes);

app.get('/api', (req, res) => {
  res.send('Quiz Master API is Running');
});

// Database Connection
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log('✅ Database Connected');
  })
  .catch((err) => {
    console.error('❌ Database connection error:', err);
  });

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});

