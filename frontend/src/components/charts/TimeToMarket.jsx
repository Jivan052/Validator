const TimeToMarket = ({ timeToMarket }) => {
  // Parse the time to market as a number, default to 0 if invalid
  const parsedTime = parseInt(timeToMarket, 10) || 0;
  
  // Determine the classification of the time to market
  let timeClass, timeLabel;
  if (parsedTime <= 3) {
    timeClass = "bg-green-100 text-green-800 border-green-300";
    timeLabel = "Fast";
  } else if (parsedTime <= 6) {
    timeClass = "bg-blue-100 text-blue-800 border-blue-300";
    timeLabel = "Medium";
  } else if (parsedTime <= 12) {
    timeClass = "bg-yellow-100 text-yellow-800 border-yellow-300";
    timeLabel = "Long";
  } else {
    timeClass = "bg-red-100 text-red-800 border-red-300";
    timeLabel = "Very Long";
  }
  
  return (
    <div className="bg-white rounded-lg shadow p-4 h-full flex flex-col justify-center items-center">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Time to Market</h3>
      
      <div className={`text-center p-4 rounded-full w-32 h-32 flex flex-col justify-center border-2 ${timeClass}`}>
        <span className="text-3xl font-bold">{parsedTime}</span>
        <span className="text-sm">months</span>
      </div>
      
      <div className={`mt-3 px-3 py-1 rounded-full text-sm font-semibold ${timeClass}`}>
        {timeLabel}
      </div>
    </div>
  );
};

export default TimeToMarket;