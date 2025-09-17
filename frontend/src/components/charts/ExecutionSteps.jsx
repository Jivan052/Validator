const ExecutionSteps = ({ steps }) => {
  return (
    <div className="bg-white rounded-lg shadow p-4 h-full">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Execution Roadmap</h3>
      
      <div className="relative">
        {/* Vertical timeline line */}
        <div className="absolute h-full w-0.5 bg-gray-200 left-2.5 top-0"></div>
        
        <ul className="space-y-4">
          {steps && steps.map((step, index) => (
            <li key={index} className="ml-8 relative">
              {/* Timeline circle */}
              <div className="absolute w-5 h-5 rounded-full bg-indigo-500 -left-8 mt-1.5 flex items-center justify-center">
                <span className="text-white text-xs">{index + 1}</span>
              </div>
              
              {/* Content */}
              <div className="p-3 bg-indigo-50 rounded-md">
                <p className="text-sm text-gray-800">{step}</p>
              </div>
            </li>
          ))}
          
          {(!steps || steps.length === 0) && (
            <li className="ml-8 relative">
              <div className="absolute w-5 h-5 rounded-full bg-gray-300 -left-8 mt-1.5"></div>
              <div className="p-3 bg-gray-50 rounded-md">
                <p className="text-sm text-gray-500">No execution steps available</p>
              </div>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default ExecutionSteps;