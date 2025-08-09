import googleSearchService from './googleSearchService';
import webScrapingService from './webScrapingService';
import brandAnalysisService from './brandAnalysisService';

/**
 * Main AI Agent service that orchestrates the entire brand analysis pipeline
 */
class AIAgentService {
  constructor() {
    this.isRunning = false;
    this.currentAnalysis = null;
  }

  /**
   * Execute complete brand voice analysis pipeline
   * @param {Object} config - Analysis configuration
   * @param {Function} onProgress - Progress callback function
   * @returns {Promise<Object>} Complete analysis results
   */
  async executeBrandAnalysis(config, onProgress = null) {
    try {
      this.isRunning = true;
      this.currentAnalysis = {
        id: `analysis-${Date.now()}`,
        keyword: config?.keyword,
        startTime: new Date()?.toISOString(),
        status: 'running'
      };

      const steps = [
        'Searching Google for top websites...',
        'Extracting website content...',
        'Analyzing brand mentions with AI...',
        'Calculating share of voice...',
        'Generating analysis summary...',
        'Finalizing results...'
      ];

      let currentStep = 0;

      // Step 1: Google Search
      if (onProgress) {
        onProgress({
          step: currentStep + 1,
          totalSteps: steps?.length,
          message: steps?.[currentStep],
          percentage: Math.round(((currentStep) / steps?.length) * 100)
        });
      }

      const searchResults = await googleSearchService?.getSearchResults(
        config?.keyword,
        config?.maxResults || 10
      );

      if (!searchResults?.results || searchResults?.results?.length === 0) {
        throw new Error('No search results found for the given keyword');
      }

      currentStep++;

      // Step 2: Web Scraping
      if (onProgress) {
        onProgress({
          step: currentStep + 1,
          totalSteps: steps?.length,
          message: steps?.[currentStep],
          percentage: Math.round(((currentStep) / steps?.length) * 100)
        });
      }

      const enrichedResults = await webScrapingService?.enrichSearchResults(
        searchResults?.results,
        (scrapingProgress) => {
          if (onProgress) {
            onProgress({
              step: currentStep + 1,
              totalSteps: steps?.length,
              message: `${steps?.[currentStep]} (${scrapingProgress?.completed}/${scrapingProgress?.total})`,
              percentage: Math.round(((currentStep + (scrapingProgress?.percentage / 100)) / steps?.length) * 100)
            });
          }
        }
      );

      currentStep++;

      // Step 3: Brand Analysis
      if (onProgress) {
        onProgress({
          step: currentStep + 1,
          totalSteps: steps?.length,
          message: steps?.[currentStep],
          percentage: Math.round(((currentStep) / steps?.length) * 100)
        });
      }

      // Create brand list (include target brand and common competitors)
      const brandList = [
        config?.targetBrand || 'Atomberg',
        ...brandAnalysisService?.defaultBrands?.filter(
          brand => brand?.toLowerCase() !== (config?.targetBrand || 'atomberg')?.toLowerCase()
        )
      ];

      const analysisResults = await brandAnalysisService?.analyzeMultipleWebsites(
        enrichedResults,
        brandList,
        (analysisProgress) => {
          if (onProgress) {
            onProgress({
              step: currentStep + 1,
              totalSteps: steps?.length,
              message: `${steps?.[currentStep]} (${analysisProgress?.completed}/${analysisProgress?.total})`,
              percentage: Math.round(((currentStep + (analysisProgress?.percentage / 100)) / steps?.length) * 100)
            });
          }
        }
      );

      currentStep++;

      // Step 4: SOV Calculation
      if (onProgress) {
        onProgress({
          step: currentStep + 1,
          totalSteps: steps?.length,
          message: steps?.[currentStep],
          percentage: Math.round(((currentStep) / steps?.length) * 100)
        });
      }

      const sovResults = await brandAnalysisService?.calculateShareOfVoice(
        analysisResults?.map(result => ({...result, keyword: config?.keyword})),
        config?.targetBrand || 'Atomberg'
      );

      currentStep++;

      // Step 5: Generate Summary
      if (onProgress) {
        onProgress({
          step: currentStep + 1,
          totalSteps: steps?.length,
          message: steps?.[currentStep],
          percentage: Math.round(((currentStep) / steps?.length) * 100)
        });
      }

      const analysisSummary = await brandAnalysisService?.generateAnalysisSummary(sovResults);

      currentStep++;

      // Step 6: Finalize
      if (onProgress) {
        onProgress({
          step: currentStep + 1,
          totalSteps: steps?.length,
          message: steps?.[currentStep],
          percentage: 100
        });
      }

      // Compile final results
      const finalResults = {
        id: this.currentAnalysis?.id,
        keyword: config?.keyword,
        targetBrand: config?.targetBrand || 'Atomberg',
        category: config?.category,
        searchResults: {
          total: searchResults?.totalResults,
          searchTime: searchResults?.searchTime,
          results: searchResults?.results
        },
        scrapingResults: {
          total: enrichedResults?.length,
          successful: enrichedResults?.filter(r => r?.scrapingSuccess)?.length,
          failed: enrichedResults?.filter(r => !r?.scrapingSuccess)?.length,
          avgContentLength: enrichedResults?.reduce((sum, r) => sum + (r?.contentLength || 0), 0) / enrichedResults?.length
        },
        shareOfVoice: sovResults,
        analysisSummary,
        metadata: {
          analysisId: this.currentAnalysis?.id,
          startTime: this.currentAnalysis?.startTime,
          endTime: new Date()?.toISOString(),
          totalDuration: Date.now() - new Date(this.currentAnalysis.startTime)?.getTime(),
          configuration: config
        }
      };

      this.isRunning = false;
      this.currentAnalysis = null;

      return finalResults;

    } catch (error) {
      this.isRunning = false;
      this.currentAnalysis = null;
      console.error('AI Agent Analysis Error:', error);
      throw new Error(`Analysis failed: ${error.message}`);
    }
  }

  /**
   * Cancel the current analysis
   */
  cancelAnalysis() {
    if (this.isRunning && this.currentAnalysis) {
      this.currentAnalysis.status = 'cancelled';
      this.isRunning = false;
      return true;
    }
    return false;
  }

  /**
   * Get current analysis status
   */
  getCurrentStatus() {
    return {
      isRunning: this.isRunning,
      currentAnalysis: this.currentAnalysis
    };
  }

  /**
   * Validate configuration before starting analysis
   * @param {Object} config - Analysis configuration
   * @returns {Object} Validation result
   */
  validateConfiguration(config) {
    const errors = [];

    if (!config?.keyword || config?.keyword?.trim()?.length < 2) {
      errors?.push('Keyword must be at least 2 characters long');
    }

    if (config?.maxResults && (config?.maxResults < 5 || config?.maxResults > 50)) {
      errors?.push('Max results must be between 5 and 50');
    }

    if (!import.meta.env?.VITE_GOOGLE_API_KEY) {
      errors?.push('Google API key is not configured');
    }

    if (!import.meta.env?.VITE_GOOGLE_CSE_ID) {
      errors?.push('Google Custom Search Engine ID is not configured');
    }

    if (!import.meta.env?.VITE_OPENAI_API_KEY) {
      errors?.push('OpenAI API key is not configured');
    }

    return {
      isValid: errors?.length === 0,
      errors
    };
  }
}

export default new AIAgentService();