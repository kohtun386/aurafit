# ⚡ AuraFit Coach — Personal AI Athletic Coach & Daily Recovery Journal

> A production-ready, user-authenticated AI web application built for the **Google Cloud Gen AI Academy APAC Edition (Ideathon Challenge)**.

AuraFit Coach empowers athletes, gym-goers, and fitness enthusiasts to balance intense training volume with physiological recovery. Powered by the Gemini API on Google AI Studio, it evaluates daily athletic logs (RPE, sleep quality, muscle soreness) and automatically generates individualized recovery protocols and daily actionable to-do habits.

---

## 🚀 Key Features

- **Daily Athletic Journal & Evaluation:** Log workout focus, volume, Rate of Perceived Exertion (RPE 1–10), sleep duration, and localized muscle soreness. Employs the Gemini API to analyze daily training strain, calculate an objective Recovery Score (0–100%), assess Central Nervous System (CNS) fatigue, and provide personalized coach feedback.
- **Automated Actionable Recovery Habits:** Automatically populates 3 concrete physiological to-do items (targeted hydration with sodium restoration, localized mobility/stretching flows, and recovery nutrition/sleep protocols) directly into the actionable habits tracker.
- **Conversational Coach (Multi-turn Chat):** Real-time interactive consultation with an elite CSCS (Certified Strength & Conditioning Specialist) AI persona via Gemini API for training load adjustments, active recovery guidance, and injury prevention.
- **Athlete Profile & Historical Archive:** Manage bodyweight, training experience, sport discipline, and injury vulnerabilities with a complete chronological archive of past training logs and readiness scores.
- **Bilingual Interface:** Seamless real-time toggle between English and Myanmar (မြန်မာ) language.

---

## 🛠️ Architecture & Tech Stack

| Component | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend & UI** | React 18, TypeScript, Tailwind CSS, Lucide Icons | High-contrast, responsive athletic dashboard with radial telemetry gauges |
| **Backend Server** | Express.js, Vite Middleware, Node.js | Secure server-side API proxy routing for Gemini API requests |
| **Generative AI** | Google AI Studio (`@google/genai`, Gemini API) | Multi-turn reasoning, structured JSON log analysis, and coaching |
| **Authentication** | Firebase Authentication | Secure athlete sign-in and user isolation |
| **Database** | Cloud Firestore | Isolated document storage per user (`/users/{uid}/...`) |
| **Secret Management**| Google Cloud Secret Manager / Environment Variables | Runtime retrieval of `GEMINI_API_KEY` (no hardcoded keys) |
| **Deployment** | Google Cloud Run | Containerized scalable deployment labeled `dev-tutorial=cloud-run-ai-challenge` |

---

## 🔒 Security & Data Isolation (Firestore Rules)

User data is strictly isolated to prevent cross-user leakage with document ownership enforcement and payload size guards:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Global Deny
    match /{document=**} {
      allow read, write: if false;
    }

    function isOwner(userId) {
      return request.auth != null && request.auth.uid == userId;
    }

    // User Profile Document
    match /users/{userId} {
      allow read, write: if isOwner(userId);

      // Subcollections: Journal Entries, Actionable Habits, Chat Messages
      match /journalEntries/{entryId} {
        allow read, write: if isOwner(userId);
      }
      match /habits/{habitId} {
        allow read, write: if isOwner(userId);
      }
      match /chatMessages/{messageId} {
        allow read, write: if isOwner(userId);
      }
    }
  }
}
```

---

## 🏃 Getting Started

### Prerequisites
- Node.js (v18+)
- A Gemini API Key from [Google AI Studio](https://aistudio.google.com/)

### Setup Instructions

1. **Clone the repository and install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment variables:**
   Ensure `.env` contains your Gemini API key:
   ```env
   GEMINI_API_KEY="your_gemini_api_key_here"
   ```

3. **Start the local development server:**
   ```bash
   npm run dev
   ```
   The app will run locally on `http://localhost:3000`.

4. **Build for production:**
   ```bash
   npm run build
   npm start
   ```

5. **Deploy with Docker to Google Cloud Run:**
   ```bash
   # Build the container image
   docker build -t gcr.io/YOUR_PROJECT_ID/aurafit-coach:latest .

   # Run locally on port 8080
   docker run -p 8080:8080 -e GEMINI_API_KEY="YOUR_KEY" gcr.io/YOUR_PROJECT_ID/aurafit-coach:latest

   # Deploy directly to Google Cloud Run
   gcloud run deploy aurafit-coach \
     --image gcr.io/YOUR_PROJECT_ID/aurafit-coach:latest \
     --platform managed \
     --region us-central1 \
     --allow-unauthenticated \
     --set-labels dev-tutorial=cloud-run-ai-challenge \
     --set-env-vars GEMINI_API_KEY="YOUR_KEY"
   ```

---

## 🏅 Ideathon Challenge Details
- **Program:** Google Cloud Gen AI Academy APAC Edition (Ideathon Challenge)
- **Deployment Label:** `dev-tutorial=cloud-run-ai-challenge`
- **Domain:** HealthTech / Athletic Performance & Recovery Physiology
