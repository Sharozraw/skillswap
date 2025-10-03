const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db'); // We'll create this

dotenv.config();
const app = express();

app.use(cors({ origin: 'http://localhost:3000' })); // Allow frontend origin
app.use(express.json()); // Parse JSON bodies

connectDB(); // Connect to MongoDB

// Routes (we'll add these)
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/jobs', require('./routes/jobRoutes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));