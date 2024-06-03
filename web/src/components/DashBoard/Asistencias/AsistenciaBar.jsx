import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
);

const gradientColor = (context, color1, color2) => {
  const gradient = context.chart.ctx.createLinearGradient(0, 0, 0, context.chart.canvas.parentNode.clientHeight * 1);
  gradient.addColorStop(0, color1);
  gradient.addColorStop(0.8, color2);
  return gradient;
};

export default function AsistenciaBar({ assistences }) {
  return <Bar
    options={{
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'bottom', },
        title: { display: false, },
      },
    }}
    data={{
      labels: assistences.labels,
      datasets: [
        {
          label: 'Buenos Aires',
          data: assistences.labels.map((label) => {
            return assistences.datasets
              .find(({ assistanceDay, locationName }) =>
                locationName === 'Buenos Aires' && assistanceDay === label
              )?.count ?? 0
          }),
          borderColor: '#5965f9',
          backgroundColor: context => gradientColor(context, '#5965f980', '#5965f900'),
          borderWidth: 2,
          fill: 'start',
        },
        {
          label: 'Boston',
          data: assistences.labels.map((label) => {
            return assistences.datasets
              .find(({ assistanceDay, locationName }) =>
                locationName === 'Boston' && assistanceDay === label
              )?.count ?? 0
          }),
          borderColor: '#0cc18e',
          backgroundColor: context => gradientColor(context, '#0cc18efa', '#0cc18e00'),
          borderWidth: 2,
          fill: 'start',
        },
      ]
    }}
  />;
}