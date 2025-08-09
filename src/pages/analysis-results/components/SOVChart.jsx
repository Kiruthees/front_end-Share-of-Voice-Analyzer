import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

import Button from '../../../components/ui/Button';

const SOVChart = ({ data, onBrandSelect, selectedBrand }) => {
  const [chartType, setChartType] = useState('bar');

  const chartData = [
    { brand: 'Atomberg', mentions: 45, sov: 32.1, color: '#1E40AF' },
    { brand: 'Havells', mentions: 38, sov: 27.1, color: '#6366F1' },
    { brand: 'Orient', mentions: 25, sov: 17.9, color: '#10B981' },
    { brand: 'Crompton', mentions: 18, sov: 12.9, color: '#F59E0B' },
    { brand: 'Bajaj', mentions: 14, sov: 10.0, color: '#EF4444' }
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      const data = payload?.[0]?.payload;
      return (
        <div className="bg-surface border border-light rounded-lg p-3 shadow-elevated">
          <p className="font-semibold text-text-primary">{data?.brand}</p>
          <p className="text-sm text-text-secondary">
            Mentions: <span className="font-medium">{data?.mentions}</span>
          </p>
          <p className="text-sm text-text-secondary">
            SOV: <span className="font-medium">{data?.sov}%</span>
          </p>
        </div>
      );
    }
    return null;
  };

  const handleBarClick = (data) => {
    onBrandSelect(data?.brand === selectedBrand ? null : data?.brand);
  };

  return (
    <div className="bg-surface rounded-lg border border-light p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-text-primary">Share of Voice Analysis</h2>
          <p className="text-sm text-text-secondary mt-1">Brand mention distribution across search results</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant={chartType === 'bar' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setChartType('bar')}
            iconName="BarChart3"
            iconPosition="left"
          >
            Bar Chart
          </Button>
          <Button
            variant={chartType === 'pie' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setChartType('pie')}
            iconName="PieChart"
            iconPosition="left"
          >
            Pie Chart
          </Button>
        </div>
      </div>
      <div className="h-80">
        {chartType === 'bar' ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis 
                dataKey="brand" 
                tick={{ fontSize: 12, fill: '#6B7280' }}
                axisLine={{ stroke: '#E5E7EB' }}
              />
              <YAxis 
                tick={{ fontSize: 12, fill: '#6B7280' }}
                axisLine={{ stroke: '#E5E7EB' }}
                label={{ value: 'Share of Voice (%)', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="sov" 
                fill="#1E40AF"
                radius={[4, 4, 0, 0]}
                cursor="pointer"
                onClick={handleBarClick}
              >
                {chartData?.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={selectedBrand === entry?.brand ? entry?.color : entry?.color + '80'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                outerRadius={120}
                dataKey="sov"
                label={({ brand, sov }) => `${brand}: ${sov}%`}
              >
                {chartData?.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry?.color}
                    stroke={selectedBrand === entry?.brand ? '#1F2937' : 'none'}
                    strokeWidth={selectedBrand === entry?.brand ? 2 : 0}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
      <div className="mt-6 grid grid-cols-2 md:grid-cols-5 gap-4">
        {chartData?.map((brand) => (
          <button
            key={brand?.brand}
            onClick={() => handleBarClick(brand)}
            className={`p-3 rounded-lg border transition-all duration-200 ${
              selectedBrand === brand?.brand
                ? 'border-primary bg-primary/5' :'border-light hover:border-primary/50'
            }`}
          >
            <div className="flex items-center space-x-2 mb-2">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: brand?.color }}
              />
              <span className="text-sm font-medium text-text-primary">{brand?.brand}</span>
            </div>
            <div className="text-left">
              <p className="text-lg font-semibold text-text-primary">{brand?.sov}%</p>
              <p className="text-xs text-text-secondary">{brand?.mentions} mentions</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default SOVChart;