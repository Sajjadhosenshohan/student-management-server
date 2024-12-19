import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes.js';
import studentRoutes from './routes/student.routes.js';
import uploadRoutes from './routes/upload.routes.js';
import mongoose from 'mongoose';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use('/students', studentRoutes);
app.use('/upload', uploadRoutes);

// Database connection
mongoose.connect(process.env.MONGODB_URI || '')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

app.get('/', (req,res)=>{
  res.send('Server is connected')
})

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});