import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { type AnalysisResult } from "@shared/schema";
import { AlertTriangle, CheckCircle, Info, XCircle, Plus, Minus, Lightbulb, Copy as CopyIcon, Code } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface RecommendationsProps {
  recommendations: AnalysisResult["recommendations"];
}

// Additional best practice recommendations to display even if all tags are good
const bestPracticeRecommendations = [
  {
    id: "bp-1",
    type: "info",
    title: "Keep your title tags unique across pages",
    description: "Every page on your site should have a unique title that accurately describes its content. Avoid duplicate titles across different pages.",
    expanded: false,
    code: "<title>Your Page's Unique Title | Brand Name</title>"
  },
  {
    id: "bp-2",
    type: "info",
    title: "Use structured data markup",
    description: "Implement JSON-LD structured data markup to enhance search engine understanding of your content and enable rich snippets in search results.",
    expanded: false,
    code: '<script type="application/ld+json">\n{\n  "@context": "https://schema.org",\n  "@type": "WebPage",\n  "name": "Page Title",\n  "description": "Page description"\n}\n</script>'
  },
  {
    id: "bp-3",
    type: "info",
    title: "Optimize image alt attributes",
    description: "Ensure all images have descriptive alt attributes that explain the image content. This helps with accessibility and image search optimization.",
    expanded: false,
    code: '<img src="image.jpg" alt="Descriptive text about the image">'
  },
  {
    id: "bp-4",
    type: "info", 
    title: "Add meta viewport tag for mobile responsiveness",
    description: "Include the viewport meta tag to ensure your site displays properly on mobile devices, which affects SEO rankings.",
    expanded: false,
    code: '<meta name="viewport" content="width=device-width, initial-scale=1">'
  },
  {
    id: "bp-5",
    type: "info",
    title: "Implement hreflang tags for multilingual sites",
    description: "If your site targets users in different languages or regions, use hreflang tags to help search engines direct users to the correct version.",
    expanded: false,
    code: '<link rel="alternate" hreflang="en" href="https://example.com/en/" />\n<link rel="alternate" hreflang="es" href="https://example.com/es/" />'
  }
];

