import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const labels = ['ene\'24', 'feb\'24', 'mar\'24', 'abr\'24', 'may\'24', 'jun\'24', 'jul\'24', 'ago\'24', 'sep\'24', 'oct\'24', 'nov\'24', 'dic\'24'];

const generateRandomData = () => labels.map(() => Math.floor(Math.random() * (50000 - 10 + 1)) + 10);

const gradientColor = (context, color1, color2) => {
  const gradient = context.chart.ctx.createLinearGradient(0, 0, 0, context.chart.canvas.parentNode.clientHeight * 1);
  gradient.addColorStop(0, color1);
  gradient.addColorStop(0.6, color2);
  return gradient;
};

export default function VentasOld({ billing }) {
  return <Line
    options={{
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
        },
        title: {
          display: false,
        },
      },
      elements: {
        line: {
          cubicInterpolationMode: 'monotone',
        },
      },
      scales: {
        x: {
          stacked: true,
        },
        y: {
          stacked: true
        }
      }
    }}
    data={{
      labels,
      datasets: [
        {
          label: 'Buenos Aires',
          data: generateRandomData(),
          borderColor: '#5965f9',
          backgroundColor: context => gradientColor(context, '#5965f980', '#5965f900'),
          borderWidth: 2,
          fill: 'start',
        },
        {
          label: 'Boston',
          data: generateRandomData(),
          borderColor: '#0cc18e',
          backgroundColor: context => gradientColor(context, '#0cc18efa', '#0cc18e00'),
          borderWidth: 2,
          fill: 'start',
        },
      ],
    }} />;
}
