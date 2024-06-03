import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];

// const generateRandomData = () => labels.map(() => Math.floor(Math.random() * (50000 - 10 + 1)) + 10);


export default function VentasByPlans({ billing }) {
  return <Bar
    options={{
      responsive: true,
      maintainAspectRatio: false,
      indexAxis: 'y',
      elements: {
        bar: {
          borderWidth: 2,
        },
      },
      plugins: {
        legend: {
          position: 'bottom',
        },
        title: { display: false, },
      },
      scales: {
        count: { beginAtZero: true, grid: { display: false }, position: 'top', type: 'linear', },
        amount: {
          ticks: {
            callback: function (value, index, values) {
              return '$' + value.toLocaleString();
            }
          }
        }
      }
    }}
    data={{
      labels: billing.map((bill) => bill.plan),
      datasets: [
        {
          label: 'Monto',
          data: billing.map((bill) => bill.amount),
          borderColor: 'rgb(255, 99, 132)',
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          xAxisID: 'amount'
        },
        {
          label: 'Cantidad',
          data: billing.map((bill) => bill.count),
          borderColor: 'rgb(53, 162, 235)',
          backgroundColor: 'rgba(53, 162, 235, 0.2)',
          xAxisID: 'count'
        },
      ]
    }}
  />;
}
