# ValidateIt - API Integration Documentation

This document provides a comprehensive overview of the external API integrations in the ValidateIt application, focusing on how the app integrates with Google Gemini AI and NewsAPI.

## Overview of API Integrations

ValidateIt leverages two main external APIs:

1. **Google Gemini AI API**: Used for analyzing business ideas and providing detailed insights based on user input.
2. **NewsAPI**: Used to fetch relevant news data related to the business idea to enhance the analysis.

## Google Gemini AI Integration

### Integration Overview

The Google Gemini AI integration provides the core analytical capabilities of ValidateIt, allowing the application to analyze business ideas and generate insights based on current market conditions, trends, and user input.

### Configuration

The Gemini API is configured in `src/services/geminiService.js`. The API key is stored in environment variables for security.

```javascript
// Environment variables for Gemini API configuration
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent";
```

### Key Functions

#### `analyzeBusinessIdea`

This is the primary function for analyzing a business idea:

```javascript
export const analyzeBusinessIdea = async (ideaDetails, newsData) => {
  try {
    // Construct the prompt with business idea details and news data
    const prompt = constructAnalysisPrompt(ideaDetails, newsData);
    
    // Make the API request to Gemini
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }],
        generationConfig: {
          temperature: 0.2,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 8192,
        }
      })
    });

    const data = await response.json();
    
    // Process and transform the Gemini response
    const analysisText = data.candidates[0].content.parts[0].text;
    return transformAnalysis(analysisText);
  } catch (error) {
    console.error("Error analyzing business idea:", error);
    throw error;
  }
}
```

#### `askFollowUpQuestion`

Allows users to ask follow-up questions about their business idea analysis:

```javascript
export const askFollowUpQuestion = async (ideaDetails, analysis, question) => {
  try {
    // Construct prompt including original idea, analysis, and the follow-up question
    const prompt = constructFollowUpPrompt(ideaDetails, analysis, question);
    
    // Make the API request to Gemini
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }],
        generationConfig: {
          temperature: 0.2,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 4096,
        }
      })
    });

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error("Error asking follow-up question:", error);
    throw error;
  }
}
```

### Prompt Construction

The application constructs specific prompts to guide the AI in generating the desired analysis:

```javascript
const constructAnalysisPrompt = (ideaDetails, newsData) => {
  // Detailed prompt construction with instructions for the AI model
  // Includes business idea details, market context, and news data
  // Provides structure for the expected response format
  return `...`;
}
```

### Response Transformation

The raw AI response is transformed into a structured format that can be easily consumed by the application:

```javascript
const transformAnalysis = (analysisText) => {
  // Parse the structured response from the AI
  // Convert text blocks into JSON objects
  // Format data for visualization components
  // ...
}
```

## NewsAPI Integration

### Integration Overview

NewsAPI is used to fetch relevant news articles about a business idea's industry or market. This data enhances the Gemini AI analysis by providing current market information.

### Configuration

The NewsAPI integration is configured in `src/services/newsApiService.js`. The API key is stored in environment variables for security.

```javascript
// Environment variables for NewsAPI configuration
const NEWS_API_KEY = import.meta.env.VITE_NEWS_API_KEY;
const NEWS_API_URL = "https://newsapi.org/v2/everything";
```

### Key Functions

#### `fetchNewsData`

This function fetches relevant news articles based on keywords derived from the business idea:

```javascript
export const fetchNewsData = async (keywords) => {
  try {
    // Prepare search query from keywords
    const query = keywords.join(' OR ');
    
    // Calculate date for last 30 days of news
    const today = new Date();
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(today.getDate() - 30);
    
    const fromDate = thirtyDaysAgo.toISOString().split('T')[0];
    
    // Construct URL with query parameters
    const url = `${NEWS_API_URL}?q=${encodeURIComponent(query)}&from=${fromDate}&sortBy=relevancy&language=en&pageSize=10&apiKey=${NEWS_API_KEY}`;
    
    // Make the API request
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.status !== 'ok') {
      throw new Error(data.message || 'Failed to fetch news data');
    }
    
    // Process and return the news articles
    return processNewsData(data.articles);
  } catch (error) {
    console.error("Error fetching news data:", error);
    throw error;
  }
}
```

#### `processNewsData`

Processes and formats the news articles for consumption by the Gemini AI analysis:

