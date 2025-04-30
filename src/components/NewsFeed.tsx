'use client';

import React, { useState, useEffect } from 'react';
import { FiSearch } from 'react-icons/fi';
import { useSwipeable } from 'react-swipeable';
import { FiPlus, FiLayers, FiX, FiZap} from 'react-icons/fi';
import Toast from './Toast';

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

interface SwipeableItemProps {
  item: NewsItem;
  onRemove: (url: string) => void;
  onDeepDive: (item: NewsItem) => void;
  onFollow: (item: NewsItem) => void;
}

const SwipeableItem = ({ item, onRemove, onDeepDive, onFollow }: SwipeableItemProps) => {
  const [offsetX, setOffsetX] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  
  // Constants for swipe interaction
  const ACTION_WIDTH = 80; // Single action width
  const RIGHT_SWIPE_WIDTH = 240; // Width for 3 actions (80px × 3)
  const SWIPE_THRESHOLD = ACTION_WIDTH / 2;
  const RIGHT_SWIPE_THRESHOLD = RIGHT_SWIPE_WIDTH / 4; // Lower threshold for 3-button action
  
  // Handle deletion with improved animation
  const handleRemove = () => {
    // First, slide to show the delete button completely
    setOffsetX(-ACTION_WIDTH);
    
    // Short delay to show the delete button
    setTimeout(() => {
      // Then initiate the removal animation (slides out and shrinks)
      setIsRemoving(true);
      
      // Wait for animation to complete before actually removing from list
      setTimeout(() => {
        onRemove(item.url);
      }, 400); // Timed to match with the CSS transition duration
    }, 100);
  };
  
  const swipeHandlers = useSwipeable({
    onSwiping: (event) => {
      setIsSwiping(true);
      // Limit the drag distance
      if (event.dir === 'Left' && event.deltaX > -ACTION_WIDTH * 1.5) {
        setOffsetX(event.deltaX); 
      } else if (event.dir === 'Right' && event.deltaX < RIGHT_SWIPE_WIDTH * 1.2) {
        setOffsetX(event.deltaX);
      }
    },
    onSwipedLeft: () => {
      if (offsetX < -SWIPE_THRESHOLD) {
        // Animate to full open position before performing action
        setOffsetX(-ACTION_WIDTH);
        // Start the removal animation
        handleRemove();
      } else {
        setOffsetX(0);
      }
      setIsSwiping(false);
    },
    onSwipedRight: () => {
      if (offsetX > RIGHT_SWIPE_THRESHOLD) {
        // Animate to full open position before performing action
        setOffsetX(RIGHT_SWIPE_WIDTH);
        setTimeout(() => {
          onDeepDive(item);
          setTimeout(() => setOffsetX(0), 1500); // Keep the swipe action visible for 1.5 seconds
        }, 300);
      } else {
        setOffsetX(0);
      }
      setIsSwiping(false);
    },
    trackMouse: true,
  });

  // Handler functions for the three right swipe actions
  const handleDeepDive = () => {
    onDeepDive(item);
    setTimeout(() => setOffsetX(0), 1500); // Delay resetting the offset
  };

  const handleFollowClick = () => {
    // Call the follow function
    onFollow(item);
    // Reset the swipe position after a delay
    setTimeout(() => setOffsetX(0), 800);
  };

  const handleMoreContext = () => {
    // Placeholder for more context functionality
    setTimeout(() => setOffsetX(0), 1500); // Delay resetting the offset
  };

  return (
    <div 
      className={`border-b border-gray-200 overflow-hidden transition-all duration-500 ease-out ${
        isRemoving ? 'max-h-0 opacity-0 my-0 py-0' : 'max-h-96 opacity-100'
      }`}
      style={{
        transform: isRemoving ? 'translateX(-100%) scale(0.9)' : 'translateX(0) scale(1)',
        transition: 'transform 0.3s ease-out, max-height 0.5s ease-out, opacity 0.5s ease-out, margin 0.5s, padding 0.5s'
      }}
    >
      {/* This outer container controls visibility and hides overflow */}
      <div className="relative overflow-hidden">
        {/* Action buttons (positioned underneath the content) */}
        <div className="absolute inset-0 flex justify-between">
          {/* Three right swipe actions (on left side of screen) */}
          <div className="flex h-full">
            <button 
              className="bg-blue-500 text-white w-[80px] h-full flex flex-col items-center justify-center"
              onClick={handleDeepDive}
            >
              <FiZap size={20} />
              <span className="text-[10px] mt-1 font-medium">Ask AI</span>
            </button>
            <button 
              className="bg-purple-500 text-white w-[80px] h-full flex flex-col items-center justify-center"
              onClick={handleFollowClick}
            >
              <FiPlus size={20} />
              <span className="text-[10px] mt-1 font-medium">Follow Story</span>
            </button>
            <button 
              className="bg-indigo-500 text-white w-[80px] h-full flex flex-col items-center justify-center"
              onClick={handleMoreContext}
            >
              <FiLayers size={20} />
              <span className="text-[10px] mt-1 font-medium">More Context</span>
            </button>
          </div>
          
          {/* Left swipe action - Read (on right side of screen) */}
          <button 
            className="bg-red-500 text-white w-[80px] h-full flex flex-col items-center justify-center"
            onClick={handleRemove}
          >
            <FiX size={20} />
            <span className="text-[10px] mt-1 font-medium">Not Interested</span>
          </button>
        </div>
        
        {/* News item content (slides on top of action buttons) */}
        <div 
          {...swipeHandlers} 
          className="bg-white w-full relative z-10 px-4 py-3" 
          style={{ 
            transform: `translateX(${offsetX}px)`,
            transition: isSwiping ? 'none' : 'transform 0.3s ease-out',
          }}
        >
          <a
            href={item.url}
            className="block hover:bg-gray-50 transition-colors cursor-pointer -mx-4 -my-3 px-4 py-3"
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => { if (Math.abs(offsetX) > 5) e.preventDefault(); }}
          >
            {/* Header with publisher and date */}
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs text-blue-600 font-medium">{item.publisher}</span>
              <span className="text-xs text-gray-500 whitespace-nowrap">
                {item.publishedAt ? new Date(item.publishedAt).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' }) : ''}
              </span>
            </div>
            
            {/* Title and topic */}
            <div className="flex items-start">
              <span className="font-medium text-gray-900 hover:underline text-base sm:text-lg">
                {item.title}
                {item.topic && (
                  <span className="ml-2 inline-block bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full align-middle font-semibold" style={{ fontFamily: 'Adelle, Arial, Helvetica, sans-serif' }}>
                    {item.topic}
                  </span>
                )}
              </span>
            </div>
            
            {/* Author if available */}
            {item.author && (
              <div className="mt-1">
                <span className="text-xs text-gray-500">{item.author}</span>
              </div>
            )}
          </a>
        </div>
      </div>
    </div>
  );
};

