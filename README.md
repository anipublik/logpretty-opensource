# 🔥 LogForge - Open Source

Transform your messy logs to structured JSON instantly with AI. No signup required.

> **Open Source Version** - This version uses Anthropic's Claude API for AI-powered transformations.

## Features

### 🚀 Quick Mode (No Login Required)
- Paste code or upload files
- Transform to structured JSON logging
- Download or copy results
- Support for 8+ languages (Python, JavaScript, TypeScript, Java, Go, Ruby, PHP, C#)
- Example code for each language

### 💪 Power Mode (GitHub Login)
- Browse your GitHub repositories
- Scan entire repos for logging patterns
- Auto-create PRs with transformations
- Batch process multiple files

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Styling:** TailwindCSS
- **AI:** Anthropic Claude 3.5 Sonnet
- **Auth:** GitHub OAuth
- **Deployment:** Vercel

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup Environment Variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Required variables:
- `ANTHROPIC_API_KEY` - Get from https://console.anthropic.com

Optional (for GitHub integration):
- `GITHUB_CLIENT_ID` - Create OAuth app at https://github.com/settings/developers
- `GITHUB_CLIENT_SECRET`
- `GITHUB_CALLBACK_URL` - e.g., http://localhost:3000/api/auth/callback
- `JWT_SECRET` - Any random secure string
- `NEXT_PUBLIC_APP_URL` - e.g., http://localhost:3000

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Project Structure

```
logforge/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/          # GitHub OAuth
│   │   │   ├── transform/     # Quick Mode API
│   │   │   └── github/        # Power Mode API
│   │   ├── page.tsx           # Main page
│   │   └── layout.tsx
│   ├── components/
│   │   ├── auth/              # Login components
│   │   ├── quick/             # Quick Mode UI
│   │   ├── github/            # Power Mode UI
│   │   └── shared/            # Header, Footer, etc.
│   ├── lib/
│   │   └── ai/                # Anthropic Claude integration
│   └── context/               # Theme context
├── package.json
└── README.md
```

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

```bash
vercel
```

Make sure to set all environment variables in your Vercel project settings.

## Cost

- **Anthropic Claude API:** Pay-as-you-go (~$3/million input tokens)
- **Vercel:** Free tier
- **GitHub OAuth:** Free
- **Estimated:** $5-15/month for moderate usage

## License

MIT

## Author

Anirudh (Ani) Sridharan
- Website: https://techani.org
- LinkedIn: https://linkedin.com/in/anirudhsridharan
- GitHub: https://github.com/anirudhsridharan
