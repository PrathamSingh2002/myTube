"use client"
import { getWatchHistory } from '@/services/user'
import { useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { FiPlay } from 'react-icons/fi';

export default function History() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [data, setData] = useState<any>([]);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const observer = useRef<any>(null)

  const lastVideoRef = useCallback((node:any)=>{
    if(loading) return;
    if(observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver((entries) => {
      if(entries[0].isIntersecting && hasMore && !loading){
        setPage((prev) => prev + 1);
      }
    });
    if(node) observer.current.observe(node);
  }, [hasMore, loading])

  const fetchHistory = async (a:number, b:number = 5) => {
    try {
      setLoading(true);
      const temp = await getWatchHistory(a, b);
      const newData = temp.data;
      setHasMore(newData.length > 0)
      setData((prev:any) => [...prev, ...newData]);
    } catch(err) {
      console.error(err);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }
  
  useEffect(() => {
    fetchHistory(page);
  }, [page])  

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Watch History</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {data.map((el: any, indx: number) => (
          <div 
            key={indx} 
            ref={indx === data.length - 1 ? lastVideoRef : null}
            className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer group" 
            onClick={() => router.replace(`/video/${el._id}?from=home`)}
          >
            <div className="relative pb-[56.25%]">
              <img
                src={el.thumbnail}
                alt={el.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                <div className="text-white text-4xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <FiPlay size={48} />
                </div>
              </div>
            </div>
            <div className="p-6">
              <h2 className="font-bold text-xl mb-3 text-gray-800 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300">{el.title}</h2>
              <p className="text-gray-600 text-sm line-clamp-3">{el.description}</p>
            </div>
          </div>
        ))}
      </div>
      {loading && (
        <div className="flex justify-center items-center mt-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}
      {!hasMore && (
        <p className="text-center mt-8 text-gray-600">No more videos to load</p>
      )}
    </div>
  )
}