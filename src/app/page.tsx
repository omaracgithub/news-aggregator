import NewsFeed from '@/components/NewsFeed';

export default function Home() {
  return (
    <div className="min-h-screen p-8">
      <main className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">News Feed</h1>
        <NewsFeed />
      </main>
    </div>
  );
}
