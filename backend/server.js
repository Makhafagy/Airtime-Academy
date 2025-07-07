const express = require('express');
const cors = require('cors');
require('dotenv').config();
const bookingRoutes = require('./routes/booking');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/booking', bookingRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});