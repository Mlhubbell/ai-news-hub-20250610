import express from "express";
import cors from "cors";
import axios from "axios";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Mock AI news data with emerging companies
const aiNewsData = [
  {
    id: 1,
    title: "OpenAI Competitor Anthropic Raises $300M Series C",
    summary: "Anthropic, the AI safety company founded by former OpenAI researchers, secured major funding to advance constitutional AI development.",
    company: "Anthropic",
    category: "ai-startups",
    url: "https://example.com/anthropic-funding",
    publishedAt: "2 hours ago",
    sentiment: "positive",
    aiScore: 95
  },
  {
    id: 2,
    title: "Robotics Startup Figure AI Unveils Humanoid Worker Robot",
    summary: "Figure AI demonstrated their latest humanoid robot capable of complex warehouse operations, attracting partnerships with major retailers.",
    company: "Figure AI",
    category: "robotics",
    url: "https://example.com/figure-ai-robot",
    publishedAt: "4 hours ago",
    sentiment: "positive",
    aiScore: 88
  },
  {
    id: 3,
    title: "Fintech AI Platform Kensho Expands Into Real-Time Analytics",
    summary: "SP Global subsidiary Kensho Technologies launches advanced AI-powered financial analytics for institutional investors.",
    company: "Kensho Technologies",
    category: "fintech",
    url: "https://example.com/kensho-analytics",
    publishedAt: "6 hours ago",
    sentiment: "positive",
    aiScore: 82
  },
  {
    id: 4,
    title: "Enterprise AI Startup Databricks Files for IPO",
    summary: "The unified analytics platform company aims for a $40B valuation as demand for enterprise AI solutions accelerates.",
    company: "Databricks",
    category: "enterprise",
    url: "https://example.com/databricks-ipo",
    publishedAt: "8 hours ago",
    sentiment: "positive",
    aiScore: 91
  },
  {
    id: 5,
    title: "Autonomous Vehicle AI Firm Aurora Goes Public",
    summary: "Aurora Innovation completes SPAC merger, becoming the first major self-driving technology company to trade publicly.",
    company: "Aurora Innovation",
    category: "ai-startups",
    url: "https://example.com/aurora-public",
    publishedAt: "10 hours ago",
    sentiment: "neutral",
    aiScore: 79
  },
  {
    id: 6,
    title: "AI Chip Startup Cerebras Challenges NVIDIA with New Architecture",
    summary: "Cerebras Systems introduces wafer-scale processors specifically designed for large language model training and inference.",
    company: "Cerebras Systems",
    category: "ai-startups",
    url: "https://example.com/cerebras-chips",
    publishedAt: "12 hours ago",
    sentiment: "positive",
    aiScore: 86
  }
];

// API Routes
app.get("/api/articles", (req, res) => {
  const { category, search } = req.query;
  
  let filteredArticles = aiNewsData;
  
  // Filter by category
  if (category && category !== "all") {
    filteredArticles = filteredArticles.filter(article => 
      article.category === category
    );
  }
  
  // Filter by search term
  if (search) {
    filteredArticles = filteredArticles.filter(article =>
      article.title.toLowerCase().includes(search.toLowerCase()) ||
      article.company.toLowerCase().includes(search.toLowerCase()) ||
      article.summary.toLowerCase().includes(search.toLowerCase())
    );
  }
  
  // Sort by AI score and recency
  filteredArticles.sort((a, b) => b.aiScore - a.aiScore);
  
  res.json({
    success: true,
    articles: filteredArticles,
    total: filteredArticles.length
  });
});

app.get("/api/companies", (req, res) => {
  const companies = [...new Set(aiNewsData.map(article => article.company))];
  res.json({
    success: true,
    companies: companies.map(company => ({
      name: company,
      articleCount: aiNewsData.filter(a => a.company === company).length
    }))
  });
});

app.get("/api/categories", (req, res) => {
  const categories = [
    { id: "all", name: "All Categories", count: aiNewsData.length },
    { id: "ai-startups", name: "AI Startups", count: aiNewsData.filter(a => a.category === "ai-startups").length },
    { id: "robotics", name: "Robotics", count: aiNewsData.filter(a => a.category === "robotics").length },
    { id: "fintech", name: "FinTech", count: aiNewsData.filter(a => a.category === "fintech").length },
    { id: "enterprise", name: "Enterprise", count: aiNewsData.filter(a => a.category === "enterprise").length }
  ];
  
  res.json({
    success: true,
    categories
  });
});

app.get("/api/trends", (req, res) => {
  const trends = {
    totalArticles: aiNewsData.length,
    averageAiScore: Math.round(aiNewsData.reduce((acc, article) => acc + article.aiScore, 0) / aiNewsData.length),
    topCategory: "ai-startups",
    sentimentDistribution: {
      positive: aiNewsData.filter(a => a.sentiment === "positive").length,
      neutral: aiNewsData.filter(a => a.sentiment === "neutral").length,
      negative: aiNewsData.filter(a => a.sentiment === "negative").length
    }
  };
  
  res.json({
    success: true,
    trends
  });
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "AI News Hub API is running",
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`🚀 AI News Hub server running on port ${PORT}`);
  console.log(`📊 Serving ${aiNewsData.length} AI news articles`);
});
