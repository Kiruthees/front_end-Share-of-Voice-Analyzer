import React from 'react';

import Button from '../../../components/ui/Button';

const BulkActions = ({ 
  selectedCount, 
  totalCount, 
  onSelectAll, 
  onDeselectAll, 
  onBulkDelete, 
  onBulkExport, 
  onBulkCompare 
}) => {
  const isAllSelected = selectedCount === totalCount && totalCount > 0;
  const isPartialSelected = selectedCount > 0 && selectedCount < totalCount;

  return (
    <div className="bg-card border border-light rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="relative">
              <input
                type="checkbox"
                checked={isAllSelected}
                ref={(input) => {
                  if (input) input.indeterminate = isPartialSelected;
                }}
                onChange={(e) => {
                  if (e?.target?.checked) {
                    onSelectAll();
                  } else {
                    onDeselectAll();
                  }
                }}
                className="w-4 h-4 text-primary border-border rounded focus:ring-primary focus:ring-2"
              />
            </div>
            <span className="text-sm font-medium text-text-primary">
              {selectedCount > 0 ? (
                `${selectedCount} of ${totalCount} selected`
              ) : (
                `Select all ${totalCount} analyses`
              )}
            </span>
          </div>

          {selectedCount > 0 && (
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={onDeselectAll}>
                Clear Selection
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BulkActions;