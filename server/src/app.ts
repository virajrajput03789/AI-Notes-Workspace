import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth';
import notesRoutes from './routes/notes';
import sharedRoutes from './routes/shared';
import insightsRoutes from './routes/insights';
import { errorHandler } from './middleware/errorHandler';

const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());

// Prefix all routes with /api
app.use('/api/auth', authRoutes);
app.use('/api/notes', notesRoutes);
app.use('/api/shared', sharedRoutes);
app.use('/api/insights', insightsRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.use(errorHandler);

export default app;
