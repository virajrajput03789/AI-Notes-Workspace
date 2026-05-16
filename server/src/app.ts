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

app.use('/auth', authRoutes);
app.use('/notes', notesRoutes);
app.use('/shared', sharedRoutes);
app.use('/insights', insightsRoutes);

app.use(errorHandler);

export default app;
