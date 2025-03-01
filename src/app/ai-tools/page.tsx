'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

interface AITool {
  name: string;
  description: string;
  url: string;
  category: string;
  image: string;
}

const aiTools: AITool[] = [
  {
    name: "ChatGPT",
    description: "Advanced language model for conversation and content creation",
    url: "https://chat.openai.com",
    category: "Language",
    image: "https://seeklogo.com/images/C/chatgpt-logo-02AFA704B5-seeklogo.com.png"
  },
  {
    name: "Midjourney",
    description: "AI art generation through natural language prompts",
    url: "https://www.midjourney.com",
    category: "Image Generation",
    image: "https://seeklogo.com/images/M/midjourney-logo-02E160DA6E-seeklogo.com.png"
  },
  {
    name: "Jasper",
    description: "AI content creation platform for marketing and business",
    url: "https://www.jasper.ai",
    category: "Writing",
    image: "https://seeklogo.com/images/J/jasper-ai-logo-2E4AEB4D51-seeklogo.com.png"
  },
  {
    name: "DALL·E 2",
    description: "Create realistic images and art from natural language",
    url: "https://labs.openai.com",
    category: "Image Generation",
    image: "https://seeklogo.com/images/D/dall-e-logo-1DD62202D2-seeklogo.com.png"
  },
  {
    name: "Notion AI",
    description: "AI-powered writing assistant integrated with Notion",
    url: "https://www.notion.so/product/ai",
    category: "Productivity",
    image: "https://seeklogo.com/images/N/notion-app-logo-009B1538E8-seeklogo.com.png"
  },
  {
    name: "Claude",
    description: "Advanced AI assistant for analysis and writing",
    url: "https://www.anthropic.com/claude",
    category: "Language",
    image: "https://seeklogo.com/images/A/anthropic-logo-3F2B20E6A9-seeklogo.com.png"
  },
  {
    name: "Runway",
    description: "AI-powered creative tools for video and image editing",
    url: "https://runwayml.com",
    category: "Video",
    image: "https://seeklogo.com/images/R/runway-ml-logo-14DC6AA3E6-seeklogo.com.png"
  },
  {
    name: "Synthesia",
    description: "AI video generation from text",
    url: "https://www.synthesia.io",
    category: "Video",
    image: "https://seeklogo.com/images/S/synthesia-logo-4CA444426F-seeklogo.com.png"
  },
  {
    name: "GitHub Copilot",
    description: "AI pair programmer for code suggestions",
    url: "https://github.com/features/copilot",
    category: "Development",
    image: "https://seeklogo.com/images/G/github-copilot-logo-4A08F8A5C2-seeklogo.com.png"
  },
  {
    name: "Eleven Labs",
    description: "AI voice generation and cloning",
    url: "https://elevenlabs.io",
    category: "Audio",
    image: "https://seeklogo.com/images/E/eleven-labs-logo-0FD376BCBA-seeklogo.com.png"
  },
  {
    name: "Perplexity AI",
    description: "AI-powered search engine",
    url: "https://www.perplexity.ai",
    category: "Search",
    image: "https://seeklogo.com/images/P/perplexity-ai-logo-332A0BB9B5-seeklogo.com.png"
  },
  {
    name: "Leonardo.ai",
    description: "AI art generation platform",
    url: "https://leonardo.ai",
    category: "Image Generation",
    image: "https://seeklogo.com/images/L/leonardo-ai-logo-42B79ABC5C-seeklogo.com.png"
  },
  {
    name: "Pika Labs",
    description: "AI video generation and editing",
    url: "https://pika.art",
    category: "Video",
    image: "https://pika.art/pika-icon.png"
  },
  {
    name: "Gemini",
    description: "Google's advanced AI model",
    url: "https://gemini.google.com",
    category: "Language",
    image: "https://seeklogo.com/images/G/google-gemini-logo-A5787B2669-seeklogo.com.png"
  },
  {
    name: "Canva AI",
    description: "AI-powered design tools",
    url: "https://www.canva.com",
    category: "Design",
    image: "https://seeklogo.com/images/C/canva-logo-B4BE25729A-seeklogo.com.png"
  },
  {
    name: "Adobe Firefly",
    description: "AI image generation and editing",
    url: "https://www.adobe.com/products/firefly.html",
    category: "Design",
    image: "https://seeklogo.com/images/A/adobe-firefly-logo-E7E886C0BF-seeklogo.com.png"
  },
  {
    name: "Microsoft Designer",
    description: "AI-powered design tool",
    url: "https://designer.microsoft.com",
    category: "Design",
    image: "https://seeklogo.com/images/M/microsoft-designer-logo-84067C5AB1-seeklogo.com.png"
  },
  {
    name: "Bing Image Creator",
    description: "AI image generation by Microsoft",
    url: "https://www.bing.com/create",
    category: "Image Generation",
    image: "https://seeklogo.com/images/B/bing-logo-A8E58F0A5E-seeklogo.com.png"
  },
  {
    name: "Stable Diffusion",
    description: "Open-source image generation model",
    url: "https://stability.ai",
    category: "Image Generation",
    image: "https://seeklogo.com/images/S/stable-diffusion-logo-C9A807D30F-seeklogo.com.png"
  },
  {
    name: "Hugging Face",
    description: "Platform for AI models and datasets",
    url: "https://huggingface.co",
    category: "Development",
    image: "https://seeklogo.com/images/H/hugging-face-logo-3EF4F6CA95-seeklogo.com.png"
  }
];

const categories = [...new Set(aiTools.map(tool => tool.category))];

export default function AIToolsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTools = aiTools.filter(tool => {
    const matchesCategory = selectedCategory === 'All' || tool.category === selectedCategory;
    const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         tool.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#0A0118] text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="relative mb-12">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-pink-500/20 to-blue-600/20 blur-3xl" />
          <h1 className="relative text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 text-transparent bg-clip-text">
            AI Tools Directory
          </h1>
          <p className="relative text-lg text-gray-300">
            Discover and explore powerful AI tools for every need
          </p>
        </div>

        <div className="mb-8 flex flex-col md:flex-row gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search AI tools..."
              className="w-full md:w-96 px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:outline-none placeholder-gray-400"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-blue-500/10 rounded-xl blur opacity-50 -z-10" />
          </div>
          
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-purple-500 scrollbar-track-transparent">
            <button
              onClick={() => setSelectedCategory('All')}
              className={`px-4 py-2 rounded-xl whitespace-nowrap transition-all ${
                selectedCategory === 'All'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/25'
                  : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10'
              }`}
            >
              All
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-xl whitespace-nowrap transition-all ${
                  selectedCategory === category
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/25'
                    : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTools.map((tool, index) => (
            <motion.a
              key={tool.name}
              href={tool.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-blue-500/10 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-purple-500/50 transition-all">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-white/5 mr-4 p-2">
                      <img
                        src={tool.image}
                        alt={tool.name}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold group-hover:text-purple-400 transition-colors">
                        {tool.name}
                      </h3>
                      <span className="text-sm text-gray-400">{tool.category}</span>
                    </div>
                  </div>
                  <p className="text-gray-300">{tool.description}</p>
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </div>
  );
} 