import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { getUserIdeas } from "../services/firestoreService";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const { currentUser } = useAuth();
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchIdeas = async () => {
      try {
        if (!currentUser) return;
        
        const userIdeas = await getUserIdeas(currentUser.uid);
        setIdeas(userIdeas);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching ideas:", error);
        setError("Failed to load ideas. Please try again later.");
        setLoading(false);
      }
    };

    fetchIdeas();
  }, [currentUser]);

  const formatDate = (timestamp) => {
    if (!timestamp) return "N/A";
    
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  };

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Your Ideas</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        
        {loading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
          </div>
        ) : (
          <div>
            {ideas.length === 0 ? (
              <div className="bg-white shadow overflow-hidden rounded-lg p-6 text-center">
                <p className="text-gray-500">You haven't submitted any ideas yet.</p>
                <Link
                  to="/new"
                  className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Submit Your First Idea
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {ideas.map((idea) => (
                  <div key={idea.id} className="bg-white shadow overflow-hidden rounded-lg">
                    <div className="px-4 py-5 sm:px-6">
                      <h3 className="text-lg leading-6 font-medium text-gray-900 truncate">
                        {idea.ideaText.length > 50
                          ? `${idea.ideaText.substring(0, 50)}...`
                          : idea.ideaText}
                      </h3>
                      <p className="mt-1 max-w-2xl text-sm text-gray-500">
                        Created on {formatDate(idea.createdAt)}
                      </p>
                    </div>
                    <div className="border-t border-gray-200 px-4 py-4 sm:px-6">
                      <div className="flex justify-between items-center">
                        <div className="text-sm">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            idea.status === "completed"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}>
                            {idea.status === "completed" ? "Completed" : "Processing"}
                          </span>
                        </div>
                        <Link
                          to={`/idea/${idea.id}`}
                          className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;