import { CheckCircleIcon } from '@heroicons/react/24/solid';

const KeyTrends = ({ trends }) => {
  return (
    <div className="bg-white rounded-lg shadow p-4 h-full">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Key Market Trends</h3>
      
      <ul className="space-y-2">
        {trends && trends.map((trend, index) => (
          <li key={index} className="flex items-start">
            <CheckCircleIcon className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
            <span className="text-sm text-gray-700">{trend}</span>
          </li>
        ))}
        
        {(!trends || trends.length === 0) && (
          <li className="text-sm text-gray-500">
            No trend data available
          </li>
        )}
      </ul>
    </div>
  );
};

export default KeyTrends;