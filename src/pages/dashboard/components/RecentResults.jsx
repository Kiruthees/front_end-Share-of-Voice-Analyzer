import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from 'recharts';

const RecentResults = ({ results, onViewAll }) => {
  const chartColors = ['#1E40AF', '#6366F1', '#F59E0B', '#10B981', '#EF4444'];

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date?.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (results?.length === 0) {
    return (
      <div className="bg-surface rounded-lg border border-light shadow-soft p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-success/10 rounded-lg flex items-center justify-center">
              <Icon name="TrendingUp" size={16} className="text-success" />
            </div>
            <h2 className="text-lg font-semibold text-text-primary">Recent Results</h2>
          </div>
        </div>
        
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="BarChart3" size={24} className="text-text-secondary" />
          </div>
          <h3 className="text-sm font-medium text-text-primary mb-2">No Results Yet</h3>
          <p className="text-xs text-text-secondary">Complete your first analysis to see results here</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface rounded-lg border border-light shadow-soft">
      <div className="p-4 border-b border-light">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-success/10 rounded-lg flex items-center justify-center">
              <Icon name="TrendingUp" size={16} className="text-success" />
            </div>
            <h2 className="text-lg font-semibold text-text-primary">Recent Results</h2>
          </div>
          <Button variant="ghost" size="sm" onClick={onViewAll}>
            View All
          </Button>
        </div>
      </div>
      <div className="divide-y divide-border">
        {results?.slice(0, 3)?.map((result, index) => (
          <div key={result?.id} className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-medium text-text-primary">
                  {result?.keyword}
                </h3>
                <p className="text-xs text-text-secondary">
                  {formatTimestamp(result?.timestamp)} • {result?.brandsFound} brands
                </p>
              </div>
              <Button variant="ghost" size="sm" iconName="ExternalLink">
                View
              </Button>
            </div>

            <div className="h-20 mb-3">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={result?.topBrands?.slice(0, 5)}>
                  <XAxis 
                    dataKey="name" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fill: '#6B7280' }}
                  />
                  <YAxis hide />
                  <Bar dataKey="sov" radius={[2, 2, 0, 0]}>
                    {result?.topBrands?.slice(0, 5)?.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={chartColors?.[index % chartColors?.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="text-xs">
                  <span className="text-text-secondary">Top Brand: </span>
                  <span className="font-medium text-text-primary">
                    {result?.topBrands?.[0]?.name} ({result?.topBrands?.[0]?.sov}%)
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-1">
                {result?.topBrands?.slice(0, 3)?.map((brand, brandIndex) => (
                  <div
                    key={brandIndex}
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: chartColors?.[brandIndex % chartColors?.length] }}
                  />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentResults;