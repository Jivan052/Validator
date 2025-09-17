import { UserGroupIcon } from '@heroicons/react/24/outline';

const CompetitorsList = ({ competitors }) => {
  return (
    <div className="bg-white rounded-lg shadow p-4 h-full">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Key Competitors</h3>
      
      <div className="space-y-3">
        {competitors && competitors.map((competitor, index) => (
          <div key={index} className="flex items-center p-2 bg-gray-50 rounded-md">
            <UserGroupIcon className="h-6 w-6 text-gray-500 mr-3" />
            <span className="text-sm text-gray-800">{competitor}</span>
          </div>
        ))}
        
        {(!competitors || competitors.length === 0) && (
          <div className="text-sm text-gray-500 p-2">
            No competitor data available
          </div>
        )}
      </div>
    </div>
  );
};

export default CompetitorsList;