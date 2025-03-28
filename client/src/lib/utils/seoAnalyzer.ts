import { type AnalysisResult, type MetaTag } from "@shared/schema";

// Function to validate title tag
export function analyzeTitleTag(title: string | null): {
  status: MetaTag["status"];
  message: string;
} {
  if (!title) {
    return {
      status: "error",
      message: "Missing title tag",
    };
  }

  const length = title.length;
  if (length < 30) {
    return {
      status: "warning",
      message: "Too short (under 30 characters)",
    };
  }

  if (length > 60) {
    return {
      status: "warning",
      message: "Too long (over 60 characters)",
    };
  }

  return {
    status: "good",
    message: "Good length (between 30-60 characters)",
  };
}

// Function to validate meta description
export function analyzeDescription(description: string | null): {
  status: MetaTag["status"];
  message: string;
} {
  if (!description) {
    return {
      status: "error",
      message: "Missing meta description",
    };
  }

  const length = description.length;
  if (length < 120) {
    return {
      status: "warning",
      message: "Too short (under 120 characters)",
    };
  }

  if (length > 155) {
    return {
      status: "warning",
      message: "Too long (over 155 characters)",
    };
  }

  return {
    status: "good",
    message: "Good length (between 120-155 characters)",
  };
}

// Function to analyze canonical tag
export function analyzeCanonical(canonical: string | null, url: string): {
  status: MetaTag["status"];
  message: string;
} {
  if (!canonical) {
    return {
      status: "warning",
      message: "Missing canonical URL",
    };
  }

  try {
    // Check if canonical URL is valid
    new URL(canonical);
    return {
      status: "good",
      message: "Canonical URL is properly set",
    };
  } catch (e) {
    return {
      status: "error",
      message: "Invalid canonical URL format",
    };
  }
}

// Function to analyze robots meta tag
export function analyzeRobots(robots: string | null): {
  status: MetaTag["status"];
  message: string;
} {
  if (!robots) {
    return {
      status: "info",
      message: "Not specified (defaults to index, follow)",
    };
  }

  if (robots.includes("noindex")) {
    return {
      status: "warning",
      message: "Contains noindex directive",
    };
  }

  return {
    status: "good",
    message: "Properly set",
  };
}

// Function to calculate overall SEO score
export function calculateScore(metaTags: MetaTag[]): AnalysisResult["score"] {
  let essentialScore = 0;
  let socialScore = 0;
  let structureScore = 0;
  let performanceScore = 7; // Default performance score
  
  // Check essential tags
  const hasTitle = metaTags.find(tag => tag.name === "title" && tag.status === "good");
  const hasDescription = metaTags.find(tag => tag.name === "meta[description]" && tag.status === "good");
  const hasCanonical = metaTags.find(tag => tag.name === "link[canonical]" && tag.status === "good");
  const hasRobots = metaTags.find(tag => tag.name === "meta[robots]");
  
  if (hasTitle) essentialScore += 3;
  else if (metaTags.find(tag => tag.name === "title" && tag.status === "warning")) essentialScore += 2;
  
  if (hasDescription) essentialScore += 3;
  else if (metaTags.find(tag => tag.name === "meta[description]" && tag.status === "warning")) essentialScore += 2;
  
  if (hasCanonical) essentialScore += 2;
  if (hasRobots && hasRobots.status !== "error") essentialScore += 2;
  
  // Check social tags
  const hasOgTitle = metaTags.find(tag => tag.name === "meta[og:title]" && tag.content);
  const hasOgDescription = metaTags.find(tag => tag.name === "meta[og:description]" && tag.content);
  const hasOgImage = metaTags.find(tag => tag.name === "meta[og:image]" && tag.content);
  const hasTwitterCard = metaTags.find(tag => tag.name === "meta[twitter:card]" && tag.content);
  
  if (hasOgTitle) socialScore += 2;
  if (hasOgDescription) socialScore += 2;
  if (hasOgImage) socialScore += 3;
  if (hasTwitterCard) socialScore += 3;
  
  // Structure score - simplified
  structureScore = 8;
  
  // Calculate overall score (weighted average)
  const overall = Math.round(
    (essentialScore / 10) * 0.35 + 
    (socialScore / 10) * 0.25 + 
    (structureScore / 10) * 0.2 + 
    (performanceScore / 10) * 0.2
  ) * 100;
  
  return {
    overall,
    essential: essentialScore,
    social: socialScore,
    structure: structureScore,
    performance: performanceScore,
  };
}
