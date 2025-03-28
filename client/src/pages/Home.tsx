import { useState } from "react";
import URLInput from "@/components/URLInput";
import InitialState from "@/components/InitialState";
import LoadingState from "@/components/LoadingState";
import ScoreOverview from "@/components/ScoreOverview";
import SearchPreview from "@/components/SearchPreview";
import SocialPreview from "@/components/SocialPreview";
import MetaTagsTable from "@/components/MetaTagsTable";
import Recommendations from "@/components/Recommendations";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { type AnalysisResult } from "@shared/schema";

export default function Home() {
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const { toast } = useToast();

  const analyzeMutation = useMutation({
    mutationFn: async (url: string) => {
      const response = await apiRequest("POST", "/api/analyze", { url });
      return response.json() as Promise<AnalysisResult>;
    },
    onSuccess: (data) => {
      setAnalysisResult(data);
    },
    onError: (error) => {
      toast({
        title: "Error analyzing website",
        description: error.message || "Please try again with a valid URL",
        variant: "destructive",
      });
    },
  });

  const handleAnalyze = (url: string) => {
    setAnalysisResult(null);
    analyzeMutation.mutate(url);
  };

  const handleReanalyze = () => {
    if (analysisResult) {
      analyzeMutation.mutate(analysisResult.url);
    }
  };

  return (
    <div className="bg-slate-50 text-slate-800 font-sans min-h-screen">
      <div className="max-w-7xl mx-auto p-4 md:p-6">
        {/* Header */}
        <header className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h1 className="text-3xl font-bold text-slate-800 flex items-center">
                <i className="fas fa-search text-primary mr-3"></i>
                <span>Meta Tag Inspector</span>
              </h1>
              <p className="text-slate-600 mt-1">Analyze and optimize your website's SEO meta tags</p>
            </div>
            
            <div className="flex items-center">
              <a href="https://github.com/yourusername/meta-tag-inspector" target="_blank" rel="noopener noreferrer" className="bg-primary text-white rounded-lg px-4 py-2 shadow-sm hover:bg-blue-600 transition-colors">
                <i className="fas fa-book mr-1"></i>
                Documentation
              </a>
            </div>
          </div>
        </header>

        {/* URL Input */}
        <URLInput onAnalyze={handleAnalyze} isPending={analyzeMutation.isPending} />

        {/* Show appropriate state based on loading status */}
        {!analysisResult && !analyzeMutation.isPending && <InitialState />}
        {analyzeMutation.isPending && <LoadingState />}

        {/* Results Container */}
        {analysisResult && !analyzeMutation.isPending && (
          <div>
            {/* Score Overview */}
            <ScoreOverview result={analysisResult} onReanalyze={handleReanalyze} />

            {/* Search Preview and Social Preview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <SearchPreview result={analysisResult} />
              <SocialPreview result={analysisResult} />
            </div>

            {/* Meta Tags Analysis */}
            <MetaTagsTable metaTags={analysisResult.metaTags} />

            {/* Recommendations */}
            <Recommendations recommendations={analysisResult.recommendations} />

            {/* Footer */}
            <footer className="text-center py-6 text-slate-500 text-sm">
              <p>Meta Tag Inspector &copy; {new Date().getFullYear()} - An SEO Analysis Tool</p>
            </footer>
          </div>
        )}
      </div>
    </div>
  );
}
