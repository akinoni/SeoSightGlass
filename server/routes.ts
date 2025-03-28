import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import fetch from "node-fetch";
import * as cheerio from "cheerio";
import { analysisResultSchema, type AnalysisResult, type MetaTag } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Define a route to analyze website SEO meta tags
  app.post("/api/analyze", async (req, res) => {
    try {
      // Validate the request body
      const { url } = z.object({
        url: z.string().url(),
      }).parse(req.body);

      // Fetch the HTML from the provided URL
      const response = await fetch(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (compatible; SEOMetaInspector/1.0; +https://metainspector.com)",
        },
      });

      if (!response.ok) {
        return res.status(400).json({
          message: `Failed to fetch website: ${response.statusText}`,
        });
      }

      const html = await response.text();
      
      // Parse the HTML using cheerio
      const $ = cheerio.load(html);
      
      // Extract meta tags
      const metaTags: MetaTag[] = [];
      const recommendations: AnalysisResult["recommendations"] = [];
      
      // Extract title
      const title = $("title").text() || null;
      if (title) {
        const titleLength = title.length;
        let titleStatus: MetaTag["status"] = "good";
        let titleMessage = "Good length and format";
        
        if (titleLength < 30) {
          titleStatus = "warning";
          titleMessage = "Too short (under 30 characters)";
          recommendations.push({
            type: "warning",
            title: "Title tag is too short",
            description: "Your title tag is under 30 characters. For better SEO, aim for 50-60 characters.",
          });
        } else if (titleLength > 60) {
          titleStatus = "warning";
          titleMessage = "Too long (over 60 characters)";
          recommendations.push({
            type: "warning",
            title: "Title tag is too long",
            description: "Your title tag exceeds 60 characters. It may be truncated in search results.",
          });
        }
        
        metaTags.push({
          name: "title",
          content: title,
          status: titleStatus,
          statusMessage: titleMessage,
        });
      } else {
        metaTags.push({
          name: "title",
          content: null,
          status: "error",
          statusMessage: "Missing title tag",
        });
        
        recommendations.push({
          type: "error",
          title: "Missing title tag",
          description: "Your page doesn't have a title tag. This is critical for SEO.",
        });
      }
      
      // Extract meta description
      const description = $('meta[name="description"]').attr("content") || null;
      if (description) {
        const descLength = description.length;
        let descStatus: MetaTag["status"] = "good";
        let descMessage = "Good length and format";
        
        if (descLength < 120) {
          descStatus = "warning";
          descMessage = "Too short (under 120 characters)";
          recommendations.push({
            type: "warning",
            title: "Meta description is too short",
            description: "Your meta description is under 120 characters. Aim for 120-155 characters.",
          });
        } else if (descLength > 155) {
          descStatus = "warning";
          descMessage = "Too long (over 155 characters)";
          recommendations.push({
            type: "warning",
            title: "Meta description is too long",
            description: "Your meta description exceeds 155 characters. It may be truncated in search results.",
          });
        }
        
        metaTags.push({
          name: "meta[description]",
          content: description,
          status: descStatus,
          statusMessage: descMessage,
        });
      } else {
        metaTags.push({
          name: "meta[description]",
          content: null,
          status: "error",
          statusMessage: "Missing meta description",
        });
        
        recommendations.push({
          type: "error",
          title: "Missing meta description",
          description: "Your page doesn't have a meta description. This is important for CTR in search results.",
        });
      }
      
      // Extract canonical URL
      const canonical = $('link[rel="canonical"]').attr("href") || null;
      if (canonical) {
        metaTags.push({
          name: "link[canonical]",
          content: canonical,
          status: "good",
          statusMessage: "Canonical URL is properly set",
        });
      } else {
        metaTags.push({
          name: "link[canonical]",
          content: null,
          status: "warning",
          statusMessage: "Missing canonical URL",
        });
        
        recommendations.push({
          type: "warning",
          title: "Missing canonical URL",
          description: "Your page doesn't have a canonical URL. This helps prevent duplicate content issues.",
        });
      }
      
      // Extract robots meta tag
      const robots = $('meta[name="robots"]').attr("content") || null;
      if (robots) {
        const isNoindex = robots.includes("noindex");
        metaTags.push({
          name: "meta[robots]",
          content: robots,
          status: isNoindex ? "warning" : "good",
          statusMessage: isNoindex ? "Contains noindex directive" : "Properly set",
        });
        
        if (isNoindex) {
          recommendations.push({
            type: "warning",
            title: "Page is set to noindex",
            description: "Your page is set to not be indexed by search engines. If this is intentional, you can ignore this warning.",
          });
        }
      } else {
        metaTags.push({
          name: "meta[robots]",
          content: null,
          status: "info",
          statusMessage: "Not specified (defaults to index, follow)",
        });
      }
      
      // Extract Open Graph tags
      const ogTitle = $('meta[property="og:title"]').attr("content") || null;
      if (ogTitle) {
        metaTags.push({
          name: "meta[og:title]",
          content: ogTitle,
          status: "good",
          statusMessage: "OG title is set",
        });
      } else {
        metaTags.push({
          name: "meta[og:title]",
          content: null,
          status: "warning",
          statusMessage: "Missing OG title",
        });
        
        recommendations.push({
          type: "warning",
          title: "Missing Open Graph title",
          description: "Add og:title meta tag for better social media sharing.",
        });
      }
      
      const ogDescription = $('meta[property="og:description"]').attr("content") || null;
      if (ogDescription) {
        metaTags.push({
          name: "meta[og:description]",
          content: ogDescription,
          status: "good",
          statusMessage: "OG description is set",
        });
      } else {
        metaTags.push({
          name: "meta[og:description]",
          content: null,
          status: "warning",
          statusMessage: "Missing OG description",
        });
        
        recommendations.push({
          type: "warning",
          title: "Missing Open Graph description",
          description: "Add og:description meta tag for better social media sharing.",
        });
      }
      
      const ogImage = $('meta[property="og:image"]').attr("content") || null;
      if (ogImage) {
        metaTags.push({
          name: "meta[og:image]",
          content: ogImage,
          status: "good",
          statusMessage: "OG image is set",
        });
      } else {
        metaTags.push({
          name: "meta[og:image]",
          content: null,
          status: "error",
          statusMessage: "Missing OG image",
        });
        
        recommendations.push({
          type: "error",
          title: "Missing Open Graph image",
          description: "Add og:image meta tag for better social media sharing. Without an image, your content will be less engaging on social platforms.",
        });
      }
      
      // Extract Twitter Card tags
      const twitterCard = $('meta[name="twitter:card"]').attr("content") || null;
      if (twitterCard) {
        metaTags.push({
          name: "meta[twitter:card]",
          content: twitterCard,
          status: "good",
          statusMessage: "Twitter card is set",
        });
      } else {
        metaTags.push({
          name: "meta[twitter:card]",
          content: null,
          status: "warning",
          statusMessage: "Missing Twitter card",
        });
        
        recommendations.push({
          type: "warning",
          title: "Missing Twitter card",
          description: "Add twitter:card meta tag (recommended: summary_large_image) for better Twitter sharing.",
        });
      }
      
      // Calculate scores
      // More accurate score calculation logic
      const calculateScore = () => {
        let essentialScore = 0;
        let socialScore = 0;
        let structureScore = 0;
        
        // Essential tags scoring (max 10 points)
        // Title tag analysis (up to 3 points)
        if (title) {
          if (title.length >= 30 && title.length <= 60) {
            essentialScore += 3; // Perfect length
          } else if (title.length > 0) {
            essentialScore += 1.5; // Present but not optimal length
          }
        }
        
        // Description analysis (up to 3 points)
        if (description) {
          if (description.length >= 120 && description.length <= 155) {
            essentialScore += 3; // Perfect length
          } else if (description.length > 0) {
            essentialScore += 1.5; // Present but not optimal length
          }
        }
        
        // Canonical URL (up to 2 points)
        if (canonical) {
          if (canonical.startsWith('http')) {
            essentialScore += 2;
          } else {
            essentialScore += 1; // Present but possibly malformed
          }
        }
        
        // Robots tag (up to 2 points)
        if (robots) {
          if (!robots.includes('noindex')) {
            essentialScore += 2;
          } else {
            essentialScore += 0.5; // Present but with noindex
          }
        }
        
        // Social tags scoring (max 10 points)
        // OG Title (up to 2 points)
        if (ogTitle) {
          socialScore += 2;
        } else if (title) {
          socialScore += 0.5; // At least there's a regular title as fallback
        }
        
        // OG Description (up to 2 points)
        if (ogDescription) {
          socialScore += 2;
        } else if (description) {
          socialScore += 0.5; // At least there's a regular description as fallback
        }
        
        // OG Image (up to 3 points)
        if (ogImage) {
          if (ogImage.startsWith('http')) {
            socialScore += 3;
          } else {
            socialScore += 1.5; // Present but possibly malformed
          }
        }
        
        // Twitter Card (up to 3 points)
        if (twitterCard) {
          if (twitterCard === 'summary_large_image') {
            socialScore += 3; // Optimal card type
          } else {
            socialScore += 2; // Present but not optimal type
          }
        }
        
        // Structure scoring (would normally analyze headings, content structure, etc.)
        // For this simplified version, we'll base it partly on tag presence
        structureScore = 6; // Base score
        
        // Add points for having the essential tags (indicates better structure)
        if (title && description) {
          structureScore += 2;
        }
        
        // Performance scoring (simplified)
        // In a real implementation, this would check page size, image optimization, etc.
        const performanceScore = 7;
        
        // Overall score calculation (weighted average)
        const overall = Math.round(
          (essentialScore / 10) * 0.35 + 
          (socialScore / 10) * 0.25 + 
          (structureScore / 10) * 0.2 + 
          (performanceScore / 10) * 0.2
        ) * 100;
        
        return {
          overall,
          essential: essentialScore,
          social: socialScore,
          structure: structureScore,
          performance: performanceScore,
        };
      };
      
      // Create the analysis result
      const analysisResult: AnalysisResult = {
        url,
        title,
        description,
        canonical,
        metaTags,
        score: calculateScore(),
        recommendations,
      };
      
      // Validate the result using the schema
      const validatedResult = analysisResultSchema.parse(analysisResult);
      
      // Return the result
      return res.status(200).json(validatedResult);
    } catch (error) {
      console.error("Error analyzing website:", error);
      
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          message: "Invalid input data",
          errors: error.errors,
        });
      }
      
      return res.status(500).json({
        message: "Failed to analyze website",
        error: (error as Error).message,
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
