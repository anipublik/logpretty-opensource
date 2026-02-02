# LogPretty Setup Guide

## Quick Start (5 minutes)

### Step 1: Get Anthropic API Key

1. Go to https://console.anthropic.com
2. Sign up or log in
3. Click "Get API Keys"
4. Click "Create Key"
5. Copy the key (starts with `sk-ant-`)

### Step 2: Configure Environment

Create a `.env.local` file in the project root:

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your Anthropic API key:

```bash
ANTHROPIC_API_KEY=sk-ant-your-actual-key-here
```

### Step 3: Run the Development Server

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

**That's it!** Quick Mode is now fully functional. You can:
- Paste code and transform it
- Upload files
- Download results
- No login required!

---

## Optional: Enable Power Mode (GitHub Integration)

If you want to enable the GitHub repository scanning feature:

### Step 1: Create GitHub OAuth App

1. Go to https://github.com/settings/developers
2. Click "New OAuth App"
3. Fill in the details:
   - **Application name:** LogPretty (or your preferred name)
   - **Homepage URL:** `http://localhost:3000` (for development)
   - **Authorization callback URL:** `http://localhost:3000/api/auth/callback`
4. Click "Register application"
5. Copy the **Client ID**
6. Click "Generate a new client secret" and copy it

### Step 2: Add GitHub Credentials to .env.local

Add these to your `.env.local` file:

```bash
# GitHub OAuth (Optional - for Power Mode)
GITHUB_CLIENT_ID=your-client-id
GITHUB_CLIENT_SECRET=your-client-secret
GITHUB_CALLBACK_URL=http://localhost:3000/api/auth/callback
JWT_SECRET=your-random-secret
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Generate a JWT Secret:**
```bash
# On Mac/Linux:
openssl rand -base64 32

# Or use any random string generator
```

### Step 3: Restart the Dev Server

```bash
# Stop the server (Ctrl+C) and restart:
npm run dev
```

Now you can:
- Sign in with GitHub
- Browse your repositories
- Scan repos for logging patterns
- Create PRs automatically

---

## Production Deployment (Vercel)

### Step 1: Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin your-repo-url
git push -u origin main
```

### Step 2: Deploy to Vercel

1. Go to https://vercel.com
2. Click "Import Project"
3. Select your GitHub repository
4. Add environment variables:
   - `ANTHROPIC_API_KEY` (required)
   - `GITHUB_CLIENT_ID` (optional)
   - `GITHUB_CLIENT_SECRET` (optional)
   - `GITHUB_CALLBACK_URL` (use your production URL)
   - `JWT_SECRET` (optional)
   - `NEXT_PUBLIC_APP_URL` (your production URL)
5. Click "Deploy"

### Step 3: Update GitHub OAuth App

If you enabled GitHub integration:
1. Go back to your GitHub OAuth app settings
2. Update the URLs to use your production domain:
   - **Homepage URL:** `https://your-domain.vercel.app`
   - **Authorization callback URL:** `https://your-domain.vercel.app/api/auth/callback`

---

## Troubleshooting

### "Cannot find module" errors
Run: `npm install`

### Anthropic API not working
- Check your API key is correct
- Verify you have credits at https://console.anthropic.com
- Check the console for error messages

### GitHub OAuth not working
- Verify all environment variables are set
- Check the callback URL matches exactly
- Make sure JWT_SECRET is set

### Port already in use
```bash
# Kill the process on port 3000:
lsof -ti:3000 | xargs kill -9

# Or use a different port:
npm run dev -- -p 3001
```

---

## Cost Breakdown

- **Anthropic Claude API:** ~$3/million tokens (pay-as-you-go)
- **Vercel Hosting:** Free (hobby tier)
- **GitHub OAuth:** Free
- **Total:** $2-5/month

---

## Next Steps

1. **Customize branding:** Update logos, colors, and text
2. **Add analytics:** Integrate Vercel Analytics or Google Analytics
3. **Add more languages:** Extend the language support
4. **Improve prompts:** Fine-tune the AI transformation prompts
5. **Add file upload:** Implement batch file processing

---

## Support

- **Issues:** Open an issue on GitHub
- **Questions:** Contact via the website
- **Documentation:** See README.md

Happy logging! 🔥
