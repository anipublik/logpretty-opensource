# 🔥 LogPretty - Open Source

Transform your messy logs to structured JSON instantly with AI. No signup required for Quick Mode.

> **Open Source Version** - This version uses Anthropic's Claude API for AI-powered transformations.

## 🚀 Key Features

### Quick Mode (No Login Required)
- **Instant Transformation**: Paste code or upload files and get structured JSON logging instantly.
- **Multi-Language Support**: Supports Python, JavaScript, TypeScript, Java, Go, Ruby, PHP, C#, and more.
- **Privacy-First**: No data storage for ephemeral scans.
- **Copy & Download**: Easy export of transformed code.

### Power Mode (GitHub Integration)
- **Repository Scanning**: Connect specific repositories to scan for logging patterns.
- **Automated PRs**: (Beta) Automatically create Pull Requests with the transformed code.
- **Batch Processing**: Transform multiple files at once.

## 📦 Project Structure

```
logpretty/
├── src/
│   ├── app/           # Next.js App Router pages and API routes
│   ├── components/    # React components (Quick, GitHub, Shared)
│   ├── lib/           # Utilities, AI logic, Auth
│   ├── config/        # Site configuration (site.ts)
│   └── context/       # React Context providers
├── docs/              # Detailed documentation
│   ├── SETUP.md       # Installation and deployment guide
│   ├── CONTRIBUTING.md# Contribution guidelines
│   └── ARCHITECTURE_AND_DESIGN.md # Architecture/PRD
├── public/            # Static assets
└── ...config files
```

## 🛠 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: TailwindCSS
- **AI Engine**: Anthropic Claude 3.5 Sonnet (Configurable)
- **Auth**: GitHub OAuth
- **Deployment**: Vercel / Docker

## 🏁 Getting Started

### 1. Prerequisites
- Node.js 18+
- An Anthropic API Key (or compatible AI provider)
- (Optional) GitHub OAuth credentials for Power Mode

### 2. Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/logpretty.git

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
```

### 3. Configuration
Edit `.env.local` to add your keys:
```bash
ANTHROPIC_API_KEY=sk-...
```

For detailed setup instructions, including GitHub OAuth configuration, see [docs/SETUP.md](docs/SETUP.md).

### 4. Run Locally
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the app.

## 📚 Documentation
- [Setup & Deployment](docs/SETUP.md): Detailed guide on environment variables, GitHub App creation, and Vercel deployment.
- [Architecture](docs/ARCHITECTURE_AND_DESIGN.md): Deep dive into the design decisions, user flows, and product requirements.
- [Contributing](docs/CONTRIBUTING.md): Guidelines for contributing to the project.

## 🎨 Customization
This project is designed to be "plug and play".
- **Site Config**: Edit `src/config/site.ts` to update the site name, author links, and navigation.
- **Branding**: Update `src/components/shared/Header.tsx` and `Hero.tsx` for visual changes.

## 💰 Cost Estimates
- **AI API**: Pay-as-you-go (approx. $2-5/month for moderate usage).
- **Hosting**: Free on Vercel Hobby tier.

## 📄 License
[MIT](LICENSE)

## ✍️ Author
@anipublik
