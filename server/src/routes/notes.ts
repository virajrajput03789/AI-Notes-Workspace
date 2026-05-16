import express, { Response, NextFunction } from 'express';
import { nanoid } from 'nanoid';
import { Note } from '../models/Note';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { Types } from 'mongoose';

const router = express.Router();

router.use(authMiddleware);

router.get('/', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const { search, tag, sort, archived } = req.query;
    
    const query: any = { userId: new Types.ObjectId(userId) };
    
    if (archived === 'true') {
      query.isArchived = true;
    } else {
      query.isArchived = false;
    }

    if (search) {
      const searchRegex = new RegExp(search as string, 'i');
      query.$or = [
        { title: searchRegex },
        { content: searchRegex },
        { tags: searchRegex },
      ];
    }

    if (tag) {
      query.tags = { $in: [tag] };
    }

    let sortOption: any = { updatedAt: -1 };
    if (sort === 'newest') sortOption = { createdAt: -1 };
    else if (sort === 'oldest') sortOption = { createdAt: 1 };

    const notes = await Note.find(query).sort(sortOption);
    res.json({ notes });
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { title, content, tags, category } = req.body;
    const note = new Note({
      userId: new Types.ObjectId(req.user!.id),
      title: title || 'Untitled',
      content: content || '',
      tags: tags || [],
      category: category || 'General',
    });
    await note.save();
    res.status(201).json({ note });
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    if (!Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: { message: 'Invalid note ID' } });
    }

    const note = await Note.findOne({ _id: new Types.ObjectId(id), userId: new Types.ObjectId(req.user!.id) });
    if (!note) {
      return res.status(404).json({ error: { message: 'Note not found' } });
    }
    res.json({ note });
  } catch (error) {
    next(error);
  }
});

router.patch('/:id', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    if (!Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: { message: 'Invalid note ID' } });
    }

    const note = await Note.findOne({ _id: new Types.ObjectId(id), userId: new Types.ObjectId(req.user!.id) });
    if (!note) {
      return res.status(404).json({ error: { message: 'Note not found' } });
    }

    const { title, content, tags, category, isArchived, isPublic } = req.body;

    if (title !== undefined) note.title = title;
    if (content !== undefined) note.content = content;
    if (tags !== undefined) note.tags = tags;
    if (category !== undefined) note.category = category;
    if (isArchived !== undefined) note.isArchived = isArchived;
    
    if (isPublic !== undefined) {
      note.isPublic = isPublic;
      if (isPublic && !note.shareId) {
        note.shareId = nanoid(12);
      }
    }

    await note.save();
    res.json({ note });
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    if (!Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: { message: 'Invalid note ID' } });
    }

    const note = await Note.findOneAndDelete({ _id: new Types.ObjectId(id), userId: new Types.ObjectId(req.user!.id) });
    if (!note) {
      return res.status(404).json({ error: { message: 'Note not found' } });
    }
    res.json({ message: 'Note deleted' });
  } catch (error) {
    next(error);
  }
});

router.post('/:id/generate-summary', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    if (!Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: { message: 'Invalid note ID' } });
    }

    const note = await Note.findOne({ _id: new Types.ObjectId(id), userId: new Types.ObjectId(req.user!.id) });
    if (!note) {
      return res.status(404).json({ error: { message: 'Note not found' } });
    }

    if (!note.content || note.content.length < 50) {
      return res.status(400).json({ error: { message: 'Note content is too short to summarize (min 50 chars)' } });
    }

    const response = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.NVIDIA_API_KEY}`
      },
      body: JSON.stringify({
        model: "meta/llama-3.1-8b-instruct",
        max_tokens: 600,
        temperature: 0.3,
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant that analyzes notes and extracts structured information. Always respond with valid JSON only, no markdown, no preamble. Do not wrap in ```json."
          },
          {
            role: "user", 
            content: `Analyze this note and return a JSON object with exactly these three fields:
- summary: 3-4 sentences capturing the core idea in third-person professional tone. Start with "This note...". Include the key topic, main points covered, and why it matters. Show domain understanding.
- action_items: Array of 4-6 strings. Each string should be a complete, detailed sentence describing a specific action. Format: 'Person/Team should do specific-task by deadline.' Example: 'Developer should set up CI/CD pipeline using GitHub Actions by end of sprint.' Do NOT return objects with task/who/what/when fields. Return plain strings only.
- suggested_title: A crisp, descriptive title under 7 words.

Note to analyze:
Title: ${note.title}
Content: ${note.content}

Return ONLY a valid JSON object. No extra text, no markdown backticks.`
          }
        ]
      })
    });

    const responseData: any = await response.json();

    if (!response.ok) {
      console.error("NVIDIA API Error:", response.status, JSON.stringify(responseData));
      return res.status(503).json({ 
        error: { message: "AI service temporarily unavailable. Please try again." } 
      });
    }

    const rawText = responseData.choices[0].message.content.trim();
    const cleanText = rawText.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(cleanText);

    note.aiSummary = parsed.summary || null;
    
    const rawItems = parsed.action_items || [];
    note.aiActionItems = rawItems.map((item: any) => {
      if (typeof item === 'string') return item;
      if (typeof item === 'object') {
        // Convert object to readable string
        const task = item.task || item.action || '';
        const who = item.who ? `${item.who} ` : '';
        const when = item.when ? ` by ${item.when}` : '';
        return `${who}should ${task}${when}`.trim();
      }
      return String(item);
    });

    note.aiSuggestedTitle = parsed.suggested_title || null;
    note.aiGeneratedAt = new Date();

    await note.save();

    res.json({
      note,
      ai: {
        summary: note.aiSummary,
        action_items: note.aiActionItems,
        suggested_title: note.aiSuggestedTitle
      }
    });
  } catch (error) {
    console.error('AI Error:', error);
    res.status(503).json({ error: { message: 'Failed to generate summary with AI' } });
  }
});

export default router;
