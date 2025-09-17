/**
 * @fileoverview NewsAPI Service Module
 * 
 * This module provides functionality to interact with the NewsAPI service (https://newsapi.org)
 * to retrieve relevant news articles based on provided keywords. It's used as part of the
 * Idea Validator application to gather market intelligence and trends related to business ideas.
 * 
 * @requires axios - HTTP client for making API requests
 * @requires VITE_NEWS_API_KEY - Environment variable containing the NewsAPI key
 * 
 * @example
 * // Import the service
 * import { getNewsArticles } from "../services/newsApiService";
 * 
 * // Use the service
 * const keywords = ["artificial intelligence", "machine learning"];
 * const articles = await getNewsArticles(keywords);
 */

import axios from "axios";

// NewsAPI service with API key from environment variables
const API_KEY = import.meta.env.VITE_NEWS_API_KEY;
const BASE_URL = "https://newsapi.org/v2";

// Get news articles based on keywords
export const getNewsArticles = async (keywords) => {
  // Validate API key
  if (!API_KEY) {
    throw new Error("NewsAPI key is not configured. Please add it to your .env file.");
  }

  // Ensure keywords is an array
  if (!Array.isArray(keywords)) {
    throw new Error("Keywords must be an array");
  }

  // Ensure there's at least one keyword
  if (keywords.length === 0) {
    throw new Error("At least one keyword is required");
  }

  try {    
    const queryString = keywords.join(" OR ");    
    const response = await axios.get(`${BASE_URL}/everything`, {
      params: {
        q: queryString,
        apiKey: API_KEY,
        language: "en",
        sortBy: "relevancy",
        pageSize: 5,
      },
    });
        
    if (!response.data.articles || response.data.articles.length === 0) {
      console.warn("No articles found for keywords:", keywords);
      // Return a default set of articles if none are found
      return [
        {
          title: "No relevant articles found",
          description: "Please try a different set of keywords or refine your idea description.",
          url: "https://example.com/no-articles"
        }
      ];
    }
    
    return response.data.articles;
  } catch (error) {
    console.error("Error details:", error.response?.data || "No response data");
    
    // Return a default set of articles on error
    return [
      {
        title: "Error fetching articles",
        description: "There was an error connecting to the news service. Please try again later.",
        url: "https://example.com/error"
      }
    ];
  }
};