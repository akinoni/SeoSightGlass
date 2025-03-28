import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { X, AlertTriangle, Check } from "lucide-react";
import { type AnalysisResult } from "@shared/schema";

interface SocialPreviewProps {
  result: AnalysisResult;
}

export default function SocialPreview({ result }: SocialPreviewProps) {
  const [activeTab, setActiveTab] = useState("twitter");
  
  // Find OpenGraph and Twitter card meta tags
  const ogImage = result.metaTags.find(tag => tag.name === "meta[og:image]");
  const ogTitle = result.metaTags.find(tag => tag.name === "meta[og:title]");
  const ogDescription = result.metaTags.find(tag => tag.name === "meta[og:description]");
  const twitterCard = result.metaTags.find(tag => tag.name === "meta[twitter:card]");
  
  const title = ogTitle?.content || result.title || "No Title";
  const description = ogDescription?.content || result.description || "No description available.";
  const imageUrl = ogImage?.content || null;
  
  // Generate appropriate status icons
  const renderStatusIcon = (tag: { status: string } | undefined) => {
    if (!tag) return <X className="text-error text-lg" />;
    
    switch (tag.status) {
      case "good":
        return <Check className="text-success text-lg" />;
      case "warning":
        return <AlertTriangle className="text-warning text-lg" />;
      default:
        return <X className="text-error text-lg" />;
    }
  };

  return (
    <section>
      <Card className="shadow-md border border-slate-200 h-full">
        <CardContent className="pt-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <i className="fas fa-share-alt text-primary mr-2"></i>
            Social Media Previews
          </h2>
          
          <Tabs defaultValue="twitter" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4 border-b border-slate-200 w-full">
              <TabsTrigger value="twitter">Twitter/X</TabsTrigger>
              <TabsTrigger value="facebook">Facebook</TabsTrigger>
              <TabsTrigger value="linkedin">LinkedIn</TabsTrigger>
            </TabsList>
            
            <TabsContent value="twitter" className="mb-4">
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                {imageUrl ? (
                  <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                    <img 
                      src={imageUrl} 
                      className="w-full h-48 object-cover" 
                      alt="Preview image" 
                      onError={(e) => {
                        e.currentTarget.src = "https://via.placeholder.com/600x300?text=Image+Not+Available";
                      }}
                    />
                  </div>
                ) : (
                  <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-500">
                    No Image Available
                  </div>
                )}
                <div className="p-3 bg-slate-50">
                  <div className="text-sm text-slate-500 mb-1">{new URL(result.url).hostname}</div>
                  <div className="font-bold text-slate-800 mb-1">{title}</div>
                  <div className="text-sm text-slate-600 line-clamp-2">{description}</div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="facebook" className="mb-4">
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                {imageUrl ? (
                  <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                    <img 
                      src={imageUrl} 
                      className="w-full h-48 object-cover" 
                      alt="Preview image" 
                      onError={(e) => {
                        e.currentTarget.src = "https://via.placeholder.com/600x300?text=Image+Not+Available";
                      }}
                    />
                  </div>
                ) : (
                  <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-500">
                    No Image Available
                  </div>
                )}
                <div className="p-3 bg-slate-50">
                  <div className="text-sm text-slate-500 mb-1">{new URL(result.url).hostname}</div>
                  <div className="font-bold text-slate-800 mb-1">{title}</div>
                  <div className="text-sm text-slate-600 line-clamp-3">{description}</div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="linkedin" className="mb-4">
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                {imageUrl ? (
                  <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                    <img 
                      src={imageUrl} 
                      className="w-full h-48 object-cover" 
                      alt="Preview image" 
                      onError={(e) => {
                        e.currentTarget.src = "https://via.placeholder.com/600x300?text=Image+Not+Available";
                      }}
                    />
                  </div>
                ) : (
                  <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-500">
                    No Image Available
                  </div>
                )}
                <div className="p-3 bg-slate-50">
                  <div className="text-sm text-slate-500 mb-1">{new URL(result.url).hostname}</div>
                  <div className="font-bold text-slate-800 mb-1">{title}</div>
                  <div className="text-sm text-slate-600 line-clamp-2">{description}</div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="mt-4">
            <h3 className="text-md font-medium mb-2 text-slate-700">OpenGraph / Twitter Card Analysis</h3>
            <div className="space-y-3">
              <div className="flex items-start">
                <div className="mt-0.5 mr-3">
                  {renderStatusIcon(ogImage)}
                </div>
                <div>
                  <p className="text-slate-800 text-sm font-medium">
                    {ogImage ? 'OpenGraph Image' : 'Missing og:image tag'}
                  </p>
                  <p className="text-slate-600 text-sm">
                    {ogImage ? 'Image is set for social sharing' : 'Social shares won\'t display an image, reducing engagement. Add an og:image tag.'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="mt-0.5 mr-3">
                  {renderStatusIcon(twitterCard)}
                </div>
                <div>
                  <p className="text-slate-800 text-sm font-medium">
                    {twitterCard ? 'Twitter Card Type' : 'Missing twitter:card tag'}
                  </p>
                  <p className="text-slate-600 text-sm">
                    {twitterCard ? `Card type: ${twitterCard.content}` : 'Twitter won\'t display your content optimally. Add twitter:card="summary_large_image".'}
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="mt-0.5 mr-3">
                  {renderStatusIcon(ogTitle)}
                </div>
                <div>
                  <p className="text-slate-800 text-sm font-medium">
                    {ogTitle ? 'OpenGraph Title' : 'Missing og:title tag'}
                  </p>
                  <p className="text-slate-600 text-sm">
                    {ogTitle ? 'Title is set for social sharing' : 'Your page title will be used as a fallback, but an explicit og:title is recommended.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
