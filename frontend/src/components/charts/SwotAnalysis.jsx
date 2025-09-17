const SwotAnalysis = ({ swotData }) => {
  const { strengths = [], weaknesses = [], opportunities = [], threats = [] } = swotData || {};
  
  return (
    <div className="bg-white rounded-lg shadow p-4 h-full">
      <h3 className="text-lg font-medium text-gray-900 mb-4">SWOT Analysis</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Strengths */}
        <div className="bg-green-50 rounded-md p-4">
          <h4 className="font-medium text-green-800 mb-2">Strengths</h4>
          <ul className="list-disc list-inside text-sm space-y-1">
            {strengths.map((item, index) => (
              <li key={`strength-${index}`} className="text-gray-800">{item}</li>
            ))}
            {strengths.length === 0 && <li className="text-gray-500">No data available</li>}
          </ul>
        </div>
        
        {/* Weaknesses */}
        <div className="bg-red-50 rounded-md p-4">
          <h4 className="font-medium text-red-800 mb-2">Weaknesses</h4>
          <ul className="list-disc list-inside text-sm space-y-1">
            {weaknesses.map((item, index) => (
              <li key={`weakness-${index}`} className="text-gray-800">{item}</li>
            ))}
            {weaknesses.length === 0 && <li className="text-gray-500">No data available</li>}
          </ul>
        </div>
        
        {/* Opportunities */}
        <div className="bg-blue-50 rounded-md p-4">
          <h4 className="font-medium text-blue-800 mb-2">Opportunities</h4>
          <ul className="list-disc list-inside text-sm space-y-1">
            {opportunities.map((item, index) => (
              <li key={`opportunity-${index}`} className="text-gray-800">{item}</li>
            ))}
            {opportunities.length === 0 && <li className="text-gray-500">No data available</li>}
          </ul>
        </div>
        
        {/* Threats */}
        <div className="bg-yellow-50 rounded-md p-4">
          <h4 className="font-medium text-yellow-800 mb-2">Threats</h4>
          <ul className="list-disc list-inside text-sm space-y-1">
            {threats.map((item, index) => (
              <li key={`threat-${index}`} className="text-gray-800">{item}</li>
            ))}
            {threats.length === 0 && <li className="text-gray-500">No data available</li>}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SwotAnalysis;