import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Breadcrumb from '../../components/ui/Breadcrumb';
import ProgressIndicator from '../../components/ui/ProgressIndicator';
import SearchPanel from './components/SearchPanel';
import ActivityFeed from './components/ActivityFeed';
import StatsCards from './components/StatsCards';
import RecentResults from './components/RecentResults';
import SystemHealth from './components/SystemHealth';
import aiAgentService from '../../services/aiAgentService';

const Dashboard = () => {
  const navigate = useNavigate();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(null);
  const [currentStepMessage, setCurrentStepMessage] = useState(null);
  const [activities, setActivities] = useState([]);
  const [stats, setStats] = useState({});
  const [recentResults, setRecentResults] = useState([]);
  const [healthData, setHealthData] = useState({});

  // Initialize data on component mount
  useEffect(() => {
    initializeData();
  }, []);

  const initializeData = () => {
    // Initialize stats
    setStats({
      totalAnalyses: 247,
      apiUsage: 68,
      successRate: 94,
      avgProcessingTime: 42
    });

    // Initialize mock activities (keeping some for demonstration)
    setActivities([
      {
        id: 'act-001',
        keyword: 'smart fan',
        status: 'completed',
        description: 'Analysis completed successfully with 8 brands found',
        timestamp: new Date(Date.now() - 1800000)?.toISOString(),
        duration: 125,
        resultsCount: 8
      },
      {
        id: 'act-002',
        keyword: 'bluetooth speaker',
        status: 'completed',
        description: 'Analysis completed with 12 brands identified',
        timestamp: new Date(Date.now() - 7200000)?.toISOString(),
        duration: 98,
        resultsCount: 12
      }
    ]);

    // Initialize mock recent results
    setRecentResults([
      {
        id: 'res-001',
        keyword: 'smart fan',
        timestamp: new Date(Date.now() - 1800000)?.toISOString(),
        brandsFound: 8,
        topBrands: [
          { name: 'Atomberg', sov: 35.2 },
          { name: 'Havells', sov: 22.8 },
          { name: 'Orient', sov: 18.5 },
          { name: 'Crompton', sov: 12.3 },
          { name: 'Bajaj', sov: 11.2 }
        ]
      }
    ]);

    // Check system health
    checkSystemHealth();
  };

  const checkSystemHealth = () => {
    const health = {
      googleApi: import.meta.env?.VITE_GOOGLE_API_KEY ? 'operational' : 'error',
      openaiApi: import.meta.env?.VITE_OPENAI_API_KEY ? 'operational' : 'error',
      scrapingService: 'operational', // Assume operational since it uses client-side CORS proxy
      database: 'operational'
    };

    setHealthData(health);
  };

  const handleStartAnalysis = async (config) => {
    try {
      // Validate configuration
      const validation = aiAgentService?.validateConfiguration(config);
      if (!validation?.isValid) {
        alert(`Configuration Error:\n${validation?.errors?.join('\n')}`);
        return;
      }

      setIsAnalyzing(true);
      setAnalysisProgress(0);
      setCurrentStep(1);
      setCurrentStepMessage('Initializing analysis...');

      // Create new activity
      const newActivity = {
        id: `act-${Date.now()}`,
        keyword: config?.keyword,
        status: 'running',
        description: `Analyzing top ${config?.maxResults || 10} websites for brand mentions`,
        timestamp: new Date()?.toISOString(),
        progress: {
          current: 0,
          total: config?.maxResults || 10
        }
      };

      setActivities(prev => [newActivity, ...prev]);

      // Execute AI agent analysis
      const results = await aiAgentService?.executeBrandAnalysis(config, (progress) => {
        setAnalysisProgress(progress?.percentage || 0);
        setCurrentStep(progress?.step || 1);
        setCurrentStepMessage(progress?.message || 'Processing...');
        
        // Update activity progress
        setActivities(prev => prev?.map(act => 
          act?.id === newActivity?.id 
            ? { 
                ...act, 
                progress: { 
                  current: progress?.step || 0, 
                  total: progress?.totalSteps || 6 
                } 
              }
            : act
        ));
      });

      // Analysis completed successfully
      const completedActivity = {
        ...newActivity,
        status: 'completed',
        description: `Analysis completed successfully with ${results?.shareOfVoice?.totalBrandsFound || 0} brands found`,
        duration: results?.metadata?.totalDuration ? Math.round(results?.metadata?.totalDuration / 1000) : 0,
        resultsCount: results?.shareOfVoice?.totalBrandsFound || 0
      };

      setActivities(prev => prev?.map(act => 
        act?.id === newActivity?.id ? completedActivity : act
      ));

      // Add to recent results
      const newResult = {
        id: `res-${Date.now()}`,
        keyword: config?.keyword,
        timestamp: new Date()?.toISOString(),
        brandsFound: results?.shareOfVoice?.totalBrandsFound || 0,
        topBrands: results?.shareOfVoice?.brandRankings?.slice(0, 5)?.map(brand => ({
          name: brand?.name,
          sov: brand?.sov
        })) || []
      };

      setRecentResults(prev => [newResult, ...prev]);

      // Update stats
      setStats(prev => ({
        ...prev,
        totalAnalyses: prev?.totalAnalyses + 1,
        apiUsage: Math.min(prev?.apiUsage + 5, 100),
        avgProcessingTime: results?.metadata?.totalDuration ? 
          Math.round(results?.metadata?.totalDuration / 1000) : prev?.avgProcessingTime
      }));

      // Navigate to results with the analysis data
      navigate('/analysis-results', { 
        state: { 
          analysisResults: results,
          fromAnalysis: true 
        } 
      });

    } catch (error) {
      console.error('Analysis failed:', error);
      
      // Update activity as failed
      setActivities(prev => prev?.map(act => 
        act?.status === 'running' 
          ? { 
              ...act, 
              status: 'failed', 
              description: `Analysis failed: ${error?.message}`,
              error: error?.message
            }
          : act
      ));

      // Update stats to reflect failure
      setStats(prev => ({
        ...prev,
        successRate: Math.max(prev?.successRate - 2, 0)
      }));

      alert(`Analysis failed: ${error?.message}`);
    } finally {
      setIsAnalyzing(false);
      setAnalysisProgress(0);
      setCurrentStep(null);
      setCurrentStepMessage(null);
    }
  };

  const handleViewDetails = (activityId) => {
    const activity = activities?.find(act => act?.id === activityId);
    if (activity?.status === 'completed') {
      navigate('/analysis-results', { state: { activityId } });
    }
  };

  const handleCancelAnalysis = (activityId) => {
    const cancelled = aiAgentService?.cancelAnalysis();
    
    if (cancelled) {
      setActivities(prev => prev?.map(act => 
        act?.id === activityId 
          ? { ...act, status: 'cancelled', description: 'Analysis cancelled by user' }
          : act
      ));
      
      setIsAnalyzing(false);
      setAnalysisProgress(0);
      setCurrentStep(null);
      setCurrentStepMessage(null);
    }
  };

  const handleViewAllResults = () => {
    navigate('/analysis-results');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <Breadcrumb />
          
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-text-primary mb-2">
              Brand Voice Analyzer Dashboard
            </h1>
            <p className="text-text-secondary">
              AI-powered competitive analysis using Google Search and OpenAI for intelligent brand mention detection
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Main Content Area */}
            <div className="lg:col-span-8 space-y-6">
              {/* Search Panel */}
              <SearchPanel 
                onStartAnalysis={handleStartAnalysis}
                isAnalyzing={isAnalyzing}
              />

              {/* Activity Feed */}
              <ActivityFeed 
                activities={activities}
                onViewDetails={handleViewDetails}
                onCancelAnalysis={handleCancelAnalysis}
              />
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-4 space-y-6">
              {/* Stats Cards */}
              <StatsCards stats={stats} />

              {/* Recent Results */}
              <RecentResults 
                results={recentResults}
                onViewAll={handleViewAllResults}
              />

              {/* System Health */}
              <SystemHealth healthData={healthData} />
            </div>
          </div>
        </div>
      </main>
      
      {/* Progress Indicator */}
      <ProgressIndicator
        isVisible={isAnalyzing}
        progress={analysisProgress}
        status="running"
        title="AI Brand Analysis in Progress"
        description={currentStepMessage || "Searching and analyzing websites for competitive data..."}
        currentStep={currentStep}
        totalSteps={6}
        estimatedTime={isAnalyzing ? Math.max(0, 180 - (analysisProgress * 1.8)) : null}
        onCancel={() => handleCancelAnalysis(activities?.find(a => a?.status === 'running')?.id)}
      />
    </div>
  );
};

export default Dashboard;