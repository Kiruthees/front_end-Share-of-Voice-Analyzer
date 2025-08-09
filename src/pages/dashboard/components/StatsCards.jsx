import React from 'react';
import Icon from '../../../components/AppIcon';

const StatsCards = ({ stats }) => {
  const statsData = [
    {
      id: 'total-analyses',
      title: 'Total Analyses',
      value: stats?.totalAnalyses || 0,
      change: '+12%',
      changeType: 'positive',
      icon: 'BarChart3',
      color: 'primary'
    },
    {
      id: 'api-usage',
      title: 'API Usage Today',
      value: `${stats?.apiUsage || 0}%`,
      change: '2,847 calls',
      changeType: 'neutral',
      icon: 'Zap',
      color: 'secondary'
    },
    {
      id: 'success-rate',
      title: 'Success Rate',
      value: `${stats?.successRate || 0}%`,
      change: '+5.2%',
      changeType: 'positive',
      icon: 'CheckCircle',
      color: 'success'
    },
    {
      id: 'avg-processing',
      title: 'Avg Processing',
      value: `${stats?.avgProcessingTime || 0}s`,
      change: '-8s',
      changeType: 'positive',
      icon: 'Clock',
      color: 'accent'
    }
  ];

  const getColorClasses = (color) => {
    const colorMap = {
      primary: 'bg-primary/10 text-primary',
      secondary: 'bg-secondary/10 text-secondary',
      success: 'bg-success/10 text-success',
      accent: 'bg-accent/10 text-accent',
      warning: 'bg-warning/10 text-warning',
      error: 'bg-error/10 text-error'
    };
    return colorMap?.[color] || colorMap?.primary;
  };

  const getChangeClasses = (changeType) => {
    switch (changeType) {
      case 'positive':
        return 'text-success';
      case 'negative':
        return 'text-error';
      default:
        return 'text-text-secondary';
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
      {statsData?.map((stat) => (
        <div
          key={stat?.id}
          className="bg-surface rounded-lg border border-light shadow-soft p-4 hover:shadow-elevated transition-shadow duration-200"
        >
          <div className="flex items-center justify-between mb-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getColorClasses(stat?.color)}`}>
              <Icon name={stat?.icon} size={18} />
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-text-primary">
                {stat?.value}
              </div>
            </div>
          </div>
          
          <div className="space-y-1">
            <h3 className="text-sm font-medium text-text-primary">
              {stat?.title}
            </h3>
            <div className="flex items-center justify-between">
              <span className={`text-xs font-medium ${getChangeClasses(stat?.changeType)}`}>
                {stat?.change}
              </span>
              <span className="text-xs text-text-secondary">
                vs last week
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;