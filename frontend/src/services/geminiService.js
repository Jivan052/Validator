import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Google Generative AI SDK with your API key from environment variables
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// Verify API key is available
if (!API_KEY) {
  console.error("CRITICAL: Gemini API key is missing from environment variables!");
  console.error("Please ensure you have VITE_GEMINI_API_KEY set in your .env file");
}

// Initialize Gemini client with API key
console.log("Initializing Gemini API client");
let genAI;
try {
  genAI = new GoogleGenerativeAI(API_KEY);
} catch (error) {
  console.error("Failed to initialize Gemini API client:", error);
  // Create a stub that will throw appropriate errors when used
  genAI = {
    getGenerativeModel: () => {
      throw new Error("Gemini API client failed to initialize. Check your API key configuration.");
    }
  };
}

// Extract keywords from the user's idea
export const extractKeywords = async (idea) => {
  // Check if API key is set
  if (!API_KEY) {
    throw new Error("Gemini API key is not configured. Please add it to your .env file.");
  }
  
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
  
  const prompt = `
    Extract 3-5 most relevant keywords from the following business idea. 
    Return only the keywords as a JSON array of strings, without any markdown formatting, code blocks, or additional text.
    
    Business Idea: ${idea}
    
    Your response should be only: ["keyword1", "keyword2", "keyword3"]
    No markdown, no code blocks, no additional explanation.
  `;
  
  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    let text = response.text();
    // Clean up the response to handle potential markdown formatting
    text = text.trim();
    
    // Remove markdown code block markers if present
    if (text.includes("```")) {
      // Extract content between the closest pair of ``` markers
      const match = text.match(/```(?:json)?\s*([\s\S]*?)```/);
      if (match && match[1]) {
        text = match[1].trim();
      } else {
        // If we can't find a proper code block, remove all ``` characters
        text = text.replace(/```/g, "");
      }
    }
    
    // Remove any "json" language identifier that might be present
    text = text.replace(/^json\s+/i, "");
    
    // Ensure the text is a valid JSON array by checking if it starts with [ and ends with ]
    if (!(text.startsWith("[") && text.endsWith("]"))) {
      throw new Error("Response is not a valid JSON array");
    }
    
    const keywords = JSON.parse(text);
    return keywords;
  } catch (error) {
    console.error("Error extracting keywords:", error);
    // Generate fallback keywords from the idea
    const fallbackKeywords = idea
      .split(/\s+/)
      .filter(word => word.length > 3)
      .slice(0, 5);
    console.log("Using fallback keywords due to error:", fallbackKeywords);
    return fallbackKeywords;
  }
};

// Analyze the idea and news articles
export const analyzeIdeaWithNews = async (idea, newsArticles) => {
  // Check if API key is set
  if (!API_KEY) {
    throw new Error("Gemini API key is not configured. Please add it to your .env file.");
  }
  
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
  
  // Format the news articles for the prompt
  const formattedNews = newsArticles.length > 0 
    ? newsArticles.map((article, index) => {
        return `
          Article ${index + 1}:
          Title: ${article.title}
          Description: ${article.description || 'No description available'}
          URL: ${article.url}
        `;
      }).join("\n\n")
    : "No relevant news articles found. Please provide general market analysis.";
  
  console.log(`Formatting ${newsArticles.length} news articles for analysis`);
  
  const prompt = `
    You are a business idea validator assistant. Analyze the following business idea and related news articles to provide structured feedback that can be easily visualized.
    
    BUSINESS IDEA:
    ${idea}
    
    RELEVANT NEWS ARTICLES:
    ${formattedNews}
    
    Please provide analysis in the following JSON format:
    {
      "ideaSummary": "A concise summary of the idea (max 2 sentences)",
      "marketPotential": {
        "score": "A score from 1-10 rating the market potential",
        "summary": "A brief 1-2 sentence explanation of the score"
      },
      "marketAnalysis": {
        "keyPoints": ["3-4 key bullet points about the market (each max 15 words)"],
        "competitors": ["3-5 main competitors or similar companies in this space"]
      },
      "sentimentAnalysis": {
        "positive": "Percentage of positive sentiment in news (e.g., 65)",
        "neutral": "Percentage of neutral sentiment in news (e.g., 20)",
        "negative": "Percentage of negative sentiment in news (e.g., 15)"
      },
      "swotAnalysis": {
        "strengths": ["3-4 brief bullet points about strengths (each max 10 words)"],
        "weaknesses": ["3-4 brief bullet points about weaknesses (each max 10 words)"],
        "opportunities": ["3-4 brief bullet points about opportunities (each max 10 words)"],
        "threats": ["3-4 brief bullet points about threats (each max 10 words)"]
      },
      "keyTrends": ["3-5 current trends in this market (each max 15 words)"],
      "references": [
        {
          "title": "Reference title",
          "url": "Reference URL"
        }
      ],
      "executionSteps": ["5-6 specific, actionable steps to execute (each max 15 words)"],
      "riskFactors": {
        "regulatory": "Risk score from 1-10",
        "market": "Risk score from 1-10",
        "technical": "Risk score from 1-10",
        "financial": "Risk score from 1-10"
      },
      "timeToMarket": "Estimated time to market in months (e.g., 6)"
    }
    
    Keep all text extremely concise, focusing on visualization-friendly data points. Return ONLY the JSON object without any additional text, explanation, or markdown formatting.
  `;
  
  try {
    const result = await model.generateContent(prompt);
    
    const response = result.response;
    let text = response.text();
    
    // Clean up the response to handle potential markdown formatting
    text = text.trim();
    
    // Remove markdown code block markers if present
    if (text.includes("```")) {
      console.log("Markdown code block detected in analysis, cleaning up...");
      // Extract content between the closest pair of ``` markers
      const match = text.match(/```(?:json)?\s*([\s\S]*?)```/);
      if (match && match[1]) {
        text = match[1].trim();
      } else {
        // If we can't find a proper code block, remove all ``` characters
        text = text.replace(/```/g, "");
      }
    }
    
    // Remove any "json" language identifier that might be present
    text = text.replace(/^json\s+/i, "");
    
    // Ensure the text is a valid JSON object by checking if it starts with { and ends with }
    if (!(text.startsWith("{") && text.endsWith("}"))) {
      throw new Error("Response is not a valid JSON object");
    }
    
    console.log("Parsing analysis JSON response");
    const analysisResult = JSON.parse(text);
    return analysisResult;
  } catch (error) {
    console.error("Error analyzing idea:", error);
    // Return a fallback analysis with error information
    return {
      ideaSummary: "Unable to generate a complete analysis at this time.",
      marketPotential: {
        score: "N/A",
        summary: "Analysis unavailable due to technical difficulties."
      },
      marketAnalysis: {
        keyPoints: ["Analysis currently unavailable.", "Please try again later."],
        competitors: ["Data unavailable"]
      },
      sentimentAnalysis: {
        positive: 0,
        neutral: 0,
        negative: 0
      },
      swotAnalysis: {
        strengths: ["Analysis unavailable"],
        weaknesses: ["Analysis unavailable"],
        opportunities: ["Analysis unavailable"],
        threats: ["Analysis unavailable"]
      },
      keyTrends: ["Analysis currently unavailable"],
      references: [
        {
          title: "Error Information",
          url: "#"
        }
      ],
      executionSteps: ["Unable to provide suggestions due to technical difficulties"],
      riskFactors: {
        regulatory: 0,
        market: 0,
        technical: 0,
        financial: 0
      },
      timeToMarket: "N/A",
      error: error.message
    };
  }
};

// Handle follow-up questions about the idea
export const handleFollowUpQuestion = async (question, idea, analysis, previousQuestions = []) => {
  // Check if API key is set
  if (!API_KEY) {
    throw new Error("Gemini API key is not configured. Please add it to your .env file.");
  }
  
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
  
  // Format the previous conversation for context
  const formattedPreviousQuestions = previousQuestions.map((q, i) => {
    return `Q${i+1}: ${q.question}\nA${i+1}: ${q.answer}`;
  }).join("\n\n");
  
  // Convert analysis object to string for the prompt
  const analysisString = JSON.stringify(analysis, null, 2);
  
  const prompt = `
    You are a business idea validator assistant. Answer the following follow-up question based on the business idea and your previous analysis.
    
    BUSINESS IDEA:
    ${idea}
    
    YOUR PREVIOUS ANALYSIS:
    ${analysisString}
    
    ${previousQuestions.length > 0 ? `PREVIOUS QUESTIONS AND ANSWERS:\n${formattedPreviousQuestions}` : ''}
    
    FOLLOW-UP QUESTION:
    ${question}
    
    IMPORTANT GUIDELINES FOR YOUR RESPONSE:
    1. Be concise and direct - keep your response under 150 words
    2. Use bullet points for key information instead of lengthy paragraphs
    3. Bold important terms or conclusions using markdown (**term**)
    4. Organize the answer with clear section headers if applicable
    5. Format numbers and statistics in an easily scannable way
    6. Focus only on the most relevant information to the specific question
    7. Use a professional, actionable tone
    8. Avoid unnecessary preambles or summaries
    
    Your response should be structured, visually appealing, and quickly digestible.
  `;
  
  try {
    const result = await model.generateContent(prompt);
    
    const response = result.response;
    const text = response.text();
    
    // Process the response to ensure proper formatting
    const processedText = text
      // Ensure markdown headers have space after #
      .replace(/###(?=[^\s])/g, '### ')
      .replace(/##(?=[^\s])/g, '## ')
      .replace(/#(?=[^\s])/g, '# ')
      // Ensure bullet points have proper spacing
      .replace(/•(?=[^\s])/g, '• ')
      .replace(/-(?=[^\s])/g, '- ')
      .replace(/\*(?=[^\s])/g, '* ')
      // Add spacing between sections
      .replace(/\n{3,}/g, '\n\n')
      .trim();
      
    return processedText;
  } catch (error) {
    return `I'm sorry, but I encountered an error while processing your question: ${error.message}. Please try asking a different question or try again later.`;
  }
};