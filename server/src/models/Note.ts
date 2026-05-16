import mongoose, { Document, Schema } from 'mongoose';

export interface INote extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  content: string;
  tags: string[];
  category: string;
  isArchived: boolean;
  isPublic: boolean;
  shareId?: string;
  aiSummary?: string | null;
  aiActionItems: string[];
  aiSuggestedTitle?: string | null;
  aiGeneratedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const noteSchema = new Schema<INote>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, default: 'Untitled' },
    content: { type: String, default: '' },
    tags: { type: [String], default: [] },
    category: { type: String, default: 'General' },
    isArchived: { type: Boolean, default: false },
    isPublic: { type: Boolean, default: false },
    shareId: { type: String, unique: true, sparse: true },
    aiSummary: { type: String, default: null },
    aiActionItems: { type: [String], default: [] },
    aiSuggestedTitle: { type: String, default: null },
    aiGeneratedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

export const Note = mongoose.model<INote>('Note', noteSchema);
