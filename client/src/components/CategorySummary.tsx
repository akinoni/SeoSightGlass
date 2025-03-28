import { type AnalysisResult } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
// Custom progress bar component with color customization
const CustomProgress = ({ value, color }: { value: number; color: string }) => (
  <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
    <div 
      className={`h-full ${color}`} 
      style={{ width: `${value}%` }}
    ></div>
  </div>
);
import { 
  AlertTriangle, 
  CheckCircle, 
  Code, 
  Share2, 
  Layout, 
  Gauge, 
  ArrowUp
} from "lucide-react";

interface CategorySummaryProps {
  result: AnalysisResult;
}

// Summary descriptions for each category
const CATEGORY_DESCRIPTIONS = {
  essential: {
    good: "Essential tags are well-optimized. Your title, description, and canonical tags meet best practices.",
    average: "Your essential tags need some improvement. Check the recommendations for details.",
    poor: "Several essential tags are missing or poorly optimized. These are critical for SEO success."
  },
  social: {
    good: "Social sharing tags are properly set up, ensuring good visibility on social platforms.",
    average: "Your social tags need some improvement to maximize engagement on social platforms.",
    poor: "Social sharing tags are missing or incomplete, reducing visibility on social media."
  },
  structure: {
    good: "Your page structure is well-optimized for search engines and users.",
    average: "Page structure has some issues that could be improved for better SEO.",
    poor: "Page structure needs significant improvement for better search engine visibility."
  },
  performance: {
    good: "Performance metrics look good, which positively impacts your SEO.",
    average: "Some performance improvements could help boost your SEO rankings.",
    poor: "Poor performance metrics may be hurting your SEO rankings."
  }
};

export default function CategorySummary({ result }: CategorySummaryProps) {
  // Determine category status based on score
  const getCategoryStatus = (score: number) => {
    if (score >= 8) return "good";
    if (score >= 6) return "average";
    return "poor";
  };

  // Get category description based on score
  const getCategoryDescription = (category: keyof typeof CATEGORY_DESCRIPTIONS, score: number) => {
    const status = getCategoryStatus(score);
    return CATEGORY_DESCRIPTIONS[category][status as keyof typeof CATEGORY_DESCRIPTIONS[typeof category]];
  };

  // Get icon and color based on category
  const getCategoryIcon = (category: string, score: number) => {
    const status = getCategoryStatus(score);
    const iconColor = status === "good" ? "text-green-500" : status === "average" ? "text-amber-500" : "text-red-500";
    
    switch (category) {
      case "essential":
        return <Code className={`w-6 h-6 ${iconColor}`} />;
      case "social":
        return <Share2 className={`w-6 h-6 ${iconColor}`} />;
      case "structure":
        return <Layout className={`w-6 h-6 ${iconColor}`} />;
      case "performance":
        return <Gauge className={`w-6 h-6 ${iconColor}`} />;
      default:
        return <CheckCircle className={`w-6 h-6 ${iconColor}`} />;
    }
  };

  // Get icon and header based on status
  const getStatusIcon = (score: number) => {
    if (score >= 8) {
      return {
        icon: <CheckCircle className="w-5 h-5 text-green-500" />,
        text: "Good",
        color: "text-green-500"
      };
    } else if (score >= 6) {
      return {
        icon: <AlertTriangle className="w-5 h-5 text-amber-500" />,
        text: "Needs Improvement",
        color: "text-amber-500"
      };
    } else {
      return {
        icon: <AlertTriangle className="w-5 h-5 text-red-500" />,
        text: "Poor",
        color: "text-red-500"
      };
    }
  };

  // Get progress bar color based on score
  const getProgressColor = (score: number) => {
    if (score >= 8) return "bg-green-500";
    if (score >= 6) return "bg-amber-500";
    return "bg-red-500";
  };

  // Convert score to percentage for progress display
  const scoreToPercentage = (score: number) => (score / 10) * 100;

  // Category definitions
  const categories = [
    {
      id: "essential",
      name: "Essential Tags",
      score: result.score.essential,
      description: getCategoryDescription("essential", result.score.essential)
    },
    {
      id: "social",
      name: "Social Media",
      score: result.score.social,
      description: getCategoryDescription("social", result.score.social)
    },
    {
      id: "structure",
      name: "Page Structure",
      score: result.score.structure,
      description: getCategoryDescription("structure", result.score.structure)
    },
    {
      id: "performance",
      name: "Performance",
      score: result.score.performance,
      description: getCategoryDescription("performance", result.score.performance)
    }
  ];

  return (
    <section className="mt-6 sm:mt-8">
      <Card className="shadow-md border border-slate-200">
        <CardContent className="pt-6 px-4 sm:px-6">
          <h2 className="text-lg sm:text-xl font-semibold mb-4 flex items-center">
            <ArrowUp className="text-primary w-5 h-5 mr-2" />
            SEO Category Breakdown
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {categories.map(category => {
              const status = getStatusIcon(category.score);
              
              return (
                <div 
                  key={category.id} 
                  className="bg-slate-50 p-4 rounded-lg border border-slate-200"
                >
                  <div className="flex items-start gap-3">
                    {getCategoryIcon(category.id, category.score)}
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-slate-800">{category.name}</h3>
                        <div className="flex items-center gap-1">
                          {status.icon}
                          <span className={`text-xs ${status.color} font-medium`}>{status.text}</span>
                        </div>
                      </div>
                      
                      <div className="mt-2 mb-3">
                        <div className="flex justify-between items-center mb-1">
                          <div className="text-xs text-slate-500">Score</div>
                          <div className="font-semibold text-sm">{category.score.toFixed(1)}/10</div>
                        </div>
                        <CustomProgress 
                          value={scoreToPercentage(category.score)} 
                          color={getProgressColor(category.score)}
                        />
                      </div>
                      
                      <p className="text-xs text-slate-600 line-clamp-2">{category.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="mt-4 pt-3 border-t border-slate-200 text-xs text-slate-500">
            <div className="flex gap-4 flex-wrap justify-center sm:justify-start">
              <div className="flex items-center">
                <span className="h-2 w-2 rounded-full bg-green-500 mr-1"></span>
                Good (8-10)
              </div>
              <div className="flex items-center">
                <span className="h-2 w-2 rounded-full bg-amber-500 mr-1"></span>
                Needs Improvement (6-7.9)
              </div>
              <div className="flex items-center">
                <span className="h-2 w-2 rounded-full bg-red-500 mr-1"></span>
                Poor (0-5.9)
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}