# Write or Bye - A Productivity Tool for Writers

## 🚀 Project Overview

**Write or Bye** is a web-based productivity tool designed for writers who struggle with procrastination. The app enforces focused writing sessions by setting time constraints and consequences, ensuring users stay on track with their writing goals.

![Homepage](./homepage.png)

## 🛠️ Tech Stack

- **Frontend:** Next.js, Tailwind CSS
- **Backend:** Node.js, Express.js
- **Database:** PostgreSQL / Firebase (TBD)
- **Authentication:** NextAuth.js / Firebase Auth (TBD)
- **Deployment:** Vercel (Frontend), DigitalOcean/AWS (Backend)
- editor https://lexical.dev/docs/getting-started/react

## 🎯 Core Features (MVP - Minimum Viable Product)

6. **AI-Powered Writing Suggestions** 🤖
   - Uses AI to suggest sentence completions and improvements.
   - Helps overcome writer's block with intelligent prompts.

7. **Smart Grammar & Style Check** 📝
   - AI-driven analysis for grammar corrections and style recommendations.
   - Provides readability scores and suggests refinements.


1. **Timed Writing Sessions** ⏳
   - Users start a timed writing session.
   - Timer counts down while they write.
2. **Write or Lose Progress** ❌
   - If the user stops writing for too long, progress is lost.
   - Configurable grace period before deletion.
3. **Live Word Counter** 🔢
   - Displays real-time word count while writing.
4. **Save & Resume Work** 💾
   - Users can save sessions manually or auto-save periodically.
5. **Dark Mode & Customization** 🌙
   - Light & Dark mode support.
   - Font size and writing theme customization.

## 🛠️ TODO Features (Future Enhancements)
- **AI-Generated Writing Prompts** 🎭 (Dynamically generate topic ideas based on user preferences)
- **Voice-to-Text AI Transcription** 🎙️ (Convert spoken words into written text seamlessly)
- **AI-Powered Summarization** 📖 (Summarize long-form content into key points)

- **Gamification & Streaks** 🏆 (Daily writing streaks and achievements)
- **Distraction-Free Mode** 🖥️ (Full-screen writing mode)
- **Cloud Sync & Multi-Device Support** ☁️
- **Export to Markdown / PDF / Google Docs** 📄
- **Collaboration Mode** 👥 (Real-time co-writing feature)

## 🏗️ Getting Started

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/writeordie.git
cd writeordie

# Install dependencies 
npm install

cd backend && npm install

# Run development server
npm run dev

# Run backend server
node backend/server.js
```

### Environment Variables

Create a `.env.local` file and configure the required environment variables:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
DATABASE_URL=your_database_connection_string
NEXTAUTH_SECRET=your_secret_key
```

## 📜 License

MIT License. Feel free to contribute and improve the project!

## 📩 Contact

tungttse@gmail.com