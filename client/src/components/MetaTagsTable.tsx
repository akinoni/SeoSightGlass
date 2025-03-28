import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, AlertTriangle, X, CopyIcon, WandIcon, FilterIcon, SearchIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { type MetaTag } from "@shared/schema";
import { Input } from "@/components/ui/input";

interface MetaTagsTableProps {
  metaTags: MetaTag[];
}

export default function MetaTagsTable({ metaTags }: MetaTagsTableProps) {
  const { toast } = useToast();
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  
  const handleCopy = (content: string | null) => {
    if (!content) return;
    
    navigator.clipboard.writeText(content).then(() => {
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
  
  // Define meta tag categories
  const metaCategories = [
    { id: "all", label: "All Tags" },
    { id: "essential", label: "Essential" },
    { id: "social", label: "Social Media" },
    { id: "technical", label: "Technical" },
    { id: "status", label: "By Status" },
  ];
  
  // Filter functions
  const getCategoryForTag = (tagName: string) => {
    if (tagName === "title" || tagName === "meta[description]" || tagName === "link[canonical]" || tagName === "meta[robots]") {
      return "essential";
    } else if (tagName.includes("og:") || tagName.includes("twitter:")) {
      return "social";
    } else {
      return "technical";
    }
  };
  
  // Filter meta tags based on active filter and search query
  const filteredMetaTags = metaTags.filter(tag => {
    const matchesSearch = searchQuery === "" || 
      tag.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (tag.content?.toLowerCase() || "").includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;
    
    switch (activeFilter) {
      case "all":
        return true;
      case "essential":
        return getCategoryForTag(tag.name) === "essential";
      case "social":
        return getCategoryForTag(tag.name) === "social";
      case "technical":
        return getCategoryForTag(tag.name) === "technical";
      case "status":
        return true; // Handled separately in rendering
      default:
        return true;
    }
  });
  
  // Sort by status if status filter is active
  const sortedMetaTags = activeFilter === "status" 
    ? [...filteredMetaTags].sort((a, b) => {
        const statusOrder = { error: 0, warning: 1, good: 2, info: 3 };
        return (statusOrder[a.status as keyof typeof statusOrder] || 0) - (statusOrder[b.status as keyof typeof statusOrder] || 0);
      })
    : filteredMetaTags;
  
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "good":
        return (
          <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs sm:text-sm font-medium text-green-800">
            <Check className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
            Good
          </span>
        );
      case "warning":
        return (
          <span className="inline-flex items-center rounded-full bg-yellow-100 px-2 py-0.5 text-xs sm:text-sm font-medium text-yellow-800">
            <AlertTriangle className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
            Warning
          </span>
        );
      case "error":
        return (
          <span className="inline-flex items-center rounded-full bg-red-100 px-2 py-0.5 text-xs sm:text-sm font-medium text-red-800">
            <X className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
            Missing
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-xs sm:text-sm font-medium text-blue-800">
            <i className="fas fa-info-circle mr-1"></i>
            Info
          </span>
        );
    }
  };

  return (
    <section className="mt-6 sm:mt-8">
      <Card className="shadow-md border border-slate-200">
        <CardContent className="pt-4 sm:pt-6 px-3 sm:px-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
            <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-0 flex items-center">
              <i className="fas fa-tags text-primary mr-2"></i>
              Meta Tags Analysis
            </h2>
            
            <div className="w-full sm:w-auto flex items-center relative">
              <SearchIcon className="absolute left-2 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Search meta tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 py-1 h-8 text-xs w-full sm:w-44 md:w-56"
              />
            </div>
          </div>
          
          {/* Filter tabs */}
          <div className="mb-4 border-b border-slate-200">
            <div className="flex space-x-1 overflow-x-auto pb-2 scrollbar-hide">
              {metaCategories.map(category => (
                <button 
                  key={category.id}
                  onClick={() => setActiveFilter(category.id)} 
                  className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-t-lg ${
                    activeFilter === category.id
                      ? 'bg-primary text-white border-primary'
                      : 'text-slate-600 hover:bg-slate-100 border-transparent'
                  } border-t border-l border-r transition-colors flex items-center`}
                >
                  {category.id === "status" && <FilterIcon className="w-3 h-3 mr-1" />}
                  {category.label}
                </button>
              ))}
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th scope="col" className="py-2 sm:py-3 px-2 sm:px-4 text-left text-xs sm:text-sm font-semibold text-slate-700">Tag</th>
                  <th scope="col" className="py-2 sm:py-3 px-2 sm:px-4 text-left text-xs sm:text-sm font-semibold text-slate-700">Content</th>
                  <th scope="col" className="py-2 sm:py-3 px-2 sm:px-4 text-left text-xs sm:text-sm font-semibold text-slate-700">Status</th>
                  <th scope="col" className="py-2 sm:py-3 px-2 sm:px-4 text-left text-xs sm:text-sm font-semibold text-slate-700">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {sortedMetaTags.length > 0 ? (
                  sortedMetaTags.map((tag, index) => (
                    <tr key={index} className="hover:bg-slate-50">
                      <td className="py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium text-slate-900">
                        <span className="font-mono">{tag.name}</span>
                      </td>
                      <td className="py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm text-slate-700">
                        <div className="max-w-[250px] sm:max-w-lg overflow-hidden overflow-ellipsis font-mono bg-slate-50 p-1.5 sm:p-2 rounded text-xs sm:text-sm">
                          {tag.content || (
                            <span className="text-slate-400">Not present</span>
                          )}
                        </div>
                      </td>
                      <td className="py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm text-slate-700">
                        {renderStatusBadge(tag.status)}
                      </td>
                      <td className="py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm text-slate-700">
                        {tag.content ? (
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleCopy(tag.content)}
                            className="text-primary hover:text-blue-700 font-medium h-8 px-2"
                          >
                            <CopyIcon className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                            <span className="hidden sm:inline">Copy</span>
                          </Button>
                        ) : (
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="text-primary hover:text-blue-700 font-medium h-8 px-2"
                            disabled
                          >
                            <WandIcon className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                            <span className="hidden sm:inline">Generate</span>
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="py-4 px-4 text-center text-sm text-slate-500">
                      {searchQuery ? "No meta tags match your search criteria." : "No meta tags found."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* Stats at the bottom */}
          <div className="mt-4 text-xs text-slate-500 flex justify-between items-center flex-wrap gap-2">
            <div>
              Showing {sortedMetaTags.length} of {metaTags.length} meta tags
              {searchQuery && ` (filtered by "${searchQuery}")`}
            </div>
            <div className="flex space-x-4">
              <span className="inline-flex items-center">
                <span className="h-2 w-2 rounded-full bg-green-500 mr-1"></span>
                Good: {metaTags.filter(tag => tag.status === "good").length}
              </span>
              <span className="inline-flex items-center">
                <span className="h-2 w-2 rounded-full bg-yellow-500 mr-1"></span>
                Warning: {metaTags.filter(tag => tag.status === "warning").length}
              </span>
              <span className="inline-flex items-center">
                <span className="h-2 w-2 rounded-full bg-red-500 mr-1"></span>
                Missing: {metaTags.filter(tag => tag.status === "error").length}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
