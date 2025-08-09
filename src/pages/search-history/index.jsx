import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Breadcrumb from '../../components/ui/Breadcrumb';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import HistoryCard from './components/HistoryCard';
import FilterPanel from './components/FilterPanel';
import ComparisonModal from './components/ComparisonModal';
import BulkActions from './components/BulkActions';
import EmptyState from './components/EmptyState';

const SearchHistory = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAnalyses, setSelectedAnalyses] = useState([]);
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);
  const [isComparisonModalOpen, setIsComparisonModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const [filters, setFilters] = useState({
    keyword: '',
    dateRange: { from: '', to: '' },
    sovRange: { min: '', max: '' },
    focusBrand: '',
    sortBy: 'date-desc'
  });

  // Mock data for search history
  const mockAnalyses = [
    {
      id: 1,
      keyword: 'smart fan',
      executedAt: '2025-01-08T14:30:00Z',
      brandsDetected: 8,
      topCompetitor: 'Havells',
      topCompetitorSOV: 32.5,
      atombergSOV: 28.3,
      sovTrend: 2.1,
      marketPosition: 2,
      websitesScraped: 10,
      processingTime: 45
    },
    {
      id: 2,
      keyword: 'ceiling fan',
      executedAt: '2025-01-07T16:45:00Z',
      brandsDetected: 12,
      topCompetitor: 'Bajaj',
      topCompetitorSOV: 35.8,
      atombergSOV: 22.7,
      sovTrend: -1.5,
      marketPosition: 3,
      websitesScraped: 10,
      processingTime: 52
    },
    {
      id: 3,
      keyword: 'smart fan',
      executedAt: '2025-01-06T10:15:00Z',
      brandsDetected: 9,
      topCompetitor: 'Orient',
      topCompetitorSOV: 29.4,
      atombergSOV: 31.2,
      sovTrend: 4.3,
      marketPosition: 1,
      websitesScraped: 10,
      processingTime: 38
    },
    {
      id: 4,
      keyword: 'table fan',
      executedAt: '2025-01-05T13:20:00Z',
      brandsDetected: 7,
      topCompetitor: 'Crompton',
      topCompetitorSOV: 28.9,
      atombergSOV: 18.5,
      sovTrend: -0.8,
      marketPosition: 4,
      websitesScraped: 10,
      processingTime: 41
    },
    {
      id: 5,
      keyword: 'exhaust fan',
      executedAt: '2025-01-04T09:30:00Z',
      brandsDetected: 6,
      topCompetitor: 'Usha',
      topCompetitorSOV: 42.1,
      atombergSOV: 15.3,
      sovTrend: 1.2,
      marketPosition: 5,
      websitesScraped: 10,
      processingTime: 35
    }
  ];

  const [analyses, setAnalyses] = useState(mockAnalyses);
  const [filteredAnalyses, setFilteredAnalyses] = useState(mockAnalyses);

  // Filter and search logic
  useEffect(() => {
    let filtered = [...analyses];

    // Apply search query
    if (searchQuery?.trim()) {
      filtered = filtered?.filter(analysis =>
        analysis?.keyword?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
        analysis?.topCompetitor?.toLowerCase()?.includes(searchQuery?.toLowerCase())
      );
    }

    // Apply filters
    if (filters?.keyword) {
      filtered = filtered?.filter(analysis =>
        analysis?.keyword?.toLowerCase()?.includes(filters?.keyword?.toLowerCase())
      );
    }

    if (filters?.dateRange?.from) {
      filtered = filtered?.filter(analysis =>
        new Date(analysis.executedAt) >= new Date(filters.dateRange.from)
      );
    }

    if (filters?.dateRange?.to) {
      filtered = filtered?.filter(analysis =>
        new Date(analysis.executedAt) <= new Date(filters.dateRange.to)
      );
    }

    if (filters?.sovRange?.min) {
      filtered = filtered?.filter(analysis =>
        analysis?.atombergSOV >= parseFloat(filters?.sovRange?.min)
      );
    }

    if (filters?.sovRange?.max) {
      filtered = filtered?.filter(analysis =>
        analysis?.atombergSOV <= parseFloat(filters?.sovRange?.max)
      );
    }

    if (filters?.focusBrand && filters?.focusBrand !== 'Atomberg') {
      filtered = filtered?.filter(analysis =>
        analysis?.topCompetitor === filters?.focusBrand
      );
    }

    // Apply sorting
    filtered?.sort((a, b) => {
      switch (filters?.sortBy) {
        case 'date-asc':
          return new Date(a.executedAt) - new Date(b.executedAt);
        case 'sov-desc':
          return b?.atombergSOV - a?.atombergSOV;
        case 'sov-asc':
          return a?.atombergSOV - b?.atombergSOV;
        default: // date-desc
          return new Date(b.executedAt) - new Date(a.executedAt);
      }
    });

    setFilteredAnalyses(filtered);
    setCurrentPage(1);
  }, [searchQuery, filters, analyses]);

  const handleSelectAnalysis = (id, isSelected) => {
    if (isSelected) {
      setSelectedAnalyses(prev => [...prev, id]);
    } else {
      setSelectedAnalyses(prev => prev?.filter(selectedId => selectedId !== id));
    }
  };

  const handleSelectAll = () => {
    setSelectedAnalyses(filteredAnalyses?.map(analysis => analysis?.id));
  };

  const handleDeselectAll = () => {
    setSelectedAnalyses([]);
  };

  const handleViewAnalysis = (id) => {
    navigate(`/analysis-results?id=${id}`);
  };

  const handleRerunAnalysis = (keyword) => {
    navigate(`/dashboard?keyword=${encodeURIComponent(keyword)}`);
  };

  const handleCompareAnalyses = (id) => {
    if (!selectedAnalyses?.includes(id)) {
      setSelectedAnalyses(prev => [...prev, id]);
    }
    setIsComparisonModalOpen(true);
  };

  const handleBulkCompare = () => {
    // Removed bulk compare functionality
  };

  const handleBulkDelete = () => {
    // Removed bulk delete functionality
  };

  const handleBulkExport = () => {
    // Removed bulk export functionality
  };

  const handleDeleteAnalysis = (id) => {
    // Removed individual delete functionality
  };

  const handleClearFilters = () => {
    setFilters({
      keyword: '',
      dateRange: { from: '', to: '' },
      sovRange: { min: '', max: '' },
      focusBrand: '',
      sortBy: 'date-desc'
    });
    setSearchQuery('');
  };

  const handleStartNewAnalysis = () => {
    navigate('/dashboard');
  };

  const handleRemoveFromComparison = (id) => {
    setSelectedAnalyses(prev => prev?.filter(selectedId => selectedId !== id));
  };

  const getSelectedAnalysesData = () => {
    return analyses?.filter(analysis => selectedAnalyses?.includes(analysis?.id));
  };

  const hasActiveFilters = Object.values(filters)?.some(filter => 
    typeof filter === 'string' ? filter : 
    typeof filter === 'object' ? Object.values(filter)?.some(v => v) : false
  ) || searchQuery?.trim();

  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredAnalyses?.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedAnalyses = filteredAnalyses?.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <Breadcrumb />
          
          {/* Page Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-text-primary mb-2">
                Search History
              </h1>
              <p className="text-text-secondary">
                Review and compare your competitive analysis results
              </p>
            </div>
            <Button variant="default" onClick={handleStartNewAnalysis}>
              <Icon name="Plus" size={20} className="mr-2" />
              New Analysis
            </Button>
          </div>

          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative max-w-md">
              <Icon name="Search" size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary" />
              <Input
                type="search"
                placeholder="Search by keyword or brand..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e?.target?.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Filter Panel */}
          <FilterPanel
            isExpanded={isFilterExpanded}
            onToggle={() => setIsFilterExpanded(!isFilterExpanded)}
            filters={filters}
            onFiltersChange={setFilters}
            onClearFilters={handleClearFilters}
          />

          {/* Bulk Actions */}
          {filteredAnalyses?.length > 0 && (
            <BulkActions
              selectedCount={selectedAnalyses?.length}
              totalCount={filteredAnalyses?.length}
              onSelectAll={handleSelectAll}
              onDeselectAll={handleDeselectAll}
              onBulkDelete={handleBulkDelete}
              onBulkExport={handleBulkExport}
              onBulkCompare={handleBulkCompare}
            />
          )}

          {/* Results */}
          {filteredAnalyses?.length === 0 ? (
            <EmptyState
              hasFilters={hasActiveFilters}
              onClearFilters={handleClearFilters}
              onStartNewAnalysis={handleStartNewAnalysis}
            />
          ) : (
            <>
              {/* Results Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <p className="text-sm text-text-secondary">
                    Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredAnalyses?.length)} of {filteredAnalyses?.length} analyses
                  </p>
                  {hasActiveFilters && (
                    <Button variant="outline" size="sm" onClick={handleClearFilters}>
                      <Icon name="X" size={14} className="mr-1" />
                      Clear Filters
                    </Button>
                  )}
                </div>
              </div>

              {/* Analysis Cards */}
              <div className="space-y-4 mb-8">
                {paginatedAnalyses?.map((analysis) => (
                  <HistoryCard
                    key={analysis?.id}
                    analysis={analysis}
                    isSelected={selectedAnalyses?.includes(analysis?.id)}
                    onSelect={handleSelectAnalysis}
                    onView={handleViewAnalysis}
                    onRerun={handleRerunAnalysis}
                    onCompare={handleCompareAnalyses}
                    onDelete={handleDeleteAnalysis}
                  />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    <Icon name="ChevronLeft" size={16} />
                  </Button>
                  
                  <div className="flex items-center space-x-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1)?.map((page) => (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(page)}
                        className="w-8 h-8"
                      >
                        {page}
                      </Button>
                    ))}
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                  >
                    <Icon name="ChevronRight" size={16} />
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </main>
      {/* Comparison Modal */}
      <ComparisonModal
        isOpen={isComparisonModalOpen}
        onClose={() => setIsComparisonModalOpen(false)}
        selectedAnalyses={getSelectedAnalysesData()}
        onRemoveAnalysis={handleRemoveFromComparison}
      />
    </div>
  );
};

export default SearchHistory;