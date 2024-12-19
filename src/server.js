import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/database.js';
import authRoutes from './routes/auth.routes.js';
import studentRoutes from './routes/student.routes.js';
import uploadRoutes from './routes/upload.routes.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/testdb';

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use('/students', studentRoutes);
app.use('/upload', uploadRoutes);

// Connect to MongoDB
await connectDB(MONGODB_URI);

app.get('/', (req,res)=>{
  res.send('Server is connected')
})

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});