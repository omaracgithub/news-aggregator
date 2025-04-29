import NewsFeed from '@/components/NewsFeed';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center px-2 sm:px-0">
      <main className="w-full max-w-2xl flex-1 flex flex-col justify-center">
        <NewsFeed />
      </main>
    </div>
  );
}
