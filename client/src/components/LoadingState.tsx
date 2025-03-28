import { Card, CardContent } from "@/components/ui/card";

export default function LoadingState() {
  return (
    <Card className="shadow-md border border-slate-200 text-center">
      <CardContent className="pt-8 pb-8 flex flex-col items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-6"></div>
        <h2 className="text-2xl font-semibold text-slate-800 mb-2">Analyzing website...</h2>
        <p className="text-slate-600 max-w-md mx-auto">
          Fetching and processing meta tags from the specified URL.
        </p>
      </CardContent>
    </Card>
  );
}
