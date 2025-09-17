# ValidateIt - Troubleshooting Guide

This document provides solutions to common issues that may arise when using, developing, or deploying the ValidateIt application.

## Table of Contents

1. [Authentication Issues](#authentication-issues)
2. [API Integration Problems](#api-integration-problems)
3. [Firestore Data Issues](#firestore-data-issues)
4. [UI/UX Problems](#uiux-problems)
5. [Performance Issues](#performance-issues)
6. [Development Environment Setup](#development-environment-setup)
7. [Deployment Challenges](#deployment-challenges)
8. [Common Error Messages](#common-error-messages)

## Authentication Issues

### Google Sign-In Not Working

**Symptoms:**
- "Sign in with Google" button does nothing when clicked
- Error message appears when attempting to sign in
- Browser console shows authentication-related errors

**Possible Causes and Solutions:**

1. **Firebase Project Configuration**
   - **Issue:** Google Authentication is not enabled in Firebase console
   - **Solution:** Go to Firebase Console > Authentication > Sign-in methods and ensure Google is enabled

2. **Incorrect OAuth Configuration**
   - **Issue:** Missing or incorrect authorized domains
   - **Solution:** Add your domain to Firebase Console > Authentication > Authorized domains

3. **Popup Blocked**
   - **Issue:** Browser blocking the authentication popup
   - **Solution:** Check for popup blocker notifications and allow popups for the application domain

4. **Environment Variables**
   - **Issue:** Missing or incorrect Firebase configuration variables
   - **Solution:** Verify `.env` file contains correct Firebase config values:
   ```
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

5. **CORS Issues**
   - **Issue:** Cross-Origin Resource Sharing blocking authentication
   - **Solution:** Check browser console for CORS errors and ensure your domain is properly configured

### User Session Issues

**Symptoms:**
- User is unexpectedly logged out
- Authentication state inconsistent between page loads
- Protected routes sometimes redirect to login even when logged in

**Possible Causes and Solutions:**

1. **Firebase Persistence**
   - **Issue:** Session persistence not properly configured
   - **Solution:** Verify persistence is set correctly:
   ```javascript
   // In src/firebase/config.js
   import { setPersistence, browserLocalPersistence } from 'firebase/auth';
   
   setPersistence(auth, browserLocalPersistence);
   ```

2. **Auth State Loading**
   - **Issue:** App not waiting for authentication state to initialize
   - **Solution:** Implement proper loading state handling:
   ```javascript
   // In src/contexts/AuthContext.jsx
   useEffect(() => {
     const unsubscribe = onAuthStateChanged(auth, (user) => {
       setCurrentUser(user);
       setLoading(false);
     });
     
     return unsubscribe;
   }, []);
   ```

3. **Cookie/Storage Issues**
   - **Issue:** Browser cookies or local storage being cleared
   - **Solution:** Check browser settings and ensure third-party cookies aren't blocked

## API Integration Problems

### Google Gemini API Not Responding

**Symptoms:**
- Idea analysis never completes
- Error messages about Gemini API
- Timeout errors in console

**Possible Causes and Solutions:**

1. **API Key Issues**
   - **Issue:** Missing or invalid Gemini API key
   - **Solution:** Verify your `.env` file contains the correct key:
   ```
   VITE_GEMINI_API_KEY=your_gemini_api_key
   ```

2. **Rate Limiting**
   - **Issue:** Exceeding API rate limits
   - **Solution:** Implement exponential backoff and retry logic:
   ```javascript
   const callGeminiWithRetry = async (prompt, retries = 3, delay = 1000) => {
     try {
       return await callGemini(prompt);
     } catch (error) {
       if (error.response && error.response.status === 429 && retries > 0) {
         await new Promise(resolve => setTimeout(resolve, delay));
         return callGeminiWithRetry(prompt, retries - 1, delay * 2);
       }
       throw error;
     }
   };
   ```

3. **Prompt Size**
   - **Issue:** Prompt exceeding maximum token limit
   - **Solution:** Reduce prompt size by limiting news data or trimming business idea description

4. **Network Issues**
   - **Issue:** Network connectivity problems
   - **Solution:** Implement better error handling and retry logic for network failures

### NewsAPI Issues

**Symptoms:**
- No news data in analysis
- Errors related to NewsAPI in console
- Analysis proceeds but lacks news context

**Possible Causes and Solutions:**

1. **API Key Issues**
   - **Issue:** Missing or invalid NewsAPI key
   - **Solution:** Verify your `.env` file contains the correct key:
   ```
   VITE_NEWS_API_KEY=your_news_api_key
   ```

2. **Quota Exceeded**
   - **Issue:** Free tier NewsAPI quota (100 requests/day) exceeded
   - **Solution:** Implement caching of news results or upgrade to a paid plan

3. **Poor Keywords**
   - **Issue:** Keywords not generating relevant news results
   - **Solution:** Improve keyword extraction algorithm in `src/services/newsApiService.js`

4. **CORS Issues**
   - **Issue:** NewsAPI blocking direct browser requests
   - **Solution:** Consider implementing a proxy server or serverless function to make the requests

## Firestore Data Issues

### Data Not Saving

**Symptoms:**
- New ideas not appearing in dashboard
- Changes to ideas not persisting
- Console errors related to Firestore operations

**Possible Causes and Solutions:**

1. **Firestore Rules**
   - **Issue:** Security rules preventing writes
   - **Solution:** Check Firestore security rules and ensure they allow appropriate access:
   ```
   match /ideas/{ideaId} {
     allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
     allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
   }
   ```

2. **Missing Fields**
   - **Issue:** Required fields missing when saving data
   - **Solution:** Ensure all required fields are included in the document:
   ```javascript
   const ideaData = {
     title: formData.title,
     description: formData.description,
     industry: formData.industry,
     targetAudience: formData.targetAudience,
     userId: currentUser.uid,  // Critical field
     createdAt: serverTimestamp(),  // Critical field
     // Other fields...
   };
   ```

3. **Authentication Issues**
   - **Issue:** User not authenticated when trying to save data
   - **Solution:** Verify authentication state before database operations:
   ```javascript
   if (!currentUser) {
     throw new Error("User must be authenticated to save data");
   }
   ```

4. **Quota Limits**
   - **Issue:** Firestore quota limits exceeded
   - **Solution:** Check Firebase usage metrics and consider upgrading your plan

### Data Not Loading

**Symptoms:**
- Dashboard shows loading spinner indefinitely
- Idea details page doesn't display data
- Console shows Firestore read errors

**Possible Causes and Solutions:**

1. **Query Issues**
   - **Issue:** Incorrect query parameters
   - **Solution:** Verify query is constructed correctly:
   ```javascript
   const ideasQuery = query(
     collection(db, "ideas"),
     where("userId", "==", currentUser.uid),
     orderBy("createdAt", "desc")
   );
   ```

2. **Security Rules**
   - **Issue:** Security rules preventing reads
   - **Solution:** Ensure security rules allow reading data for the current user

3. **Data Structure**
   - **Issue:** Unexpected data structure causing rendering issues
   - **Solution:** Implement data validation and handle missing fields gracefully:
   ```javascript
   // Safe access to nested properties
   const marketScore = idea?.analysis?.marketPotential?.score || 0;
   ```

4. **Index Missing**
   - **Issue:** Missing composite index for complex queries
   - **Solution:** Create required indexes based on Firebase console errors

## UI/UX Problems

### Charts Not Rendering

**Symptoms:**
- Empty spaces where charts should appear
- Error messages in console related to chart rendering
- Partial chart display or incorrect data visualization

**Possible Causes and Solutions:**

1. **Missing Data**
   - **Issue:** Data structure for charts is incorrect or missing
   - **Solution:** Ensure data is properly transformed for chart components:
   ```javascript
   // Transform risk factors data for radar chart
   const transformRiskData = (riskFactors) => {
     if (!riskFactors) return defaultRiskData;
     
     return {
       labels: Object.keys(riskFactors),
       datasets: [{
         data: Object.values(riskFactors),
         backgroundColor: 'rgba(75, 192, 192, 0.2)',
         borderColor: 'rgba(75, 192, 192, 1)',
       }]
     };
   };
   ```

2. **Chart Library Issues**
   - **Issue:** Incompatible chart library versions
   - **Solution:** Verify chart library version compatibility and update if needed

3. **Responsive Layout Issues**
   - **Issue:** Chart container dimensions not properly set
   - **Solution:** Ensure chart containers have explicit dimensions:
   ```jsx
   <div className="h-64 w-full">
     <MarketPotentialGauge score={score} explanation={explanation} />
   </div>
   ```

### Responsive Design Issues

**Symptoms:**
- Layout breaks on mobile devices
- Content overflows containers
- Elements overlap or become unusable on small screens

**Possible Causes and Solutions:**

1. **Missing Tailwind Classes**
   - **Issue:** Lack of responsive Tailwind classes
   - **Solution:** Add responsive variants to Tailwind classes:
   ```jsx
   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
     {/* Content */}
   </div>
   ```

2. **Overflow Issues**
   - **Issue:** Content overflowing containers
   - **Solution:** Add overflow handling:
   ```jsx
   <div className="overflow-x-auto">
     {/* Table or wide content */}
   </div>
   ```

3. **Font Size Issues**
   - **Issue:** Text too large or small on different devices
   - **Solution:** Use responsive font sizing:
   ```jsx
   <h1 className="text-xl md:text-2xl lg:text-3xl">Heading</h1>
   ```

## Performance Issues

### Slow Page Loading

**Symptoms:**
- Pages take a long time to initially load
- Dashboard becomes slow with many ideas
- High memory usage reported in browser

**Possible Causes and Solutions:**

1. **Large Bundle Size**
   - **Issue:** JavaScript bundle too large
   - **Solution:** Implement code splitting:
   ```jsx
   // In src/App.jsx
   import { lazy, Suspense } from 'react';
   
   const Dashboard = lazy(() => import('./pages/Dashboard'));
   const IdeaDetails = lazy(() => import('./pages/IdeaDetails'));
   
   // Then in routes
   <Suspense fallback={<div>Loading...</div>}>
     <Route path="/dashboard" element={<Dashboard />} />
   </Suspense>
   ```

2. **Inefficient Firestore Queries**
   - **Issue:** Fetching too much data at once
   - **Solution:** Implement pagination:
   ```javascript
   const fetchIdeas = async (limit = 10) => {
     const ideasQuery = query(
       collection(db, "ideas"),
       where("userId", "==", currentUser.uid),
       orderBy("createdAt", "desc"),
       limit(limit)
     );
     
     return getDocs(ideasQuery);
   };
   ```

3. **Unoptimized Images**
   - **Issue:** Large image files slowing page load
   - **Solution:** Optimize images and implement lazy loading:
   ```jsx
   <img 
     src={imageUrl} 
     loading="lazy" 
     className="w-full h-auto" 
     alt="Description" 
   />
   ```

4. **Excessive Re-renders**
   - **Issue:** Components re-rendering too frequently
   - **Solution:** Use React.memo and useMemo to prevent unnecessary renders:
   ```jsx
   const MemoizedComponent = React.memo(function Component(props) {
     // Component code
   });
   ```

### Analysis Takes Too Long

**Symptoms:**
- Business idea analysis stuck at loading
- Progress indicator moves slowly or stops
- Timeout errors after extended wait

**Possible Causes and Solutions:**

1. **Gemini API Latency**
   - **Issue:** Gemini API taking too long to respond
   - **Solution:** Implement better user feedback and timeout handling:
   ```javascript
   const analyzeWithTimeout = async (prompt) => {
     const timeoutPromise = new Promise((_, reject) => 
       setTimeout(() => reject(new Error('Analysis timed out')), 60000)
     );
     
     const analysisPromise = analyzeBusinessIdea(prompt);
     
     try {
       return await Promise.race([analysisPromise, timeoutPromise]);
     } catch (error) {
       if (error.message === 'Analysis timed out') {
         // Handle timeout gracefully
       }
       throw error;
     }
   };
   ```

2. **Complex Processing**
   - **Issue:** Frontend processing of analysis results too intensive
   - **Solution:** Move complex processing to a worker thread or serverless function

3. **Large Payload**
   - **Issue:** Analysis result payload too large
   - **Solution:** Optimize data structure and implement progressive loading

## Development Environment Setup

### Environment Variables Not Loading

**Symptoms:**
- API calls failing with authentication errors
- Firebase initialization errors
- Console errors about undefined environment variables

**Possible Causes and Solutions:**

1. **Missing .env File**
   - **Issue:** Environment file missing or misnamed
   - **Solution:** Create a `.env` file in the project root with required variables

2. **Incorrect Variable Prefix**
   - **Issue:** Vite requires VITE_ prefix for variables
   - **Solution:** Ensure all variables start with VITE_:
   ```
   VITE_FIREBASE_API_KEY=your_api_key
   ```

3. **Environment Restart Required**
   - **Issue:** Development server not picking up new variables
   - **Solution:** Restart the development server after adding environment variables

### Build Failures

**Symptoms:**
- Build command fails with errors
- Production build missing features that work in development
- Console errors during build process

**Possible Causes and Solutions:**

1. **Dependency Issues**
   - **Issue:** Incompatible or missing dependencies
   - **Solution:** Update package.json and run npm install:
   ```bash
   npm install
   ```

2. **Type Errors**
   - **Issue:** TypeScript errors preventing build
   - **Solution:** Fix type issues or temporarily disable type checking:
   ```json
   // In vite.config.js
   {
     "esbuild": {
       "logOverride": { "eslint-plugin-react-refresh": "silent" }
     }
   }
   ```

3. **Build Configuration**
   - **Issue:** Incorrect Vite configuration
   - **Solution:** Check vite.config.js for errors and update as needed

## Deployment Challenges

### Firebase Hosting Issues

**Symptoms:**
- Deployment fails with Firebase CLI errors
- Deployed app shows blank page
- API calls working locally but failing in production

**Possible Causes and Solutions:**

1. **Firebase Configuration**
   - **Issue:** Missing or incorrect Firebase configuration
   - **Solution:** Check firebase.json configuration and update as needed

2. **Environment Variables**
   - **Issue:** Environment variables not set in production
   - **Solution:** Set environment variables in Firebase console or CI/CD pipeline:
   ```bash
   firebase functions:config:set gemini.key="your_gemini_api_key"
   ```

3. **Build Output Path**
   - **Issue:** Incorrect build output directory in firebase.json
   - **Solution:** Update the public directory in firebase.json:
   ```json
   {
     "hosting": {
       "public": "dist",
       "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
       "rewrites": [
         {
           "source": "**",
           "destination": "/index.html"
         }
       ]
     }
   }
   ```

4. **CORS Configuration**
   - **Issue:** API requests blocked by CORS in production
   - **Solution:** Configure CORS headers appropriately in API services

### Route/Navigation Issues

**Symptoms:**
- 404 errors when accessing routes directly
- Back button not working properly
- Routes that work locally fail in production

**Possible Causes and Solutions:**

1. **History API Fallback**
   - **Issue:** Server not configured for client-side routing
   - **Solution:** Configure server to redirect all requests to index.html:
   ```json
   // For Firebase, in firebase.json
   {
     "hosting": {
       "rewrites": [
         {
           "source": "**",
           "destination": "/index.html"
         }
       ]
     }
   }
   ```

2. **Base URL Configuration**
   - **Issue:** Incorrect base URL configuration
   - **Solution:** Ensure base URL is correctly configured in vite.config.js:
   ```javascript
   // vite.config.js
   export default defineConfig({
     base: '/',
     // other config
   });
   ```

3. **Router Configuration**
   - **Issue:** Router not properly configured
   - **Solution:** Check React Router configuration:
   ```jsx
   // src/main.jsx
   import { BrowserRouter } from 'react-router-dom';
   
   ReactDOM.createRoot(document.getElementById('root')).render(
     <React.StrictMode>
       <BrowserRouter>
         <App />
       </BrowserRouter>
     </React.StrictMode>
   );
   ```

## Common Error Messages

### "Firebase: Error (auth/unauthorized-domain)"

**Cause:** The domain trying to authenticate is not authorized in Firebase console

**Solution:**
1. Go to Firebase Console > Authentication > Sign-in methods
2. Add your domain to the "Authorized domains" list
3. If testing locally, ensure `localhost` is in the list

### "Error fetching news data: Request failed with status code 429"

**Cause:** NewsAPI rate limit exceeded (100 requests per day on free tier)

**Solution:**
1. Implement caching for news results
2. Upgrade to a paid NewsAPI plan
3. Add fallback logic when limit is exceeded:
```javascript
try {
  const newsData = await fetchNewsData(keywords);
  return newsData;
} catch (error) {
  if (error.response && error.response.status === 429) {
    console.warn("News API limit exceeded, proceeding without news data");
    return []; // Continue without news data
  }
  throw error;
}
```

### "Quota exceeded for quota metric 'Tokens' and limit 'Tokens per day'"

**Cause:** Google Gemini API quota limit reached

**Solution:**
1. Implement quota tracking and user limiting
2. Upgrade Gemini API plan
3. Add graceful degradation:
```javascript
try {
  const analysis = await analyzeBusinessIdea(ideaDetails, newsData);
  return analysis;
} catch (error) {
  if (error.message.includes('Quota exceeded')) {
    setError("Our AI service is currently at capacity. Please try again later.");
  }
  throw error;
}
```

### "TypeError: Cannot read properties of undefined (reading 'score')"

**Cause:** Attempting to access nested properties that don't exist in the analysis result

**Solution:**
1. Implement optional chaining and default values:
```javascript
const marketScore = analysis?.marketPotential?.score ?? 0;
```

2. Add data validation before rendering:
```javascript
if (!analysis || !analysis.marketPotential) {
  return <div>Analysis data incomplete. Please try again.</div>;
}
```

## Additional Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Vite Documentation](https://vitejs.dev/guide/)
- [React Router Documentation](https://reactrouter.com/docs/en/v6)
- [Google Gemini API Documentation](https://ai.google.dev/docs)
- [NewsAPI Documentation](https://newsapi.org/docs)

## Getting Additional Help

If you're still experiencing issues after trying the solutions in this troubleshooting guide:

1. Check the GitHub repository issues section for similar problems
2. Join our Discord community for real-time support
3. Contact support at support@validateit-app.com (placeholder example)
4. Submit a detailed bug report including steps to reproduce the issue