import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const SearchPanel = ({ onStartAnalysis, isAnalyzing }) => {
  const [keyword, setKeyword] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('electronics');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [maxResults, setMaxResults] = useState(10);
  const [targetBrand, setTargetBrand] = useState('');

  const productCategories = [
    { value: 'electronics', label: 'Electronics' },
    { value: 'home-appliances', label: 'Home Appliances' },
    { value: 'automotive', label: 'Automotive' },
    { value: 'fashion', label: 'Fashion' },
    { value: 'health-beauty', label: 'Health & Beauty' },
    { value: 'sports', label: 'Sports & Outdoors' },
    { value: 'technology', label: 'Technology' },
    { value: 'food-beverage', label: 'Food & Beverage' },
    { value: 'travel', label: 'Travel & Tourism' },
    { value: 'finance', label: 'Finance & Insurance' }
  ];

  const handleStartAnalysis = () => {
    if (!keyword?.trim()) return;
    
    const analysisConfig = {
      keyword: keyword?.trim(),
      category: selectedCategory,
      maxResults,
      targetBrand: targetBrand?.trim() || null,
      timestamp: new Date()?.toISOString()
    };
    
    onStartAnalysis(analysisConfig);
  };

  const getApiStatus = () => {
    const hasGoogleApi = import.meta.env?.VITE_GOOGLE_API_KEY;
    const hasGoogleCse = import.meta.env?.VITE_GOOGLE_CSE_ID;
    const hasOpenAi = import.meta.env?.VITE_OPENAI_API_KEY;
    
    if (hasGoogleApi && hasGoogleCse && hasOpenAi) {
      return { status: 'Connected', color: 'success' };
    } else if (hasGoogleApi && hasGoogleCse) {
      return { status: 'Google Ready', color: 'warning' };
    } else {
      return { status: 'Setup Required', color: 'error' };
    }
  };

  const apiStatus = getApiStatus();

  return (
    <div className="bg-surface rounded-lg border border-light shadow-soft p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <Icon name="Search" size={20} className="text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-text-primary">Start New Analysis</h2>
            <p className="text-sm text-text-secondary">Search and analyze brand mentions across top websites</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className={showAdvanced ? 'bg-muted' : ''}
        >
          <Icon name="Settings" size={18} />
        </Button>
      </div>
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Search Keyword"
            type="text"
            placeholder="e.g., smart fan, wireless headphones, running shoes"
            value={keyword}
            onChange={(e) => setKeyword(e?.target?.value)}
            required
          />
          
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Product Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e?.target?.value)}
              className="w-full px-3 py-2 border border-light rounded-lg bg-input text-text-primary focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {productCategories?.map((category) => (
                <option key={category?.value} value={category?.value}>
                  {category?.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {showAdvanced && (
          <div className="border-t border-light pt-4 mt-4 animate-slide-up">
            <h3 className="text-sm font-medium text-text-primary mb-3 flex items-center">
              <Icon name="Sliders" size={16} className="mr-2" />
              Advanced Options
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Max Results"
                type="number"
                min="5"
                max="50"
                value={maxResults}
                onChange={(e) => setMaxResults(parseInt(e?.target?.value))}
                description="Number of websites to analyze (5-50)"
              />
              
              <Input
                label="Target Brand (Optional)"
                type="text"
                placeholder="e.g., Nike, Apple, Samsung"
                value={targetBrand}
                onChange={(e) => setTargetBrand(e?.target?.value)}
                description="Primary brand to track and compare"
              />
            </div>
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-light">
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${
              apiStatus?.color === 'success' ? 'bg-success' : 
              apiStatus?.color === 'warning' ? 'bg-warning' : 'bg-error'
            }`}></div>
            <span className="text-sm text-text-secondary">API Status: {apiStatus?.status}</span>
          </div>
          
          <Button
            onClick={handleStartAnalysis}
            disabled={!keyword?.trim() || isAnalyzing}
            loading={isAnalyzing}
            iconName="Play"
            iconPosition="left"
            size="lg"
            className="px-8"
          >
            {isAnalyzing ? 'Analyzing...' : 'Start Analysis'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SearchPanel;