```javascript
const processNewsData = (articles) => {
  // Extract relevant information from each article
  return articles.map(article => ({
    title: article.title,
    description: article.description,
    source: article.source.name,
    url: article.url,
    publishedAt: article.publishedAt
  }));
}
```

#### `extractKeywords`

Extracts relevant keywords from a business idea for news searching:

```javascript
export const extractKeywords = (ideaDetails) => {
  const { title, industry, targetAudience, description } = ideaDetails;
  
  // Extract potential keywords from idea fields
  let keywords = [];
  
  // Add industry as primary keyword
  if (industry) {
    keywords.push(industry);
  }
  
  // Extract key phrases from title and description
  if (title) {
    // Add significant words from title
    const titleWords = title.split(' ')
      .filter(word => word.length > 3)
      .filter(word => !commonWords.includes(word.toLowerCase()));
    keywords = [...keywords, ...titleWords];
  }
  
  // Filter out duplicates and limit to top keywords
  const uniqueKeywords = [...new Set(keywords)];
  return uniqueKeywords.slice(0, 5); // Limit to top 5 keywords
}
```

## Authentication for API Access

Both APIs require authentication via API keys that are stored in environment variables:

```
# .env file
VITE_GEMINI_API_KEY=your_gemini_api_key_here
VITE_NEWS_API_KEY=your_news_api_key_here
```

The application uses Vite's environment variable system to securely access these keys without exposing them in the client-side code.

## API Request Flow

The typical flow for API requests in ValidateIt follows these steps:

1. User submits a business idea in the `NewIdea` component
2. Application extracts keywords using `extractKeywords` function
3. Application fetches relevant news with `fetchNewsData` function
4. Application combines idea details and news data to construct a prompt
5. Application sends the prompt to Google Gemini AI with `analyzeBusinessIdea` function
6. Application transforms and stores the AI response in Firestore
7. Application displays the analysis results in the `IdeaDetails` component

For follow-up questions:

1. User submits a follow-up question in the `IdeaDetails` component
2. Application constructs a new prompt including the original analysis and question
3. Application sends the prompt to Google Gemini AI with `askFollowUpQuestion` function
4. Application displays the response to the user

## Error Handling

Both API services implement robust error handling:

```javascript
try {
  // API request code
} catch (error) {
  console.error("Error message:", error);
  
  // Check for specific error types
  if (error.response) {
    // Handle server errors (4xx, 5xx)
    if (error.response.status === 429) {
      // Handle rate limiting
    }
  } else if (error.request) {
    // Handle network errors
  }
  
  // Re-throw for component-level handling
  throw error;
}
```

The components using these services implement their own error handling to provide appropriate user feedback.

## Rate Limiting and Quotas

Both APIs have rate limiting and quota considerations:

### Google Gemini AI

- Quota: Varies by plan
- Rate Limits: Based on tokens per minute
- Application Handling: Implements exponential backoff for retries

### NewsAPI

- Free Tier: 100 requests per day
- Rate Limits: No more than 50 requests per 12 hours
- Application Handling: Caches news results for similar queries

## Local Development and Testing

For local development and testing, developers should:

1. Create a `.env.local` file with their API keys
2. Use mock data for testing when possible to avoid API quota consumption
3. Consider setting up a proxy for API requests to avoid CORS issues

## API Monitoring

API usage is monitored to track:

- Number of requests
- Error rates
- Response times
- Quota consumption

This monitoring helps identify issues and optimize API usage.

## Future API Enhancements

Planned improvements for API integrations include:

1. Implementing caching strategies to reduce API calls
2. Adding more news sources beyond NewsAPI
3. Expanding Gemini AI capabilities for deeper analysis
4. Implementing a fallback mechanism when API limits are reached

## Troubleshooting Common API Issues

### Google Gemini API

| Issue | Possible Cause | Solution |
|-------|----------------|----------|
| 400 Bad Request | Malformed prompt | Check prompt construction |
| 429 Too Many Requests | Rate limit exceeded | Implement backoff strategy |
| Timeout | Large response | Adjust timeout settings |

### NewsAPI

| Issue | Possible Cause | Solution |
|-------|----------------|----------|
| 401 Unauthorized | Invalid API key | Check API key in env variables |
| 429 Too Many Requests | Daily quota exceeded | Implement caching |
| Empty results | Poor keywords | Improve keyword extraction |