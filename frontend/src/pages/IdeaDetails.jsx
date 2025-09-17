import { useEffect, useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { getIdeaById, addFollowUpQuestion, checkUserQuestionLimit, getUserQuestionCount } from "../services/firestoreService";
import { handleFollowUpQuestion } from "../services/geminiService";
import { useAuth } from "../contexts/AuthContext";
import ReactMarkdown from "react-markdown";
import ViewMoreText from "../components/ViewMoreText";
import { ChartBarIcon, ArrowPathIcon, LightBulbIcon, QuestionMarkCircleIcon, ExclamationTriangleIcon, ChatBubbleBottomCenterTextIcon } from '@heroicons/react/24/outline';
import MarketPotentialGauge from "../components/charts/MarketPotentialGauge";
import SentimentChart from "../components/charts/SentimentChart";
import RiskFactorsChart from "../components/charts/RiskFactorsChart";
import SwotAnalysis from "../components/charts/SwotAnalysis";
import ExecutionSteps from "../components/charts/ExecutionSteps";
import TimeToMarket from "../components/charts/TimeToMarket";
import KeyTrends from "../components/charts/KeyTrends";
import CompetitorsList from "../components/charts/CompetitorsList";
import RequestMoreQuestionsForm from "../components/RequestMoreQuestionsForm";
import { transformAnalysisFormat } from "../utils/analysisTransformer";

const IdeaDetails = () => {
  const { ideaId } = useParams();
  const { currentUser } = useAuth();
  const [idea, setIdea] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [followUpQuestion, setFollowUpQuestion] = useState("");
  const [askingQuestion, setAskingQuestion] = useState(false);
  const [questionLimitReached, setQuestionLimitReached] = useState(false);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [userQuestionCount, setUserQuestionCount] = useState(0);
  const questionLimit = 5; // Define the limit as a constant
  
  // Transform analysis data to new format if needed
  const analysisData = useMemo(() => {
    if (!idea || !idea.analysis) return null;
    return transformAnalysisFormat(idea.analysis);
  }, [idea]);

  useEffect(() => {
    const fetchIdea = async () => {
      try {
        const ideaData = await getIdeaById(ideaId);
        
        // Check if the idea belongs to the current user
        if (ideaData.userId !== currentUser.uid) {
          setError("You do not have permission to view this idea.");
          setLoading(false);
          return;
        }
        
        setIdea(ideaData);
        
        // Get the user's question count
        const count = await getUserQuestionCount(currentUser.uid);
        setUserQuestionCount(count);
        
        // Check if the user has reached their question limit
        setQuestionLimitReached(count >= questionLimit);
        
        setLoading(false);
      } catch (error) {
        console.error("Error fetching idea:", error);
        setError("Failed to load idea details. Please try again later.");
        setLoading(false);
      }
    };

    fetchIdea();
  }, [ideaId, currentUser, questionLimit]);

  const handleSubmitQuestion = async (e) => {
    e.preventDefault();
    
    if (!followUpQuestion.trim()) return;
    
    // Check if user has reached their question limit
    try {
      const limitReached = await checkUserQuestionLimit(currentUser.uid);
      
      if (limitReached) {
        setQuestionLimitReached(true);
        setShowRequestForm(true);
        return;
      }
      
      setAskingQuestion(true);
      
      // Get previous questions for context
      const previousQuestions = idea.questions || [];
      
      // Get answer from Gemini
      const answer = await handleFollowUpQuestion(
        followUpQuestion,
        idea.ideaText,
        analysisData, // Use transformed analysis data
        previousQuestions
      );
      
      // Save question and answer to Firestore and increment question count
      await addFollowUpQuestion(ideaId, followUpQuestion, answer, currentUser.uid);
      
      // Update local state - use the same timestamp format as in firestoreService.js
      const now = new Date();
      const updatedIdea = {
        ...idea,
        questions: [
          ...(idea.questions || []),
          {
            question: followUpQuestion,
            answer,
            timestamp: now,
          },
        ],
        updatedAt: now, // Also update the updatedAt field to maintain consistency
      };
      
      setIdea(updatedIdea);
      setFollowUpQuestion("");
      setAskingQuestion(false);
      
      // Update the user's question count and check if they've reached the limit
      const count = await getUserQuestionCount(currentUser.uid);
      setUserQuestionCount(count);
      setQuestionLimitReached(count >= questionLimit);
    } catch (error) {
      console.error("Error asking follow-up question:", error);
      setError("Failed to process your question. Please try again later.");
      setAskingQuestion(false);
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "N/A";
    
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
    }).format(date);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg animate-pulse">
          {/* Header Skeleton */}
          <div className="px-4 py-5 sm:px-6">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          </div>
          
          {/* Content Skeleton */}
          <div className="border-t border-gray-200 px-6 py-5 bg-gray-50">
            <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-24 bg-gray-200 rounded mb-6"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="col-span-1 h-40 bg-gray-200 rounded"></div>
              <div className="col-span-1 h-40 bg-gray-200 rounded"></div>
              <div className="col-span-2 h-40 bg-gray-200 rounded"></div>
            </div>
          </div>
          
          {/* Charts Skeleton */}
          <div className="p-6">
            <div className="h-6 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <div className="md:col-span-2 h-64 bg-gray-200 rounded"></div>
              <div className="h-64 bg-gray-200 rounded"></div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="h-48 bg-gray-200 rounded"></div>
              <div className="h-48 bg-gray-200 rounded"></div>
              <div className="h-48 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      </div>
    );
  }

  if (!idea) {
    return (
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">Idea not found.</span>
        </div>
      </div>
    );
  }

  // If idea is still processing
  if (idea.status === "processing") {
    return (
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">{idea.ideaText}</h1>
          <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto"></div>
              <p className="mt-4 text-lg text-gray-500">
                Your idea is still being analyzed. Please check back later.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h1 className="text-2xl font-bold text-gray-900">{idea.ideaText}</h1>
            <p className="mt-1 text-sm text-gray-500">
              Submitted on {formatDate(idea.createdAt)}
            </p>
          </div>
          
          {/* Header Summary */}
          <div className="border-t border-gray-200 px-6 py-5 bg-indigo-50">
            <div className="flex items-center mb-4">
              <LightBulbIcon className="h-6 w-6 text-indigo-600 mr-2" />
              <h2 className="text-xl font-semibold text-indigo-800">Idea Analysis Dashboard</h2>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm mb-6">
              <p className="text-gray-800 font-medium mb-1">Summary</p>
              <div className="text-gray-600">
                <ViewMoreText text={analysisData.ideaSummary} maxLength={250} />
              </div>
            </div>
            
            {/* Market Potential and Time to Market */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="col-span-1">
                <MarketPotentialGauge score={analysisData.marketPotential?.score} />
              </div>
              <div className="col-span-1">
                <TimeToMarket timeToMarket={analysisData.timeToMarket} />
              </div>
              <div className="col-span-2">
                <div className="bg-white rounded-lg shadow p-4 h-full">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Market Insight</h3>
                  <div className="text-gray-600">
                    <ViewMoreText text={analysisData.marketPotential?.summary} maxLength={200} />
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Main Analysis Results */}
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <ChartBarIcon className="h-5 w-5 mr-2 text-indigo-500" />
              Detailed Analysis
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {/* SWOT Analysis - Spans 2 columns */}
              <div className="md:col-span-2">
                <SwotAnalysis swotData={analysisData.swotAnalysis} />
              </div>
              
              {/* Sentiment Chart */}
              <div>
                <SentimentChart sentimentData={analysisData.sentimentAnalysis} />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {/* Risk Factors Chart */}
              <div>
                <RiskFactorsChart riskFactors={analysisData.riskFactors} />
              </div>
              
              {/* Key Trends */}
              <div>
                <KeyTrends trends={analysisData.keyTrends} />
              </div>
              
              {/* Competitors */}
              <div>
                <CompetitorsList competitors={analysisData.marketAnalysis?.competitors} />
              </div>
            </div>
            
            {/* Execution Steps */}
            <div className="mb-8">
              <ExecutionSteps steps={analysisData.executionSteps} />
            </div>
            
            {/* References */}
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4">References & Sources</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {analysisData.references && analysisData.references.map((reference, index) => (
                  <a 
                    key={index}
                    href={reference.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center p-2 bg-gray-50 hover:bg-indigo-50 rounded-md transition-colors duration-200"
                  >
                    <span className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 text-sm mr-3">
                      {index + 1}
                    </span>
                    <span className="text-sm text-gray-800 hover:text-indigo-700 truncate">
                      {reference.title}
                    </span>
                  </a>
                ))}
                {(!analysisData.references || analysisData.references.length === 0) && (
                  <p className="text-gray-500 text-sm">No references available</p>
                )}
              </div>
            </div>
          </div>
          
          {/* Follow-up Questions */}
          <div className="border-t border-gray-200 px-6 py-5 bg-indigo-50">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center">
                <QuestionMarkCircleIcon className="h-6 w-6 text-indigo-600 mr-2" />
                <h2 className="text-xl font-semibold text-indigo-800">Follow-up Questions</h2>
              </div>
              
              {/* Question Count Badge */}
              <div className="bg-white shadow-sm rounded-full px-4 py-2 flex items-center space-x-2">
                <ChatBubbleBottomCenterTextIcon className="h-5 w-5 text-indigo-500" />
                <div>
                  <span className="font-medium text-indigo-600">{userQuestionCount}</span>
                  <span className="text-gray-600">/{questionLimit} questions used</span>
                </div>
              </div>
            </div>
            
            {showRequestForm ? (
              <div className="mb-6">
                <RequestMoreQuestionsForm onClose={() => setShowRequestForm(false)} />
              </div>
            ) : (
              <>
                {/* Question limit warning */}
                {questionLimitReached && (
                  <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mb-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <ExclamationTriangleIcon className="h-5 w-5 text-amber-400" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-amber-700">
                          <strong>Question limit reached:</strong> You've used all {userQuestionCount} of your {questionLimit} allowed follow-up questions across all ideas.
                        </p>
                        <div className="mt-2">
                          <button
                            type="button"
                            onClick={() => setShowRequestForm(true)}
                            className="text-sm text-amber-700 font-medium hover:text-amber-600"
                          >
                            Request more questions →
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Ask new question form */}
                <form onSubmit={handleSubmitQuestion} className="bg-white rounded-lg shadow-sm p-4 mb-6">
                  <label htmlFor="follow-up-question" className="block text-sm font-medium text-gray-700 mb-2">
                    Ask for more details or clarification about your idea
                  </label>
                  <div className="mt-1">
                    <textarea
                      id="follow-up-question"
                      name="follow-up-question"
                      rows={2}
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 rounded-md p-3"
                      placeholder="E.g., What are the biggest technical challenges I'll face?"
                      value={followUpQuestion}
                      onChange={(e) => setFollowUpQuestion(e.target.value)}
                      disabled={askingQuestion || questionLimitReached}
                    />
                  </div>
                  <div className="mt-3 flex justify-between items-center">
                    <div className="flex items-center">
                      {!questionLimitReached ? (
                        <div className="flex items-center text-sm">
                          <span className="font-medium text-indigo-600">{userQuestionCount}</span>
                          <span className="text-gray-500">/{questionLimit} questions used across all ideas</span>
                          <span className="mx-2 text-gray-400">|</span>
                          <span className="text-gray-500">
                            {idea?.questions?.length || 0} questions on this idea
                          </span>
                        </div>
                      ) : (
                        <div className="text-sm font-medium text-red-600">
                          Limit reached: {userQuestionCount}/{questionLimit}
                        </div>
                      )}
                    </div>
                    <button
                      type="submit"
                      className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-300 disabled:cursor-not-allowed"
                      disabled={askingQuestion || !followUpQuestion.trim() || questionLimitReached}
                    >
                      {askingQuestion ? (
                        <>
                          <ArrowPathIcon className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" />
                          Processing...
                        </>
                      ) : questionLimitReached ? (
                        "Limit Reached"
                      ) : (
                        "Ask Question"
                      )}
                    </button>
                  </div>
                </form>
              </>
            )}
            
            {/* List of previous questions */}
            {idea.questions && idea.questions.length > 0 ? (
              <div className="space-y-4">
                {idea.questions.map((qa, index) => (
                  <div key={index} className="bg-white shadow-sm rounded-lg overflow-hidden">
                    <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                      <div className="flex items-start">
                        <div className="bg-indigo-100 text-indigo-700 rounded-full w-8 h-8 flex items-center justify-center mr-3 flex-shrink-0 mt-1">
                          Q
                        </div>
                        <div>
                          <p className="text-gray-800 font-medium">{qa.question}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            Asked on {formatDate(qa.timestamp)}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="px-4 py-4">
                      <div className="flex">
                        <div className="bg-green-100 text-green-700 rounded-full w-8 h-8 flex items-center justify-center mr-3 flex-shrink-0 mt-1">
                          A
                        </div>
                        <div className="flex-1">
                          <div className="text-gray-700 answer-content bg-white p-3 rounded-md">
                            <ViewMoreText text={qa.answer} maxLength={300} />
                          </div>
                          <p className="mt-2 text-xs text-gray-500">
                            Answered {qa.timestamp && formatDate(qa.timestamp)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm p-6 text-center">
                <QuestionMarkCircleIcon className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No questions asked yet. Use the form above to ask your first question.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IdeaDetails;