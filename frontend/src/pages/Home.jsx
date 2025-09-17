import { useAuth } from "../contexts/AuthContext";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { checkUserQuestionLimit } from "../services/firestoreService";

const Home = () => {
  const { currentUser } = useAuth();
  const [questionLimitReached, setQuestionLimitReached] = useState(false);
  
  useEffect(() => {
    const checkLimit = async () => {
      if (currentUser) {
        try {
          const limitReached = await checkUserQuestionLimit(currentUser.uid);
          setQuestionLimitReached(limitReached);
        } catch (error) {
          console.error("Error checking question limit:", error);
        }
      }
    };
    
    checkLimit();
  }, [currentUser]);

  return (
    <div className="bg-white">
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            <svg
              className="hidden lg:block absolute right-0 inset-y-0 h-full w-48 text-white transform translate-x-1/2"
              fill="currentColor"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <polygon points="50,0 100,0 50,100 0,100" />
            </svg>

            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="sm:text-center lg:text-left">
                <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                  <span className="block xl:inline">Validate your business</span>{" "}
                  <span className="block text-indigo-600 xl:inline">ideas with AI</span>
                </h1>
                <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                  Get instant feedback on your business ideas using AI-powered
                  analysis and real-time market data. Our platform uses advanced
                  AI technology and the latest news to help you make informed
                  decisions.
                </p>
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                  {currentUser ? (
                    <>
                      <div className="rounded-md shadow">
                        <Link
                          to="/new"
                          className={`w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white ${
                            questionLimitReached ? 
                            "bg-gray-400 cursor-not-allowed" : 
                            "bg-indigo-600 hover:bg-indigo-700"
                          } md:py-4 md:text-lg md:px-10`}
                          onClick={(e) => questionLimitReached && e.preventDefault()}
                        >
                          {questionLimitReached ? "Question Limit Reached" : "Validate New Idea"}
                        </Link>
                      </div>
                      {questionLimitReached && (
                        <div className="mt-3 sm:mt-0 sm:ml-3">
                          <Link
                            to="/dashboard"
                            className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-amber-600 hover:bg-amber-700 md:py-4 md:text-lg md:px-10"
                          >
                            Request More Questions
                          </Link>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="rounded-md shadow">
                      <Link
                        to="/login"
                        className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10"
                      >
                        Sign in with Google
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </main>
          </div>
        </div>
        <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
          <img
            className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full"
            src="https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2850&q=80"
            alt="People working on laptops"
          />
        </div>
      </div>
      
      {/* Feature Section */}
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">
              Features
            </h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              A better way to validate your ideas
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              Leverage AI, data visualizations, and real-time market data to quickly validate your business ideas.
            </p>
          </div>

          <div className="mt-10">
            <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
              <div className="relative">
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                    <svg
                      className="h-6 w-6"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900">
                    Visual Analytics
                  </p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-gray-500">
                  Interactive charts and visual representations help you quickly understand market potential, sentiment analysis, and risk factors.
                </dd>
              </div>

              <div className="relative">
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                    <svg
                      className="h-6 w-6"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                      />
                    </svg>
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900">
                    Real-time Market Analysis
                  </p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-gray-500">
                  Get insights from the latest news articles and market trends related to your business idea, with sentiment analysis visualization.
                </dd>
              </div>

              <div className="relative">
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                    <svg
                      className="h-6 w-6"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"
                      />
                    </svg>
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900">
                    SWOT Analysis
                  </p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-gray-500">
                  AI-generated SWOT analysis helps you identify Strengths, Weaknesses, Opportunities, and Threats with color-coded visual presentation.
                </dd>
              </div>

              <div className="relative">
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                    <svg
                      className="h-6 w-6"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900">
                    Risk Assessment Charts
                  </p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-gray-500">
                  Visual radar charts help you understand potential risks across regulatory, market, technical, and financial dimensions.
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
      
      {/* Visual Demo Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center mb-10">
            <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">
              Visual Analysis
            </h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              See your idea from every angle
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              Our visual analysis tools help you understand your idea's potential at a glance.
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-xl overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800">Business Idea Analysis Dashboard</h3>
            </div>
            
            {/* Mockup of the visual dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 bg-indigo-50">
              {/* SWOT Analysis Mockup */}
              <div className="md:col-span-2">
                <div className="bg-white rounded-lg shadow p-4">
                  <h4 className="text-lg font-medium text-gray-800 mb-3">SWOT Analysis</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-green-50 p-3 rounded-md">
                      <h5 className="font-medium text-green-700 mb-1">Strengths</h5>
                      <div className="h-4 bg-green-100 rounded mb-2"></div>
                      <div className="h-4 bg-green-100 rounded mb-2"></div>
                      <div className="h-4 bg-green-100 rounded"></div>
                    </div>
                    <div className="bg-red-50 p-3 rounded-md">
                      <h5 className="font-medium text-red-700 mb-1">Weaknesses</h5>
                      <div className="h-4 bg-red-100 rounded mb-2"></div>
                      <div className="h-4 bg-red-100 rounded mb-2"></div>
                      <div className="h-4 bg-red-100 rounded"></div>
                    </div>
                    <div className="bg-blue-50 p-3 rounded-md">
                      <h5 className="font-medium text-blue-700 mb-1">Opportunities</h5>
                      <div className="h-4 bg-blue-100 rounded mb-2"></div>
                      <div className="h-4 bg-blue-100 rounded mb-2"></div>
                      <div className="h-4 bg-blue-100 rounded"></div>
                    </div>
                    <div className="bg-yellow-50 p-3 rounded-md">
                      <h5 className="font-medium text-yellow-700 mb-1">Threats</h5>
                      <div className="h-4 bg-yellow-100 rounded mb-2"></div>
                      <div className="h-4 bg-yellow-100 rounded mb-2"></div>
                      <div className="h-4 bg-yellow-100 rounded"></div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Chart Mockup */}
              <div>
                <div className="bg-white rounded-lg shadow p-4 h-full">
                  <h4 className="text-lg font-medium text-gray-800 mb-3">Sentiment Analysis</h4>
                  <div className="flex items-center justify-center h-36">
                    <div className="w-36 h-36 rounded-full border-8 border-gray-200 relative">
                      <div className="absolute inset-0 rounded-full overflow-hidden">
                        <div className="bg-green-500 h-full w-2/3"></div>
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-2xl font-bold text-gray-700">65%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Bottom Row */}
              <div>
                <div className="bg-white rounded-lg shadow p-4">
                  <h4 className="text-lg font-medium text-gray-800 mb-2">Market Potential</h4>
                  <div className="flex justify-center">
                    <div className="w-24 h-24 rounded-full bg-indigo-100 flex items-center justify-center border-4 border-indigo-500">
                      <span className="text-2xl font-bold text-indigo-700">8/10</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <div className="bg-white rounded-lg shadow p-4">
                  <h4 className="text-lg font-medium text-gray-800 mb-2">Risk Factors</h4>
                  <div className="flex justify-center">
                    <div className="w-32 h-32 bg-gray-100 rounded-lg relative">
                      {/* Simplified radar chart mockup */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-24 h-24 bg-red-200 rounded-full opacity-50"></div>
                        <div className="absolute w-20 h-20 bg-red-300 rounded-full"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <div className="bg-white rounded-lg shadow p-4">
                  <h4 className="text-lg font-medium text-gray-800 mb-2">Time to Market</h4>
                  <div className="flex justify-center items-center h-24">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600">6</div>
                      <div className="text-gray-500">months</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;