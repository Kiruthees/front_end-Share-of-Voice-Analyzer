import openai from './openaiClient';

/**
 * Enhanced Brand Analysis service with OpenAI integration for intelligent brand detection
 */
class BrandAnalysisService {
  constructor() {
    // Expanded default brand list for various categories
    this.defaultBrands = [
      // Electronics/Smart Home
      'Atomberg', 'Havells', 'Orient', 'Crompton', 'Bajaj', 'Usha', 'Luminous',
      // Technology
      'Apple', 'Samsung', 'Google', 'Microsoft', 'Sony', 'LG', 'OnePlus',
      // Fashion/Apparel  
      'Nike', 'Adidas', 'Puma', 'Reebok', 'Under Armour', 'New Balance',
      // Automotive
      'Toyota', 'Honda', 'Ford', 'BMW', 'Mercedes', 'Audi', 'Hyundai',
      // General Consumer
      'Amazon', 'Flipkart', 'Reliance', 'Tata', 'Godrej', 'ITC', 'HUL'
    ];
  }

  /**
   * Intelligent brand detection using OpenAI for any keyword category
   * @param {string} keyword - Search keyword to analyze
   * @param {string} content - Website content to analyze
   * @param {Array} customBrands - Optional custom brand list
   * @returns {Promise<Object>} AI-powered brand analysis
   */
  async detectBrandsWithAI(keyword, content, customBrands = []) {
    try {
      if (!content || content?.length < 50) {
        return { brands: [], totalMentions: 0, confidence: 0 };
      }

      // Combine custom brands with category-relevant defaults
      const brandList = [...new Set([...customBrands, ...this.defaultBrands])];
      const brandPrompt = brandList?.length > 0 ? `Known brands to look for: ${brandList?.join(', ')}` : '';

      const response = await openai?.chat?.completions?.create({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: `You are a brand analysis expert. Analyze the given content for brand mentions related to "${keyword}". 
            ${brandPrompt}
            
            Return your analysis in this exact JSON format:
            {
              "brands": [
                {
                  "name": "Brand Name",
                  "mentions": number_of_mentions,
                  "confidence": confidence_score_0_to_1,
                  "contexts": ["context1", "context2"]
                }
              ],
              "totalMentions": total_brand_mentions_found,
              "categoryRelevance": relevance_score_0_to_1,
              "newBrandsFound": ["any_new_brands_not_in_known_list"]
            }`
          },
          {
            role: 'user',
            content: `Analyze this content for brand mentions related to "${keyword}":\n\n${content?.substring(0, 4000)}...`
          }
        ],
        response_format: {
          type: 'json_schema',
          json_schema: {
            name: 'brand_analysis_response',
            schema: {
              type: 'object',
              properties: {
                brands: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      name: { type: 'string' },
                      mentions: { type: 'number' },
                      confidence: { type: 'number' },
                      contexts: { type: 'array', items: { type: 'string' } }
                    },
                    required: ['name', 'mentions', 'confidence', 'contexts']
                  }
                },
                totalMentions: { type: 'number' },
                categoryRelevance: { type: 'number' },
                newBrandsFound: { type: 'array', items: { type: 'string' } }
              },
              required: ['brands', 'totalMentions', 'categoryRelevance', 'newBrandsFound']
            }
          }
        },
        temperature: 0.3,
        max_tokens: 1500
      });

      const analysis = JSON.parse(response?.choices?.[0]?.message?.content);
      
      // Filter out low-confidence results
      analysis.brands = analysis?.brands?.filter(brand => 
        brand?.confidence >= 0.6 && brand?.mentions > 0
      );

      return analysis;

    } catch (error) {
      console.error('AI Brand Detection Error:', error);
      // Fallback to basic text analysis
      return this.fallbackBrandDetection(keyword, content, customBrands);
    }
  }

  /**
   * Fallback brand detection using text analysis
   * @param {string} keyword - Search keyword
   * @param {string} content - Content to analyze
   * @param {Array} customBrands - Custom brand list
   * @returns {Object} Basic brand analysis
   */
  fallbackBrandDetection(keyword, content, customBrands = []) {
    const brandList = [...new Set([...customBrands, ...this.defaultBrands])];
    const contentLower = content?.toLowerCase();
    const brands = [];
    let totalMentions = 0;

    brandList?.forEach(brand => {
      const brandLower = brand?.toLowerCase();
      const regex = new RegExp(`\\b${brandLower}\\b`, 'gi');
      const matches = content?.match(regex) || [];
      
      if (matches?.length > 0) {
        // Extract context around brand mentions
        const contexts = [];
        let lastIndex = 0;
        let match;
        const contextRegex = new RegExp(`(.{0,50}\\b${brandLower}\\b.{0,50})`, 'gi');
        
        while ((match = contextRegex?.exec(content)) !== null && contexts?.length < 3) {
          contexts?.push(match?.[1]?.trim());
          lastIndex = match?.index;
        }

        brands?.push({
          name: brand,
          mentions: matches?.length,
          confidence: 0.8, // Default confidence for text matching
          contexts: contexts?.slice(0, 3)
        });
        totalMentions += matches?.length;
      }
    });

    return {
      brands: brands?.sort((a, b) => b?.mentions - a?.mentions),
      totalMentions,
      categoryRelevance: 0.7, // Default relevance
      newBrandsFound: []
    };
  }

  /**
   * Analyze website content for brand mentions using OpenAI
   * @param {string} content - Website content to analyze
   * @param {Array} brandList - List of brands to search for
   * @returns {Promise<Object>} Brand analysis results
   */
  async analyzeBrandMentions(content, brandList = this.defaultBrands) {
    try {
      if (!content || content?.length < 50) {
        return { brands: [], totalMentions: 0, confidence: 0 };
      }

      // Limit content length to avoid token limits
      const limitedContent = content?.substring(0, 8000);

      const response = await openai?.chat?.completions?.create({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: `You are a brand analysis expert. Analyze the given website content and identify mentions of specific brands. Count how many times each brand is mentioned, considering variations in capitalization, spacing, and common misspellings. Be precise and only count actual brand mentions, not generic terms that might contain the brand name.`
          },
          {
            role: 'user',
            content: `Analyze this website content for mentions of these brands: ${brandList?.join(', ')}\n\nContent to analyze:\n${limitedContent}\n\nReturn the results in the following JSON format with exact brand name matching:`
          }
        ],
        response_format: {
          type: 'json_schema',
          json_schema: {
            name: 'brand_analysis_response',
            schema: {
              type: 'object',
              properties: {
                brands: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      name: { type: 'string' },
                      mentions: { type: 'number' },
                      contexts: {
                        type: 'array',
                        items: { type: 'string' }
                      }
                    },
                    required: ['name', 'mentions']
                  }
                },
                totalMentions: { type: 'number' },
                confidence: { type: 'number' }
              },
              required: ['brands', 'totalMentions', 'confidence'],
              additionalProperties: false
            }
          }
        },
        temperature: 0.3,
        max_tokens: 2000
      });

      const result = JSON.parse(response?.choices?.[0]?.message?.content);
      
      // Validate and sanitize the result
      return {
        brands: result?.brands?.filter(brand => brand?.mentions > 0) || [],
        totalMentions: result?.totalMentions || 0,
        confidence: Math.min(Math.max(result?.confidence || 0, 0), 100) // Ensure confidence is between 0-100
      };

    } catch (error) {
      console.error('Error analyzing brand mentions:', error);
      return { brands: [], totalMentions: 0, confidence: 0, error: error?.message };
    }
  }

  /**
   * Enhanced analysis for multiple websites with AI integration
   * @param {Array} enrichedResults - Website results with content
   * @param {Array} brandList - List of brands to analyze
   * @param {Function} progressCallback - Progress callback
   * @returns {Promise<Array>} Enhanced analysis results
   */
  async analyzeMultipleWebsites(enrichedResults, brandList = [], progressCallback = null) {
    const results = [];
    let completed = 0;

    for (const website of enrichedResults) {
      try {
        if (progressCallback) {
          progressCallback({
            completed,
            total: enrichedResults?.length,
            percentage: Math.round((completed / enrichedResults?.length) * 100),
            currentWebsite: website?.displayLink
          });
        }

        if (!website?.scrapingSuccess || !website?.content) {
          results?.push({
            ...website,
            analysisSuccess: false,
            error: 'No content available for analysis',
            brandMentions: {},
            totalBrandMentions: 0
          });
          completed++;
          continue;
        }

        // Use AI-powered brand detection
        const aiAnalysis = await this.detectBrandsWithAI(
          website?.keyword || 'product',
          website?.content,
          brandList
        );

        // Convert AI analysis to expected format
        const brandMentions = {};
        aiAnalysis?.brands?.forEach(brand => {
          brandMentions[brand?.name] = brand?.mentions;
        });

        results?.push({
          ...website,
          analysisSuccess: true,
          brandMentions,
          totalBrandMentions: aiAnalysis?.totalMentions,
          brandContexts: aiAnalysis?.brands?.reduce((acc, brand) => {
            acc[brand?.name] = brand?.contexts || [];
            return acc;
          }, {}),
          categoryRelevance: aiAnalysis?.categoryRelevance,
          newBrandsFound: aiAnalysis?.newBrandsFound,
          analysisMethod: 'AI-powered',
          aiConfidence: aiAnalysis?.brands?.reduce((sum, brand) => 
            sum + brand?.confidence, 0) / (aiAnalysis?.brands?.length || 1)
        });

      } catch (error) {
        console.error(`Analysis failed for ${website?.displayLink}:`, error);
        results?.push({
          ...website,
          analysisSuccess: false,
          error: error?.message,
          brandMentions: {},
          totalBrandMentions: 0
        });
      }

      completed++;
    }

    if (progressCallback) {
      progressCallback({
        completed: enrichedResults?.length,
        total: enrichedResults?.length,
        percentage: 100
      });
    }

    return results;
  }

  /**
   * Calculate Share of Voice (SOV) for all brands
   * @param {Array} analysisResults - Array of website analysis results
   * @param {string} targetBrand - Primary brand to highlight
   * @returns {Promise<Object>} SOV calculation results
   */
  async calculateShareOfVoice(analysisResults, targetBrand = 'Atomberg') {
    try {
      // Aggregate brand mentions across all websites
      const brandTotals = {};
      let overallTotalMentions = 0;
      const websiteBreakdown = [];

      analysisResults?.forEach((website) => {
        const websiteData = {
          url: website?.url,
          title: website?.title,
          totalMentions: website?.brandAnalysis?.totalMentions || 0,
          brands: website?.brandAnalysis?.brands || [],
          confidence: website?.brandAnalysis?.confidence || 0
        };

        websiteBreakdown?.push(websiteData);

        // Aggregate brand totals
        if (website?.brandAnalysis?.brands) {
          website?.brandAnalysis?.brands?.forEach((brand) => {
            if (brand?.mentions > 0) {
              brandTotals[brand.name] = (brandTotals?.[brand?.name] || 0) + brand?.mentions;
              overallTotalMentions += brand?.mentions;
            }
          });
        }
      });

      // Calculate SOV percentages
      const brandSOV = Object.keys(brandTotals)?.map(brandName => ({
          name: brandName,
          mentions: brandTotals?.[brandName],
          sov: overallTotalMentions > 0 
            ? parseFloat(((brandTotals?.[brandName] / overallTotalMentions) * 100)?.toFixed(2))
            : 0,
          isTarget: brandName?.toLowerCase() === targetBrand?.toLowerCase()
        }))?.sort((a, b) => b?.sov - a?.sov);

      // Find target brand data
      const targetBrandData = brandSOV?.find(brand => brand?.isTarget) || null;
      const targetBrandRank = targetBrandData 
        ? brandSOV?.findIndex(brand => brand?.isTarget) + 1 
        : null;

      return {
        keyword: analysisResults?.[0]?.keyword || 'Unknown',
        targetBrand,
        targetBrandData,
        targetBrandRank,
        totalBrandsFound: brandSOV?.length,
        totalMentions: overallTotalMentions,
        totalWebsitesAnalyzed: analysisResults?.length,
        successfulScrapes: analysisResults?.filter(r => r?.scrapingSuccess)?.length,
        brandRankings: brandSOV,
        websiteBreakdown,
        analysisMetadata: {
          timestamp: new Date()?.toISOString(),
          avgConfidence: websiteBreakdown?.length > 0 
            ? parseFloat((websiteBreakdown?.reduce((sum, w) => sum + w?.confidence, 0) / websiteBreakdown?.length)?.toFixed(2))
            : 0
        }
      };
    } catch (error) {
      console.error('Error calculating share of voice:', error);
      throw error;
    }
  }

  /**
   * Generate analysis summary using OpenAI
   * @param {Object} sovResults - Share of Voice results
   * @returns {Promise<string>} Analysis summary
   */
  async generateAnalysisSummary(sovResults) {
    try {
      const response = await openai?.chat?.completions?.create({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: `You are a marketing analyst expert. Generate a concise, professional analysis summary based on brand share of voice data. Focus on key insights, competitive positioning, and actionable recommendations.`
          },
          {
            role: 'user',
            content: `Generate a professional analysis summary for this brand voice analysis:

Target Brand: ${sovResults?.targetBrand}
Target Brand SOV: ${sovResults?.targetBrandData?.sov || 0}%
Target Brand Rank: ${sovResults?.targetBrandRank || 'Not found'}
Total Brands Found: ${sovResults?.totalBrandsFound}
Total Mentions: ${sovResults?.totalMentions}
Keyword: "${sovResults?.keyword}"

Top 5 Brands by SOV:
${sovResults?.brandRankings?.slice(0, 5)?.map(brand => `${brand?.name}: ${brand?.sov}%`)?.join('\n')}

Provide insights about competitive position, market visibility, and recommendations in 3-4 concise paragraphs.`
          }
        ],
        temperature: 0.7,
        max_tokens: 500
      });

      return response?.choices?.[0]?.message?.content;
    } catch (error) {
      console.error('Error generating analysis summary:', error);
      return 'Unable to generate analysis summary at this time.';
    }
  }
}

export default new BrandAnalysisService();