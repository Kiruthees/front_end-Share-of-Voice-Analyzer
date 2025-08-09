import axios from 'axios';

/**
 * Google Custom Search API service for fetching search results
 */
class GoogleSearchService {
  constructor() {
    this.apiKey = import.meta.env?.VITE_GOOGLE_API_KEY;
    this.searchEngineId = import.meta.env?.VITE_GOOGLE_CSE_ID;
    this.baseUrl = 'https://www.googleapis.com/customsearch/v1';
  }

  /**
   * Search Google for websites using the Custom Search API
   * @param {string} keyword - Search keyword
   * @param {number} maxResults - Maximum number of results to return
   * @returns {Promise<Array>} Array of search results
   */
  async searchWebsites(keyword, maxResults = 10) {
    try {
      if (!this.apiKey || !this.searchEngineId) {
        throw new Error('Google API key or Custom Search Engine ID not configured');
      }

      const results = [];
      const requestsNeeded = Math.ceil(maxResults / 10); // Google API returns max 10 results per request

      for (let i = 0; i < requestsNeeded; i++) {
        const startIndex = (i * 10) + 1;
        const response = await axios?.get(this.baseUrl, {
          params: {
            key: this.apiKey,
            cx: this.searchEngineId,
            q: keyword,
            start: startIndex,
            num: Math.min(10, maxResults - results?.length)
          }
        });

        if (response?.data?.items) {
          const formattedResults = response?.data?.items?.map((item, index) => ({
            id: `result-${startIndex + index}`,
            title: item?.title,
            link: item?.link,
            snippet: item?.snippet,
            displayLink: item?.displayLink,
            formattedUrl: item?.formattedUrl,
            rank: startIndex + index
          }));

          results?.push(...formattedResults);
        }

        // Rate limiting: pause between requests
        if (i < requestsNeeded - 1) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }

      return results?.slice(0, maxResults);
    } catch (error) {
      console.error('Google Search API error:', error);
      throw new Error(`Failed to search Google: ${error.response?.data?.error?.message || error.message}`);
    }
  }

  /**
   * Get search results with enhanced metadata
   * @param {string} keyword - Search keyword
   * @param {number} maxResults - Maximum number of results
   * @returns {Promise<Object>} Search results with metadata
   */
  async getSearchResults(keyword, maxResults = 10) {
    try {
      const startTime = Date.now();
      const results = await this.searchWebsites(keyword, maxResults);
      const endTime = Date.now();

      return {
        keyword,
        totalResults: results?.length,
        searchTime: endTime - startTime,
        timestamp: new Date()?.toISOString(),
        results
      };
    } catch (error) {
      throw error;
    }
  }
}

export default new GoogleSearchService();