import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const EmptyState = ({ 
  hasFilters, 
  onClearFilters, 
  onStartNewAnalysis 
}) => {
  if (hasFilters) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
          <Icon name="Search" size={32} className="text-text-secondary" />
        </div>
        <h3 className="text-lg font-semibold text-text-primary mb-2">
          No analyses match your filters
        </h3>
        <p className="text-text-secondary mb-6 max-w-md mx-auto">
          Try adjusting your search criteria or date range to find the analyses you're looking for.
        </p>
        <div className="flex items-center justify-center space-x-3">
          <Button variant="outline" onClick={onClearFilters}>
            <Icon name="X" size={16} className="mr-2" />
            Clear Filters
          </Button>
          <Button variant="default" onClick={onStartNewAnalysis}>
            <Icon name="Plus" size={16} className="mr-2" />
            Start New Analysis
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="text-center py-16">
      <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
        <Icon name="History" size={40} className="text-text-secondary" />
      </div>
      <h3 className="text-xl font-semibold text-text-primary mb-3">
        No analysis history yet
      </h3>
      <p className="text-text-secondary mb-8 max-w-lg mx-auto">
        Start your first competitive analysis to begin tracking brand performance and share of voice metrics. Your completed analyses will appear here for easy comparison and review.
      </p>
      <div className="flex items-center justify-center space-x-4">
        <Button variant="default" size="lg" onClick={onStartNewAnalysis}>
          <Icon name="Zap" size={20} className="mr-2" />
          Start First Analysis
        </Button>
        <Button variant="outline" size="lg">
          <Icon name="BookOpen" size={20} className="mr-2" />
          View Documentation
        </Button>
      </div>
      
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        <div className="text-center">
          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
            <Icon name="Search" size={24} className="text-primary" />
          </div>
          <h4 className="font-semibold text-text-primary mb-2">Automated Search</h4>
          <p className="text-sm text-text-secondary">
            Automatically search Google and analyze top-ranking websites for brand mentions
          </p>
        </div>
        
        <div className="text-center">
          <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
            <Icon name="BarChart3" size={24} className="text-secondary" />
          </div>
          <h4 className="font-semibold text-text-primary mb-2">SOV Calculation</h4>
          <p className="text-sm text-text-secondary">
            Calculate share of voice metrics and track competitive positioning over time
          </p>
        </div>
        
        <div className="text-center">
          <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center mx-auto mb-3">
            <Icon name="TrendingUp" size={24} className="text-success" />
          </div>
          <h4 className="font-semibold text-text-primary mb-2">Trend Analysis</h4>
          <p className="text-sm text-text-secondary">
            Compare historical data and identify market trends and opportunities
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmptyState;