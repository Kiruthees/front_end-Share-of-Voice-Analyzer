import axios from 'axios';

/**
 * Web scraping service for extracting content from websites
 */
class WebScrapingService {
  constructor() {
    this.timeout = 10000; // 10 seconds timeout
    this.maxRetries = 2;
  }

  /**
   * Extract text content from a website using a CORS proxy
   * @param {string} url - Website URL to scrape
   * @returns {Promise<string>} Extracted text content
   */
  async scrapeWebsiteContent(url) {
    let lastError;

    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        // Using AllOrigins CORS proxy service (free service)
        const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
        
        const response = await axios?.get(proxyUrl, {
          timeout: this.timeout,
          headers: {
            'Accept': 'application/json',
          }
        });

        if (!response?.data?.contents) {
          throw new Error('No content received from proxy');
        }

        // Extract text content from HTML
        const htmlContent = response?.data?.contents;
        let textContent = this.extractTextFromHtml(htmlContent);

        if (!textContent || textContent?.length < 100) {
          throw new Error('Insufficient content extracted');
        }

        return textContent;
      } catch (error) {
        lastError = error;
        console.warn(`Scraping attempt ${attempt} failed for ${url}:`, error?.message);
        
        if (attempt < this.maxRetries) {
          // Wait before retry
          await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
        }
      }
    }

    // If all attempts failed, throw the last error
    throw new Error(`Failed to scrape ${url}: ${lastError?.message || 'Unknown error'}`);
  }

  /**
   * Extract plain text from HTML content
   * @param {string} html - HTML content
   * @returns {string} Plain text content
   */
  extractTextFromHtml(html) {
    try {
      // Create a temporary DOM element to parse HTML
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = html;

      // Remove script and style elements
      const scripts = tempDiv?.querySelectorAll('script, style, noscript');
      scripts?.forEach(element => element?.remove());

      // Get text content
      let textContent = tempDiv?.textContent || tempDiv?.innerText || '';

      // Clean up the text
      textContent = // Replace newlines with space
      // Replace multiple whitespaces with single space
      textContent?.replace(/\s+/g, ' ')?.replace(/\n+/g, ' ')?.trim();

      return textContent;
    } catch (error) {
      console.error('Error extracting text from HTML:', error);
      return '';
    }
  }

  /**
   * Scrape multiple websites in parallel with rate limiting
   * @param {Array} urls - Array of URLs to scrape
   * @param {Function} onProgress - Progress callback function
   * @returns {Promise<Array>} Array of scraped content
   */
  async scrapeMultipleWebsites(urls, onProgress = null) {
    const results = [];
    const batchSize = 3; // Process 3 URLs at a time to avoid overwhelming servers

    for (let i = 0; i < urls?.length; i += batchSize) {
      const batch = urls?.slice(i, i + batchSize);
      
      const batchPromises = batch?.map(async (url) => {
        try {
          const content = await this.scrapeWebsiteContent(url);
          return {
            url,
            content,
            success: true,
            timestamp: new Date()?.toISOString()
          };
        } catch (error) {
          return {
            url,
            content: '',
            success: false,
            error: error?.message,
            timestamp: new Date()?.toISOString()
          };
        }
      });

      const batchResults = await Promise.all(batchPromises);
      results?.push(...batchResults);

      // Call progress callback if provided
      if (onProgress) {
        onProgress({
          completed: results?.length,
          total: urls?.length,
          percentage: Math.round((results?.length / urls?.length) * 100)
        });
      }

      // Rate limiting: pause between batches
      if (i + batchSize < urls?.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    return results;
  }

  /**
   * Get website metadata and content
   * @param {Array} searchResults - Array of search results from Google
   * @param {Function} onProgress - Progress callback
   * @returns {Promise<Array>} Enhanced search results with content
   */
  async enrichSearchResults(searchResults, onProgress = null) {
    try {
      const urls = searchResults?.map(result => result?.link);
      const scrapedData = await this.scrapeMultipleWebsites(urls, onProgress);

      // Combine search results with scraped content
      const enrichedResults = searchResults?.map((result, index) => {
        const scrapedContent = scrapedData?.[index];
        return {
          ...result,
          content: scrapedContent?.content || '',
          contentLength: scrapedContent?.content?.length || 0,
          scrapingSuccess: scrapedContent?.success || false,
          scrapingError: scrapedContent?.error || null,
          scrapedAt: scrapedContent?.timestamp
        };
      });

      return enrichedResults;
    } catch (error) {
      console.error('Error enriching search results:', error);
      throw error;
    }
  }
}

export default new WebScrapingService();