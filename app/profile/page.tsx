"use client"

import AddUser from "@/components/addUser"
import InfiniteScroll from "@/components/infiniteScroll"
import { getVideoOfUser } from "@/services/video"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"

function Profile() {
    const user = useSelector((state:any) => state.user.userInfo)
    const [tab, setTab] = useState(1);
    const [videos, setVideos] = useState<any>([]);
    const router = useRouter();
    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    const getUserVideo = async (pageNum: number) => {
      if(user?._id){
        try{
          setIsLoading(true);
          const res = await getVideoOfUser(user._id, pageNum);
          if (pageNum === 1) {
            setVideos(res.data.data);
          } else {
            setVideos((prevVideos:any) => [...prevVideos, ...res.data.data]);
          }
          setHasMore(res.data.data.length > 0);
        }catch(err){
          console.log(err);
        }finally{
          setIsLoading(false);
        }
      }
    }

    const loadMore = () => {
      if(hasMore && !isLoading){
        setPage(prev => prev + 1);
      }
    }

    useEffect(() => {
      getUserVideo(1);
    }, [user?._id])

    useEffect(() => {
      if (page > 1) {
        getUserVideo(page);
      }
    }, [page])

    return (
      <div>
          <div className=" text-center">
            {user?.fullName}
          </div>
          <div className="flex flex-row justify-around">
            <div onClick={() => setTab(1)} className={`${tab === 1 && "bg-blue-400" } cursor-pointer`}>Videos</div>
            <div onClick={() => setTab(2)} className={`${tab === 2 && "bg-blue-400" } cursor-pointer`}>Tweets</div>
          </div>
          {tab === 1 ?
          <InfiniteScroll loadMore={loadMore} hasMore={hasMore} isLoading={isLoading}>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {videos.map((el:any, indx:any) => (
                    <div key={el._id} className="border rounded-lg overflow-hidden shadow-lg" onClick={()=>{
                        router.replace(`/video/${el._id}`);
                    }}>
                        <img
                            src={el.thumbnail}
                            alt={el.title}
                            width={300}
                            height={200}
                            className="object-cover w-full h-48"
                        />
                        <div className="p-4">
                            <h2 className="font-bold text-xl mb-2 truncate">{el.title}</h2>
                            <p className="text-gray-700 text-base line-clamp-3">{el.description}</p>
                        </div>
                    </div>
                ))}
            </div>
            {isLoading && <h4 className="text-center mt-4">Loading ... </h4>}
          </InfiniteScroll>
          : <div>tweets</div>
          }
      </div>
    )
}

export default AddUser(Profile);