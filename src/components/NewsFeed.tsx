'use client';

import React, { useState, useEffect } from 'react';

interface NewsItem {
  title: string;
  description: string;
  url: string;
  publishedAt: string;
}

export default function NewsFeed() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Replace with actual API call
    const fetchNews = async () => {
      try {
        // Simulating API call
        const mockNews: NewsItem[] = [
          {
            title: "Welcome to News Aggregator",
            description: "This is a sample news item. We'll replace this with real news data soon!",
            url: "#",
            publishedAt: new Date().toISOString(),
          },
        ];
        setNews(mockNews);
      } catch (error) {
        console.error('Error fetching news:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  if (loading) {
    return <div className="p-4">Loading news...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Latest News</h1>
      <div className="space-y-4">
        {news.map((item, index) => (
          <div key={index} className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold mb-2">{item.title}</h2>
            <p className="text-gray-600 mb-2">{item.description}</p>
            <a 
              href={item.url} 
              className="text-blue-500 hover:text-blue-700"
              target="_blank"
              rel="noopener noreferrer"
            >
              Read more
            </a>
            <p className="text-sm text-gray-500 mt-2">
              {new Date(item.publishedAt).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
} 