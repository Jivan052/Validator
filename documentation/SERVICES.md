# ValidateIt - Services Documentation

This document details the service modules used in ValidateIt, explaining their purpose, functionality, and usage patterns.

## Table of Contents

1. [Firestore Service](#firestore-service)
2. [Gemini Service](#gemini-service)
3. [News API Service](#news-api-service)
4. [Secure Storage Utility](#secure-storage-utility)

## Firestore Service

**File:** `src/services/firestoreService.js`

### Overview

The Firestore Service module handles all interactions with the Firebase Firestore database, providing functions to create, read, update, and delete data related to user ideas, analyses, and question counts. The service implements optimized caching strategies to reduce database reads/writes.

### Key Functions

#### `addIdea(userId, ideaText, keywords)`

Adds a new business idea to the database.

**Parameters:**
- `userId`: The ID of the authenticated user
- `ideaText`: The textual description of the business idea
- `keywords`: Array of keywords associated with the idea

**Returns:** Promise that resolves to the ID of the newly created idea document

**Implementation Notes:**
- Creates a new document in the 'ideas' collection
- Sets initial status to 'processing'
- Increments the user's question count

#### `updateIdeaWithAnalysis(ideaId, newsArticles, analysis)`

Updates an existing idea with analysis results.

**Parameters:**
- `ideaId`: The ID of the idea to update
- `newsArticles`: Array of news articles related to the idea
- `analysis`: Object containing all analysis results

**Returns:** Promise that resolves to the idea ID

**Implementation Notes:**
- Updates the idea document with analysis results
- Sets status to 'completed'

#### `addFollowUpQuestion(ideaId, question, answer, userId)`

Adds a follow-up question and answer to an existing idea.

**Parameters:**
- `ideaId`: The ID of the idea
- `question`: The follow-up question text
- `answer`: The AI-generated answer
- `userId`: The ID of the authenticated user

**Returns:** Promise that resolves to the idea ID

**Implementation Notes:**
- Uses JavaScript Date objects for timestamps in arrays (See FIRESTORE_TIMESTAMPS.md)
- Increments the user's question count

#### `getUserIdeas(userId)`

Retrieves all ideas for a specific user.

**Parameters:**
- `userId`: The ID of the authenticated user

**Returns:** Promise that resolves to an array of idea objects

#### `getIdeaById(ideaId)`

Retrieves a single idea by ID.

**Parameters:**
- `ideaId`: The ID of the idea to retrieve

**Returns:** Promise that resolves to an idea object

#### `getUserQuestionCount(userId)`

Gets the current question count for a user, with local caching for performance.

**Parameters:**
- `userId`: The ID of the authenticated user

**Returns:** Promise that resolves to the user's question count

**Implementation Notes:**
- Uses secure storage for caching with a 2-hour expiration
- Falls back to cached value if database request fails

#### `incrementUserQuestionCount(userId)`

Increments a user's question count by one, implementing batched updates for performance.

**Parameters:**
- `userId`: The ID of the authenticated user

**Returns:** Promise that resolves to the new count

**Implementation Notes:**
- Immediately updates secure cache for responsive UI
- Implements a batching mechanism to reduce database writes
- Groups multiple increment operations within a 2-second window

#### `checkUserQuestionLimit(userId, limit = QUESTION_LIMIT)`

Checks if a user has exceeded their question limit.

**Parameters:**
- `userId`: The ID of the authenticated user
- `limit`: The maximum allowed questions (default: from config/constants.js)

**Returns:** Promise that resolves to a boolean indicating if limit is exceeded

**Implementation Notes:**
- Uses cached values when possible
- Only verifies with server for near-limit cases with stale cache

### Usage Example

```javascript
import { addIdea, getUserIdeas } from '../services/firestoreService';

// Create a new idea
const saveIdea = async () => {
  try {
    const ideaId = await addIdea(
      currentUser.uid,
      "An AI-powered virtual nutritionist app",
      ["AI", "nutrition", "health tech"]
    );
    console.log("Idea saved with ID:", ideaId);
  } catch (error) {
    console.error("Error saving idea:", error);
  }
};

// Get all user ideas
const loadUserIdeas = async () => {
  try {
    const ideas = await getUserIdeas(currentUser.uid);
    setIdeas(ideas);
  } catch (error) {
    console.error("Error loading ideas:", error);
  }
};
```

## Gemini Service

**File:** `src/services/geminiService.js`

### Overview

The Gemini Service module handles communication with Google's Gemini AI API, providing functions for keyword extraction, idea analysis, and answering follow-up questions.

### Key Functions

#### `extractKeywords(ideaText)`

Extracts relevant keywords from a business idea description.

**Parameters:**
- `ideaText`: The textual description of the business idea

**Returns:** Promise that resolves to an array of keywords

**Implementation Notes:**
- Uses Gemini AI for natural language processing
- Typically returns 3-5 keywords for optimal news search

#### `analyzeIdeaWithNews(ideaText, newsArticles)`

Generates a comprehensive analysis of a business idea using the idea text and related news articles.

**Parameters:**
- `ideaText`: The textual description of the business idea
- `newsArticles`: Array of news articles related to the idea

**Returns:** Promise that resolves to an analysis object containing:
- `summary`: Executive summary of the idea
- `marketPotential`: Score and evaluation of market opportunity
- `keyTrends`: Current market trends related to the idea
- `sentiment`: Overall sentiment analysis from news articles
- `riskFactors`: Assessment of various risk categories
- `swot`: SWOT analysis (Strengths, Weaknesses, Opportunities, Threats)
- `executionSteps`: Recommended implementation steps
- `timeToMarket`: Estimated time to bring the idea to market
- `competitors`: List of potential competitors

**Implementation Notes:**
- Implements structured output format for consistent UI rendering
- Uses advanced prompting techniques for comprehensive analysis

#### `handleFollowUpQuestion(ideaText, newsArticles, analysis, previousQuestions, newQuestion)`

Generates an answer to a follow-up question about a business idea.

**Parameters:**
- `ideaText`: The original idea description
- `newsArticles`: Related news articles
- `analysis`: Previous analysis results
- `previousQuestions`: Array of previous Q&A pairs
- `newQuestion`: The new question to answer

**Returns:** Promise that resolves to a markdown-formatted answer string

**Implementation Notes:**
- Provides contextual answers based on previous analysis
- Uses previous Q&A history for coherent conversation

### Usage Example

```javascript
import { extractKeywords, analyzeIdeaWithNews } from '../services/geminiService';
import { getNewsArticles } from '../services/newsApiService';

const analyzeIdea = async (ideaText) => {
  try {
    // Extract keywords from idea text
    const keywords = await extractKeywords(ideaText);
    
    // Get relevant news articles
    const newsArticles = await getNewsArticles(keywords);
    
    // Generate analysis
    const analysis = await analyzeIdeaWithNews(ideaText, newsArticles);
    
    return {
      keywords,
      newsArticles,
      analysis
    };
  } catch (error) {
    console.error("Error analyzing idea:", error);
    throw error;
  }
};
```

## News API Service

**File:** `src/services/newsApiService.js`

### Overview

The News API Service module handles communication with the NewsAPI service to retrieve relevant news articles based on keywords extracted from business ideas.

### Key Functions

#### `getNewsArticles(keywords)`

Fetches news articles based on provided keywords.

**Parameters:**
- `keywords`: Array of keywords to search for

**Returns:** Promise that resolves to an array of news article objects

**Implementation Notes:**
- Implements error handling with fallback default articles
- Optimizes query construction for best search results
- Limits results to most relevant 5 articles

### Usage Example

```javascript
import { getNewsArticles } from '../services/newsApiService';

const fetchNewsForIdea = async (keywords) => {
  try {
    const articles = await getNewsArticles(keywords);
    setNewsArticles(articles);
  } catch (error) {
    console.error("Error fetching news:", error);
    setError("Failed to fetch news articles. Please try again.");
  }
};
```

## Secure Storage Utility

**File:** `src/utils/secureStorage.js`

### Overview

The Secure Storage Utility provides a secure alternative to localStorage, using encrypted cookies with configurable security options. It includes fallback to memory storage when cookies are disabled.

### Key Methods

#### `setItem(key, value, options = {})`

Stores data securely.

**Parameters:**
- `key`: The key under which to store the data
- `value`: The data to store (can be any type)
- `options`: Optional cookie configuration options

**Implementation Notes:**
- Automatically serializes non-string values to JSON
- Uses secure cookies in production environment
- Implements a consistent prefix for application cookies

#### `getItem(key)`

Retrieves data from secure storage.

**Parameters:**
- `key`: The key of the data to retrieve

**Returns:** The stored data (automatically deserialized if JSON)

**Implementation Notes:**
- Automatically tries to parse JSON values
- Falls back gracefully to raw string value if parsing fails

#### `removeItem(key)`

Removes data from secure storage.

**Parameters:**
- `key`: The key of the data to remove

#### `clear()`

Clears all data stored by the application.

**Implementation Notes:**
- Only clears cookies with the application's prefix
- Preserves other cookies not managed by the application

### Usage Example

```javascript
import secureStorage from '../utils/secureStorage';

// Store user preferences
secureStorage.setItem('user_theme', 'dark');

// Retrieve user preferences
const theme = secureStorage.getItem('user_theme');

// Store complex data
secureStorage.setItem('user_settings', {
  notifications: true,
  language: 'en',
  accessibility: {
    highContrast: false,
    fontSize: 'medium'
  }
});

// Retrieve complex data (automatically parsed)
const settings = secureStorage.getItem('user_settings');
console.log(settings.accessibility.fontSize); // 'medium'

// Remove specific item
secureStorage.removeItem('user_theme');

// Clear all application storage
secureStorage.clear();
```