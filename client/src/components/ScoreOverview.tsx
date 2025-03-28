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
    <section className="mb-8">
      <Card className="shadow-md border border-slate-200">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold mb-2 md:mb-0">SEO Score Overview</h2>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium"
                disabled
              >
                <i className="fas fa-download mr-1"></i>
                Export
              </Button>
              <Button
                className="bg-primary hover:bg-blue-600 text-white font-medium"
                onClick={onReanalyze}
              >
                <i className="fas fa-sync-alt mr-1"></i>
                Re-analyze
              </Button>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex flex-col items-center mb-6 md:mb-0">
              <div className="relative w-32 h-32">
                <svg className="w-full h-full" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="16" fill="none" stroke="#e6e6e6" strokeWidth="2"></circle>
                  <circle 
                    cx="18" 
                    cy="18" 
                    r="16" 
                    fill="none" 
                    stroke={strokeColor} 
                    strokeWidth="2" 
                    strokeDasharray={`${circumference} ${circumference}`} 
                    strokeDashoffset={offset} 
                    transform="rotate(-90 18 18)"
                  ></circle>
                  <text 
                    x="18" 
                    y="18" 
                    textAnchor="middle" 
                    dominantBaseline="middle" 
                    fontSize="10" 
                    fontWeight="bold" 
                    fill={strokeColor}
                  >
                    {result.score.overall}%
                  </text>
                </svg>
              </div>
              <p className="text-lg font-medium text-slate-700 mt-2">Overall Score</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full md:w-auto">
              <div className="bg-slate-50 rounded-lg p-4 text-center">
                <div className={`text-2xl font-bold ${getScoreColor(result.score.essential)}`}>
                  {result.score.essential}/10
                </div>
                <div className="text-sm text-slate-600">Essential Tags</div>
              </div>
              <div className="bg-slate-50 rounded-lg p-4 text-center">
                <div className={`text-2xl font-bold ${getScoreColor(result.score.social)}`}>
                  {result.score.social}/10
                </div>
                <div className="text-sm text-slate-600">Social Tags</div>
              </div>
              <div className="bg-slate-50 rounded-lg p-4 text-center">
                <div className={`text-2xl font-bold ${getScoreColor(result.score.structure)}`}>
                  {result.score.structure}/10
                </div>
                <div className="text-sm text-slate-600">Structure</div>
              </div>
              <div className="bg-slate-50 rounded-lg p-4 text-center">
                <div className={`text-2xl font-bold ${getScoreColor(result.score.performance)}`}>
                  {result.score.performance}/10
                </div>
                <div className="text-sm text-slate-600">Performance</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
