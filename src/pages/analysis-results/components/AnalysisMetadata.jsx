import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AnalysisMetadata = () => {
  const analysisData = {
    searchTerm: "smart fan",
    completedAt: "2025-08-09T09:05:09",
    totalWebsites: 47,
    successfulScrapes: 42,
    failedScrapes: 5,
    totalMentions: 140,
    uniqueBrands: 12,
    processingTime: "4m 32s",
    dataQuality: 89.4,
    apiCalls: {
      googleSearch: 10,
      openaiAnalysis: 42,
      webScraping: 47
    },
    coverage: {
      ecommerce: 15,
      brandWebsites: 8,
      reviewSites: 12,
      newsArticles: 7
    }
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return {
      date: date?.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      }),
      time: date?.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    };
  };

  const { date, time } = formatDateTime(analysisData?.completedAt);

  const getQualityColor = (score) => {
    if (score >= 90) return 'text-success';
    if (score >= 75) return 'text-warning';
    return 'text-error';
  };

  const MetricCard = ({ icon, label, value, sublabel = null, color = 'text-text-primary' }) => (
    <div className="p-4 bg-muted/50 rounded-lg">
      <div className="flex items-center space-x-2 mb-2">
        <Icon name={icon} size={16} className="text-text-secondary" />
        <span className="text-sm text-text-secondary">{label}</span>
      </div>
      <div className="flex items-baseline space-x-1">
        <span className={`text-lg font-semibold ${color}`}>{value}</span>
        {sublabel && <span className="text-xs text-text-secondary">{sublabel}</span>}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Analysis Overview */}
      <div className="bg-surface rounded-lg border border-light p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-text-primary">Analysis Overview</h3>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
            <span className="text-sm text-success font-medium">Completed</span>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between py-2 border-b border-light">
            <span className="text-sm text-text-secondary">Search Term</span>
            <span className="text-sm font-medium text-text-primary">"{analysisData?.searchTerm}"</span>
          </div>
          
          <div className="flex items-center justify-between py-2 border-b border-light">
            <span className="text-sm text-text-secondary">Completed</span>
            <div className="text-right">
              <div className="text-sm font-medium text-text-primary">{date}</div>
              <div className="text-xs text-text-secondary">{time}</div>
            </div>
          </div>
          
          <div className="flex items-center justify-between py-2 border-b border-light">
            <span className="text-sm text-text-secondary">Processing Time</span>
            <span className="text-sm font-medium text-text-primary">{analysisData?.processingTime}</span>
          </div>
          
          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-text-secondary">Data Quality</span>
            <div className="flex items-center space-x-2">
              <span className={`text-sm font-medium ${getQualityColor(analysisData?.dataQuality)}`}>
                {analysisData?.dataQuality}%
              </span>
              <Icon 
                name={analysisData?.dataQuality >= 85 ? "CheckCircle" : "AlertCircle"} 
                size={16} 
                className={getQualityColor(analysisData?.dataQuality)}
              />
            </div>
          </div>
        </div>
      </div>
      {/* Key Metrics */}
      <div className="bg-surface rounded-lg border border-light p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-4">Key Metrics</h3>
        <div className="grid grid-cols-2 gap-4">
          <MetricCard
            icon="Globe"
            label="Websites Scraped"
            value={analysisData?.successfulScrapes}
            sublabel={`of ${analysisData?.totalWebsites}`}
          />
          <MetricCard
            icon="MessageSquare"
            label="Total Mentions"
            value={analysisData?.totalMentions}
            color="text-primary"
          />
          <MetricCard
            icon="Tag"
            label="Unique Brands"
            value={analysisData?.uniqueBrands}
            color="text-secondary"
          />
          <MetricCard
            icon="Zap"
            label="Success Rate"
            value={`${Math.round((analysisData?.successfulScrapes / analysisData?.totalWebsites) * 100)}%`}
            color="text-success"
          />
        </div>
      </div>
      {/* API Usage */}
      <div className="bg-surface rounded-lg border border-light p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-4">API Usage</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Icon name="Search" size={16} className="text-text-secondary" />
              <span className="text-sm text-text-secondary">Google Search API</span>
            </div>
            <span className="text-sm font-medium text-text-primary">{analysisData?.apiCalls?.googleSearch} calls</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Icon name="Brain" size={16} className="text-text-secondary" />
              <span className="text-sm text-text-secondary">OpenAI Analysis</span>
            </div>
            <span className="text-sm font-medium text-text-primary">{analysisData?.apiCalls?.openaiAnalysis} calls</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Icon name="Download" size={16} className="text-text-secondary" />
              <span className="text-sm text-text-secondary">Web Scraping</span>
            </div>
            <span className="text-sm font-medium text-text-primary">{analysisData?.apiCalls?.webScraping} requests</span>
          </div>
        </div>
      </div>
      {/* Website Coverage */}
      <div className="bg-surface rounded-lg border border-light p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-4">Website Coverage</h3>
        <div className="space-y-3">
          {Object.entries(analysisData?.coverage)?.map(([category, count]) => (
            <div key={category} className="flex items-center justify-between">
              <span className="text-sm text-text-secondary capitalize">
                {category?.replace(/([A-Z])/g, ' $1')?.trim()}
              </span>
              <div className="flex items-center space-x-2">
                <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary rounded-full"
                    style={{ width: `${(count / analysisData?.successfulScrapes) * 100}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-text-primary w-8 text-right">{count}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Export Actions */}
      <div className="bg-surface rounded-lg border border-light p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-4">Export Data</h3>
        <div className="space-y-3">
          <Button
            variant="outline"
            fullWidth
            iconName="FileText"
            iconPosition="left"
          >
            Export PDF Report
          </Button>
          <Button
            variant="outline"
            fullWidth
            iconName="Download"
            iconPosition="left"
          >
            Download CSV Data
          </Button>
          <Button
            variant="outline"
            fullWidth
            iconName="Share"
            iconPosition="left"
          >
            Share Analysis
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AnalysisMetadata;