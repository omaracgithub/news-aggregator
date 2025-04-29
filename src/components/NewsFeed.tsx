'use client';

import React, { useState, useEffect } from 'react';
import { FiSearch } from 'react-icons/fi';

interface NewsItem {
  title: string;
  description: string;
  url: string;
  publishedAt: string;
  publisher: string;
  image?: string;
  author?: string;
  topic?: string;
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
    <div className="w-full max-w-2xl mx-auto px-2 sm:px-4 py-2" style={{ fontFamily: 'Adelle, Arial, Helvetica, sans-serif' }}>
      <div className="flex items-center justify-end h-10 mb-1">
        <button className="p-2 rounded-full hover:bg-gray-100 transition-colors" aria-label="AI Search">
          <FiSearch size={20} />
        </button>
      </div>
      <div className="divide-y divide-gray-200 bg-white rounded-lg shadow-sm">
        {news.map((item, index) => (
          <a
            key={index}
            href={item.url}
            className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer group"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="font-medium text-gray-900 group-hover:underline text-base sm:text-lg flex-grow">
              {item.title}
              {item.topic && (
                <span className="ml-2 inline-block bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full align-middle font-semibold" style={{ fontFamily: 'Adelle, Arial, Helvetica, sans-serif' }}>
                  {item.topic}
                </span>
              )}
            </span>
            <div className="flex flex-col items-end min-w-[120px] ml-4 text-right">
              <span className="text-xs text-gray-500 whitespace-nowrap">{item.publishedAt ? new Date(item.publishedAt).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' }) : ''}</span>
              <span className="text-xs text-blue-600 font-medium mt-1">{item.publisher}</span>
              {item.author && <span className="text-xs text-gray-500">{item.author}</span>}
            </div>
          </a>
        ))}
      </div>
    </div>
  );
} 