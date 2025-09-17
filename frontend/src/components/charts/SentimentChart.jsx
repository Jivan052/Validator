import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// Register the required components
ChartJS.register(ArcElement, Tooltip, Legend);

const SentimentChart = ({ sentimentData }) => {
  // Set default values if sentimentData is missing properties
  const positive = parseFloat(sentimentData?.positive) || 0;
  const neutral = parseFloat(sentimentData?.neutral) || 0;
  const negative = parseFloat(sentimentData?.negative) || 0;

  const data = {
    labels: ['Positive', 'Neutral', 'Negative'],
    datasets: [
      {
        data: [positive, neutral, negative],
        backgroundColor: [
          'rgba(75, 192, 112, 0.8)',  // Green for positive
          'rgba(255, 206, 86, 0.8)',  // Yellow for neutral
          'rgba(255, 99, 132, 0.8)',  // Red for negative
        ],
        borderColor: [
          'rgba(75, 192, 112, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(255, 99, 132, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
      title: {
        display: true,
        text: 'Sentiment Analysis',
        font: {
          size: 16,
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.formattedValue || '';
            return `${label}: ${value}%`;
          }
        }
      }
    },
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 h-full">
      <h3 className="text-lg font-medium text-gray-900 mb-2">Sentiment Analysis</h3>
      <div className="h-64">
        <Pie data={data} options={options} />
      </div>
    </div>
  );
};

export default SentimentChart;