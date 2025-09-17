import { Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';

// Register the required components
ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

const RiskFactorsChart = ({ riskFactors }) => {
  // Set default values if riskFactors is missing properties
  const regulatory = parseFloat(riskFactors?.regulatory) || 0;
  const market = parseFloat(riskFactors?.market) || 0;
  const technical = parseFloat(riskFactors?.technical) || 0;
  const financial = parseFloat(riskFactors?.financial) || 0;
  
  const data = {
    labels: ['Regulatory Risk', 'Market Risk', 'Technical Risk', 'Financial Risk'],
    datasets: [
      {
        label: 'Risk Level (1-10)',
        data: [regulatory, market, technical, financial],
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
    ],
  };
  
  const options = {
    responsive: true,
    scales: {
      r: {
        angleLines: {
          display: true,
        },
        suggestedMin: 0,
        suggestedMax: 10,
      },
    },
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
  };
  
  return (
    <div className="bg-white rounded-lg shadow p-4 h-full">
      <h3 className="text-lg font-medium text-gray-900 mb-2">Risk Assessment</h3>
      <div className="h-64">
        <Radar data={data} options={options} />
      </div>
    </div>
  );
};

export default RiskFactorsChart;