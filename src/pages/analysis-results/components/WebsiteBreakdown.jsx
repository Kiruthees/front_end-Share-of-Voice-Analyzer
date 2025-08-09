import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const WebsiteBreakdown = ({ websites = [], selectedBrand }) => {
  const [expandedRows, setExpandedRows] = useState(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [filterThreshold, setFilterThreshold] = useState(0);

  // Use provided websites data or fallback to mock data
  const websiteData = websites?.length > 0 ? websites : [
    {
      id: 1,
      domain: 'amazon.in',
      url: 'https://amazon.in/smart-fans/s?k=smart+fans',
      totalMentions: 23,
      brandMentions: {
        'Atomberg': 8,
        'Havells': 6,
        'Orient': 4,
        'Crompton': 3,
        'Bajaj': 2
      },
      category: 'E-commerce',
      lastScraped: '2025-08-09T09:02:15',
      status: 'success',
      scrapedContent: 'Sample scraped content for analysis...',
      contexts: [
        { brand: 'Atomberg', context: `Atomberg Efficio+ 1200mm BLDC Motor with Remote 3 Blade Ceiling Fan` },
        { brand: 'Havells', context: `Havells Stealth Air 1200mm Premium Underlight Ceiling Fan` },
        { brand: 'Orient', context: `Orient Electric Aeroquiet 1200mm Ceiling Fan with Remote Control` }
      ]
    },
    {
      id: 2,
      domain: 'flipkart.com',
      url: 'https://flipkart.com/ceiling-fans/pr?sid=j9e%2Cabm%2Cc9y',
      totalMentions: 19,
      brandMentions: {
        'Atomberg': 7,
        'Havells': 5,
        'Orient': 3,
        'Crompton': 2,
        'Bajaj': 2
      },
      category: 'E-commerce',
      lastScraped: '2025-08-09T09:01:45',
      status: 'success',
      scrapedContent: 'Detailed product listings and reviews...',
      contexts: [
        { brand: 'Atomberg', context: `Atomberg Renesa+ 1200mm BLDC Motor Ceiling Fan with LED Light` },
        { brand: 'Havells', context: `Havells Leganza 1200mm Ceiling Fan with Decorative LED Light` }
      ]
    },
    {
      id: 3,
      domain: 'atomberg.com',
      url: 'https://atomberg.com/products/smart-ceiling-fans',
      totalMentions: 15,
      brandMentions: {
        'Atomberg': 15
      },
      category: 'Brand Website',
      lastScraped: '2025-08-09T09:00:30',
      status: 'success',
      scrapedContent: 'Complete brand product information and specifications...',
      contexts: [
        { brand: 'Atomberg', context: `Atomberg's smart ceiling fans with BLDC technology offer 65% energy savings` },
        { brand: 'Atomberg', context: `Control your Atomberg smart fan with Alexa, Google Assistant, or mobile app` }
      ]
    },
    {
      id: 4,
      domain: 'havells.com',
      url: 'https://havells.com/en/consumer/fans/ceiling-fans',
      totalMentions: 12,
      brandMentions: {
        'Havells': 12
      },
      category: 'Brand Website',
      lastScraped: '2025-08-09T08:59:15',
      status: 'success',
      scrapedContent: 'Comprehensive brand portfolio and product details...',
      contexts: [
        { brand: 'Havells', context: `Havells premium ceiling fans with advanced motor technology` },
        { brand: 'Havells', context: `Experience the perfect blend of style and performance with Havells fans` }
      ]
    },
    {
      id: 5,
      domain: 'gadgets360.com',
      url: 'https://gadgets360.com/smart-home/reviews/best-smart-ceiling-fans-2024',
      totalMentions: 18,
      brandMentions: {
        'Atomberg': 6,
        'Havells': 4,
        'Orient': 3,
        'Crompton': 3,
        'Bajaj': 2
      },
      category: 'Review Site',
      lastScraped: '2025-08-09T08:58:00',
      status: 'success',
      scrapedContent: 'Detailed reviews and comparisons of smart ceiling fans...',
      contexts: [
        { brand: 'Atomberg', context: `Atomberg leads the smart fan segment with innovative BLDC technology` },
        { brand: 'Havells', context: `Havells offers premium smart fans with excellent build quality` }
      ]
    }
  ];

  const toggleRowExpansion = (id) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded?.has(id)) {
      newExpanded?.delete(id);
    } else {
      newExpanded?.add(id);
    }
    setExpandedRows(newExpanded);
  };

  const filteredData = websiteData?.filter(website => {
    const matchesSearch = website?.domain?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
                         website?.category?.toLowerCase()?.includes(searchTerm?.toLowerCase());
    const matchesThreshold = website?.totalMentions >= filterThreshold;
    const matchesBrand = !selectedBrand || website?.brandMentions?.[selectedBrand] > 0;
    
    return matchesSearch && matchesThreshold && matchesBrand;
  });

  const handleDownloadData = (website) => {
    try {
      const downloadData = {
        websiteInfo: {
          domain: website?.domain,
          url: website?.url,
          category: website?.category,
          lastScraped: website?.lastScraped,
          totalMentions: website?.totalMentions
        },
        brandMentions: website?.brandMentions,
        contexts: website?.contexts,
        scrapedContent: website?.scrapedContent || 'Content not available',
        analysisMetadata: {
          downloadedAt: new Date()?.toISOString(),
          filteredBy: selectedBrand || 'All brands'
        }
      };

      const dataStr = JSON.stringify(downloadData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `website-analysis-${website?.domain}-${new Date()?.toISOString()?.split('T')?.[0]}.json`;
      document.body?.appendChild(link);
      link?.click();
      document.body?.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
      alert('Download failed. Please try again.');
    }
  };

  const handleOpenLink = (url) => {
    try {
      // Open the website URL in a new tab
      window.open(url, '_blank', 'noopener,noreferrer');
    } catch (error) {
      console.error('Failed to open link:', error);
      // Fallback: try to navigate in the same window
      window.location.href = url;
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'E-commerce':
        return 'ShoppingCart';
      case 'Brand Website':
        return 'Building';
      case 'Review Site':
        return 'Star';
      case 'News':
        return 'Newspaper';
      default:
        return 'Globe';
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'E-commerce':
        return 'bg-blue-100 text-blue-800';
      case 'Brand Website':
        return 'bg-green-100 text-green-800';
      case 'Review Site':
        return 'bg-yellow-100 text-yellow-800';
      case 'News':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-surface rounded-lg border border-light">
      <div className="p-6 border-b border-light">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div>
            <h3 className="text-lg font-semibold text-text-primary">Website Breakdown</h3>
            <p className="text-sm text-text-secondary mt-1">
              {selectedBrand ? `Brand mentions for ${selectedBrand}` : 'Detailed mention distribution across websites'}
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
            <Input
              type="search"
              placeholder="Search websites..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e?.target?.value)}
              className="w-full sm:w-48"
            />
            <Input
              type="number"
              placeholder="Min mentions"
              value={filterThreshold}
              onChange={(e) => setFilterThreshold(Number(e?.target?.value))}
              className="w-full sm:w-32"
            />
          </div>
        </div>
      </div>
      <div className="divide-y divide-light">
        {filteredData?.map((website) => (
          <div key={website?.id} className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 flex-1">
                <button
                  onClick={() => toggleRowExpansion(website?.id)}
                  className="flex items-center justify-center w-8 h-8 rounded-lg border border-light hover:bg-muted transition-colors duration-200"
                >
                  <Icon 
                    name={expandedRows?.has(website?.id) ? "ChevronDown" : "ChevronRight"} 
                    size={16} 
                  />
                </button>
                
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h4 className="text-base font-medium text-text-primary">{website?.domain}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(website?.category)}`}>
                      <Icon name={getCategoryIcon(website?.category)} size={12} className="inline mr-1" />
                      {website?.category}
                    </span>
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-success rounded-full" />
                      <span className="text-xs text-text-secondary">Active</span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-text-secondary truncate max-w-md">{website?.url}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-6">
                <div className="text-right">
                  <div className="text-lg font-semibold text-text-primary">{website?.totalMentions}</div>
                  <div className="text-xs text-text-secondary">Total Mentions</div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => handleOpenLink(website?.url)}
                    title="Visit Website"
                  >
                    <Icon name="ExternalLink" size={16} />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => handleDownloadData(website)}
                    title="Download Analysis Data"
                  >
                    <Icon name="Download" size={16} />
                  </Button>
                </div>
              </div>
            </div>

            {expandedRows?.has(website?.id) && (
              <div className="mt-6 pl-12 animate-slide-up">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Brand Mentions */}
                  <div>
                    <h5 className="text-sm font-medium text-text-primary mb-3">Brand Mentions</h5>
                    <div className="space-y-2">
                      {Object.entries(website?.brandMentions)?.map(([brand, count]) => (
                        <div key={brand} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                          <div className="flex items-center space-x-2">
                            <div className={`w-2 h-2 rounded-full ${
                              brand === 'Atomberg' ? 'bg-primary' : 'bg-secondary'
                            }`} />
                            <span className="text-sm text-text-primary">{brand}</span>
                          </div>
                          <span className="text-sm font-medium text-text-primary">{count}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Context Examples */}
                  <div>
                    <h5 className="text-sm font-medium text-text-primary mb-3">Context Examples</h5>
                    <div className="space-y-3">
                      {website?.contexts?.slice(0, 3)?.map((context, index) => (
                        <div key={index} className="p-3 bg-muted/30 rounded-lg">
                          <div className="flex items-center space-x-2 mb-1">
                            <div className={`w-2 h-2 rounded-full ${
                              context?.brand === 'Atomberg' ? 'bg-primary' : 'bg-secondary'
                            }`} />
                            <span className="text-xs font-medium text-text-secondary">{context?.brand}</span>
                          </div>
                          <p className="text-sm text-text-primary">{context?.context}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-light flex items-center justify-between text-xs text-text-secondary">
                  <span>Last scraped: {new Date(website?.lastScraped)?.toLocaleString()}</span>
                  <div className="flex items-center space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleOpenLink(website?.url)}
                    >
                      Visit Source
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDownloadData(website)}
                    >
                      Download Data
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      {filteredData?.length === 0 && (
        <div className="p-12 text-center">
          <Icon name="Search" size={48} className="text-text-secondary mx-auto mb-4" />
          <h4 className="text-lg font-medium text-text-primary mb-2">No websites found</h4>
          <p className="text-text-secondary">Try adjusting your search criteria or filters</p>
        </div>
      )}
    </div>
  );
};

export default WebsiteBreakdown;