'use client';

import React, { useState, useEffect } from 'react';

interface NewsItem {
  title: string;
  description: string;
  url: string;
  publishedAt: string;
  publisher: string;
  image?: string;
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
        const data: NewsItem[] = await res.json();
        setNews(data);
      } catch (error: unknown) {
        setError(error instanceof Error ? error.message : 'Error fetching news');
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
            className="block rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow p-4 sm:p-6 focus:outline-none focus:ring-2 focus:ring-blue-400 text-left"
            target="_blank"
            rel="noopener noreferrer"
          >
            {item.image && (
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-48 object-cover rounded-lg mb-3 bg-gray-100"
                loading="lazy"
              />
            )}
            <div className="flex flex-row items-center justify-between gap-2">
              <h2 className="text-lg sm:text-xl font-semibold mb-1 sm:mb-0 text-gray-900">{item.title}</h2>
              <span className="text-xs text-gray-500 whitespace-nowrap">
                {item.publishedAt ? new Date(item.publishedAt).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' }) : ''}
              </span>
            </div>
            {item.description && (
              <p className="text-gray-700 text-sm mt-1 mb-2">{item.description}</p>
            )}
            <div className="flex flex-row items-center justify-between mt-3">
              <span className="text-xs text-blue-600 font-medium">{item.publisher}</span>
              <span className="text-xs text-blue-500 font-semibold">Read more →</span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
} 