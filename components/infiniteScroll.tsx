import React, { useRef, useCallback } from 'react';

interface InfiniteScrollProps {
  loadMore: () => void;
  hasMore: boolean;
  children: React.ReactNode;
  isLoading: boolean;
}

function InfiniteScroll({ loadMore, hasMore, children, isLoading }: InfiniteScrollProps) {
  const observerRef = useRef<IntersectionObserver | null>(null);
  
  const loadMoreRef = useCallback((node: HTMLDivElement | null) => {
    if (observerRef.current) observerRef.current.disconnect();
    observerRef.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore && !isLoading) {
        loadMore();
      }
    });
    if (node) observerRef.current.observe(node);
  }, [loadMore, hasMore, isLoading]);

  return (
    <div className="pb-5">
      {children}
      {hasMore && (
        <div 
          ref={loadMoreRef}
          className="text-center py-5 bg-gray-100 cursor-pointer transition-colors duration-300 hover:bg-gray-200"
        >
          {isLoading ? (
            <div className="inline-block w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <p className="text-gray-700">Load more</p>
          )}
        </div>
      )}
      {!hasMore && (
        <p className="text-center py-5 text-gray-500">No more items to load</p>
      )}
    </div>
  );
}

export default React.memo(InfiniteScroll);