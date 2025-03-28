import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { type AnalysisResult } from "@shared/schema";

interface RecommendationsProps {
  recommendations: AnalysisResult["recommendations"];
}

export default function Recommendations({ recommendations }: RecommendationsProps) {
  if (recommendations.length === 0) {
    return (
      <section className="mt-8 mb-8">
        <Card className="shadow-md border border-slate-200">
          <CardContent className="pt-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <i className="fas fa-lightbulb text-primary mr-2"></i>
              Recommendations
            </h2>
            
            <div className="bg-green-50 rounded-lg p-4 border-l-4 border-green-500">
              <h3 className="font-medium text-slate-800 mb-1">Great job!</h3>
              <p className="text-slate-600 text-sm mb-2">
                Your website's SEO meta tags are well-optimized. We don't have any recommendations for improvements at this time.
              </p>
            </div>
          </CardContent>
        </Card>
      </section>
    );
  }

  // Map recommendation types to border colors
  const getBorderColor = (type: string) => {
    switch (type) {
      case "warning":
        return "border-warning";
      case "error":
        return "border-error";
      default:
        return "border-info";
    }
  };

  return (
    <section className="mt-8 mb-8">
      <Card className="shadow-md border border-slate-200">
        <CardContent className="pt-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <i className="fas fa-lightbulb text-primary mr-2"></i>
            Recommendations
          </h2>
          
          <div className="space-y-4">
            {recommendations.map((recommendation, index) => (
              <div key={index} className={`bg-slate-50 rounded-lg p-4 border-l-4 ${getBorderColor(recommendation.type)}`}>
                <h3 className="font-medium text-slate-800 mb-1">{recommendation.title}</h3>
                <p className="text-slate-600 text-sm mb-2">{recommendation.description}</p>
                <div className="mt-2">
                  <Button 
                    variant="ghost"
                    className="text-primary hover:text-blue-700 text-sm font-medium px-0"
                  >
                    <i className="fas fa-magic mr-1"></i>
                    Generate recommendation
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
