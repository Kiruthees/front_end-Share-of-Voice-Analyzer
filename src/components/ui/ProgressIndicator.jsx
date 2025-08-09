import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Icon from '../AppIcon';
import Button from './Button';

const ProgressIndicator = ({ 
  isVisible = false, 
  progress = 0, 
  status = 'running', 
  title = 'Processing Analysis',
  description = 'Analyzing competitive data...',
  onCancel = null,
  estimatedTime = null,
  currentStep = null,
  totalSteps = null
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted || !isVisible) {
    return null;
  }

  const getStatusIcon = () => {
    switch (status) {
      case 'success':
        return <Icon name="CheckCircle" size={24} className="text-success" />;
      case 'error':
        return <Icon name="XCircle" size={24} className="text-error" />;
      case 'warning':
        return <Icon name="AlertTriangle" size={24} className="text-warning" />;
      default:
        return <Icon name="Loader2" size={24} className="text-primary animate-spin" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'success':
        return 'bg-success';
      case 'error':
        return 'bg-error';
      case 'warning':
        return 'bg-warning';
      default:
        return 'bg-primary';
    }
  };

  const formatTime = (seconds) => {
    if (!seconds) return '';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs?.toString()?.padStart(2, '0')}`;
  };

  const progressContent = (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 animate-fade-in">
      <div className="bg-surface rounded-lg shadow-elevated p-6 w-full max-w-md mx-4 animate-slide-up">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            {getStatusIcon()}
            <div>
              <h3 className="text-lg font-semibold text-text-primary">{title}</h3>
              {currentStep && totalSteps && (
                <p className="text-sm text-text-secondary">
                  Step {currentStep} of {totalSteps}
                </p>
              )}
            </div>
          </div>
          {onCancel && status === 'running' && (
            <Button variant="ghost" size="icon" onClick={onCancel}>
              <Icon name="X" size={16} />
            </Button>
          )}
        </div>

        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm text-text-secondary">{description}</p>
            <span className="text-sm font-medium text-text-primary">
              {Math.round(progress)}%
            </span>
          </div>
          
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${getStatusColor()}`}
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
        </div>

        {estimatedTime && status === 'running' && (
          <div className="flex items-center justify-between text-sm text-text-secondary">
            <span>Estimated time remaining:</span>
            <span className="font-mono">{formatTime(estimatedTime)}</span>
          </div>
        )}

        {status === 'success' && (
          <div className="mt-4 p-3 bg-success/10 rounded-lg border border-success/20">
            <p className="text-sm text-success font-medium">Analysis completed successfully!</p>
          </div>
        )}

        {status === 'error' && (
          <div className="mt-4 p-3 bg-error/10 rounded-lg border border-error/20">
            <p className="text-sm text-error font-medium">Analysis failed. Please try again.</p>
          </div>
        )}

        {onCancel && status === 'running' && (
          <div className="mt-4 flex justify-end">
            <Button variant="outline" onClick={onCancel} size="sm">
              Cancel Analysis
            </Button>
          </div>
        )}
      </div>
    </div>
  );

  return createPortal(progressContent, document.body);
};

export default ProgressIndicator;