// Utility to transform old analysis format to the new format
export const transformAnalysisFormat = (analysis) => {
  // Check if this is already in the new format
  if (analysis.marketPotential || analysis.sentimentAnalysis || analysis.swotAnalysis) {
    return analysis; // Already in the new format
  }
  
  // This is the old format, let's transform it
  return {
    ideaSummary: analysis.ideaSummary || "No summary available",
    
    marketPotential: {
      score: "5", // Default middle score
      summary: analysis.marketAnalysis ? 
        analysis.marketAnalysis.split('.')[0] + '.' : // Take first sentence 
        "No market analysis available"
    },
    
    marketAnalysis: {
      keyPoints: extractBulletPoints(analysis.marketAnalysis, 4),
      competitors: ["Data not available in this format"]
    },
    
    sentimentAnalysis: {
      positive: 50, // Default balanced sentiment
      neutral: 25,
      negative: 25
    },
    
    swotAnalysis: {
      strengths: extractBulletPoints(analysis.marketAnalysis, 3, "strength", "advantage", "benefit"),
      weaknesses: extractBulletPoints(analysis.marketAnalysis, 3, "weakness", "challenge", "issue"),
      opportunities: extractBulletPoints(analysis.marketAnalysis, 3, "opportunity", "potential", "growth"),
      threats: extractBulletPoints(analysis.marketAnalysis, 3, "threat", "risk", "competitor")
    },
    
    keyTrends: extractBulletPoints(analysis.trendsAndSentiments, 4, "trend", "growing", "emerging"),
    
    references: analysis.references || [],
    
    executionSteps: analysis.executionSuggestions ? 
      analysis.executionSuggestions.split('\n')
        .map(line => line.trim())
        .filter(line => line.startsWith('-') || line.startsWith('•'))
        .map(line => line.replace(/^[-•]\s*/, ''))
        .slice(0, 6) : 
      ["Step 1: Validate concept", "Step 2: Research market", "Step 3: Develop MVP", "Step 4: Gather feedback"],
    
    riskFactors: {
      regulatory: calculateRiskScore(analysis.risks, ["regulation", "compliance", "legal", "government"]),
      market: calculateRiskScore(analysis.risks, ["market", "demand", "customer", "competition"]),
      technical: calculateRiskScore(analysis.risks, ["technical", "technology", "development", "engineering"]),
      financial: calculateRiskScore(analysis.risks, ["financial", "funding", "cost", "investment"])
    },
    
    timeToMarket: "6" // Default value
  };
};

// Helper function to extract bullet points from text
const extractBulletPoints = (text, count = 3, ...keywords) => {
  if (!text) return Array(count).fill("No data available");
  
  // Split by sentences
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  
  if (keywords && keywords.length > 0) {
    // Find sentences containing keywords
    const relevantSentences = sentences.filter(sentence => 
      keywords.some(keyword => 
        sentence.toLowerCase().includes(keyword.toLowerCase())
      )
    );
    
    if (relevantSentences.length > 0) {
      return relevantSentences
        .slice(0, count)
        .map(s => s.trim());
    }
  }
  
  // If no keywords matched or no keywords provided, return first N sentences
  return sentences
    .slice(0, count)
    .map(s => s.trim());
};

// Helper function to calculate risk scores based on keyword presence
const calculateRiskScore = (risksText, keywords) => {
  if (!risksText) return 5; // Default middle value
  
  let score = 5; // Start with middle score
  const text = risksText.toLowerCase();
  
  // Count how many keywords are present
  const matches = keywords.filter(keyword => text.includes(keyword.toLowerCase())).length;
  
  // Adjust score based on matches (more matches = higher risk)
  if (matches > 2) return 8;
  if (matches > 0) return 7;
  
  return score;
};