"use client"
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux"
import withAuth from "@/components/auth";
import AddUser from "@/components/addUser";
import InfiniteScroll from "@/components/infiniteScroll";
import { searchVideo } from "@/services/video";
import { setVideos } from "../store/videoSlice";
import { useRouter } from "next/navigation";
function Home(){
    const videoData = useSelector((state:any) => state.video.videos);
    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [inputVideo, setInputvideo] = useState("");
    const dispatch = useDispatch();
    const router = useRouter();
    const hitUrl = async (obj:string, page:number) => {
        try{
            setIsLoading(true);
            const res = await searchVideo(obj, page);
            if(res?.data?.data){
                setHasMore(res.data.data.length>0);
                dispatch(setVideos([...videoData, ...res.data.data]));
            }else{
                setHasMore(false);
            }
        }catch(err){
            console.log(err);
        }finally{
            setIsLoading(false);
        }
    }

    useEffect(() => {
        hitUrl(inputVideo, page);
    }, [page])

    const loadMore = () => {
        if(hasMore){
            setPage((prev) => prev+1);
        }
    }

    return (
        <div className="p-4">
            <div className="mb-4 flex">
                <input 
                    className="flex-grow mr-2 p-2 border rounded" 
                    onChange={(ev) => setInputvideo(ev.target.value)}
                    placeholder="Search videos..."
                />
                <button 
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    onClick={() => {
                        dispatch(setVideos([]));
                        setPage(1);
                        hitUrl(inputVideo, 1);
                    }}
                >
                    Search
                </button>
            </div>
            <h1 className="text-3xl font-bold mb-4">My Video Page</h1>
            <InfiniteScroll loadMore={loadMore} hasMore={hasMore} isLoading={isLoading}>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {videoData.map((el:any, indx:any) => (
                        <div key={indx} className="border rounded-lg overflow-hidden shadow-lg" onClick={()=>{
                            router.replace(`/video/${el._id}`);
                        }}>
                            <img
                                src={el.thumbnail}
                                alt={el.title}
                                width={300}   // Provide the actual width of the image
                                height={200}  // Provide the actual height of the image
                                className="object-cover" // You can use CSS classes for additional styling
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
        </div>
    );
}

export default withAuth(AddUser(Home));