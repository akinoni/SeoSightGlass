import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, AlertTriangle, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { type MetaTag } from "@shared/schema";

interface MetaTagsTableProps {
  metaTags: MetaTag[];
}

export default function MetaTagsTable({ metaTags }: MetaTagsTableProps) {
  const { toast } = useToast();
  
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
  
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "good":
        return (
          <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-sm font-medium text-green-800">
            <Check className="w-4 h-4 mr-1" />
            Good
          </span>
        );
      case "warning":
        return (
          <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-sm font-medium text-yellow-800">
            <AlertTriangle className="w-4 h-4 mr-1" />
            Warning
          </span>
        );
      case "error":
        return (
          <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-sm font-medium text-red-800">
            <X className="w-4 h-4 mr-1" />
            Missing
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-sm font-medium text-blue-800">
            <i className="fas fa-info-circle mr-1"></i>
            Info
          </span>
        );
    }
  };

  return (
    <section className="mt-8">
      <Card className="shadow-md border border-slate-200">
        <CardContent className="pt-6">
          <h2 className="text-xl font-semibold mb-6 flex items-center">
            <i className="fas fa-tags text-primary mr-2"></i>
            Meta Tags Analysis
          </h2>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th scope="col" className="py-3.5 px-4 text-left text-sm font-semibold text-slate-700">Tag</th>
                  <th scope="col" className="py-3.5 px-4 text-left text-sm font-semibold text-slate-700">Content</th>
                  <th scope="col" className="py-3.5 px-4 text-left text-sm font-semibold text-slate-700">Status</th>
                  <th scope="col" className="py-3.5 px-4 text-left text-sm font-semibold text-slate-700">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {metaTags.map((tag, index) => (
                  <tr key={index}>
                    <td className="whitespace-nowrap py-4 px-4 text-sm font-medium text-slate-900">
                      <span className="font-mono">{tag.name}</span>
                    </td>
                    <td className="py-4 px-4 text-sm text-slate-700">
                      <div className="max-w-lg overflow-hidden text-ellipsis font-mono bg-slate-50 p-2 rounded">
                        {tag.content || (
                          <span className="text-slate-400">Not present</span>
                        )}
                      </div>
                    </td>
                    <td className="whitespace-nowrap py-4 px-4 text-sm text-slate-700">
                      {renderStatusBadge(tag.status)}
                    </td>
                    <td className="whitespace-nowrap py-4 px-4 text-sm text-slate-700">
                      {tag.content ? (
                        <Button 
                          variant="ghost" 
                          onClick={() => handleCopy(tag.content)}
                          className="text-primary hover:text-blue-700 font-medium"
                        >
                          <i className="far fa-copy mr-1"></i>
                          Copy
                        </Button>
                      ) : (
                        <Button 
                          variant="ghost" 
                          className="text-primary hover:text-blue-700 font-medium"
                          disabled
                        >
                          <i className="fas fa-magic mr-1"></i>
                          Generate
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
