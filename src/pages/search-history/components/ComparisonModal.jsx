import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';

const ComparisonModal = ({ 
  isOpen, 
  onClose, 
  selectedAnalyses, 
  onRemoveAnalysis 
}) => {
  const [viewMode, setViewMode] = useState('trend'); // 'trend' or 'breakdown'

  if (!isOpen) return null;

  // Generate comparison data
  const generateTrendData = () => {
    const dates = selectedAnalyses?.map(analysis => ({
      date: new Date(analysis.executedAt)?.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      keyword: analysis?.keyword,
      atombergSOV: analysis?.atombergSOV,
      topCompetitorSOV: analysis?.topCompetitorSOV,
      topCompetitor: analysis?.topCompetitor
    }));
    return dates?.sort((a, b) => new Date(a.date) - new Date(b.date));
  };

  const generateBreakdownData = () => {
    return selectedAnalyses?.map(analysis => ({
      keyword: analysis?.keyword,
      date: new Date(analysis.executedAt)?.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      atomberg: analysis?.atombergSOV,
      competitor: analysis?.topCompetitorSOV,
      competitorName: analysis?.topCompetitor,
      others: 100 - analysis?.atombergSOV - analysis?.topCompetitorSOV
    }));
  };

  const trendData = generateTrendData();
  const breakdownData = generateBreakdownData();

  const modalContent = (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 animate-fade-in">
      <div className="bg-surface rounded-lg shadow-elevated w-full max-w-6xl mx-4 max-h-[90vh] overflow-hidden animate-slide-up">
        <div className="flex items-center justify-between p-6 border-b border-light">
          <div className="flex items-center space-x-3">
            <Icon name="BarChart3" size={24} className="text-primary" />
            <div>
              <h2 className="text-xl font-semibold text-text-primary">
                Analysis Comparison
              </h2>
              <p className="text-sm text-text-secondary">
                Comparing {selectedAnalyses?.length} analyses
              </p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <Icon name="X" size={20} />
          </Button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          {/* View Mode Toggle */}
          <div className="flex items-center space-x-2 mb-6">
            <Button
              variant={viewMode === 'trend' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('trend')}
            >
              <Icon name="TrendingUp" size={16} className="mr-2" />
              SOV Trends
            </Button>
            <Button
              variant={viewMode === 'breakdown' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('breakdown')}
            >
              <Icon name="PieChart" size={16} className="mr-2" />
              Market Breakdown
            </Button>
          </div>

          {/* Selected Analyses List */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-text-primary mb-3">
              Selected Analyses
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {selectedAnalyses?.map((analysis) => (
                <div key={analysis?.id} className="bg-muted rounded-lg p-3 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-text-primary">"{analysis?.keyword}"</p>
                    <p className="text-sm text-text-secondary">
                      {new Date(analysis.executedAt)?.toLocaleDateString('en-US')}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onRemoveAnalysis(analysis?.id)}
                  >
                    <Icon name="X" size={16} />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Charts */}
          {viewMode === 'trend' && (
            <div className="space-y-6">
              <div className="bg-card border border-light rounded-lg p-6">
                <h3 className="text-lg font-semibold text-text-primary mb-4">
                  Share of Voice Trends
                </h3>
                <div className="w-full h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={trendData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                      <XAxis 
                        dataKey="date" 
                        stroke="var(--color-text-secondary)"
                        fontSize={12}
                      />
                      <YAxis 
                        stroke="var(--color-text-secondary)"
                        fontSize={12}
                        domain={[0, 100]}
                      />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'var(--color-card)',
                          border: '1px solid var(--color-border)',
                          borderRadius: '8px'
                        }}
                      />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="atombergSOV" 
                        stroke="var(--color-primary)" 
                        strokeWidth={3}
                        name="Atomberg SOV (%)"
                        dot={{ fill: 'var(--color-primary)', strokeWidth: 2, r: 4 }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="topCompetitorSOV" 
                        stroke="var(--color-warning)" 
                        strokeWidth={3}
                        name="Top Competitor SOV (%)"
                        dot={{ fill: 'var(--color-warning)', strokeWidth: 2, r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {viewMode === 'breakdown' && (
            <div className="space-y-6">
              <div className="bg-card border border-light rounded-lg p-6">
                <h3 className="text-lg font-semibold text-text-primary mb-4">
                  Market Share Breakdown
                </h3>
                <div className="w-full h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={breakdownData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                      <XAxis 
                        dataKey="keyword" 
                        stroke="var(--color-text-secondary)"
                        fontSize={12}
                        angle={-45}
                        textAnchor="end"
                        height={80}
                      />
                      <YAxis 
                        stroke="var(--color-text-secondary)"
                        fontSize={12}
                        domain={[0, 100]}
                      />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'var(--color-card)',
                          border: '1px solid var(--color-border)',
                          borderRadius: '8px'
                        }}
                      />
                      <Legend />
                      <Bar 
                        dataKey="atomberg" 
                        stackId="a" 
                        fill="var(--color-primary)" 
                        name="Atomberg"
                      />
                      <Bar 
                        dataKey="competitor" 
                        stackId="a" 
                        fill="var(--color-warning)" 
                        name="Top Competitor"
                      />
                      <Bar 
                        dataKey="others" 
                        stackId="a" 
                        fill="var(--color-muted-foreground)" 
                        name="Others"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Summary Table */}
              <div className="bg-card border border-light rounded-lg p-6">
                <h3 className="text-lg font-semibold text-text-primary mb-4">
                  Comparison Summary
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-light">
                        <th className="text-left py-3 px-4 font-medium text-text-primary">Keyword</th>
                        <th className="text-left py-3 px-4 font-medium text-text-primary">Date</th>
                        <th className="text-left py-3 px-4 font-medium text-text-primary">Atomberg SOV</th>
                        <th className="text-left py-3 px-4 font-medium text-text-primary">Top Competitor</th>
                        <th className="text-left py-3 px-4 font-medium text-text-primary">Market Position</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedAnalyses?.map((analysis) => (
                        <tr key={analysis?.id} className="border-b border-light hover:bg-muted">
                          <td className="py-3 px-4 font-medium text-text-primary">
                            "{analysis?.keyword}"
                          </td>
                          <td className="py-3 px-4 text-text-secondary">
                            {new Date(analysis.executedAt)?.toLocaleDateString('en-US')}
                          </td>
                          <td className="py-3 px-4">
                            <span className="font-semibold text-primary">
                              {analysis?.atombergSOV}%
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div>
                              <span className="font-medium text-text-primary">
                                {analysis?.topCompetitor}
                              </span>
                              <span className="text-text-secondary ml-2">
                                ({analysis?.topCompetitorSOV}%)
                              </span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded-full">
                              #{analysis?.marketPosition}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-end space-x-3 p-6 border-t border-light">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button variant="default">
            <Icon name="Download" size={16} className="mr-2" />
            Export Comparison
          </Button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default ComparisonModal;