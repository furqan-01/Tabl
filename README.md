# Tabl Modern Bistro 🍽️✨

**Live Production URL: https://tabl-flyrank.netlify.app/

Tabl is a next-generation contactless dining application featuring real-time menu management, a Kitchen Display System (KDS), and an interactive 3D AI Gastronomy Concierge powered by Gemini.

## 📸 Screenshots
*(Add 2-3 screenshots here: One of the Hero section with 3D Orb, one of the Menu Catalog, and one of the AI Chat Drawer)*
![Hero Section](./public/hero-screenshot.png) 

## 🏗️ Architecture Overview
*   **Frontend:** Next.js (App Router), React, Tailwind CSS, Lucide Icons.
*   **3D Graphics:** React Three Fiber (`@react-three/fiber`) & WebGL for the interactive AI Concierge Orb.
*   **Backend & Database:** Firebase Firestore for real-time menu and table cart synchronization.
*   **AI Integration:** Vercel AI SDK paired with Gemini models for tool calling and generative UI. 
*   **Deployment:** Netlify/Vercel with optimized CI/CD pipelines.

## 🧠 Design Decisions & Trade-offs
1.  **React Three Fiber vs. Static Images:** Opted for a WebGL 3D Orb for the AI assistant to create a premium, interactive "Bistro" feel. To mitigate performance drops on mobile (Total Blocking Time), the 3D canvas loading is deferred using `requestIdleCallback` and timeouts.
2.  **Tool Calling over Simple Text Generation:** Implemented strict Zod schemas for the Gemini model. Instead of just answering text, the AI securely queries the Firestore database via function calls to return accurate, live inventory (e.g., filtering out "86'd" or out-of-stock items).

## 🛡️ Production Hygiene & Abuse Protection
*   **Timeouts:** Applied `export const maxDuration = 30;` to the streaming edge/serverless handlers to prevent hanging connections.
*   **Token Caps:** Max output tokens are strictly limited in the Gemini configuration to prevent credit-draining long generations.
*   **UI Constraints:** The chat input is capped by character length on the client side.

## 🤖 Honest "How AI Built This" Section
AI was heavily utilized to accelerate development, but guided by strict architectural decisions:
*   **Google AI Studio:** Used for the initial rapid prototyping of the system prompt and Zod schema definitions for menu querying.
*   **Cursor / GitHub Copilot:** Assisted in generating boilerplate Tailwind CSS classes, scaffolding repetitive React components, and handling basic state management.
*   **Human Intervention:** The complex integration of React Three Fiber with Next.js SSR, Firebase real-time listeners, and the Lighthouse performance optimizations (DOM slicing, deferring scripts) required manual debugging and custom logic writing where AI generated hallucinations or anti-patterns.

## 💻 Run Instructions (Local Development)

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/tabl-bistro.git
cd tabl-bistro
```
