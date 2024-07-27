'use client'

import VideoPlayer from '@/components/videoPlayer';
import { getVideoById } from '@/services/video';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const VideoPage = () => {
  const router = useRouter();
  const params = useParams();
  const [data, setData] = useState<any>(null);
  const fetchVideo = async () => {
    if(params.id){
      try{
        const res = await getVideoById(params.id);  
        if(res?.data){
          setData(res.data);
        }else{
        router.replace('/404');
        }
      }catch(err){
        router.replace('/404');
        console.log("error")
      }
    }
  }
  useEffect(() => {
    fetchVideo();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      {
        data && <VideoPlayer video={data} />
      }
    </div>
  );
};

export default VideoPage;
