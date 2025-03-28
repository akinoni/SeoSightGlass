import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, AlertTriangle } from "lucide-react";
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

  return (
    <section>
      <Card className="shadow-md border border-slate-200 h-full">
        <CardContent className="pt-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <i className="fas fa-search text-primary mr-2"></i>
            Google Search Preview
          </h2>
          
          <div className="border border-slate-200 rounded-lg p-4 bg-white mb-4">
            <div className="text-blue-800 text-lg font-medium hover:underline cursor-pointer truncate">
              {result.title || "No Title"}
            </div>
            <div className="text-green-700 text-sm truncate">
              {result.url}
            </div>
            <div className="text-slate-600 mt-1 text-sm line-clamp-2">
              {result.description || "No description available."}
            </div>
          </div>
          
          <div className="mb-4">
            <h3 className="text-md font-medium mb-2 text-slate-700">Title Tag Analysis</h3>
            <div className="flex items-start">
              <div className="mt-1 mr-3">
                {titleTag?.status === "good" ? (
                  <Check className="text-success" />
                ) : (
                  <AlertTriangle className="text-warning" />
                )}
              </div>
              <div>
                <div className="flex items-center mb-1">
                  <div className="font-mono text-sm bg-slate-100 px-2 py-1 rounded mr-2 truncate max-w-[250px]">
                    {result.title || "No title found"}
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleCopy(result.title)}
                    disabled={!result.title}
                    title="Copy to clipboard"
                  >
                    <i className="far fa-copy"></i>
                  </Button>
                </div>
                <p className="text-slate-600 text-sm">{titleTag?.statusMessage || "No title found"}</p>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-md font-medium mb-2 text-slate-700">Meta Description Analysis</h3>
            <div className="flex items-start">
              <div className="mt-1 mr-3">
                {descriptionTag?.status === "good" ? (
                  <Check className="text-success" />
                ) : descriptionTag?.status === "warning" ? (
                  <AlertTriangle className="text-warning" />
                ) : (
                  <AlertTriangle className="text-error" />
                )}
              </div>
              <div>
                <div className="flex items-center mb-1">
                  <div className="font-mono text-sm bg-slate-100 px-2 py-1 rounded mr-2 truncate max-w-[250px]">
                    {result.description || "No description found"}
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleCopy(result.description)}
                    disabled={!result.description}
                    title="Copy to clipboard"
                  >
                    <i className="far fa-copy"></i>
                  </Button>
                </div>
                <p className="text-slate-600 text-sm">{descriptionTag?.statusMessage || "No description found"}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
