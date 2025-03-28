import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { type AnalysisResult } from "@shared/schema";

interface ScoreOverviewProps {
  result: AnalysisResult;
  onReanalyze: () => void;
}

export default function ScoreOverview({ result, onReanalyze }: ScoreOverviewProps) {
  // Determine color based on score
  const getScoreColor = (score: number) => {
    if (score >= 8) return "text-success";
    if (score >= 6) return "text-warning";
    return "text-error";
  };

  // Calculate SVG circle parameters
  const getCircleParameters = (score: number) => {
    const radius = 16;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (score / 100) * circumference;
    
    // Determine stroke color
    let strokeColor = "#10B981"; // success/green
    if (score < 80 && score >= 60) {
      strokeColor = "#F59E0B"; // warning/yellow
    } else if (score < 60) {
      strokeColor = "#EF4444"; // error/red
    }
    
    return {
      radius,
      circumference,
      offset,
      strokeColor
    };
  };

  const { radius, circumference, offset, strokeColor } = getCircleParameters(result.score.overall);

  return (
    <section className="mb-6 sm:mb-8">
      <Card className="shadow-md border border-slate-200">
        <CardContent className="pt-4 sm:pt-6 px-3 sm:px-6">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-4 sm:mb-6">
            <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-0">SEO Score Overview</h2>
            <div className="flex space-x-2 w-full sm:w-auto">
              <Button
                variant="outline"
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs sm:text-sm flex-1 sm:flex-initial"
                disabled
              >
                <i className="fas fa-download mr-1"></i>
                Export
              </Button>
              <Button
                className="bg-primary hover:bg-blue-600 text-white font-medium text-xs sm:text-sm flex-1 sm:flex-initial"
                onClick={onReanalyze}
              >
                <i className="fas fa-sync-alt mr-1"></i>
                Re-analyze
              </Button>
            </div>
          </div>
          
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="flex flex-col items-center mb-2 lg:mb-0">
              <div className="relative w-24 h-24 sm:w-32 sm:h-32">
                <svg className="w-full h-full" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="16" fill="none" stroke="#e6e6e6" strokeWidth="2"></circle>
                  <circle 
                    cx="18" 
                    cy="18" 
                    r="16" 
                    fill="none" 
                    stroke={strokeColor} 
                    strokeWidth="2.5" 
                    strokeDasharray={`${circumference} ${circumference}`} 
                    strokeDashoffset={offset} 
                    transform="rotate(-90 18 18)"
                  ></circle>
                  <text 
                    x="18" 
                    y="16" 
                    textAnchor="middle" 
                    dominantBaseline="middle" 
                    fontSize="6" 
                    fontWeight="bold" 
                    fill="#64748b"
                  >
                    SCORE
                  </text>
                  <text 
                    x="18" 
                    y="22" 
                    textAnchor="middle" 
                    dominantBaseline="middle" 
                    fontSize="8" 
                    fontWeight="bold" 
                    fill={strokeColor}
                  >
                    {result.score.overall}%
                  </text>
                </svg>
              </div>
              <p className="text-base sm:text-lg font-medium text-slate-700 mt-1 sm:mt-2">Overall Score</p>
              
              {/* Brief score explanation */}
              <div className="text-xs text-slate-500 text-center mt-1 max-w-[200px]">
                {result.score.overall >= 80 ? (
                  "Great work! Your site has strong SEO fundamentals."
                ) : result.score.overall >= 60 ? (
                  "Good start, but improvements needed for optimal SEO."
                ) : (
                  "Significant SEO improvements needed for better visibility."
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 w-full">
              <div className="bg-slate-50 rounded-lg p-3 sm:p-4 text-center">
                <div className={`text-xl sm:text-2xl font-bold ${getScoreColor(result.score.essential)}`}>
                  {result.score.essential.toFixed(1)}/10
                </div>
                <div className="text-xs sm:text-sm text-slate-600">Essential Tags</div>
                <div className="hidden sm:block h-1 w-full bg-slate-200 mt-2 rounded">
                  <div 
                    className={`h-1 rounded ${result.score.essential >= 8 ? 'bg-green-500' : result.score.essential >= 6 ? 'bg-yellow-500' : 'bg-red-500'}`}
                    style={{ width: `${result.score.essential * 10}%` }}
                  ></div>
                </div>
              </div>
              <div className="bg-slate-50 rounded-lg p-3 sm:p-4 text-center">
                <div className={`text-xl sm:text-2xl font-bold ${getScoreColor(result.score.social)}`}>
                  {result.score.social.toFixed(1)}/10
                </div>
                <div className="text-xs sm:text-sm text-slate-600">Social Tags</div>
                <div className="hidden sm:block h-1 w-full bg-slate-200 mt-2 rounded">
                  <div 
                    className={`h-1 rounded ${result.score.social >= 8 ? 'bg-green-500' : result.score.social >= 6 ? 'bg-yellow-500' : 'bg-red-500'}`}
                    style={{ width: `${result.score.social * 10}%` }}
                  ></div>
                </div>
              </div>
              <div className="bg-slate-50 rounded-lg p-3 sm:p-4 text-center">
                <div className={`text-xl sm:text-2xl font-bold ${getScoreColor(result.score.structure)}`}>
                  {result.score.structure.toFixed(1)}/10
                </div>
                <div className="text-xs sm:text-sm text-slate-600">Structure</div>
                <div className="hidden sm:block h-1 w-full bg-slate-200 mt-2 rounded">
                  <div 
                    className={`h-1 rounded ${result.score.structure >= 8 ? 'bg-green-500' : result.score.structure >= 6 ? 'bg-yellow-500' : 'bg-red-500'}`}
                    style={{ width: `${result.score.structure * 10}%` }}
                  ></div>
                </div>
              </div>
              <div className="bg-slate-50 rounded-lg p-3 sm:p-4 text-center">
                <div className={`text-xl sm:text-2xl font-bold ${getScoreColor(result.score.performance)}`}>
                  {result.score.performance.toFixed(1)}/10
                </div>
                <div className="text-xs sm:text-sm text-slate-600">Performance</div>
                <div className="hidden sm:block h-1 w-full bg-slate-200 mt-2 rounded">
                  <div 
                    className={`h-1 rounded ${result.score.performance >= 8 ? 'bg-green-500' : result.score.performance >= 6 ? 'bg-yellow-500' : 'bg-red-500'}`}
                    style={{ width: `${result.score.performance * 10}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
