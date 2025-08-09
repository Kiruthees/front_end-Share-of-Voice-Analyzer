import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ActivityFeed = ({ activities, onViewDetails, onCancelAnalysis }) => {
  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <Icon name="CheckCircle" size={16} className="text-success" />;
      case 'running':
        return <Icon name="Loader2" size={16} className="text-primary animate-spin" />;
      case 'failed':
        return <Icon name="XCircle" size={16} className="text-error" />;
      case 'cancelled':
        return <Icon name="StopCircle" size={16} className="text-warning" />;
      default:
        return <Icon name="Clock" size={16} className="text-text-secondary" />;
    }
  };

  const getStatusBadge = (status) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
    switch (status) {
      case 'completed':
        return `${baseClasses} bg-success/10 text-success border border-success/20`;
      case 'running':
        return `${baseClasses} bg-primary/10 text-primary border border-primary/20`;
      case 'failed':
        return `${baseClasses} bg-error/10 text-error border border-error/20`;
      case 'cancelled':
        return `${baseClasses} bg-warning/10 text-warning border border-warning/20`;
      default:
        return `${baseClasses} bg-muted text-text-secondary border border-border`;
    }
  };

  const formatDuration = (seconds) => {
    if (!seconds) return '0s';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
    return date?.toLocaleDateString();
  };

  if (activities?.length === 0) {
    return (
      <div className="bg-surface rounded-lg border border-light shadow-soft p-8 text-center">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
          <Icon name="Activity" size={24} className="text-text-secondary" />
        </div>
        <h3 className="text-lg font-medium text-text-primary mb-2">No Recent Activity</h3>
        <p className="text-text-secondary">Start your first analysis to see activity here</p>
      </div>
    );
  }

  return (
    <div className="bg-surface rounded-lg border border-light shadow-soft">
      <div className="p-6 border-b border-light">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center">
              <Icon name="Activity" size={16} className="text-accent" />
            </div>
            <h2 className="text-lg font-semibold text-text-primary">Recent Activity</h2>
          </div>
          <Button variant="ghost" size="sm" iconName="RefreshCw" iconPosition="left">
            Refresh
          </Button>
        </div>
      </div>
      <div className="divide-y divide-border max-h-96 overflow-y-auto">
        {activities?.map((activity) => (
          <div key={activity?.id} className="p-4 hover:bg-muted/50 transition-colors duration-200">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3 flex-1">
                <div className="mt-1">
                  {getStatusIcon(activity?.status)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="text-sm font-medium text-text-primary truncate">
                      {activity?.keyword}
                    </h3>
                    <span className={getStatusBadge(activity?.status)}>
                      {activity?.status}
                    </span>
                  </div>
                  <p className="text-xs text-text-secondary mb-2">
                    {activity?.description}
                  </p>
                  
                  {activity?.status === 'running' && activity?.progress && (
                    <div className="mb-2">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs text-text-secondary">
                          {activity?.progress?.current} of {activity?.progress?.total} websites
                        </span>
                        <span className="text-xs font-medium text-text-primary">
                          {Math.round((activity?.progress?.current / activity?.progress?.total) * 100)}%
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-1.5">
                        <div
                          className="bg-primary h-1.5 rounded-full transition-all duration-300"
                          style={{ width: `${(activity?.progress?.current / activity?.progress?.total) * 100}%` }}
                        />
                      </div>
                    </div>
                  )}

                  <div className="flex items-center space-x-4 text-xs text-text-secondary">
                    <span>{formatTimestamp(activity?.timestamp)}</span>
                    {activity?.duration && (
                      <span>Duration: {formatDuration(activity?.duration)}</span>
                    )}
                    {activity?.resultsCount && (
                      <span>{activity?.resultsCount} brands found</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2 ml-4">
                {activity?.status === 'completed' && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onViewDetails(activity?.id)}
                    iconName="Eye"
                    iconPosition="left"
                  >
                    View
                  </Button>
                )}
                {activity?.status === 'running' && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onCancelAnalysis(activity?.id)}
                    iconName="X"
                    iconPosition="left"
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityFeed;