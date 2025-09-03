import * as React from 'react';
import { Card, Typography } from 'antd';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import { Radar } from 'react-chartjs-2';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

const { Title } = Typography;

interface RadarChartProps {
  data: { 
    labels: string[];
    datasets: Array<{
      label: string;
      data: number[];
      backgroundColor?: string;
      borderColor?: string;
    }>;
  } | { name: string; value: number }[];
  title?: string;
  height?: number;
}

const RadarChart: React.FC<RadarChartProps> = ({ 
  data, 
  title = 'Результаты оценки',
  height = 600 
}) => {
  if (!data) {
    return (
      <Card title={title} style={{ height }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
          <div>Нет данных для отображения</div>
        </div>
      </Card>
    );
  }

  // Проверяем формат данных
  const isChartData = 'labels' in data && 'datasets' in data;
  
  if (isChartData) {
    // Формат с labels и datasets
    const chartData = data as { labels: string[]; datasets: Array<{ label: string; data: number[] }> };
    
    if (!chartData.labels || chartData.labels.length === 0 || !chartData.datasets || chartData.datasets.length === 0) {
      return (
        <Card title={title} style={{ height }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
            <div>Нет данных для отображения</div>
          </div>
        </Card>
      );
    }

    // Настройки для Chart.js
    const options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top' as const,
          labels: {
            usePointStyle: true,
            padding: 20,
            font: {
              size: 14,
              weight: 'bold',
            },
          },
        },
        title: {
          display: true,
          text: 'Сравнение результатов при поступлении и выписке',
          font: {
            size: 18,
            weight: 'bold',
          },
          padding: 25,
        },
        tooltip: {
          mode: 'index' as const,
          intersect: false,
          backgroundColor: 'rgba(0, 0, 0, 0.9)',
          titleColor: '#fff',
          bodyColor: '#fff',
          borderColor: '#ddd',
          borderWidth: 1,
          titleFont: {
            size: 14,
            weight: 'bold',
          },
          bodyFont: {
            size: 13,
          },
        },
      },
      scales: {
        r: {
          beginAtZero: true,
          max: 7,
          min: 0,
          ticks: {
            stepSize: 1,
            color: '#666',
            font: {
              size: 12,
            },
            callback: function(value: any) {
              return value + ' баллов';
            },
          },
          grid: {
            color: '#ddd',
            lineWidth: 1,
          },
          pointLabels: {
            color: '#333',
            font: {
              size: 11,
              weight: 'bold',
            },
            padding: 15,
            callback: function(value: any) {
              // Сокращаем длинные названия
              if (value.length > 20) {
                return value.substring(0, 20) + '...';
              }
              return value;
            },
          },
          angleLines: {
            color: '#ddd',
            lineWidth: 1,
          },
        },
      },
      elements: {
        point: {
          radius: 4,
          hoverRadius: 6,
        },
        line: {
          tension: 0.1,
        },
      },
    };

    return (
      <Card title={title} style={{ height }}>
        <div style={{ height: height - 120, padding: '30px' }}>
          <Radar data={chartData} options={options} />
        </div>
      </Card>
    );
  } else {
    // Формат с массивом { name, value }
    const arrayData = data as { name: string; value: number }[];
    
    if (!Array.isArray(arrayData) || arrayData.length === 0) {
      return (
        <Card title={title} style={{ height }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
            <div>Нет данных для отображения</div>
          </div>
        </Card>
      );
    }

    // Конвертируем в формат Chart.js
    const chartData = {
      labels: arrayData.map(item => item.name),
      datasets: [{
        label: 'Оценки',
        data: arrayData.map(item => item.value),
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(54, 162, 235, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(54, 162, 235, 1)',
      }],
    };

    const options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top' as const,
          labels: {
            usePointStyle: true,
            padding: 20,
            font: {
              size: 14,
              weight: 'bold',
            },
          },
        },
        title: {
          display: true,
          text: 'Результаты оценки пациента',
          font: {
            size: 16,
            weight: 'bold',
          },
          padding: 20,
        },
        tooltip: {
          mode: 'index' as const,
          intersect: false,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          titleColor: '#fff',
          bodyColor: '#fff',
          borderColor: '#ddd',
          borderWidth: 1,
        },
      },
      scales: {
        r: {
          beginAtZero: true,
          max: 7,
          min: 0,
          ticks: {
            stepSize: 1,
            color: '#666',
            font: {
              size: 12,
            },
            callback: function(value: any) {
              return value + ' баллов';
            },
          },
          grid: {
            color: '#ddd',
            lineWidth: 1,
          },
          pointLabels: {
            color: '#333',
            font: {
              size: 11,
              weight: 'bold',
            },
            padding: 15,
            callback: function(value: any) {
              // Сокращаем длинные названия
              if (value.length > 20) {
                return value.substring(0, 20) + '...';
              }
              return value;
            },
          },
          angleLines: {
            color: '#ddd',
            lineWidth: 1,
          },
        },
      },
      elements: {
        point: {
          radius: 4,
          hoverRadius: 6,
        },
        line: {
          tension: 0.1,
        },
      },
    };

    return (
      <Card title={title} style={{ height }}>
        <div style={{ height: height - 100, padding: '20px' }}>
          <Radar data={chartData} options={options} />
        </div>
      </Card>
    );
  }
};

export default RadarChart;
