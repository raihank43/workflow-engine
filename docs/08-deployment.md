# Deployment Guide

## Vercel Deployment

The app is configured for deployment on [Vercel](https://vercel.com).

### Prerequisites

- A Vercel account
- The [Vercel CLI](https://vercel.com/docs/cli) (optional, for CLI deployment)
- Repository pushed to GitHub / GitLab / Bitbucket

### Configuration

The `vercel.json` in the `app/` directory contains:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm install",
  "framework": "vite",
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

- **Framework**: Vite (auto-detected by Vercel)
- **Output**: `dist/` (Vite's default build output)
- **Rewrites**: All routes fall back to `index.html` for client-side routing with React Router

### Deploy via Vercel Dashboard

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your Git repository
3. Set the **Root Directory** to `app` (since the Vite project lives inside `app/`)
4. Vercel will auto-detect Vite and apply the settings from `vercel.json`
5. Click **Deploy**

### Deploy via CLI

```bash
cd app
npx vercel
```

On first run, link to your Vercel account and project. Subsequent deploys:

```bash
npx vercel --prod
```

### Environment Variables

Currently no server-side environment variables are required. If you add API integrations in the future:

1. Go to **Project Settings → Environment Variables** in the Vercel dashboard
2. Add variables with the `VITE_` prefix so they're available at build time:
   - `VITE_API_URL` — Backend API endpoint
   - `VITE_API_KEY` — Public API key (never store secrets in client-side vars)

### Build Settings Summary

| Setting | Value |
|---------|-------|
| Framework | Vite |
| Root Directory | `app` |
| Build Command | `npm run build` |
| Output Directory | `dist` |
| Install Command | `npm install` |
| Node.js Version | 18.x+ (default) |

### SPA Routing

The `rewrites` rule in `vercel.json` ensures all paths (e.g., `/settings`, `/workflow/wf-123`) are served by `index.html`, allowing React Router to handle client-side navigation.

### Post-Deployment Checklist

- [ ] Verify the dashboard loads at `/`
- [ ] Verify navigation to `/settings` works
- [ ] Verify canvas editor loads at `/workflow/:id`
- [ ] Verify light/dark theme toggle works
- [ ] Check mobile responsiveness (if applicable)
