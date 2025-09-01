import React from 'react';
import { Card, Typography, Empty } from 'antd';

const { Title } = Typography;

interface RadarChartProps {
  data: { name: string; value: number }[];
  title?: string;
  height?: number;
}

const RadarChart: React.FC<RadarChartProps> = ({ 
  data, 
  title = 'Результаты оценки',
  height = 400 
}) => {
  if (!data || data.length === 0) {
    return (
      <Card title={title} style={{ height }}>
        <Empty description="Нет данных для отображения" />
      </Card>
    );
  }

  // Простая реализация радар-диаграммы с помощью CSS
  const maxValue = Math.max(...data.map(item => item.value));
  const normalizedData = data.map(item => ({
    ...item,
    percentage: (item.value / maxValue) * 100,
  }));

  return (
    <Card title={title} style={{ height }}>
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <div style={{ marginBottom: '20px' }}>
          <Title level={4}>Результаты оценки пациента</Title>
          <p>Показатели нормализованы относительно максимального значения</p>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {normalizedData.map((item, index) => (
            <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ 
                width: '120px', 
                textAlign: 'left', 
                fontSize: '14px',
                fontWeight: '500'
              }}>
                {item.name}
              </div>
              <div style={{ 
                flex: 1, 
                height: '20px', 
                backgroundColor: '#f0f0f0', 
                borderRadius: '10px',
                overflow: 'hidden'
              }}>
                <div
                  style={{
                    width: `${item.percentage}%`,
                    height: '100%',
                    backgroundColor: `hsl(${(index * 60) % 360}, 70%, 50%)`,
                    borderRadius: '10px',
                    transition: 'width 0.3s ease',
                  }}
                />
              </div>
              <div style={{ 
                width: '60px', 
                textAlign: 'right', 
                fontSize: '12px',
                color: '#666'
              }}>
                {item.value.toFixed(1)}
              </div>
            </div>
          ))}
        </div>

        <div style={{ 
          marginTop: '20px', 
          padding: '12px', 
          backgroundColor: '#f8f9fa', 
          borderRadius: '8px',
          fontSize: '12px',
          color: '#666'
        }}>
          <strong>Интерпретация:</strong>
          <ul style={{ margin: '8px 0 0 0', paddingLeft: '20px' }}>
            <li>0-25%: Низкий уровень</li>
            <li>26-50%: Средний уровень</li>
            <li>51-75%: Высокий уровень</li>
            <li>76-100%: Очень высокий уровень</li>
          </ul>
        </div>
      </div>
    </Card>
  );
};

export default RadarChart;
