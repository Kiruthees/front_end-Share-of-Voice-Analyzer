import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const FilterPanel = ({ 
  isExpanded, 
  onToggle, 
  filters, 
  onFiltersChange, 
  onClearFilters 
}) => {
  const [localFilters, setLocalFilters] = useState(filters);

  const handleFilterChange = (key, value) => {
    const updatedFilters = { ...localFilters, [key]: value };
    setLocalFilters(updatedFilters);
    onFiltersChange(updatedFilters);
  };

  const handleDateRangeChange = (type, value) => {
    const updatedDateRange = { ...localFilters?.dateRange, [type]: value };
    handleFilterChange('dateRange', updatedDateRange);
  };

  const handleSOVRangeChange = (type, value) => {
    const updatedSOVRange = { ...localFilters?.sovRange, [type]: value };
    handleFilterChange('sovRange', updatedSOVRange);
  };

  const predefinedKeywords = [
    'smart fan', 'ceiling fan', 'table fan', 'exhaust fan', 'pedestal fan'
  ];

  const predefinedBrands = [
    'Atomberg', 'Havells', 'Bajaj', 'Orient', 'Crompton', 'Usha'
  ];

  return (
    <div className="bg-card border border-light rounded-lg mb-6">
      <div className="flex items-center justify-between p-4 border-b border-light">
        <div className="flex items-center space-x-2">
          <Icon name="Filter" size={20} className="text-primary" />
          <h3 className="text-lg font-semibold text-text-primary">Advanced Filters</h3>
          {Object.values(filters)?.some(filter => 
            typeof filter === 'string' ? filter : 
            typeof filter === 'object' ? Object.values(filter)?.some(v => v) : false
          ) && (
            <span className="px-2 py-1 bg-primary text-primary-foreground text-xs rounded-full">
              Active
            </span>
          )}
        </div>
        <Button variant="ghost" size="icon" onClick={onToggle}>
          <Icon name={isExpanded ? "ChevronUp" : "ChevronDown"} size={20} />
        </Button>
      </div>
      {isExpanded && (
        <div className="p-4 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Search Keywords */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Search Keywords
              </label>
              <Input
                type="text"
                placeholder="Enter keyword..."
                value={localFilters?.keyword}
                onChange={(e) => handleFilterChange('keyword', e?.target?.value)}
                className="mb-2"
              />
              <div className="flex flex-wrap gap-1">
                {predefinedKeywords?.map((keyword) => (
                  <button
                    key={keyword}
                    onClick={() => handleFilterChange('keyword', keyword)}
                    className={`px-2 py-1 text-xs rounded-full border transition-colors ${
                      localFilters?.keyword === keyword
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-muted text-text-secondary border-border hover:bg-border'
                    }`}
                  >
                    {keyword}
                  </button>
                ))}
              </div>
            </div>

            {/* Date Range */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Date Range
              </label>
              <div className="space-y-2">
                <Input
                  type="date"
                  label="From"
                  value={localFilters?.dateRange?.from}
                  onChange={(e) => handleDateRangeChange('from', e?.target?.value)}
                />
                <Input
                  type="date"
                  label="To"
                  value={localFilters?.dateRange?.to}
                  onChange={(e) => handleDateRangeChange('to', e?.target?.value)}
                />
              </div>
            </div>

            {/* SOV Range */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Atomberg SOV Range (%)
              </label>
              <div className="space-y-2">
                <Input
                  type="number"
                  label="Min SOV"
                  placeholder="0"
                  min="0"
                  max="100"
                  value={localFilters?.sovRange?.min}
                  onChange={(e) => handleSOVRangeChange('min', e?.target?.value)}
                />
                <Input
                  type="number"
                  label="Max SOV"
                  placeholder="100"
                  min="0"
                  max="100"
                  value={localFilters?.sovRange?.max}
                  onChange={(e) => handleSOVRangeChange('max', e?.target?.value)}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Brand Filter */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Focus Brand
              </label>
              <div className="flex flex-wrap gap-1">
                {predefinedBrands?.map((brand) => (
                  <button
                    key={brand}
                    onClick={() => handleFilterChange('focusBrand', 
                      localFilters?.focusBrand === brand ? '' : brand
                    )}
                    className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                      localFilters?.focusBrand === brand
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-muted text-text-secondary border-border hover:bg-border'
                    }`}
                  >
                    {brand}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort Options */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Sort By
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: 'date-desc', label: 'Newest First' },
                  { value: 'date-asc', label: 'Oldest First' },
                  { value: 'sov-desc', label: 'Highest SOV' },
                  { value: 'sov-asc', label: 'Lowest SOV' }
                ]?.map((option) => (
                  <button
                    key={option?.value}
                    onClick={() => handleFilterChange('sortBy', option?.value)}
                    className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                      localFilters?.sortBy === option?.value
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-muted text-text-secondary border-border hover:bg-border'
                    }`}
                  >
                    {option?.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-light">
            <div className="text-sm text-text-secondary">
              Filters help you find specific analyses quickly
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" onClick={onClearFilters}>
                Clear All
              </Button>
              <Button variant="default" onClick={onToggle}>
                Apply Filters
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterPanel;