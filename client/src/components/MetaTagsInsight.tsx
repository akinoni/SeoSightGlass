import { type MetaTag, type AnalysisResult } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Check, 
  AlertTriangle, 
  X, 
  Tag, 
  BarChart3,
  ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tooltip } from "@/components/ui/tooltip";

interface MetaTagsInsightProps {
  metaTags: MetaTag[];
}

// Group tags by type for statistics and visual display
interface TagStats {
  good: number;
  warning: number;
  error: number;
  info: number;
  total: number;
}

export default function MetaTagsInsight({ metaTags }: MetaTagsInsightProps) {
  // Calculate stats per category
  const getTagStats = (): Record<string, TagStats> => {
    const initialStats = {
      good: 0,
      warning: 0,
      error: 0,
      info: 0,
      total: 0
    };
    
    const stats = {
      essential: { ...initialStats },
      social: { ...initialStats },
      other: { ...initialStats },
      all: { ...initialStats }
    };
    
    metaTags.forEach(tag => {
      // Determine category
      let category: 'essential' | 'social' | 'other' = 'other';
      
      if (['title', 'meta[description]', 'link[canonical]', 'meta[robots]'].includes(tag.name)) {
        category = 'essential';
      } else if (tag.name.includes('og:') || tag.name.includes('twitter:')) {
        category = 'social';
      }
      
      // Update stats
      stats[category][tag.status]++;
      stats[category].total++;
      
      // Update all category
      stats.all[tag.status]++;
      stats.all.total++;
    });
    
    return stats;
  };
  
  const tagStats = getTagStats();
  
  // Get appropriate color for status
  const getStatusColor = (status: string): string => {
    switch (status) {
      case "good": return "text-green-500";
      case "warning": return "text-amber-500";
      case "error": return "text-red-500";
      default: return "text-blue-500";
    }
  };
  
  // Get icon for status
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "good": return <Check className="w-4 h-4 text-green-500" />;
      case "warning": return <AlertTriangle className="w-4 h-4 text-amber-500" />;
      case "error": return <X className="w-4 h-4 text-red-500" />;
      default: return null;
    }
  };
  
  // Calculate percentage for status
  const calculatePercentage = (count: number, total: number): number => {
    return total > 0 ? Math.round((count / total) * 100) : 0;
  };
  
  // Function to render status bar
  const renderStatusBar = (stats: TagStats) => {
    return (
      <div className="flex h-2 w-full rounded-full overflow-hidden">
        {stats.good > 0 && (
          <div 
            className="bg-green-500 h-full" 
            style={{ width: `${calculatePercentage(stats.good, stats.total)}%` }}
          ></div>
        )}
        {stats.warning > 0 && (
          <div 
            className="bg-amber-500 h-full" 
            style={{ width: `${calculatePercentage(stats.warning, stats.total)}%` }}
          ></div>
        )}
        {stats.error > 0 && (
          <div 
            className="bg-red-500 h-full" 
            style={{ width: `${calculatePercentage(stats.error, stats.total)}%` }}
          ></div>
        )}
        {stats.info > 0 && (
          <div 
            className="bg-blue-500 h-full" 
            style={{ width: `${calculatePercentage(stats.info, stats.total)}%` }}
          ></div>
        )}
      </div>
    );
  };
  
  // Helper for tag category info
  const categoryInfo = [
    {
      id: "essential",
      name: "Essential Tags",
      description: "Core meta tags that every page should have, like title and description",
      examples: ["title", "meta[description]", "link[canonical]"],
      badgeColor: "bg-primary/10 text-primary"
    },
    {
      id: "social",
      name: "Social Media Tags",
      description: "Tags that control how your page appears when shared on social media",
      examples: ["meta[og:title]", "meta[twitter:card]", "meta[og:image]"],
      badgeColor: "bg-indigo-100 text-indigo-800"
    },
    {
      id: "other",
      name: "Technical Tags",
      description: "Additional tags that provide technical information",
      examples: ["meta[viewport]", "meta[charset]", "meta[language]"],
      badgeColor: "bg-slate-100 text-slate-800"
    }
  ];
  
  // Get the top 3 tags that need attention
  const priorityTags = metaTags
    .filter(tag => tag.status === "error" || tag.status === "warning")
    .sort((a, b) => a.status === "error" ? -1 : 1)
    .slice(0, 3);
  
  return (
    <section className="mt-6 sm:mt-8">
      <Card className="shadow-md border border-slate-200">
        <CardContent className="pt-6 px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
            <h2 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-0 flex items-center">
              <Tag className="text-primary w-5 h-5 mr-2" />
              Meta Tags Insight
            </h2>
            
            <div className="flex items-center">
              <Badge variant="outline" className="text-xs">
                {metaTags.length} Total Tags
              </Badge>
            </div>
          </div>
          
          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-5">
            {categoryInfo.map(category => {
              const stats = tagStats[category.id as keyof typeof tagStats];
              const isAllGood = stats.good === stats.total && stats.total > 0;
              
              return (
                <div 
                  key={category.id} 
                  className="bg-slate-50 rounded-lg p-3 border border-slate-200"
                >
                  <div className="flex items-center justify-between mb-2">
                    <Badge 
                      variant="secondary" 
                      className={`font-medium ${category.badgeColor}`}
                    >
                      {category.name}
                    </Badge>
                    
                    {isAllGood && (
                      <Badge variant="outline" className="bg-green-50 text-green-700 text-xs border-green-200">
                        <Check className="w-3 h-3 mr-1" />
                        All Good
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex justify-between items-center text-xs text-slate-600 mb-1">
                    <span>Tag Status</span>
                    <span>{stats.total} tags</span>
                  </div>
                  
                  {renderStatusBar(stats)}
                  
                  <div className="flex justify-between mt-2 text-xs">
                    <div className="flex space-x-2">
                      <div className="flex items-center">
                        <span className="h-2 w-2 rounded-full bg-green-500 mr-1"></span>
                        <span className="text-slate-700">{stats.good}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="h-2 w-2 rounded-full bg-amber-500 mr-1"></span>
                        <span className="text-slate-700">{stats.warning}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="h-2 w-2 rounded-full bg-red-500 mr-1"></span>
                        <span className="text-slate-700">{stats.error}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Priority Fixes */}
          {priorityTags.length > 0 && (
            <div className="mb-4">
              <h3 className="text-sm font-medium text-slate-700 mb-2 flex items-center">
                <BarChart3 className="w-4 h-4 mr-1 text-amber-500" />
                Priority Fixes
              </h3>
              
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                <ul className="space-y-2">
                  {priorityTags.map((tag, idx) => (
                    <li key={idx} className="flex items-start">
                      {getStatusIcon(tag.status)}
                      <div className="ml-2">
                        <p className="text-sm font-medium text-slate-800">
                          {tag.name}
                          <span className={`ml-1 text-xs ${getStatusColor(tag.status)}`}>
                            ({tag.status})
                          </span>
                        </p>
                        <p className="text-xs text-slate-600">{tag.statusMessage}</p>
                      </div>
                    </li>
                  ))}
                </ul>
                
                <div className="mt-3 flex justify-end">
                  <Button 
                    variant="outline"
                    size="sm"
                    className="text-xs h-8"
                    onClick={() => window.scrollTo({
                      top: document.getElementById('meta-tags-table')?.offsetTop,
                      behavior: 'smooth'
                    })}
                  >
                    <ExternalLink className="w-3 h-3 mr-1" />
                    View All Tags
                  </Button>
                </div>
              </div>
            </div>
          )}
          
          {/* Legend and explanation */}
          <div className="text-xs text-slate-500 mt-3 pt-3 border-t border-slate-200">
            <p className="mb-2">
              <span className="font-medium">Tag Categories:</span> Tags are grouped by their purpose in SEO and analyzed accordingly.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {categoryInfo.map(info => (
                <div key={info.id} className="flex flex-col">
                  <span className="font-medium text-slate-700">{info.name}:</span>
                  <span className="text-slate-600 text-2xs">Examples: {info.examples.join(", ")}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}