# ValidateIt - Configuration Documentation

This document details the configuration options available in the ValidateIt application, including environment variables, constants, and customization options.

## Environment Variables

The application uses Vite's environment variable system. Environment variables are loaded from `.env` files and are prefixed with `VITE_`.

### Creating Environment Files

1. Create a `.env` file in the root of the frontend directory:
   ```
   .env                # loaded in all cases
   .env.local          # loaded in all cases, ignored by git
   .env.development    # only loaded in development mode
   .env.production     # only loaded in production mode
   ```

2. Define your variables:
   ```
   VITE_VARIABLE_NAME=value
   ```

3. Access variables in code:
   ```javascript
   import.meta.env.VITE_VARIABLE_NAME
   ```

### Available Environment Variables

#### Firebase Configuration

```
VITE_FIREBASE_API_KEY=YOUR_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN=YOUR_FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID=YOUR_FIREBASE_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET=YOUR_FIREBASE_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID=YOUR_FIREBASE_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID=YOUR_FIREBASE_APP_ID
VITE_FIREBASE_MEASUREMENT_ID=YOUR_FIREBASE_MEASUREMENT_ID
```

#### API Keys

```
VITE_NEWS_API_KEY=YOUR_NEWS_API_KEY
VITE_GEMINI_API_KEY=YOUR_GEMINI_API_KEY
```

#### EmailJS Configuration

```
VITE_EMAILJS_SERVICE_ID=YOUR_EMAILJS_SERVICE_ID
VITE_EMAILJS_TEMPLATE_ID=YOUR_EMAILJS_TEMPLATE_ID
VITE_EMAILJS_PUBLIC_KEY=YOUR_EMAILJS_PUBLIC_KEY
```

#### Application Configuration

```
VITE_QUESTION_LIMIT=10
```

## Global Constants

The application uses a centralized constants system for configuration values that are used throughout the application.

### Constants File

The main constants file is located at `src/config/constants.js`. This file exports global constants used throughout the application.

```javascript
// src/config/constants.js
export const QUESTION_LIMIT = parseInt(import.meta.env.VITE_QUESTION_LIMIT || "10");

// Other constants can be added here
```

### Using Constants

Constants should be imported directly into components that need them:

```javascript
import { QUESTION_LIMIT } from "../config/constants";

function MyComponent() {
  return (
    <div>
      <p>You can ask up to {QUESTION_LIMIT} questions.</p>
    </div>
  );
}
```

## Question Limit Configuration

The application implements a question limit feature that restricts the number of questions a user can ask. This limit is configured using the `VITE_QUESTION_LIMIT` environment variable and the `QUESTION_LIMIT` constant.

### How to Change the Question Limit

1. Update the `.env` file:
   ```
   VITE_QUESTION_LIMIT=15
   ```

2. Restart the development server (if running).

The question limit is applied consistently across all components through the global constant.

### Components Affected by Question Limit

- `Navbar.jsx`: Displays the user's question count relative to the limit
- `NewIdea.jsx`: Prevents new idea submission if limit is reached
- `IdeaDetails.jsx`: Prevents asking follow-up questions if limit is reached
- `Home.jsx`: Disables "Validate New Idea" button if limit is reached
- `RequestMoreQuestionsForm.jsx`: Displays the current limit in the request form

### Default Behavior

If the `VITE_QUESTION_LIMIT` environment variable is not set, the application will default to a limit of 10 questions per user.

## Customization Options

### Changing Application Theme

The application uses TailwindCSS for styling. The theme can be customized in the `tailwind.config.js` file.

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#4f46e5',
          DEFAULT: '#4338ca',
          dark: '#3730a3',
        },
        // Add more color customizations here
      },
      // Add more theme customizations here
    },
  },
};
```

### Feature Flags

Future versions of the application may implement feature flags to enable or disable specific features. These would be added to the constants file as boolean values.