'use client';

import React, { useState, useEffect } from 'react';

interface NewsItem {
  title: string;
  description: string;
  url: string;
  publishedAt: string;
  publisher: string;
}

export default function NewsFeed() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch('/api/news');
        if (!res.ok) throw new Error('Failed to fetch news');
        const data = await res.json();
        // Map API response to NewsItem interface
        const mappedNews: NewsItem[] = data.map((item: any) => ({
          title: item.title,
          description: item.description,
          url: item.link,
          publishedAt: item.pubDate,
          publisher: item.publisher,
        }));
        setNews(mappedNews);
      } catch (error: any) {
        setError(error.message || 'Error fetching news');
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  if (loading) {
    return <div className="p-4 text-center text-lg">Loading news...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500 text-center">{error}</div>;
  }

  return (
    <div className="w-full max-w-2xl mx-auto px-2 sm:px-4 py-4">
      <h1 className="text-xl sm:text-2xl font-bold mb-4 text-center">Latest News</h1>
      <div className="flex flex-col gap-4">
        {news.map((item, index) => (
          <a
            key={index}
            href={item.url}
            className="block rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow p-4 sm:p-6 focus:outline-none focus:ring-2 focus:ring-blue-400"
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <h2 className="text-lg sm:text-xl font-semibold mb-1 sm:mb-0 text-gray-900 line-clamp-2">{item.title}</h2>
              <span className="text-xs text-gray-500 whitespace-nowrap">{new Date(item.publishedAt).toLocaleDateString()}</span>
            </div>
            <p className="text-gray-700 text-sm mt-2 line-clamp-3">{item.description}</p>
            <div className="flex justify-between items-center mt-3">
              <span className="text-xs text-blue-600 font-medium">{item.publisher}</span>
              <span className="text-xs text-blue-500 font-semibold">Read more &rarr;</span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
} 