export default function Recommendations({ recommendations }: RecommendationsProps) {
  const [expandedRecs, setExpandedRecs] = useState<Record<string, boolean>>({});
  const [showBestPractices, setShowBestPractices] = useState<boolean>(true);
  const [bestPractices, setBestPractices] = useState(bestPracticeRecommendations);
  const { toast } = useToast();
  
  // Handle toggling expanded state for a recommendation
  const toggleExpanded = (id: string) => {
    setExpandedRecs(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };
  
  // Toggle best practice recommendation expanded state
  const toggleBestPracticeExpanded = (id: string) => {
    setBestPractices(prev => 
      prev.map(rec => 
        rec.id === id ? { ...rec, expanded: !rec.expanded } : rec
      )
    );
  };
  
  // Handle copying code to clipboard
  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code).then(() => {
      toast({
        title: "Copied!",
        description: "Code copied to clipboard",
      });
    }).catch(() => {
      toast({
        title: "Failed to copy",
        description: "Please try again",
        variant: "destructive",
      });
    });
  };
  
  // Get icon based on recommendation type
  const getRecommendationIcon = (type: string) => {
    switch (type) {
      case "error":
        return <XCircle className="text-red-500 w-5 h-5" />;
      case "warning":
        return <AlertTriangle className="text-amber-500 w-5 h-5" />;
      case "success":
        return <CheckCircle className="text-green-500 w-5 h-5" />;
      default:
        return <Info className="text-blue-500 w-5 h-5" />;
    }
  };
  
  // Prepare implementation examples for common recommendations
  const getImplementationExample = (title: string): string => {
    if (title.toLowerCase().includes('title')) {
      return '<title>Descriptive Page Title | Brand Name</title>';
    } else if (title.toLowerCase().includes('description')) {
      return '<meta name="description" content="A compelling description between 120-155 characters that accurately summarizes your page content.">';
    } else if (title.toLowerCase().includes('canonical')) {
      return '<link rel="canonical" href="https://example.com/your-canonical-url/" />';
    } else if (title.toLowerCase().includes('robots')) {
      return '<meta name="robots" content="index, follow">';
    } else if (title.toLowerCase().includes('og:title') || title.toLowerCase().includes('open graph title')) {
      return '<meta property="og:title" content="Your Page Title for Social Sharing" />';
    } else if (title.toLowerCase().includes('og:description') || title.toLowerCase().includes('open graph description')) {
      return '<meta property="og:description" content="A compelling description for social media sharing, ideally under 155 characters." />';
    } else if (title.toLowerCase().includes('og:image') || title.toLowerCase().includes('open graph image')) {
      return '<meta property="og:image" content="https://example.com/image.jpg" />\n<meta property="og:image:width" content="1200" />\n<meta property="og:image:height" content="630" />';
    } else if (title.toLowerCase().includes('twitter:card') || title.toLowerCase().includes('twitter card')) {
      return '<meta name="twitter:card" content="summary_large_image" />';
    }
    return '<!-- Add implementation example for this recommendation -->';
  };

  // Combined recommendations (user recommendations + best practices)
  const allRecommendations = [
    ...recommendations.map((rec, idx) => ({
      ...rec,
      id: `rec-${idx}`,
      expanded: expandedRecs[`rec-${idx}`] || false,
      code: getImplementationExample(rec.title)
    })),
    ...(showBestPractices && recommendations.length > 0 ? bestPractices : [])
  ];

  return (
    <section className="mt-6 sm:mt-8 mb-8">
      <Card className="shadow-md border border-slate-200">
        <CardContent className="pt-4 sm:pt-6 px-3 sm:px-6">
          <div className="flex justify-between items-center mb-3 sm:mb-4">
            <h2 className="text-lg sm:text-xl font-semibold flex items-center">
              <Lightbulb className="text-primary w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              SEO Recommendations
            </h2>
            
            {recommendations.length > 0 && (
              <Button 
                variant="outline"
                size="sm"
                className="text-xs h-8 px-2"
                onClick={() => setShowBestPractices(!showBestPractices)}
              >
                {showBestPractices ? (
                  <><Minus className="w-3 h-3 mr-1" /> Hide Best Practices</>
                ) : (
                  <><Plus className="w-3 h-3 mr-1" /> Show Best Practices</>
                )}
              </Button>
            )}
          </div>
          
          {allRecommendations.length === 0 ? (
            <div className="bg-green-50 rounded-lg p-4 border-l-4 border-green-500">
              <div className="flex">
                <CheckCircle className="text-green-500 w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-medium text-slate-800 mb-1">Great job!</h3>
                  <p className="text-slate-600 text-sm mb-2">
                    Your website's SEO meta tags are well-optimized. Below are some best practices to consider.
                  </p>
                </div>
              </div>
              
              <div className="mt-3 space-y-3">
                {bestPractices.map(practice => (
                  <div key={practice.id} className="bg-white rounded-lg p-3 shadow-sm border border-slate-100">
                    <div className="flex justify-between items-start">
                      <div className="flex gap-2">
                        <Info className="text-blue-500 w-4 h-4 flex-shrink-0 mt-0.5" />
                        <div>
                          <h4 className="text-sm font-medium text-slate-800">{practice.title}</h4>
                          <p className="text-xs text-slate-600 mt-0.5">{practice.description}</p>
                        </div>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-6 w-6 p-0" 
                        onClick={() => toggleBestPracticeExpanded(practice.id)}
                      >
                        {practice.expanded ? <Minus className="h-3 w-3" /> : <Plus className="h-3 w-3" />}
                      </Button>
                    </div>
                    
                    {practice.expanded && (
                      <div className="mt-2 relative">
                        <div className="bg-slate-50 p-2 rounded-md font-mono text-xs overflow-x-auto">
                          <pre className="text-slate-800 whitespace-pre-wrap break-all">{practice.code}</pre>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="absolute top-1 right-1 h-6 w-6 p-0" 
                          onClick={() => handleCopyCode(practice.code)}
                        >
                          <CopyIcon className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              {allRecommendations.map((recommendation) => {
                const isExpandable = recommendation.code !== undefined;
                const isExpanded = recommendation.expanded;
                
                return (
                  <div 
                    key={recommendation.id}
                    className={`rounded-lg p-3 sm:p-4 border-l-4 ${
                      recommendation.type === "error" 
                        ? "border-red-500 bg-red-50" 
                        : recommendation.type === "warning" 
                          ? "border-amber-500 bg-amber-50" 
                          : "border-blue-500 bg-blue-50"
                    }`}
                  >
                    <div className="flex justify-between">
                      <div className="flex gap-2 sm:gap-3">
                        <div className="flex-shrink-0 mt-0.5">
                          {getRecommendationIcon(recommendation.type)}
                        </div>
                        <div>
                          <h3 className="font-medium text-slate-800 text-sm sm:text-base mb-0.5 sm:mb-1">{recommendation.title}</h3>
                          <p className="text-slate-600 text-xs sm:text-sm">{recommendation.description}</p>
                          
                          {isExpandable && isExpanded && (
                            <div className="mt-3 relative">
                              <div className="bg-white p-2 rounded-md font-mono text-xs overflow-x-auto">
                                <div className="flex items-center text-slate-500 mb-1 text-xs">
                                  <Code className="w-3 h-3 mr-1" />
                                  Implementation Example
                                </div>
                                <pre className="text-slate-800 whitespace-pre-wrap break-all">{recommendation.code}</pre>
                              </div>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="absolute top-1 right-1 h-6 w-6 p-0" 
                                onClick={() => handleCopyCode(recommendation.code)}
                                title="Copy to clipboard"
                              >
                                <CopyIcon className="h-3 w-3" />
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                      {isExpandable && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className={`h-6 w-6 p-0 flex-shrink-0 ${
                            recommendation.type === "error" 
                              ? "hover:bg-red-100" 
                              : recommendation.type === "warning" 
                                ? "hover:bg-amber-100" 
                                : "hover:bg-blue-100"
                          }`}
                          onClick={() => {
                            if ('id' in recommendation) {
                              if (recommendation.id.startsWith('rec-')) {
                                toggleExpanded(recommendation.id);
                              } else {
                                toggleBestPracticeExpanded(recommendation.id);
                              }
                            }
                          }}
                        >
                          {isExpanded ? <Minus className="h-3 w-3" /> : <Plus className="h-3 w-3" />}
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
