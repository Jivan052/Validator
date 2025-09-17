import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import './ViewMoreButton.css';

const ViewMoreText = ({ text, maxLength = 300 }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Only show view more button if text exceeds max length
  const shouldTruncate = text && text.length > maxLength;
  
  // Function to truncate text with markdown awareness
  const truncateText = (text, maxLength) => {
    if (!text || text.length <= maxLength) return text;
    
    // Try to find a good breaking point (end of sentence, paragraph or list item)
    const breakPoints = [
      text.lastIndexOf('. ', maxLength),
      text.lastIndexOf('\n', maxLength),
      text.lastIndexOf('- ', maxLength),
      text.lastIndexOf('* ', maxLength),
      text.lastIndexOf('# ', maxLength),
      text.lastIndexOf('## ', maxLength)
    ];
    
    // Filter out invalid break points (-1)
    const validBreakPoints = breakPoints.filter(point => point > maxLength / 2);
    
    // Use the latest valid break point or just truncate at maxLength if none found
    const breakPoint = validBreakPoints.length > 0 
      ? Math.max(...validBreakPoints) + 1  // +1 to include the period or newline
      : maxLength;
    
    return text.substring(0, breakPoint) + '...';
  };

  return (
    <div className="view-more-container">
      <ReactMarkdown>
        {isExpanded ? text : truncateText(text, maxLength)}
      </ReactMarkdown>
      
      {shouldTruncate && (
        <button 
          onClick={() => setIsExpanded(!isExpanded)} 
          className="view-more-button"
        >
          {isExpanded ? 'View less' : 'View more'}
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24" 
            strokeWidth={1.5} 
            stroke="currentColor" 
            className="w-4 h-4 ml-1"
          >
            {isExpanded 
              ? <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" /> 
              : <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            }
          </svg>
        </button>
      )}
    </div>
  );
};

export default ViewMoreText;