# Collaborative AI Notes Workspace

A production-grade, collaborative notes workspace application designed with a premium, editorial aesthetic. It features a robust Next.js frontend, an Express backend, and high-performance AI integration using Llama 3.1 via NVIDIA.

## Overview

Peblo Notes is built to feel like a premium writing tool. It supports real-time auto-saving, powerful organization via tags and categories, public sharing of notes, and built-in AI insights (summarization, action item extraction, and title suggestions) powered by **Llama 3.1 70B**. The UI emphasizes typography (Instrument Serif and DM Mono), dark mode by default, and a subtle noise texture.

## Tech Stack

### Frontend
- **Next.js 14 (App Router)**: Robust routing and server/client component boundaries.
- **React Query**: Centralized server state management with optimistic-style updates.
- **TailwindCSS**: Custom theme with editorial dark-mode aesthetic.
- **Recharts**: Data visualization for productivity metrics.

### Backend
- **Node.js & Express**: Scalable API layer.
- **MongoDB & Mongoose**: Flexible document storage with aggregation pipelines.
- **NVIDIA AI API (Llama 3.1 70B)**: High-speed LLM integration for structured JSON extraction.

## System Features

1. **Authentication**: Secure JWT-based login/signup with persistent sessions.
2. **Notes Workspace**: Fully featured editor with auto-save and markdown-inspired typography.
3. **AI Magic**: Instant summarization, task extraction, and title suggestions.
4. **Search & Filter**: Real-time keyword search and tag-based filtering.
5. **Public Sharing**: One-click public link generation with dedicated viewer page.
6. **Insights**: Visual dashboard tracking your note-taking habits.

## Database Schema (Mongoose)

### User
```typescript
{
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Bcrypt hashed
}
```

### Note
```typescript
{
  userId: { type: ObjectId, ref: 'User', indexed: true },
  title: { type: String, default: 'Untitled' },
  content: { type: String, default: '' },
  tags: [String],
  category: { type: String, enum: ["General", "Work", "Personal", "Ideas", "Research"] },
  isArchived: Boolean,
  isPublic: Boolean,
  shareId: { type: String, unique: true, sparse: true },
  aiSummary: String,
  aiActionItems: [String],
  aiSuggestedTitle: String,
  aiGeneratedAt: Date
}
```

## Sample AI Output

**Input Note Content:**
"Met with the design team today. We discussed the new branding for the ed-tech app. We need to finalize the primary gold color by Friday. Also, Sarah will start drafting the animation scripts for the intro video."

**AI Generated JSON:**
```json
{
  "summary": "The design team met to discuss branding for the new ed-tech application, focusing on color selection and video production.",
  "action_items": [
    "Finalize primary gold color (Deadline: Friday)",
    "Sarah to begin drafting animation scripts for intro video"
  ],
  "suggested_title": "Branding & Animation Kickoff"
}
```

## Setup Instructions

### Prerequisites
- Node.js v18+
- MongoDB
- NVIDIA API Key

### Installation & Run

1. **Server Setup**:
   ```bash
   cd server
   npm install
   npm run dev
   ```
2. **Client Setup**:
   ```bash
   cd client
   npm install
   npm run dev
   ```

## Key Quality Standards Implemented
- **Type Safety**: Full TypeScript implementation across the stack.
- **Mobile Responsive**: Sidebar collapses into a menu on mobile devices.
- **UX Polish**: Subtle SVG noise texture, smooth transitions, and auto-save indicators.
- **Security**: Environment variables used for all keys; passwords hashed; IDs validated.
