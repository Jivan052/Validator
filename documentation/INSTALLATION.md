# ValidateIt - Installation & Setup Guide

This document provides detailed instructions for setting up the ValidateIt application for development and production use.

## Prerequisites

Before setting up ValidateIt, ensure you have the following:

1. **Node.js Environment**:
   - Node.js v16.0.0 or later
   - npm v8.0.0 or later (comes with Node.js)

2. **API Access**:
   - Firebase account with Firestore and Authentication enabled
   - Google Gemini AI API access (through Google AI Studio)
   - NewsAPI account with API key

3. **Development Tools**:
   - Git for version control
   - Visual Studio Code or your preferred code editor
   - Modern web browser (Chrome, Firefox, Edge recommended)

## Step-by-Step Installation

### 1. Clone the Repository

```bash
# Clone the repository
git clone https://github.com/yourusername/ValidateIt.git

# Navigate to the project directory
cd ValidateIt/frontend
```

### 2. Install Dependencies

```bash
# Install all required dependencies
npm install
```

### 3. Environment Configuration

Create a `.env` file in the `frontend` directory with the following variables:

```env
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

### 4. Firebase Setup

1. **Create a Firebase Project**:
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Click "Add project" and follow the setup wizard
   - Enable Google Analytics if desired

2. **Set Up Authentication**:
   - In your Firebase project, go to "Authentication" → "Sign-in method"
   - Enable "Google" as a sign-in provider
   - Configure the OAuth consent screen with appropriate app information

3. **Create Firestore Database**:
   - Go to "Firestore Database" → "Create database"
   - Start in production mode
   - Choose a location close to your target users

4. **Set Up Security Rules**:
   - In "Firestore Database" → "Rules", configure the following basic rules:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /ideas/{ideaId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
    }
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

5. **Get Firebase Configuration**:
   - Go to "Project settings" → "General" → "Your apps"
   - Register a web app if you haven't already
   - Copy the Firebase configuration object
   - Add these values to your `.env` file

### 5. Gemini AI API Setup

1. **Access Google AI Studio**:
   - Visit [Google AI Studio](https://makersuite.google.com/)
   - Sign in with your Google account
   - Navigate to "API Keys" section

2. **Create API Key**:
   - Generate a new API key
   - Copy the key value
   - Add it to your `.env` file as `VITE_GEMINI_API_KEY`

3. **API Model Access**:
   - Ensure you have access to the `gemini-1.5-flash` or comparable model
   - If different model access, update the model name in `geminiService.js`

### 6. NewsAPI Setup

1. **Register for NewsAPI**:
   - Go to [NewsAPI](https://newsapi.org/)
   - Create an account and verify your email

2. **Get API Key**:
   - Copy your API key from the dashboard
   - Add it to your `.env` file as `VITE_NEWS_API_KEY`

3. **API Limitations**:
   - Note that free plans have usage limitations
   - For production, consider upgrading to a paid plan

### 7. Start Development Server

```bash
# Start the development server
npm run dev
```

This will start the Vite development server, usually on port 5173.
Open your browser and navigate to `http://localhost:5173` to see the application running.

### 8. Build for Production

When ready to deploy:

```bash
# Build the project
npm run build
```

This will create a `dist` directory with optimized production files.

## Deployment Options

### Firebase Hosting (Recommended)

1. Install Firebase CLI:
   ```bash
   npm install -g firebase-tools
   ```

2. Login to Firebase:
   ```bash
   firebase login
   ```

3. Initialize Firebase in your project:
   ```bash
   firebase init
   ```
   - Select "Hosting"
   - Choose your Firebase project
   - Set "dist" as the public directory
   - Configure as a single-page app
   - Don't overwrite index.html

4. Deploy:
   ```bash
   firebase deploy
   ```

### Other Deployment Options

- **Vercel**: Connect your GitHub repository for automatic deployments
- **Netlify**: Connect your GitHub repository or upload the dist folder
- **GitHub Pages**: Not recommended due to routing issues with SPAs

## Troubleshooting Installation Issues

### Environment Variables Not Loading

- Ensure `.env` file is in the correct location (frontend root)
- Ensure variable names begin with `VITE_` prefix
- Restart the development server after changing `.env` file

### Firebase Authentication Issues

- Verify Google sign-in is enabled in Firebase Console
- Check Firebase configuration values in `.env` file
- Ensure OAuth consent screen is properly configured

### API Key Issues

- Verify API keys are valid and active
- Check for character copy/paste errors in `.env` file
- Ensure API service accounts have proper permissions

## Development Environment Configuration

### Recommended VSCode Extensions

- ESLint
- Prettier
- Tailwind CSS IntelliSense
- ES7+ React/Redux/React-Native snippets

### Code Style & Linting

The project uses ESLint with the following configuration:

```bash
# Run linting
npm run lint

# Fix auto-fixable issues
npm run lint -- --fix
```