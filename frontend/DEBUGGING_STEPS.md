# Debugging Steps for "Stuck at 30%" Issue

## Issue Description
- The application gets stuck at 30% progress during idea analysis
- This occurs specifically during the keyword extraction phase using the Gemini API

## Enhanced Debugging
We've added comprehensive logging and error handling to help identify the issue:

1. **Check Browser Console Logs**:
   - Open the browser's developer tools (F12 or right-click -> Inspect)
   - Navigate to the "Console" tab
   - Submit a new idea and watch for the logs
   - Look specifically for logs showing:
     - "Initializing Gemini API with model: gemini-2.0-flash"
     - "Sending prompt to Gemini API"
     - Any error messages

2. **Verify Environment Variables**:
   - Ensure VITE_GEMINI_API_KEY is correctly set in .env
   - Confirm no trailing spaces or quotes in the API key

3. **Fallback Mechanism**:
   - We've implemented a fallback keyword extraction that will use simple word extraction if the API fails
   - This should allow the process to continue past 30% even if Gemini API fails

4. **API Key Status**:
   - Verify your Gemini API key is active and has sufficient quota
   - Check if there are any restrictions on your Gemini API key

5. **Model Availability**:
   - We've updated to use "gemini-2.0-flash" as requested
   - If the issue persists, check if this model is available for your API key

## How to Test the Fix
1. Run the application
2. Submit a new business idea
3. Watch the browser console for logs
4. Monitor if the progress moves beyond 30%

If the progress still gets stuck at 30%, check the console logs for specific error messages that will help identify the exact issue.

## Solutions for Common Issues

### If "API key not valid" appears:
- Double-check the API key in .env
- Ensure it's properly activated in Google AI Studio

### If "Model not found" appears:
- Try changing to a different Gemini model like "gemini-1.0-pro" in geminiService.js

### If timeout errors occur:
- The API might be overloaded, try again later
- Consider implementing a retry mechanism

### If parsing errors appear:
- The response format might be unexpected
- Check the raw response format in console logs