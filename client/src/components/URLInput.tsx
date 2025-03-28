import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { isValidUrl } from "@/lib/utils/validators";

interface URLInputProps {
  onAnalyze: (url: string) => void;
  isPending: boolean;
}

export default function URLInput({ onAnalyze, isPending }: URLInputProps) {
  const [url, setUrl] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url.trim()) {
      setError("Please enter a URL");
      return;
    }

    // Add protocol if missing
    let formattedUrl = url.trim();
    if (!formattedUrl.startsWith("http://") && !formattedUrl.startsWith("https://")) {
      formattedUrl = "https://" + formattedUrl;
    }

    if (!isValidUrl(formattedUrl)) {
      setError("Please enter a valid URL");
      return;
    }

    setError(null);
    onAnalyze(formattedUrl);
  };

  const handleExampleClick = (exampleUrl: string) => {
    setUrl(exampleUrl);
    setError(null);
  };

  return (
    <section className="mb-6 sm:mb-8">
      <Card className="shadow-md border border-slate-200">
        <CardContent className="pt-4 sm:pt-6 px-3 sm:px-6">
          <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-2 sm:gap-3">
            <div className="flex-grow">
              <label htmlFor="url-input" className="block text-sm font-medium text-slate-700 mb-1">
                Website URL
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <i className="fas fa-globe text-slate-400"></i>
                </div>
                <Input
                  type="text"
                  id="url-input"
                  className={`pl-10 py-5 sm:py-6 ${error ? 'border-red-500' : ''} text-sm sm:text-base`}
                  placeholder="https://example.com"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  disabled={isPending}
                />
              </div>
              {error && (
                <p className="mt-1 text-xs sm:text-sm text-red-500">{error}</p>
              )}
            </div>
            <div className="flex items-end">
              <Button 
                type="submit" 
                className="bg-primary hover:bg-blue-600 text-white font-medium py-5 sm:py-6 w-full md:w-auto text-sm sm:text-base"
                disabled={isPending}
              >
                <i className="fas fa-search mr-2"></i>
                Analyze
              </Button>
            </div>
          </form>
          
          {/* Examples section */}
          <div className="mt-3 sm:mt-4">
            <p className="text-xs text-slate-500">Try these examples:</p>
            <div className="flex flex-wrap gap-2 mt-1 sm:mt-2">
              <button 
                className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-1 rounded transition-colors" 
                onClick={() => handleExampleClick("https://example.com")}
                disabled={isPending}
                type="button"
              >
                example.com
              </button>
              <button 
                className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-1 rounded transition-colors" 
                onClick={() => handleExampleClick("https://twitter.com")}
                disabled={isPending}
                type="button"
              >
                twitter.com
              </button>
              <button 
                className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-1 rounded transition-colors" 
                onClick={() => handleExampleClick("https://github.com")}
                disabled={isPending}
                type="button"
              >
                github.com
              </button>
              <button 
                className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-1 rounded transition-colors" 
                onClick={() => handleExampleClick("https://shopify.com")}
                disabled={isPending}
                type="button"
              >
                shopify.com
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
