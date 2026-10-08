# 🌟 OmniPick AI — Product Recommendation System

An AI-powered product recommendation web application built with **React**, **TypeScript**, and **Vite**.

Designed and built for the **AI Engineer Assessment**.

---

## 🎯 Features

- 🧠 **Natural Language Product Search**: Type free-form natural language preferences (e.g., *"I want a phone under $500 with a great camera"*, *"Best lightweight laptop for coding & long battery"*).
- ⚡ **Multi-Engine AI Architecture**:
  - **Google Gemini 1.5 Flash**: Direct integration with Gemini generative API.
  - **OpenAI GPT-4o Mini / GPT-3.5**: Direct integration with OpenAI chat completions.
  - **Smart Local Semantic NLP Engine**: Built-in client-side vector-heuristic & rule matcher that works **100% out of the box with zero setup / API keys required**, extracting budgets, categories, and technical attributes with match scoring.
- 💡 **AI Reasoning Explanations**: Displays dynamic AI thought synthesis explaining *why* each specific product was selected and highlights key matching specs.
- 📊 **Confidence & Match Scoring**: Real-time calculated match percentages (e.g., `98% AI Match`).
- 🔍 **Faceted Filtering & Sorting**: Filter by Category, Max Price Slider, Minimum Customer Rating, or Sort by AI Match Score, Price, or Popularity.
- ⚖️ **Side-by-Side Product Comparison**: Compare specifications, AI scores, and pricing across up to 4 items simultaneously.
- 🛍️ **Interactive Shopping Bag**: Live simulated shopping cart with quantity adjustments and checkout confetti celebration.
- 📱 **Ultra-Responsive Cyber Dark UI**: Built with modern CSS glassmorphism, responsive grid layouts, and micro-animations.

---

## 🛠️ Tech Stack

- **Frontend**: React 19 + TypeScript
- **Bundler / Dev Server**: Vite
- **Styling**: Vanilla Modern CSS (Design System Tokens & Glassmorphism)
- **Icons**: Lucide React
- **Animations**: Canvas Confetti
- **Deployment**: Configured for Vercel (`vercel.json`)

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Locally
```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### 3. Build for Production
```bash
npm run build
```

---

## 🌐 Deploying to Vercel

1. Push this repository to GitHub or GitLab.
2. Go to [Vercel](https://vercel.com) and click **"Add New Project"**.
3. Import this repository.
4. Framework Preset will auto-detect as **Vite**.
5. Click **"Deploy"**.
6. Share your live Vercel URL!

*(Optional: You can also deploy directly via the Vercel CLI using `npx vercel`)*.

---

## 📋 Evaluation Requirements Met

| Requirement | Implementation |
|---|---|
| **React Frontend** | Built using React with TypeScript and responsive UI |
| **AI Recommendation Integration** | Supports Google Gemini API, OpenAI GPT API, and Local NLP fallback |
| **User Input & Preference Filtering** | Natural language prompt bar extracts budget, category, keywords, and ranks products |
| **Clean & Maintainable Code** | Modular architecture with separated types, services, components, and data catalog |
| **Vercel Deployment Ready** | Pre-configured `vercel.json` with static build optimization |
