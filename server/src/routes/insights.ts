import express, { Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { Note } from '../models/Note';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = express.Router();

router.use(authMiddleware);

router.get('/', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;

    const totalNotes = await Note.countDocuments({ userId: new mongoose.Types.ObjectId(userId), isArchived: false });
    const archivedNotes = await Note.countDocuments({ userId: new mongoose.Types.ObjectId(userId), isArchived: true });
    
    const recentNotes = await Note.find({ userId: new mongoose.Types.ObjectId(userId), isArchived: false })
      .sort({ updatedAt: -1 })
      .limit(5)
      .select('title updatedAt _id');

    const topTagsPipeline = await Note.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      { $unwind: "$tags" },
      { $group: { _id: "$tags", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 8 },
      { $project: { _id: 0, tag: "$_id", count: 1 } }
    ]);
    const topTags = topTagsPipeline;

    const aiUsage = await Note.countDocuments({ userId: new mongoose.Types.ObjectId(userId), aiSummary: { $ne: null } });

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const weeklyActivityPipeline = await Note.aggregate([
      { 
        $match: { 
          userId: new mongoose.Types.ObjectId(userId),
          createdAt: { $gte: sevenDaysAgo }
        } 
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Fill in missing days
    const weeklyActivity = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const found = weeklyActivityPipeline.find(x => x._id === dateStr);
      weeklyActivity.push({
        date: dateStr,
        count: found ? found.count : 0
      });
    }

    res.json({
      totalNotes,
      archivedNotes,
      recentNotes,
      topTags,
      aiUsage,
      weeklyActivity
    });
  } catch (error) {
    next(error);
  }
});

export default router;
