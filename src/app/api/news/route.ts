console.log('route.ts loaded');
import { NextResponse } from 'next/server';
import Parser from 'rss-parser';

type MeedRssItem = {
  title?: string;
  link?: string;
  pubDate?: string;
  updated?: string;
  description?: string;
  content?: string;
  summary?: string;
};

type NewsItem = {
  publisher: string;
  title?: string;
  link?: string;
  pubDate: string;
  description: string;
  source: string;
};

const parser = new Parser({
  customFields: {
    item: [
      ['a10:updated', 'updated'],
    ],
  },
});

const sources = [
  {
    publisher: 'MEED - Analysis',
    rss_feed: 'http://www.meed.com/classifications/analysis/feed',
    description: 'MEED Analysis RSS feed'
  },
  {
    publisher: 'MEED - Comment',
    rss_feed: 'http://www.meed.com/category/news/commentary/feed/',
    description: 'MEED Commentary RSS feed'
  },
  {
    publisher: 'MEED - News',
    rss_feed: 'http://www.meed.com/classifications/analysis/special-report/feed/',
    description: 'MEED News RSS feed'
  },
  {
    publisher: 'MEED - Special Reports',
    rss_feed: 'https://www.meed.com/classifications/analysis/special-report/rss',
    description: 'MEED Special Reports RSS feed'
  },
  {
    publisher: 'MEED - Tenders',
    rss_feed: 'https://www.meed.com/tenders/feed/',
    description: 'MEED Tenders RSS feed'
  }
];

export async function GET() {
  console.log('GET /api/news called');
  const allNews: NewsItem[] = [];
  await Promise.all(
    sources.map(async (source) => {
      try {
        console.log(`Fetching feed for: ${source.publisher}`);
        const feed = await parser.parseURL(source.rss_feed);
        console.log(`Fetched ${feed.items.length} items from ${source.publisher}`);
        feed.items.forEach((item: MeedRssItem) => {
          allNews.push({
            publisher: source.publisher,
            title: item.title,
            link: item.link,
            pubDate: item.updated || item.pubDate || '',
            description: item.description || item.content || item.summary || '',
            source: source.rss_feed
          });
        });
      } catch (e) {
        console.error(`Error fetching/parsing feed for ${source.publisher}:`, e);
      }
    })
  );
  console.log(`Total news items aggregated: ${allNews.length}`);
  // Sort by date, newest first
  allNews.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());
  return NextResponse.json(allNews);
} 