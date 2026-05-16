import express, { Request, Response, NextFunction } from 'express';
import { Note } from '../models/Note';

const router = express.Router();

router.get('/:shareId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const shareId = req.params.shareId as string;
    const note = await Note.findOne({ shareId, isPublic: true })
      .select('title content tags category createdAt aiSummary aiActionItems -_id');

    if (!note) {
      return res.status(404).json({ error: { message: 'This note is not available' } });
    }

    res.json({ note });
  } catch (error) {
    next(error);
  }
});

export default router;
