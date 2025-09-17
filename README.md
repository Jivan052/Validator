# ValidateIt

A React + Firebase web application that helps users validate business ideas using AI analysis and real-time news data.

## Features

- **Authentication**: Google login authentication with Firebase Auth
- **Idea Submission**: Submit your business ideas for analysis
- **NewsAPI Integration**: Automatic extraction of keywords and fetching of relevant news articles
- **Gemini AI Analysis**: Comprehensive analysis of your idea including market analysis, trends, execution suggestions, and risks
- **Follow-up Q&A**: Ask additional questions about your idea with context-aware AI responses
- **Saved Projects**: Access all your previously submitted ideas and analyses

## Documentation

For detailed documentation about different aspects of the application, refer to the following guides:

- [Installation Guide](./documentation/INSTALLATION.md) - Setup and environment configuration
- [Components Documentation](./documentation/COMPONENTS.md) - React component structure and usage
- [Services Documentation](./documentation/SERVICES.md) - API services and utilities
- [Authentication Guide](./documentation/AUTHENTICATION.md) - Authentication system details
- [Database Guide](./documentation/DATABASE.md) - Firestore data structure and operations
- [API Integration Guide](./documentation/API_INTEGRATION.md) - External API integration details
- [Security Documentation](./documentation/SECURITY.md) - Security practices and implementations
- [Troubleshooting Guide](./documentation/TROUBLESHOOTING.md) - Solutions to common issues

## Tech Stack

- **Frontend**: React with Vite, TailwindCSS
- **Backend**: Firebase (Auth, Firestore)
- **AI**: Gemini API
- **External API**: NewsAPI

## Setup Instructions

### Prerequisites

- Node.js (v16 or later)
- npm or yarn
- Firebase account
- NewsAPI account
- Gemini API access

### Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd ValidateIt/frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the frontend directory with your API keys:
   ```
   # Firebase Configuration
   VITE_FIREBASE_API_KEY=YOUR_FIREBASE_API_KEY
   VITE_FIREBASE_AUTH_DOMAIN=YOUR_FIREBASE_AUTH_DOMAIN
   VITE_FIREBASE_PROJECT_ID=YOUR_FIREBASE_PROJECT_ID
   VITE_FIREBASE_STORAGE_BUCKET=YOUR_FIREBASE_STORAGE_BUCKET
   VITE_FIREBASE_MESSAGING_SENDER_ID=YOUR_FIREBASE_MESSAGING_SENDER_ID
   VITE_FIREBASE_APP_ID=YOUR_FIREBASE_APP_ID
   VITE_FIREBASE_MEASUREMENT_ID=YOUR_FIREBASE_MEASUREMENT_ID

   # NewsAPI Configuration
   VITE_NEWS_API_KEY=YOUR_NEWS_API_KEY

   # Gemini AI Configuration
   VITE_GEMINI_API_KEY=YOUR_GEMINI_API_KEY
   ```

4. Start the development server:
   ```
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:5173`

### Firebase Setup

1. Create a new Firebase project at [https://console.firebase.google.com/](https://console.firebase.google.com/)
2. Enable Authentication with Google and Email/Password providers
3. Create a Firestore database
4. Get your Firebase configuration from Project Settings > General > Your Apps
5. Add the configuration details to your `.env` file

### NewsAPI Setup

1. Sign up for a NewsAPI account at [https://newsapi.org/](https://newsapi.org/)
2. Get your API key
3. Add it to your `.env` file

### Gemini API Setup

1. Get access to the Gemini API at [https://ai.google.dev/](https://ai.google.dev/)
2. Generate an API key
3. Add it to your `.env` file

## Usage

1. Sign up or log in to your account
2. Submit a business idea in the "New Idea" page
3. Wait for the analysis to complete
4. View the detailed analysis with market insights, execution suggestions, and risks
5. Ask follow-up questions in the Q&A section
6. Access your saved ideas from the dashboard

## Example Workflow

1. User logs in with Google
2. Enters idea → "AI-powered fashion assistant"
3. Gemini extracts keywords → "AI fashion", "virtual stylist", "AI shopping"
4. NewsAPI called with those keywords → returns 5 articles
5. Gemini analyzes → outputs summary, trends, references, execution steps, risks
6. User sees results in dashboard + can ask follow-ups
7. Idea + results saved in Firestore

## License

[MIT](LICENSE)