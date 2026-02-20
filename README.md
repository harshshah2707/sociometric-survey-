# Workplace Interaction & Relationship Mapping Survey

A sociometric survey web application for mapping workplace interaction patterns, communication networks, trust relationships, and organizational dynamics.

Built with **Next.js 14** (App Router), **TypeScript**, **Tailwind CSS**, **React Flow**, and **Google Sheets** as the data backend.

## Features

- **8-section survey form** with progress indicator and localStorage autosave  
- **Autocomplete name input** with predefined participant list + manual entry  
- **Dynamic rating grids** (Section 5) populated from previously mentioned names  
- **Google Sheets backend** — no database required  
- **Interactive sociogram** visualization using React Flow + d3-force layout  
- **Network analytics**: in/out-degree centrality, reciprocity, density, clique detection  
- **Filterable graph**: by relationship type, positive/negative, labels, central actor highlighting  
- **Mobile responsive** & academic research-style UI  
- **Leave warning** for incomplete surveys  

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Google Sheets API

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or use existing)
3. Enable the **Google Sheets API**
4. Create a **Service Account** and download the JSON key
5. Share your Google Sheet with the service account email (Editor access)
6. Copy `.env.example` to `.env.local` and fill in:

```bash
cp .env.example .env.local
```

```env
GOOGLE_CLIENT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
GOOGLE_SHEET_ID=16yoTayyRGpzIHqH7iezkQ456VKOg9VAlld0z9cOlcnk
```

> **Important:** The `GOOGLE_PRIVATE_KEY` must include the `\n` escape sequences. Copy it directly from the JSON key file.

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
src/
├── app/
│   ├── page.tsx                    # Landing page
│   ├── layout.tsx                  # Root layout with nav
│   ├── globals.css                 # Global styles
│   ├── survey/
│   │   └── page.tsx                # Survey form page
│   ├── visualize/
│   │   └── page.tsx                # Sociogram visualization
│   └── api/
│       ├── submit/route.ts         # POST: submit survey → Google Sheets
│       └── responses/route.ts      # GET: fetch responses from Sheets
├── components/
│   ├── form/
│   │   ├── SurveyForm.tsx          # Main form orchestrator
│   │   ├── ProgressBar.tsx         # Section progress indicator
│   │   ├── NameInput.tsx           # Autocomplete name selector
│   │   ├── Section1.tsx            # Participant Information
│   │   ├── Section2.tsx            # Work Communication Network
│   │   ├── Section3.tsx            # Social & Trust Network
│   │   ├── Section4.tsx            # Negative / Avoidance Network
│   │   ├── Section5.tsx            # Relationship Strength grids
│   │   ├── Section6.tsx            # Perception Network checkboxes
│   │   ├── Section7.tsx            # Clique Mapping
│   │   └── Section8.tsx            # Comments
│   └── graph/
│       ├── SociogramGraph.tsx      # React Flow network visualization
│       └── AnalyticsPanel.tsx      # Network analytics metrics
├── lib/
│   ├── googleSheets.ts            # Google Sheets API client
│   ├── flattenSurvey.ts           # JSON → flat row converter
│   └── networkBuilder.ts          # Sheet data → network graph builder
└── types/
    └── survey.ts                  # TypeScript types & constants
```

## Deploying to Vercel

1. Push your repository to GitHub
2. Import the project in [Vercel](https://vercel.com)
3. Add the environment variables in **Settings → Environment Variables**:
   - `GOOGLE_CLIENT_EMAIL`
   - `GOOGLE_PRIVATE_KEY`
   - `GOOGLE_SHEET_ID`
4. Deploy — Vercel will auto-detect Next.js

> **Tip:** When adding `GOOGLE_PRIVATE_KEY` in Vercel, paste the raw key including `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----`.

## Edge Types in Sociogram

| Type           | Color   | Source Section   |
|--------------- |---------|------------------|
| Communication  | Blue    | Section 2        |
| Advice         | Green   | Section 2        |
| Trust          | Purple  | Section 3        |
| Avoidance      | Red     | Section 4        |
| Conflict       | Orange  | Section 4        |

## License

MIT
