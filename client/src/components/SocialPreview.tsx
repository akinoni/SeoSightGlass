import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { X, AlertTriangle, Check, Share2 } from "lucide-react";
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
  
  // Get hostname for display
  const getHostname = (url: string) => {
    try {
      return new URL(url).hostname;
    } catch (e) {
      return url;
    }
  };
  
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

  // Platform-specific card preview component
  const SocialCard = ({ platform }: { platform: string }) => {
    // Customize based on the platform
    let cardStyle: React.CSSProperties = {};
    let imageStyle: React.CSSProperties = {};
    let customClass = "";
    
    switch (platform) {
      case "twitter":
        // Twitter/X card style
        cardStyle = { maxWidth: "500px", margin: "0 auto" };
        imageStyle = { paddingTop: "52.5%" }; // Twitter's 1.91:1 ratio
        customClass = "rounded-xl"; // Twitter has more rounded corners
        break;
        
      case "facebook":
        // Facebook card style
        cardStyle = {};
        imageStyle = { paddingTop: "52.5%" }; // Facebook's 1.91:1 ratio
        customClass = "rounded-lg"; // Standard rounded corners
        break;
        
      case "linkedin":
        // LinkedIn card style
        cardStyle = {};
        imageStyle = { paddingTop: "52%" }; // LinkedIn's image ratio
        customClass = "rounded-none"; // Less rounded corners
        break;
    }
    
    return (
      <div className={`border border-slate-200 overflow-hidden shadow-sm ${customClass}`} style={cardStyle}>
        {/* Platform-specific header for Facebook */}
        {platform === "facebook" && (
          <div className="bg-[#f0f2f5] px-3 py-2 flex items-center border-b border-slate-200">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold mr-2">f</div>
            <div>
              <div className="text-sm font-semibold">Page Name</div>
              <div className="text-xs text-slate-500">Sponsored · <i className="fas fa-globe-americas text-xs"></i></div>
            </div>
          </div>
        )}
        
        {/* Platform-specific header for LinkedIn */}
        {platform === "linkedin" && (
          <div className="bg-white px-3 py-2 flex items-center border-b border-slate-200">
            <div className="w-8 h-8 rounded-full bg-blue-700 flex items-center justify-center text-white font-bold mr-2">in</div>
            <div>
              <div className="text-sm font-semibold">Company Name</div>
              <div className="text-xs text-slate-500">Sponsored · <i className="fas fa-globe text-xs"></i></div>
            </div>
          </div>
        )}
        
        {/* Image container with aspect ratio */}
        {imageUrl ? (
          <div className="w-full relative" style={imageStyle}>
            <img 
              src={imageUrl} 
              className="absolute inset-0 w-full h-full object-cover" 
              alt="Preview image" 
              onError={(e) => {
                e.currentTarget.src = "https://via.placeholder.com/600x315?text=Image+Not+Available";
              }}
            />
          </div>
        ) : (
          <div className="w-full relative bg-gray-200" style={imageStyle}>
            <div className="absolute inset-0 flex items-center justify-center text-gray-500 text-sm">
              <div className="text-center px-4">
                <Share2 className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                No Image Available
                <div className="text-xs mt-1 text-gray-400">Add og:image meta tag for preview</div>
              </div>
            </div>
          </div>
        )}
        
        {/* Content container - platform specific styling */}
        <div className={`p-3 sm:p-4 ${platform === "twitter" ? "bg-white" : platform === "linkedin" ? "bg-white" : "bg-slate-50"}`}>
          {platform === "twitter" && (
            <div className="flex items-center mb-1">
              <div className="w-5 h-5 rounded-full bg-slate-300 mr-2"></div>
              <div className="text-sm font-semibold">@username</div>
            </div>
          )}
          
          <div className="text-xs sm:text-sm text-slate-500 mb-1">{getHostname(result.url)}</div>
          <div className={`font-bold text-slate-800 mb-1 text-sm sm:text-base line-clamp-1 ${platform === "linkedin" ? "text-blue-700" : ""}`}>
            {title}
          </div>
          <div className="text-xs sm:text-sm text-slate-600 line-clamp-2">{description}</div>
          
          {platform === "facebook" && (
            <div className="mt-2 text-xs text-blue-600 uppercase font-semibold">Learn More</div>
          )}
          
          {platform === "linkedin" && (
            <div className="mt-2 inline-block bg-blue-700 text-white px-4 py-1 text-xs rounded">Learn More</div>
          )}
        </div>
      </div>
    );
  };

  return (
    <section>
      <Card className="shadow-md border border-slate-200 h-full">
        <CardContent className="pt-4 sm:pt-6 px-3 sm:px-6">
          <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 flex items-center">
            <i className="fas fa-share-alt text-primary mr-2"></i>
            Social Media Previews
          </h2>
          
          <Tabs defaultValue="twitter" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-3 sm:mb-4 border-b border-slate-200 w-full">
              <TabsTrigger value="twitter" className="text-xs sm:text-sm">Twitter/X</TabsTrigger>
              <TabsTrigger value="facebook" className="text-xs sm:text-sm">Facebook</TabsTrigger>
              <TabsTrigger value="linkedin" className="text-xs sm:text-sm">LinkedIn</TabsTrigger>
            </TabsList>
            
            <TabsContent value="twitter" className="mb-4">
              <SocialCard platform="twitter" />
            </TabsContent>
            
            <TabsContent value="facebook" className="mb-4">
              <SocialCard platform="facebook" />
            </TabsContent>
            
            <TabsContent value="linkedin" className="mb-4">
              <SocialCard platform="linkedin" />
            </TabsContent>
          </Tabs>
          
          <div className="mt-4">
            <h3 className="text-sm sm:text-md font-medium mb-2 text-slate-700">OpenGraph / Twitter Card Analysis</h3>
            <div className="space-y-2 sm:space-y-3">
              <div className="flex items-start">
                <div className="mt-0.5 mr-2 sm:mr-3 flex-shrink-0">
                  {renderStatusIcon(ogImage)}
                </div>
                <div>
                  <p className="text-slate-800 text-xs sm:text-sm font-medium">
                    {ogImage ? 'OpenGraph Image' : 'Missing og:image tag'}
                  </p>
                  <p className="text-slate-600 text-xs sm:text-sm">
                    {ogImage ? 'Image is set for social sharing' : 'Social shares won\'t display an image, reducing engagement. Add an og:image tag.'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="mt-0.5 mr-2 sm:mr-3 flex-shrink-0">
                  {renderStatusIcon(twitterCard)}
                </div>
                <div>
                  <p className="text-slate-800 text-xs sm:text-sm font-medium">
                    {twitterCard ? 'Twitter Card Type' : 'Missing twitter:card tag'}
                  </p>
                  <p className="text-slate-600 text-xs sm:text-sm">
                    {twitterCard ? `Card type: ${twitterCard.content}` : 'Twitter won\'t display your content optimally. Add twitter:card="summary_large_image".'}
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="mt-0.5 mr-2 sm:mr-3 flex-shrink-0">
                  {renderStatusIcon(ogTitle)}
                </div>
                <div>
                  <p className="text-slate-800 text-xs sm:text-sm font-medium">
                    {ogTitle ? 'OpenGraph Title' : 'Missing og:title tag'}
                  </p>
                  <p className="text-slate-600 text-xs sm:text-sm">
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
