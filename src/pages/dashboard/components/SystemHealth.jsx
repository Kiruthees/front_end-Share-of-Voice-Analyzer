import React from 'react';
import Icon from '../../../components/AppIcon';

const SystemHealth = ({ healthData }) => {
  const healthMetrics = [
    {
      id: 'google-api',
      name: 'Google Search API',
      status: healthData?.googleApi || 'operational',
      responseTime: '120ms',
      uptime: '99.9%'
    },
    {
      id: 'openai-api',
      name: 'OpenAI API',
      status: healthData?.openaiApi || 'operational',
      responseTime: '850ms',
      uptime: '99.8%'
    },
    {
      id: 'scraping-service',
      name: 'Web Scraping',
      status: healthData?.scrapingService || 'operational',
      responseTime: '2.1s',
      uptime: '99.5%'
    },
    {
      id: 'database',
      name: 'Database',
      status: healthData?.database || 'operational',
      responseTime: '45ms',
      uptime: '100%'
    }
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'operational':
        return <Icon name="CheckCircle" size={14} className="text-success" />;
      case 'degraded':
        return <Icon name="AlertTriangle" size={14} className="text-warning" />;
      case 'down':
        return <Icon name="XCircle" size={14} className="text-error" />;
      default:
        return <Icon name="Clock" size={14} className="text-text-secondary" />;
    }
  };

  const getStatusBadge = (status) => {
    const baseClasses = "px-2 py-0.5 rounded-full text-xs font-medium";
    switch (status) {
      case 'operational':
        return `${baseClasses} bg-success/10 text-success`;
      case 'degraded':
        return `${baseClasses} bg-warning/10 text-warning`;
      case 'down':
        return `${baseClasses} bg-error/10 text-error`;
      default:
        return `${baseClasses} bg-muted text-text-secondary`;
    }
  };

  const overallStatus = healthMetrics?.every(metric => metric?.status === 'operational') 
    ? 'operational' 
    : healthMetrics?.some(metric => metric?.status === 'down') 
    ? 'down' :'degraded';

  return (
    <div className="bg-surface rounded-lg border border-light shadow-soft">
      <div className="p-4 border-b border-light">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-success/10 rounded-lg flex items-center justify-center">
              <Icon name="Shield" size={16} className="text-success" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-text-primary">System Health</h2>
              <div className="flex items-center space-x-2">
                {getStatusIcon(overallStatus)}
                <span className={getStatusBadge(overallStatus)}>
                  {overallStatus === 'operational' ? 'All Systems Operational' : 
                   overallStatus === 'degraded' ? 'Some Issues Detected' : 'Service Disruption'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="divide-y divide-border">
        {healthMetrics?.map((metric) => (
          <div key={metric?.id} className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-3">
                {getStatusIcon(metric?.status)}
                <span className="text-sm font-medium text-text-primary">
                  {metric?.name}
                </span>
              </div>
              <span className={getStatusBadge(metric?.status)}>
                {metric?.status}
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-xs text-text-secondary ml-5">
              <div>
                <span className="block">Response Time</span>
                <span className="font-medium text-text-primary">{metric?.responseTime}</span>
              </div>
              <div>
                <span className="block">Uptime</span>
                <span className="font-medium text-text-primary">{metric?.uptime}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="p-4 border-t border-light bg-muted/30">
        <div className="flex items-center justify-between text-xs">
          <span className="text-text-secondary">Last updated: {new Date()?.toLocaleTimeString()}</span>
          <button className="text-primary hover:text-primary/80 font-medium">
            View Status Page
          </button>
        </div>
      </div>
    </div>
  );
};

export default SystemHealth;