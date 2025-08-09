import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Breadcrumb from '../../components/ui/Breadcrumb';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import SOVChart from './components/SOVChart';
import BrandDataTable from './components/BrandDataTable';
import WebsiteBreakdown from './components/WebsiteBreakdown';
import AnalysisMetadata from './components/AnalysisMetadata';

const AnalysisResults = () => {
  const location = useLocation();
  const [analysisData, setAnalysisData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBrand, setSelectedBrand] = useState(null);

  useEffect(() => {
    // Check if we have real analysis results from navigation state
    if (location?.state?.analysisResults) {
      const results = location?.state?.analysisResults;
      setAnalysisData(results);
      setIsLoading(false);
    } else {
      // Mock data for fallback
      initializeMockData();
    }
  }, [location]);

  const initializeMockData = () => {
    const mockData = {
      id: 'analysis-mock',
      keyword: 'smart fan',
      targetBrand: 'Atomberg',
      shareOfVoice: {
        targetBrandData: { name: 'Atomberg', sov: 35.2, mentions: 124 },
        targetBrandRank: 1,
        totalBrandsFound: 8,
        totalMentions: 352,
        brandRankings: [
          { name: 'Atomberg', sov: 35.2, mentions: 124, isTarget: true },
          { name: 'Havells', sov: 22.8, mentions: 80, isTarget: false },
          { name: 'Orient', sov: 18.5, mentions: 65, isTarget: false },
          { name: 'Crompton', sov: 12.3, mentions: 43, isTarget: false },
          { name: 'Bajaj', sov: 11.2, mentions: 40, isTarget: false }
        ],
        websiteBreakdown: [
          {
            url: 'https://example1.com',
            title: 'Best Smart Fans 2024',
            totalMentions: 45,
            brands: [
              { name: 'Atomberg', mentions: 18 },
              { name: 'Havells', mentions: 12 }
            ]
          }
        ]
      },
      analysisSummary: 'Mock analysis summary for demonstration purposes.',
      metadata: {
        analysisId: 'mock-analysis',
        startTime: new Date(Date.now() - 300000)?.toISOString(),
        endTime: new Date()?.toISOString(),
        totalDuration: 300000
      }
    };
    
    setAnalysisData(mockData);
    setIsLoading(false);
  };

  const handleBrandSelect = (brandName) => {
    setSelectedBrand(brandName === selectedBrand ? null : brandName);
  };

  const handleExportResults = () => {
    if (!analysisData) return;
    
    const exportData = {
      analysis: {
        keyword: analysisData?.keyword,
        targetBrand: analysisData?.targetBrand,
        timestamp: new Date()?.toISOString()
      },
      shareOfVoice: analysisData?.shareOfVoice,
      summary: analysisData?.analysisSummary,
      metadata: analysisData?.metadata
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `brand-analysis-${analysisData?.keyword}-${new Date()?.toISOString()?.split('T')?.[0]}.json`;
    document.body?.appendChild(link);
    link?.click();
    document.body?.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleShareResults = () => {
    if (navigator.share && analysisData) {
      navigator.share({
        title: `Brand Voice Analysis: ${analysisData?.keyword}`,
        text: `${analysisData?.targetBrand} has ${analysisData?.shareOfVoice?.targetBrandData?.sov || 0}% share of voice for "${analysisData?.keyword}"`,
        url: window.location?.href
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-16">
          <div className="max-w-7xl mx-auto px-6 py-8 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="text-text-secondary mt-4">Loading analysis results...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!analysisData) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-16">
          <div className="max-w-7xl mx-auto px-6 py-8 text-center">
            <Icon name="AlertCircle" size={48} className="text-muted mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-text-primary mb-2">No Analysis Data Available</h1>
            <p className="text-text-secondary">Please run a new analysis from the dashboard.</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <Breadcrumb />
          
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-text-primary mb-2">
                Brand Voice Analysis Results
              </h1>
              <p className="text-text-secondary">
                Competitive analysis for "{analysisData?.keyword}" - Target: {analysisData?.targetBrand}
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportResults}
                iconName="Download"
                iconPosition="left"
              >
                Export
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleShareResults}
                iconName="Share"
                iconPosition="left"
              >
                Share
              </Button>
            </div>
          </div>

          {/* Key Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-surface rounded-lg border border-light shadow-soft p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-text-secondary">Target Brand SOV</p>
                  <p className="text-3xl font-bold text-primary">
                    {analysisData?.shareOfVoice?.targetBrandData?.sov?.toFixed(1) || 0}%
                  </p>
                </div>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Icon name="Target" size={24} className="text-primary" />
                </div>
              </div>
              <div className="mt-2">
                <p className="text-xs text-text-secondary">
                  Rank #{analysisData?.shareOfVoice?.targetBrandRank || 'N/A'} of {analysisData?.shareOfVoice?.totalBrandsFound || 0} brands
                </p>
              </div>
            </div>

            <div className="bg-surface rounded-lg border border-light shadow-soft p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-text-secondary">Total Mentions</p>
                  <p className="text-3xl font-bold text-text-primary">
                    {analysisData?.shareOfVoice?.totalMentions || 0}
                  </p>
                </div>
                <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
                  <Icon name="MessageSquare" size={24} className="text-success" />
                </div>
              </div>
              <div className="mt-2">
                <p className="text-xs text-text-secondary">
                  Across {analysisData?.shareOfVoice?.totalWebsitesAnalyzed || 0} websites
                </p>
              </div>
            </div>

            <div className="bg-surface rounded-lg border border-light shadow-soft p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-text-secondary">Brands Found</p>
                  <p className="text-3xl font-bold text-text-primary">
                    {analysisData?.shareOfVoice?.totalBrandsFound || 0}
                  </p>
                </div>
                <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center">
                  <Icon name="Tag" size={24} className="text-warning" />
                </div>
              </div>
            </div>

            <div className="bg-surface rounded-lg border border-light shadow-soft p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-text-secondary">Analysis Time</p>
                  <p className="text-3xl font-bold text-text-primary">
                    {analysisData?.metadata?.totalDuration ? 
                      Math.round(analysisData?.metadata?.totalDuration / 1000) : 'N/A'}s
                  </p>
                </div>
                <div className="w-12 h-12 bg-info/10 rounded-lg flex items-center justify-center">
                  <Icon name="Clock" size={24} className="text-info" />
                </div>
              </div>
            </div>
          </div>

          {/* Analysis Summary */}
          {analysisData?.analysisSummary && (
            <div className="bg-surface rounded-lg border border-light shadow-soft p-6 mb-8">
              <h2 className="text-xl font-semibold text-text-primary mb-4 flex items-center">
                <Icon name="FileText" size={20} className="mr-3" />
                AI Analysis Summary
              </h2>
              <p className="text-text-secondary leading-relaxed">
                {analysisData?.analysisSummary}
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* SOV Chart */}
            <SOVChart 
              data={analysisData?.shareOfVoice?.brandRankings || []} 
              onBrandSelect={handleBrandSelect}
              selectedBrand={selectedBrand}
            />
            
            {/* Brand Data Table */}
            <BrandDataTable 
              brands={analysisData?.shareOfVoice?.brandRankings || []}
              targetBrand={analysisData?.targetBrand}
              selectedBrand={selectedBrand}
              onBrandSelect={handleBrandSelect}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Website Breakdown */}
            <WebsiteBreakdown 
              websites={analysisData?.shareOfVoice?.websiteBreakdown || []} 
              selectedBrand={selectedBrand}
            />
            
            {/* Analysis Metadata */}
            <AnalysisMetadata 
              metadata={analysisData?.metadata}
              keyword={analysisData?.keyword}
              scrapingResults={analysisData?.scrapingResults}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default AnalysisResults;