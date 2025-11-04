import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const ConfidenceChart = ({ confidence, prediction }) => {
  const confidencePercentage = (confidence * 100).toFixed(1);
  const remainingPercentage = (100 - confidencePercentage).toFixed(1);

  const data = {
    labels: ['Confidence', 'Uncertainty'],
    datasets: [
      {
        data: [confidencePercentage, remainingPercentage],
        backgroundColor: [
          prediction === 'Defective' ? '#ef4444' : '#22c55e',
          '#e5e7eb',
        ],
        borderColor: [
          prediction === 'Defective' ? '#dc2626' : '#16a34a',
          '#d1d5db',
        ],
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `${context.label}: ${context.parsed}%`;
          },
        },
      },
    },
    cutout: '75%',
  };

  return (
    <div className="relative">
      <div className="h-48 w-48 mx-auto">
        <Doughnut data={data} options={options} />
      </div>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <p className="text-3xl font-bold text-gray-800">{confidencePercentage}%</p>
        <p className="text-sm text-gray-600">Confidence</p>
      </div>
    </div>
  );
};

export default ConfidenceChart;