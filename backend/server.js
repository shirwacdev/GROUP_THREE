const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bycript = require('bcryptjs');

require('dotenv').config();

const app = express();
const AdminRoutes = require('./routes/AdminRoutes');

app.use(cors());
app.use(express.json());
app.use('/api/admin', AdminRoutes.router);
// Also expose routes at root for clients calling /register or /login directly
app.use('/', AdminRoutes.router);

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log('db Connected');
  })
  .catch((err) => {
    console.log(err);
  });

app.get('/api', (req, res) => {
  res.send('Hello My Team');
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  // Log the active port so we know the server booted successfully
  console.log(`Server is running on port ${PORT}`);
});
