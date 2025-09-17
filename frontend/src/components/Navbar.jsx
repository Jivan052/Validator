import { useAuth } from "../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getUserQuestionCount } from "../services/firestoreService";
import { ChatBubbleBottomCenterTextIcon } from '@heroicons/react/24/outline';

const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [questionCount, setQuestionCount] = useState(0);
  const questionLimit = 5; // Define the question limit
  
  // Fetch the user's question count when the component loads
  useEffect(() => {
    const fetchQuestionCount = async () => {
      if (currentUser) {
        try {
          const count = await getUserQuestionCount(currentUser.uid);
          setQuestionCount(count);
        } catch (error) {
          console.error("Error fetching question count:", error);
        }
      }
    };
    
    fetchQuestionCount();
  }, [currentUser]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  return (
    <nav className="bg-indigo-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link to="/" className="text-white font-bold text-xl">
                Idea Validator
              </Link>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                {currentUser && (
                  <>
                    <Link
                      to="/dashboard"
                      className="text-white hover:bg-indigo-700 px-3 py-2 rounded-md text-sm font-medium"
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/new"
                      className="text-white hover:bg-indigo-700 px-3 py-2 rounded-md text-sm font-medium"
                    >
                      New Idea
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6">
              {currentUser ? (
                <div className="flex items-center">
                  {/* Question Count Indicator */}
                  <div className="mr-4 bg-indigo-800 px-3 py-1 rounded-full flex items-center space-x-2">
                    <ChatBubbleBottomCenterTextIcon className="h-4 w-4 text-indigo-300" />
                    <div>
                      <span className="text-white font-medium text-xs">{questionCount}</span>
                      <span className="text-indigo-300 text-xs">/{questionLimit}</span>
                      <span className="text-indigo-300 text-xs ml-1">questions</span>
                    </div>
                  </div>
                  <span className="text-white mr-4">{currentUser.email}</span>
                  <button
                    onClick={handleLogout}
                    className="bg-indigo-700 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-800"
                  >
                    Log Out
                  </button>
                </div>
              ) : (
                <div>
                  <Link
                    to="/login"
                    className="text-white hover:bg-indigo-700 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Log In
                  </Link>
                  <Link
                    to="/signup"
                    className="bg-white text-indigo-600 ml-2 px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-100"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="bg-indigo-700 inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-indigo-800 focus:ring-white"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <svg
                  className="block h-6 w-6"
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
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
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {currentUser && (
              <>
                <Link
                  to="/dashboard"
                  className="text-white hover:bg-indigo-700 block px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  to="/new"
                  className="text-white hover:bg-indigo-700 block px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  New Idea
                </Link>
              </>
            )}
          </div>
          <div className="pt-4 pb-3 border-t border-indigo-800">
            <div className="px-2 space-y-1">
              {currentUser ? (
                <>
                  <div className="px-3 py-2 text-white">{currentUser.email}</div>
                  {/* Question Count Indicator for Mobile */}
                  <div className="px-3 py-2 mb-2 flex items-center">
                    <div className="bg-indigo-800 px-3 py-1 rounded-full flex items-center space-x-2">
                      <ChatBubbleBottomCenterTextIcon className="h-4 w-4 text-indigo-300" />
                      <div>
                        <span className="text-white font-medium text-xs">{questionCount}</span>
                        <span className="text-indigo-300 text-xs">/{questionLimit}</span>
                        <span className="text-indigo-300 text-xs ml-1">questions used</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                    className="block w-full text-left px-3 py-2 text-white rounded-md text-base font-medium bg-indigo-700 hover:bg-indigo-800"
                  >
                    Log Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="block text-white hover:bg-indigo-700 px-3 py-2 rounded-md text-base font-medium"
                    onClick={() => setIsOpen(false)}
                  >
                    Log In
                  </Link>
                  <Link
                    to="/signup"
                    className="block bg-white text-indigo-600 px-3 py-2 rounded-md text-base font-medium hover:bg-gray-100"
                    onClick={() => setIsOpen(false)}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;