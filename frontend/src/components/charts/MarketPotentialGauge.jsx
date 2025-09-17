import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// Register the required components
ChartJS.register(ArcElement, Tooltip, Legend);

const MarketPotentialGauge = ({ score }) => {
  // Parse the score as a number, default to 0 if invalid
  const parsedScore = parseInt(score, 10) || 0;
  
  const data = {
    labels: ['Potential', 'Remaining'],
    datasets: [
      {
        data: [parsedScore, 10 - parsedScore],
        backgroundColor: [
          'rgba(54, 162, 235, 0.8)',  // Blue for potential
          'rgba(220, 220, 220, 0.3)',  // Light gray for remaining
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(220, 220, 220, 1)',
        ],
        borderWidth: 1,
        cutout: '70%',
      },
    ],
  };
  
  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false,
      },
    },
    rotation: -90,
    circumference: 180,
    maintainAspectRatio: false,
  };
  
  const textCenter = {
    id: 'textCenter',
    beforeDatasetsDraw(chart) {
      const { ctx, data } = chart;
      
      ctx.save();
      ctx.font = 'bold 24px Arial';
      ctx.fillStyle = 'rgba(54, 162, 235, 1)';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      const score = data.datasets[0].data[0] || 0;
      const text = `${score}/10`;
      const xCoor = chart.getDatasetMeta(0).data[0].x;
      const yCoor = chart.getDatasetMeta(0).data[0].y;
      
      ctx.fillText(text, xCoor, yCoor - 10);
      
      // Add label
      ctx.font = '14px Arial';
      ctx.fillStyle = '#666';
      ctx.fillText('Market Potential', xCoor, yCoor + 15);
      
      ctx.restore();
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow p-4 h-full">
      <h3 className="text-lg font-medium text-gray-900 mb-2">Market Potential</h3>
      <div className="h-44 relative mt-4">
        <Doughnut data={data} options={options} plugins={[textCenter]} />
      </div>
    </div>
  );
};

export default MarketPotentialGauge;