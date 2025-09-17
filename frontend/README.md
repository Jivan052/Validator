# ValidateIt - AI-Powered Business Idea Validator

## Overview
ValidateIt is a web application that helps entrepreneurs validate their business ideas using AI analysis and news data. Built with React, Firebase, and integrated with Gemini AI and NewsAPI, it provides comprehensive analysis and insights for your business ideas.

## Features
- Secure authentication with Firebase
- AI-powered keyword extraction from your idea
- Relevant news article fetching based on keywords
- Comprehensive idea analysis including market potential, trends, and risks
- Follow-up questions and answers about your idea

## Technical Stack
- React 19.1.1 with Vite
- Firebase Authentication and Firestore
- TailwindCSS for styling
- Google Gemini AI API for idea analysis
- NewsAPI for relevant articles

## Setup Instructions

### Prerequisites
- Node.js and npm installed
- Firebase account
- Google AI Studio account with Gemini API access
- NewsAPI account

### Installation

1. Clone the repository and install dependencies
```
cd ValidateIt/frontend
npm install
```

2. Create a `.env` file in the frontend directory with the following variables:
```
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_firebase_measurement_id

# NewsAPI Configuration
VITE_NEWS_API_KEY=your_newsapi_key

# Gemini AI Configuration
VITE_GEMINI_API_KEY=your_gemini_api_key
```

3. Start the development server
```
npm run dev
```

## Troubleshooting

### "Stuck at 30%" Issue
If the application gets stuck at 30% during idea analysis, it's usually related to the Gemini API integration. Here are some steps to resolve this:

1. **Verify Gemini API Key**:
   - Ensure your VITE_GEMINI_API_KEY in the .env file is correct and active
   - Visit [Google AI Studio](https://makersuite.google.com/app/apikey) to verify your key is active

2. **Check Model Availability**:
   - The application uses "gemini-2.0-flash" model
   - If this model isn't available for your API key, modify the model name in `src/services/geminiService.js`
   - Try changing to "gemini-1.5-flash" or "gemini-1.0-pro" if needed

3. **Inspect Browser Console**:
   - Open developer tools (F12) and check the console for specific errors
   - Look for messages related to the Gemini API

4. **API Quota Exceeded**:
   - If you see quota errors, you may need to wait or upgrade your Gemini API plan

5. **Retry with a Simpler Idea**:
   - Try submitting a shorter, simpler idea to test functionality

### Other Common Issues

1. **Firebase Authentication Problems**:
   - Verify your Firebase configuration in .env
   - Ensure Firebase Authentication is enabled in your Firebase console

2. **NewsAPI Errors**:
   - Check your NewsAPI key is valid
   - Be aware that free NewsAPI plans have limitations

3. **CORS Issues**:
   - If seeing CORS errors, you may need to set up proper CORS headers if deploying to production

## Original Vite Template Information

This project was created with the Vite React template that provides a minimal setup to get React working in Vite with HMR and ESLint rules.

Plugins used:
- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) for Fast Refresh
