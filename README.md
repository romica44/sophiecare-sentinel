# SophieCare Sentinel

**Multi-Agent AI Surgical Workflow Copilot** built for the Band of Agents Hackathon.

SophieCare Sentinel is an enterprise multi-agent workflow demo where specialized AI agents coordinate around a surgical case: intake, risk review, surgical planning, compliance validation, documentation, and supervision.

> Safety note: This is a hackathon/product workflow prototype. It is not a medical device and must not be used for diagnosis, treatment, or real clinical decisions.

## Demo Story

Hospitals often work with fragmented clinical information, manual checklists, scattered documentation, and time-sensitive surgical workflows. SophieCare Sentinel shows how collaborative AI agents can exchange context and coordinate work to support safer, more traceable surgical preparation workflows.

## Agents

- **Supervisor Agent**: orchestrates the full workflow and coordinates context between agents.
- **Intake Agent**: extracts and normalizes patient and procedure context.
- **Risk Agent**: identifies workflow-level perioperative risk signals.
- **Planning Agent**: generates an operating-room preparation checklist.
- **Compliance Agent**: checks protocol readiness and missing documentation.
- **Documentation Agent**: drafts structured summaries and reports.

## Tech Stack

- Next.js App Router
- React
- TypeScript
- CSS custom futuristic UI
- Vercel-ready API route
- Free mock agent mode by default
- Optional Gemini / OpenRouter / Ollama providers

## Run Locally

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open:

```bash
http://localhost:3000
```

## AI Provider Configuration

The project runs for free without any API key using:

```env
AI_PROVIDER=mock
```

### Option A: Gemini Free Tier

1. Create a free key in Google AI Studio.
2. Add this to `.env.local` or Vercel Environment Variables:

```env
AI_PROVIDER=gemini
GEMINI_API_KEY=your_key_here
GEMINI_MODEL=gemini-1.5-flash
```

### Option B: OpenRouter Free Models

1. Create a key in OpenRouter.
2. Use a free model, for example:

```env
AI_PROVIDER=openrouter
OPENROUTER_API_KEY=your_key_here
OPENROUTER_MODEL=meta-llama/llama-3.1-8b-instruct:free
```

### Option C: Ollama Local

Good for local testing only. Not recommended for Vercel serverless.

```env
AI_PROVIDER=ollama
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama3.1:8b
```

## Deploy to Vercel

1. Push the project to GitHub.
2. Go to Vercel and import the GitHub repository.
3. Framework should be auto-detected as **Next.js**.
4. Add environment variables:
   - For free demo with no key: `AI_PROVIDER=mock`
   - For Gemini: `AI_PROVIDER=gemini` and `GEMINI_API_KEY=...`
5. Click **Deploy**.

## Suggested Hackathon Submission

### Project Title

SophieCare Sentinel

### Short Description

Multi-agent AI surgical workflow copilot where specialized agents coordinate intake, risk analysis, planning, compliance, and documentation.

### Long Description

SophieCare Sentinel is an enterprise multi-agent workflow prototype designed for surgical preparation environments. The system coordinates specialized AI agents that exchange context, analyze patient and procedure information, identify workflow-level risks, generate readiness checklists, validate missing compliance items, and draft structured documentation. A Supervisor Agent orchestrates the entire process and makes agent communication visible through a real-time command center, demonstrating how collaborative AI systems can support traceable, privacy-conscious, and human-reviewed clinical workflows.

### Tags

AI Agents, Multi-Agent Systems, Healthcare AI, Enterprise Workflow, Surgical Workflow, Next.js, TypeScript, Gemini, OpenRouter, Vercel

## Repository Requirements Checklist

- [x] README with app description
- [x] Setup instructions
- [x] Run instructions
- [x] Open-source-ready structure
- [x] Vercel-ready deployment
- [x] Mock/free mode
- [x] Optional AI provider integrations

## License

MIT
