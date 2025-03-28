import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, AlertTriangle, CopyIcon } from "lucide-react";
import { type AnalysisResult } from "@shared/schema";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface SearchPreviewProps {
  result: AnalysisResult;
}

export default function SearchPreview({ result }: SearchPreviewProps) {
  const { toast } = useToast();
  
  const handleCopy = (text: string | null) => {
    if (!text) return;
    
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "Copied!",
        description: "Text copied to clipboard",
      });
    }).catch(err => {
      toast({
        title: "Failed to copy",
        description: "Please try again",
        variant: "destructive",
      });
    });
  };

  // Find the title and description meta tags
  const titleTag = result.metaTags.find(tag => tag.name === "title");
  const descriptionTag = result.metaTags.find(tag => tag.name === "meta[description]");
  
  // Get domain name for display
  const getDomainName = (url: string) => {
    try {
      const { hostname } = new URL(url);
      return hostname;
    } catch (e) {
      return url;
    }
  };

  return (
    <section>
      <Card className="shadow-md border border-slate-200 h-full">
        <CardContent className="pt-4 sm:pt-6 px-3 sm:px-6">
          <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 flex items-center">
            <i className="fas fa-search text-primary mr-2"></i>
            Google Search Preview
          </h2>
          
          {/* Google Search Preview */}
          <div className="border border-slate-200 rounded-lg p-3 sm:p-4 bg-white mb-4 shadow-sm">
            <div className="text-blue-800 text-base sm:text-lg font-medium hover:underline cursor-pointer truncate">
              {result.title || "No Title"}
            </div>
            <div className="text-green-700 text-xs sm:text-sm truncate">
              {getDomainName(result.url)}
            </div>
            <div className="text-slate-600 mt-1 text-xs sm:text-sm line-clamp-2">
              {result.description || "No description available."}
            </div>
          </div>
          
          {/* Title Tag Analysis */}
          <div className="mb-4">
            <h3 className="text-sm sm:text-md font-medium mb-2 text-slate-700">Title Tag Analysis</h3>
            <div className="flex items-start">
              <div className="mt-1 mr-2 sm:mr-3 flex-shrink-0">
                {titleTag?.status === "good" ? (
                  <Check className="text-success w-4 h-4 sm:w-5 sm:h-5" />
                ) : (
                  <AlertTriangle className="text-warning w-4 h-4 sm:w-5 sm:h-5" />
                )}
              </div>
              <div className="flex-grow min-w-0">
                <div className="flex items-center mb-1 flex-wrap sm:flex-nowrap gap-1 sm:gap-0">
                  <div className="font-mono text-xs sm:text-sm bg-slate-100 px-2 py-1 rounded mr-0 sm:mr-2 w-full sm:w-auto overflow-hidden text-ellipsis">
                    {result.title || "No title found"}
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleCopy(result.title)}
                    disabled={!result.title}
                    title="Copy to clipboard"
                    className="flex-shrink-0"
                  >
                    <CopyIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                  </Button>
                </div>
                <p className="text-slate-600 text-xs sm:text-sm">
                  {titleTag?.statusMessage || "No title found"}
                </p>
                
                {/* Title character count information */}
                {result.title && (
                  <div className="mt-2 flex items-center">
                    <div 
                      className={`h-1.5 ${
                        result.title.length <= 30 ? 'bg-red-400' : 
                        result.title.length <= 60 ? 'bg-green-500' : 'bg-yellow-500'
                      } rounded-l`}
                      style={{ width: `${Math.min(100, (result.title.length / 70) * 100)}%` }}
                    ></div>
                    <div className="h-1.5 bg-slate-200 flex-grow rounded-r"></div>
                    <span className="text-xs text-slate-500 ml-2">{result.title.length}/60</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Meta Description Analysis */}
          <div>
            <h3 className="text-sm sm:text-md font-medium mb-2 text-slate-700">Meta Description Analysis</h3>
            <div className="flex items-start">
              <div className="mt-1 mr-2 sm:mr-3 flex-shrink-0">
                {descriptionTag?.status === "good" ? (
                  <Check className="text-success w-4 h-4 sm:w-5 sm:h-5" />
                ) : descriptionTag?.status === "warning" ? (
                  <AlertTriangle className="text-warning w-4 h-4 sm:w-5 sm:h-5" />
                ) : (
                  <AlertTriangle className="text-error w-4 h-4 sm:w-5 sm:h-5" />
                )}
              </div>
              <div className="flex-grow min-w-0">
                <div className="flex items-center mb-1 flex-wrap sm:flex-nowrap gap-1 sm:gap-0">
                  <div className="font-mono text-xs sm:text-sm bg-slate-100 px-2 py-1 rounded mr-0 sm:mr-2 w-full sm:w-auto overflow-hidden text-ellipsis">
                    {result.description || "No description found"}
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleCopy(result.description)}
                    disabled={!result.description}
                    title="Copy to clipboard"
                    className="flex-shrink-0"
                  >
                    <CopyIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                  </Button>
                </div>
                <p className="text-slate-600 text-xs sm:text-sm">
                  {descriptionTag?.statusMessage || "No description found"}
                </p>
                
                {/* Description character count information */}
                {result.description && (
                  <div className="mt-2 flex items-center">
                    <div 
                      className={`h-1.5 ${
                        result.description.length <= 120 ? 'bg-red-400' : 
                        result.description.length <= 155 ? 'bg-green-500' : 'bg-yellow-500'
                      } rounded-l`}
                      style={{ width: `${Math.min(100, (result.description.length / 170) * 100)}%` }}
                    ></div>
                    <div className="h-1.5 bg-slate-200 flex-grow rounded-r"></div>
                    <span className="text-xs text-slate-500 ml-2">{result.description.length}/155</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
