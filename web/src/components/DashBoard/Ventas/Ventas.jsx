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

const startColor = parseInt('5965f9', 16);
const endColor = parseInt('0cc18e', 16);


export default function Ventas({ billing }) {

  return <Bar
    options={{
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
        },
        title: { display: false, },
      },
      scales: {
        x: { stacked: true, },
        y: {
          stacked: true,
          ticks: {
            callback: function (value, index, values) {
              return '$' + value.toLocaleString();
            }
          }
        }
      },
    }}
    data={{
      labels: billing.labels,
      datasets: billing.datasets.map((bill) => {
        const background = (Math.floor(Math.random() * (endColor - startColor + 1)) + startColor).toString(16).padStart(6, '0');
        return {
          data: billing.labels.map((blabel) =>
            bill.amounts
              .filter(({ label }) => label === blabel)
              // .map(({ amount }) => amount)
              .reduce((acc, curr) => acc + curr.amount, 0)
          ),
          label: bill.firstName,
          borderColor: bill.color ?? '#' + background,
          backgroundColor: context => gradientColor(context, (bill.color ?? '#' + background) + '00', (bill.color ?? '#' + background) + 'aa'),
          borderWidth: 2,
        }
      }),
    }} />;
}
