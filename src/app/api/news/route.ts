console.log('route.ts loaded');
import { NextResponse } from 'next/server';
import Parser from 'rss-parser';

type AlKhaleejRssItem = {
  title?: string;
  link?: string;
  pubDate?: string;
  description?: string;
  enclosure?: { url?: string };
  author?: string;
  category?: string | string[];
};

type NewsItem = {
  publisher: string;
  title?: string;
  url?: string;
  publishedAt: string;
  description: string;
  image?: string;
  source: string;
  author?: string;
  topic?: string;
};

const parser = new Parser();

const sources = [
  {
    publisher: 'EL PAÍS (English)',
    rss_feed: 'https://feeds.elpais.com/mrss-s/pages/ep/site/english.elpais.com/portada',
    description: 'EL PAÍS English News RSS feed'
  },
  {
    publisher: 'BBC News',
    rss_feed: 'https://feeds.bbci.co.uk/news/rss.xml',
    description: 'BBC News RSS feed'
  },
  {
    publisher: 'CNN',
    rss_feed: 'http://rss.cnn.com/rss/edition.rss',
    description: 'CNN International RSS feed'
  },
  {
    publisher: 'Reuters',
    rss_feed: 'http://feeds.reuters.com/reuters/topNews',
    description: 'Reuters Top News RSS feed'
  },
  {
    publisher: 'The Guardian',
    rss_feed: 'https://www.theguardian.com/world/rss',
    description: 'The Guardian World RSS feed'
  },
  {
    publisher: 'Al Jazeera',
    rss_feed: 'https://www.aljazeera.com/xml/rss/all.xml',
    description: 'Al Jazeera RSS feed'
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
        feed.items.forEach((item: AlKhaleejRssItem) => {
          allNews.push({
            publisher: source.publisher,
            title: item.title,
            url: item.link,
            publishedAt: item.pubDate || '',
            description: item.description || '',
            image: item.enclosure?.url,
            source: source.rss_feed,
            author: item.author || '',
            topic: Array.isArray(item.category) ? item.category[0] : item.category || '',
          });
        });
      } catch (e) {
        console.error(`Error fetching/parsing feed for ${source.publisher}:`, e);
      }
    })
  );
  console.log(`Total news items aggregated: ${allNews.length}`);
  // Sort by date, newest first
  allNews.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  return NextResponse.json(allNews);
} 