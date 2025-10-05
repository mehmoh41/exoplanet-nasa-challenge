# 🚀 ExoAI Explorer: Hunt for Exoplanets with AI

**ExoAI Explorer** is a web application designed to make the vast and complex data from NASA's Kepler mission accessible and engaging. By combining an interactive data browser with powerful generative AI, this tool empowers space enthusiasts, students, and citizen scientists to hunt for exoplanets from their own computers.


<!-- Add a screenshot of the application's main page here -->
<!-- ![ExoAI Explorer Screenshot](link-to-your-screenshot.png) -->

---

## ✨ Core Features

### 1. Interactive Data Exploration
The "Explore" page provides a comprehensive and searchable catalog of Kepler Objects of Interest (KOIs).
- **Filter and Sort:** Quickly find specific objects by name or status, and sort the data by key parameters like planet size, orbital period, or stellar temperature.
- **Visualize Data:** Interactive scatter plots allow you to visually explore relationships between different planetary characteristics, such as `Orbital Period vs. Planet Radius` and `Equilibrium Temperature vs. Planet Radius`.

### 2. AI-Powered Analysis Engine
The "Analyze with AI" page leverages Google's Gemini AI model via Genkit to provide deep insights into exoplanet data.
- **General Summary:** Upload a dataset (CSV/JSON) and receive a high-level report from the AI, highlighting key discoveries, data distributions, and planets with potential for habitability.
- **Planet Candidate Analysis:** Get a detailed AI-driven classification for a single planet candidate. The model predicts whether the object is a `CONFIRMED` planet, a `CANDIDATE`, or a `FALSE POSITIVE`, providing a confidence score and a detailed, data-driven rationale.

---

## 🛠️ Technology Stack

This project is built with a modern, server-centric, and type-safe technology stack.

- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Generative AI:** [Google Gemini](https://deepmind.google/technologies/gemini/) via [Genkit](https://firebase.google.com/docs/genkit)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **UI Components:** [ShadCN UI](https://ui.shadcn.com/)
- **Charting:** [Recharts](https://recharts.org/)
- **Deployment:** [Firebase App Hosting](https://firebase.google.com/docs/app-hosting)

---

## 🚀 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

- [Node.js](https://nodejs.org/en/) (v20 or later recommended)
- `npm` or your preferred package manager

### Installation & Setup

1. **Clone the repository:**
   ```sh
   git clone https://github.com/firebase/studio-templates.git
   cd studio-templates/exo-ai-explorer
   ```

2. **Install NPM packages:**
   ```sh
   npm install
   ```

3. **Set up environment variables:**
   - Create a `.env` file in the root of the project by copying the example:
     ```sh
     cp .env.example .env
     ```
   - Obtain a Gemini API key from [Google AI Studio](https://aistudio.google.com/app/apikey).
   - Add your API key to the `.env` file:
     ```
     GEMINI_API_KEY=your_api_key_here
     ```

### Running the Application

1. **Start the development server:**
   The application runs on `http://localhost:9002` by default.
   ```sh
   npm run dev
   ```

2. **(Optional) Run the Genkit development UI:**
   To inspect your AI flows, you can run the Genkit developer UI on `http://localhost:4000`.
   ```sh
   npm run genkit:watch
   ```

Now you can open [http://localhost:9002](http://localhost:9002) in your browser to see the application.

---

## 📂 Project Structure

- `src/app/`: Contains the main pages of the application (`Explore` and `Analyze`).
- `src/app/_components/`: Client-side React components used by the pages.
- `src/ai/`: Configuration and definitions for the AI models and flows.
  - `src/ai/flows/`: Server-side Genkit flows that perform the AI analysis.
  - `src/ai/schemas.ts`: Zod schemas for AI flow inputs and outputs.
- `src/lib/`: Contains server-side data fetching logic (`data.ts`) and server actions (`actions.ts`).
- `src/components/`: Shared UI components, including the layout and ShadCN UI elements.
- `public/`: Static assets (if any).

---

## 📄 License

This project is licensed under the Apache-2.0 License - see the [LICENSE.md](LICENSE.md) file for details.