export default function NewsFeed() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [removedIds, setRemovedIds] = useState<Set<string>>(new Set());
  const [selectedArticle, setSelectedArticle] = useState<NewsItem | null>(null);
  const [followedStories, setFollowedStories] = useState<Set<string>>(new Set());
  const [toast, setToast] = useState<{
    isVisible: boolean;
    message: string;
    type: 'success' | 'error' | 'info';
  }>({
    isVisible: false,
    message: '',
    type: 'success'
  });

  // Set the body background to white
  useEffect(() => {
    document.body.style.backgroundColor = 'white';
    return () => {
      document.body.style.backgroundColor = '';
    };
  }, []);

  const handleDeepDive = (item: NewsItem) => {
    setSelectedArticle(item);
    console.log(`Deep dive on: ${item.title}`);
  };

  const handleRemove = (url: string) => {
    setRemovedIds(prev => new Set([...prev, url]));
  };

  const handleFollow = (item: NewsItem) => {
    // Create a truncated version of the title for the toast message
    const truncatedTitle = item.title.length > 40 
      ? `"${item.title.substring(0, 40)}..."` 
      : `"${item.title}"`;
      
    // Check if already followed
    if (followedStories.has(item.url)) {
      // Already following, show info toast
      setToast({
        isVisible: true,
        message: `You're already set to receive updates about ${truncatedTitle}`,
        type: 'info'
      });
    } else {
      // Add to followed stories
      setFollowedStories(prev => new Set([...prev, item.url]));
      
      // Show success toast
      setToast({
        isVisible: true,
        message: `You'll be notified of any developments on ${truncatedTitle}`,
        type: 'success'
      });
    }
  };

  const closeToast = () => {
    setToast(prev => ({ ...prev, isVisible: false }));
  };

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
    <div className="w-full min-h-screen bg-white" style={{ fontFamily: 'Adelle, Arial, Helvetica, sans-serif' }}>
      <div className="flex items-center justify-end h-10 mb-1">
        <button className="p-2 rounded-full hover:bg-gray-100 transition-colors" aria-label="AI Search">
          <FiSearch size={20} />
        </button>
      </div>
      <div className="divide-y divide-gray-200">
        {news
          .filter((item) => !removedIds.has(item.url))
          .map((item, index) => (
            <SwipeableItem 
              key={index}
              item={item}
              onRemove={handleRemove}
              onDeepDive={handleDeepDive}
              onFollow={handleFollow}
            />
          ))}
      </div>
      
      {/* Toast notification */}
      <Toast 
        isVisible={toast.isVisible}
        message={toast.message}
        type={toast.type}
        onClose={closeToast}
      />
    </div>
  );
} 