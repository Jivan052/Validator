import { useState, useEffect, useRef } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { addIdea, updateIdeaWithAnalysis, checkUserQuestionLimit, getUserQuestionCount } from "../services/firestoreService";
import { extractKeywords, analyzeIdeaWithNews } from "../services/geminiService";
import { getNewsArticles } from "../services/newsApiService";
import { QUESTION_LIMIT } from "../config/constants";

const NewIdea = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [idea, setIdea] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState("");
  const [stuckTimer, setStuckTimer] = useState(0);
  const lastProgressRef = useRef(0);
  const progressTimerRef = useRef(null);
  const [userQuestionCount, setUserQuestionCount] = useState(0);
  const [questionLimitReached, setQuestionLimitReached] = useState(false);
  
  // Effect to check the user's question count on load
  useEffect(() => {
    const checkQuestionCount = async () => {
      if (currentUser) {
        try {
          const count = await getUserQuestionCount(currentUser.uid);
          setUserQuestionCount(count);
          
          const limitReached = await checkUserQuestionLimit(currentUser.uid);
          setQuestionLimitReached(limitReached);
        } catch (error) {
          console.error("Error checking question count:", error);
        }
      }
    };
    
    checkQuestionCount();
  }, [currentUser]);
  
  // Effect to detect when progress gets stuck
  useEffect(() => {
    if (loading && progress > 0 && progress < 100) {
      // Clear any existing timer
      if (progressTimerRef.current) {
        clearInterval(progressTimerRef.current);
      }
      
      // Start a new timer to check if progress is stuck
      lastProgressRef.current = progress;
      let timeStuck = 0;
      
      progressTimerRef.current = setInterval(() => {
        // If progress hasn't changed in 2 seconds, increment the stuck timer
        if (lastProgressRef.current === progress) {
          timeStuck += 1;
          setStuckTimer(timeStuck);
          
          if (timeStuck >= 20) {  // 20 seconds stuck
            console.warn(`Process appears to be stuck at ${progress}% for ${timeStuck} seconds`);
            // Don't clear the interval - we'll continue monitoring
          }
        } else {
          // Progress changed, reset the stuck timer
          timeStuck = 0;
          setStuckTimer(0);
          lastProgressRef.current = progress;
        }
      }, 1000);
      
      // Clean up timer
      return () => {
        if (progressTimerRef.current) {
          clearInterval(progressTimerRef.current);
        }
      };
    } else if (!loading || progress === 100) {
      // Not loading or completed, clear any timer
      setStuckTimer(0);
      if (progressTimerRef.current) {
        clearInterval(progressTimerRef.current);
        progressTimerRef.current = null;
      }
    }
  }, [loading, progress]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!idea.trim()) {
      return setError("Please enter your idea.");
    }
    
    // Check if the user has reached their question limit
    try {
      const limitReached = await checkUserQuestionLimit(currentUser.uid);
      if (limitReached) {
        return setError("You've reached your question limit of " + QUESTION_LIMIT + ". Please request more questions before submitting a new idea for validation.");
      }
    } catch (limitError) {
      console.error("Error checking question limit:", limitError);
    }
    
    try {
      setLoading(true);
      setError("");
      setProgress(10);
      setStatusMessage("Starting analysis...");
      
      // Step 1: Save the idea to Firestore
      setStatusMessage("Saving your idea...");
      const ideaId = await addIdea(currentUser.uid, idea, []);
      console.log("Idea saved with ID:", ideaId);
      
      // Step 2: Extract keywords using Gemini
      setProgress(30);
      setStatusMessage("Extracting keywords...");
      let keywords;
      try {
        keywords = await extractKeywords(idea);
        console.log("Extracted keywords:", keywords);
      } catch (keywordError) {
        console.error("Error extracting keywords:", keywordError);
        // Fallback to manual keywords extraction
        const fallbackKeywords = idea
          .toLowerCase()
          .split(/\s+/)
          .filter(word => word.length > 3)
          .slice(0, 5);
        console.log("Using fallback keywords:", fallbackKeywords);
        keywords = fallbackKeywords;
      }
      
      // Step 3: Get news articles based on keywords
      setProgress(50);
      setStatusMessage("Fetching relevant news articles...");
      let newsArticles;
      try {
        newsArticles = await getNewsArticles(keywords);
        console.log("Fetched news articles:", newsArticles);
      } catch (newsError) {
        console.error("Error fetching news articles:", newsError);
        // Provide a fallback set of empty articles
        newsArticles = [];
      }
      
      // Step 4: Analyze the idea with Gemini
      setProgress(70);
      setStatusMessage("Analyzing your idea...");
      let analysis;
      try {
        analysis = await analyzeIdeaWithNews(idea, newsArticles);
        console.log("Analysis completed");
      } catch (analysisError) {
        console.error("Error analyzing idea:", analysisError);
        // Create a basic fallback analysis
        analysis = {
          ideaSummary: "Analysis could not be generated. Please try again later.",
          marketAnalysis: "Unable to analyze market potential due to an error.",
          trendsAndSentiments: "Trend analysis unavailable at this time.",
          references: [],
          executionSuggestions: "We recommend trying again or refining your idea description.",
          risks: "Risk assessment could not be completed."
        };
      }
      
      // Step 5: Update the idea with news articles and analysis
      setProgress(90);
      setStatusMessage("Finalizing results...");
      await updateIdeaWithAnalysis(ideaId, newsArticles, analysis);
      console.log("Idea updated with analysis");
      
      // Increment the user's question count
      const updatedCount = await getUserQuestionCount(currentUser.uid);
      setUserQuestionCount(updatedCount);
      setQuestionLimitReached(updatedCount >= QUESTION_LIMIT);
      
      setProgress(100);
      setStatusMessage("Analysis complete!");
      
      // Navigate to the idea details page
      navigate(`/idea/${ideaId}`);
    } catch (error) {
      console.error("Error processing idea:", error);
      setError(`Failed to process your idea: ${error.message || "Unknown error"}. Please try again later.`);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h1 className="text-2xl font-bold text-gray-900">Submit a New Idea</h1>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Enter your business idea below and our AI will analyze it for you.
            </p>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                <span className="block sm:inline">{error}</span>
              </div>
            )}
            
            {questionLimitReached && (
              <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mb-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-amber-700">
                      <strong>Question limit reached:</strong> You've used all {userQuestionCount} of your {QUESTION_LIMIT} allowed follow-up questions.
                    </p>
                    <div className="mt-2">
                      <p className="text-sm text-amber-700">
                        Submitting a new idea for validation requires 1 question credit. Please request more questions before proceeding.
                      </p>
                      <button
                        type="button"
                        onClick={() => navigate('/dashboard')}
                        className="mt-2 text-sm text-amber-700 font-medium hover:text-amber-600 inline-flex items-center"
                      >
                        Go to Dashboard to Request More Questions →
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="sm:overflow-hidden">
                <div className="px-4 py-5 bg-white space-y-6 sm:p-6">
                  <div>
                    <label htmlFor="idea" className="block text-sm font-medium text-gray-700">
                      Your Business Idea
                    </label>
                    <div className="mt-1">
                      <textarea
                        id="idea"
                        name="idea"
                        rows={5}
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 rounded-md p-2"
                        placeholder="Describe your business idea in detail. The more information you provide, the better the analysis will be."
                        value={idea}
                        onChange={(e) => setIdea(e.target.value)}
                        disabled={loading}
                      />
                    </div>
                    <p className="mt-2 text-sm text-gray-500">
                      For example: "AI-powered fashion assistant that helps users find perfect outfits based on their style preferences and body type."
                    </p>
                  </div>
                </div>
                <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-500">
                      <span className="font-medium text-indigo-600">{userQuestionCount}</span>
                      <span className="text-gray-500">/{QUESTION_LIMIT} questions used</span>
                    </div>
                    <button
                      type="submit"
                      className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-300 disabled:cursor-not-allowed"
                      disabled={loading || questionLimitReached}
                    >
                      {loading ? "Analyzing..." : questionLimitReached ? "Limit Reached" : "Submit for Analysis"}
                    </button>
                  </div>
                </div>
              </div>
            </form>
            
            {loading && (
              <div className="mt-4">
                <div className="relative pt-1">
                  <div className="flex mb-2 items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-indigo-600 bg-indigo-200">
                        {statusMessage}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-semibold inline-block text-indigo-600">
                        {progress}%
                      </span>
                    </div>
                  </div>
                  <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-indigo-200">
                    <div
                      style={{ width: `${progress}%` }}
                      className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-500 transition-all duration-500"
                    ></div>
                  </div>
                  
                  {/* If progress gets stuck at any percentage for more than 10 seconds, show troubleshooting info */}
                  {stuckTimer >= 10 && (
                    <div className="text-sm text-amber-600 mt-2 bg-amber-50 p-3 rounded border border-amber-200">
                      <p className="font-semibold">Taking longer than expected at {progress}%? ({stuckTimer}s)</p>
                      <p className="mt-1">This could be due to:</p>
                      <ul className="list-disc list-inside mt-1 ml-2">
                        <li>Gemini API connection issues</li>
                        <li>API key configuration problems</li>
                        <li>High server load</li>
                      </ul>
                      <p className="mt-2">The app will continue to try processing your idea.</p>
                      
                      {stuckTimer >= 30 && (
                        <div className="mt-2 pt-2 border-t border-amber-200">
                          <p className="font-semibold">Stuck for over 30 seconds:</p>
                          <ul className="list-disc list-inside mt-1 ml-2">
                            <li>Check the browser console (F12) for detailed error logs</li>
                            <li>Verify your API keys in the .env file</li>
                            <li>Try refreshing the page and submitting again</li>
                          </ul>
                          <button
                            onClick={() => window.location.reload()}
                            className="mt-2 text-xs bg-amber-100 hover:bg-amber-200 text-amber-800 px-2 py-1 rounded"
                          >
                            Refresh Page
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewIdea;