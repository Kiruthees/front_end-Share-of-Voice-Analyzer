import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const BrandDataTable = ({ selectedBrand, onBrandSelect }) => {
  const [sortField, setSortField] = useState('sov');
  const [sortDirection, setSortDirection] = useState('desc');

  const brandData = [
    {
      id: 1,
      brand: 'Atomberg',
      mentions: 45,
      sov: 32.1,
      topWebsites: ['amazon.in', 'flipkart.com', 'atomberg.com'],
      trend: 'up',
      trendValue: 5.2,
      avgPosition: 2.3,
      lastSeen: '2025-08-09T08:45:00'
    },
    {
      id: 2,
      brand: 'Havells',
      mentions: 38,
      sov: 27.1,
      topWebsites: ['havells.com', 'amazon.in', 'moglix.com'],
      trend: 'down',
      trendValue: -2.1,
      avgPosition: 3.1,
      lastSeen: '2025-08-09T08:42:00'
    },
    {
      id: 3,
      brand: 'Orient',
      mentions: 25,
      sov: 17.9,
      topWebsites: ['orientelectric.com', 'flipkart.com', 'tatacliq.com'],
      trend: 'up',
      trendValue: 1.8,
      avgPosition: 4.2,
      lastSeen: '2025-08-09T08:38:00'
    },
    {
      id: 4,
      brand: 'Crompton',
      mentions: 18,
      sov: 12.9,
      topWebsites: ['crompton.co.in', 'amazon.in', 'snapdeal.com'],
      trend: 'stable',
      trendValue: 0.3,
      avgPosition: 5.1,
      lastSeen: '2025-08-09T08:35:00'
    },
    {
      id: 5,
      brand: 'Bajaj',
      mentions: 14,
      sov: 10.0,
      topWebsites: ['bajajelectricals.com', 'flipkart.com', 'paytmmall.com'],
      trend: 'down',
      trendValue: -1.5,
      avgPosition: 6.8,
      lastSeen: '2025-08-09T08:30:00'
    }
  ];

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const sortedData = [...brandData]?.sort((a, b) => {
    const aValue = a?.[sortField];
    const bValue = b?.[sortField];
    
    if (sortDirection === 'asc') {
      return aValue > bValue ? 1 : -1;
    }
    return aValue < bValue ? 1 : -1;
  });

  const filteredData = selectedBrand 
    ? sortedData?.filter(item => item?.brand === selectedBrand)
    : sortedData;

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up':
        return <Icon name="TrendingUp" size={16} className="text-success" />;
      case 'down':
        return <Icon name="TrendingDown" size={16} className="text-error" />;
      default:
        return <Icon name="Minus" size={16} className="text-text-secondary" />;
    }
  };

  const SortButton = ({ field, children }) => (
    <button
      onClick={() => handleSort(field)}
      className="flex items-center space-x-1 text-left font-medium text-text-primary hover:text-primary transition-colors duration-200"
    >
      <span>{children}</span>
      {sortField === field && (
        <Icon 
          name={sortDirection === 'asc' ? 'ChevronUp' : 'ChevronDown'} 
          size={14} 
        />
      )}
    </button>
  );

  return (
    <div className="bg-surface rounded-lg border border-light">
      <div className="p-6 border-b border-light">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-text-primary">Brand Performance Data</h3>
            <p className="text-sm text-text-secondary mt-1">
              {selectedBrand ? `Showing data for ${selectedBrand}` : 'All brands detected in analysis'}
            </p>
          </div>
          {selectedBrand && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onBrandSelect(null)}
              iconName="X"
              iconPosition="left"
            >
              Clear Filter
            </Button>
          )}
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted">
            <tr>
              <th className="px-6 py-3 text-left">
                <SortButton field="brand">Brand</SortButton>
              </th>
              <th className="px-6 py-3 text-left">
                <SortButton field="mentions">Mentions</SortButton>
              </th>
              <th className="px-6 py-3 text-left">
                <SortButton field="sov">SOV %</SortButton>
              </th>
              <th className="px-6 py-3 text-left">
                <SortButton field="avgPosition">Avg Position</SortButton>
              </th>
              <th className="px-6 py-3 text-left">Trend</th>
              <th className="px-6 py-3 text-left">Top Websites</th>
              <th className="px-6 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-light">
            {filteredData?.map((brand) => (
              <tr 
                key={brand?.id}
                className={`hover:bg-muted/50 transition-colors duration-200 ${
                  selectedBrand === brand?.brand ? 'bg-primary/5' : ''
                }`}
              >
                <td className="px-6 py-4">
                  <button
                    onClick={() => onBrandSelect(brand?.brand === selectedBrand ? null : brand?.brand)}
                    className="flex items-center space-x-2 hover:text-primary transition-colors duration-200"
                  >
                    <div className={`w-3 h-3 rounded-full ${
                      brand?.brand === 'Atomberg' ? 'bg-primary' : 'bg-secondary'
                    }`} />
                    <span className="font-medium text-text-primary">{brand?.brand}</span>
                  </button>
                </td>
                <td className="px-6 py-4">
                  <span className="text-text-primary font-medium">{brand?.mentions}</span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-text-primary font-medium">{brand?.sov}%</span>
                    <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary rounded-full"
                        style={{ width: `${(brand?.sov / 35) * 100}%` }}
                      />
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-text-primary">{brand?.avgPosition}</span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    {getTrendIcon(brand?.trend)}
                    <span className={`text-sm font-medium ${
                      brand?.trend === 'up' ? 'text-success' : 
                      brand?.trend === 'down' ? 'text-error' : 'text-text-secondary'
                    }`}>
                      {brand?.trend === 'stable' ? '0.0' : 
                       brand?.trend === 'up' ? `+${brand?.trendValue}` : brand?.trendValue}%
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1">
                    {brand?.topWebsites?.slice(0, 2)?.map((website, index) => (
                      <span 
                        key={index}
                        className="px-2 py-1 bg-muted text-xs text-text-secondary rounded"
                      >
                        {website}
                      </span>
                    ))}
                    {brand?.topWebsites?.length > 2 && (
                      <span className="px-2 py-1 bg-muted text-xs text-text-secondary rounded">
                        +{brand?.topWebsites?.length - 2}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="icon">
                      <Icon name="Eye" size={16} />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Icon name="Download" size={16} />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BrandDataTable;