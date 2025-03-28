import { Card, CardContent } from "@/components/ui/card";
import { Search } from "lucide-react";

export default function InitialState() {
  return (
    <Card className="shadow-md border border-slate-200 text-center">
      <CardContent className="pt-8 pb-8 flex flex-col items-center">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
          <Search className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-2xl font-semibold text-slate-800 mb-2">Enter a URL to begin analysis</h2>
        <p className="text-slate-600 max-w-md mx-auto">
          Enter any website URL above to analyze its SEO meta tags and receive recommendations for improvement.
        </p>
      </CardContent>
    </Card>
  );
}
