'use client'

import VideoPlayer from '@/components/videoPlayer';
import { getVideoById } from '@/services/video';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const VideoPage = () => {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const [data, setData] = useState<any>(null);
  const fetchVideo = async (obj:any) => {
    if(params.id){
      try{
        const res = await getVideoById(params.id, obj);  
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
    if(searchParams && searchParams.get('from') === 'home' ){
      router.replace(`/video/${params.id}`);
      fetchVideo("home");
    }else{
      fetchVideo("video");
    }
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
