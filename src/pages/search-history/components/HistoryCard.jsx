import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const HistoryCard = ({ 
  analysis, 
  isSelected, 
  onSelect, 
  onView, 
  onRerun, 
  onCompare, 
  onDelete 
}) => {
  const getTrendIcon = (trend) => {
    if (trend > 0) return { icon: 'TrendingUp', color: 'text-success' };
    if (trend < 0) return { icon: 'TrendingDown', color: 'text-error' };
    return { icon: 'Minus', color: 'text-text-secondary' };
  };

  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const trendData = getTrendIcon(analysis?.sovTrend);

  return (
    <div className={`bg-card border border-light rounded-lg p-6 transition-all duration-200 hover:shadow-soft ${
      isSelected ? 'ring-2 ring-primary border-primary' : ''
    }`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start space-x-3">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={(e) => onSelect(analysis?.id, e?.target?.checked)}
            className="mt-1 w-4 h-4 text-primary border-border rounded focus:ring-primary focus:ring-2"
          />
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-1">
              <h3 className="text-lg font-semibold text-text-primary">
                "{analysis?.keyword}"
              </h3>
              <span className="px-2 py-1 bg-muted text-text-secondary text-xs rounded-full">
                {analysis?.brandsDetected} brands
              </span>
            </div>
            <p className="text-sm text-text-secondary">
              {formatDate(analysis?.executedAt)}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" onClick={() => onView(analysis?.id)}>
            <Icon name="Eye" size={16} />
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="bg-muted rounded-lg p-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-text-secondary">Top Competitor</span>
            <Icon name="Crown" size={14} className="text-warning" />
          </div>
          <p className="text-lg font-semibold text-text-primary mt-1">
            {analysis?.topCompetitor}
          </p>
          <p className="text-sm text-text-secondary">
            {analysis?.topCompetitorSOV}% SOV
          </p>
        </div>

        <div className="bg-muted rounded-lg p-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-text-secondary">Atomberg SOV</span>
            <Icon name="Target" size={14} className="text-primary" />
          </div>
          <div className="flex items-center space-x-2 mt-1">
            <p className="text-lg font-semibold text-text-primary">
              {analysis?.atombergSOV}%
            </p>
            <Icon name={trendData?.icon} size={16} className={trendData?.color} />
          </div>
          <p className="text-sm text-text-secondary">
            {analysis?.sovTrend > 0 ? '+' : ''}{analysis?.sovTrend}% vs last
          </p>
        </div>

        <div className="bg-muted rounded-lg p-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-text-secondary">Market Position</span>
            <Icon name="Award" size={14} className="text-secondary" />
          </div>
          <p className="text-lg font-semibold text-text-primary mt-1">
            #{analysis?.marketPosition}
          </p>
          <p className="text-sm text-text-secondary">
            of {analysis?.brandsDetected} brands
          </p>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 text-sm text-text-secondary">
          <span className="flex items-center space-x-1">
            <Icon name="Globe" size={14} />
            <span>{analysis?.websitesScraped} sites analyzed</span>
          </span>
          <span className="flex items-center space-x-1">
            <Icon name="Clock" size={14} />
            <span>{analysis?.processingTime}s</span>
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="default" size="sm" onClick={() => onView(analysis?.id)}>
            View Analysis
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HistoryCard;