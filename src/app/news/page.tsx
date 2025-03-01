'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface NewsItem {
  title: string;
  description: string;
  content: string;
  image_url: string;
  link: string;
  pubDate: string;
  source_id: string;
  category: string;
  language: string;
  country: string;
}

interface NewsFilters {
  category: string;
  language: string;
  country: string;
}

const categories = [
  'Latest', 'Breaking', 'Business', 'Sports', 'Science', 'Crime', 'Domestic',
  'Education', 'Entertainment', 'Environment', 'Food', 'Health', 'Lifestyle',
  'Politics', 'Technology', 'Crypto'
];

const languages = [
  { code: 'te', name: 'Telugu' },
  { code: 'hi', name: 'Hindi' },
  { code: 'en', name: 'English' },
  // Add more languages as needed
];

const countries = [
  { code: 'in', name: 'India' },
  { code: 'bd', name: 'Bangladesh' },
  { code: 'us', name: 'United States' },
  // Add more countries as needed
];

export default function NewsPage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<NewsFilters>({
    category: 'Latest',
    language: 'en',
    country: 'in'
  });

  const fetchNews = async () => {
    setLoading(true);
    try {
      let url = '';
      const apiKey = 'pub_708741e789bae81847b5c0423edb5ecbd5146';

      if (filters.category === 'Latest') {
        url = `https://newsdata.io/api/1/latest?apikey=${apiKey}`;
      } else if (filters.category === 'Breaking') {
        url = `https://newsdata.io/api/1/latest?apikey=${apiKey}&category=politics&country=${filters.country}`;
      } else if (filters.category === 'Crypto') {
        url = `https://newsdata.io/api/1/crypto?apikey=${apiKey}`;
      } else {
        url = `https://newsdata.io/api/1/news?apikey=${apiKey}&country=${filters.country}&language=${filters.language}&category=${filters.category.toLowerCase()}`;
      }

      const response = await fetch(url);
      const data = await response.json();
      setNews(data.results || []);
    } catch (error) {
      console.error('Error fetching news:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, [filters]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F172A] via-[#1E1B4B] to-[#4C1D95]">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-4">News Hub</h1>
          <p className="text-gray-300">Stay updated with the latest news from around the world</p>
        </motion.div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {/* Category Filter */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative"
          >
            <select
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value })}
              className="w-full bg-white/10 text-white border border-white/20 rounded-lg px-4 py-2 appearance-none hover:bg-white/20 transition-colors"
            >
              {categories.map((category) => (
                <option key={category} value={category} className="bg-[#1E1B4B]">
                  {category}
                </option>
              ))}
            </select>
          </motion.div>

          {/* Language Filter */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <select
              value={filters.language}
              onChange={(e) => setFilters({ ...filters, language: e.target.value })}
              className="w-full bg-white/10 text-white border border-white/20 rounded-lg px-4 py-2 appearance-none hover:bg-white/20 transition-colors"
            >
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code} className="bg-[#1E1B4B]">
                  {lang.name}
                </option>
              ))}
            </select>
          </motion.div>

          {/* Country Filter */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <select
              value={filters.country}
              onChange={(e) => setFilters({ ...filters, country: e.target.value })}
              className="w-full bg-white/10 text-white border border-white/20 rounded-lg px-4 py-2 appearance-none hover:bg-white/20 transition-colors"
            >
              {countries.map((country) => (
                <option key={country.code} value={country.code} className="bg-[#1E1B4B]">
                  {country.name}
                </option>
              ))}
            </select>
          </motion.div>
        </div>

        {/* News Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {news.map((item, index) => (
              <motion.a
                key={index}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group"
              >
                <div className="bg-white/10 backdrop-blur-lg rounded-xl overflow-hidden border border-white/10 hover:border-purple-500/50 transition-all">
                  {item.image_url && (
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={item.image_url}
                        alt={item.title}
                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xs text-purple-400 bg-purple-400/10 px-2 py-1 rounded-full">
                        {item.category || filters.category}
                      </span>
                      <span className="text-xs text-gray-400">
                        {new Date(item.pubDate).toLocaleDateString()}
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2 line-clamp-2 group-hover:text-purple-400 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-gray-300 line-clamp-3 text-sm">
                      {item.description}
                    </p>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-sm text-gray-400">{item.source_id}</span>
                      <span className="text-purple-400 group-hover:translate-x-2 transition-transform">
                        Read more →
                      </span>
                    </div>
                  </div>
                </div>
              </motion.a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 