"use client"

import AddUser from "@/components/addUser"
import InfiniteScroll from "@/components/infiniteScroll"
import { deleteVideoById, getVideoOfUser } from "@/services/video"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { getUserTweetService } from "@/services/tweets"
import { getUserById } from "@/services/user"
import { MdDelete } from "react-icons/md";
import DeleteVideoPopup from "@/components/deleteVideoPopup"
import DeleteTweetPopup from "@/components/deleteTweetPopup"
import { useSelector } from "react-redux"
function Profile() {
    const params = useParams();
    const rootUser = useSelector((state: any)=>state.user.userInfo);
    const [user, setUser] = useState<any>(null);
    const [tab, setTab] = useState('videos');
    const [videos, setVideos] = useState<any>([]);
    const [tweets, setTweets] = useState<any>([]);
    const router = useRouter();
    const [videoPage, setVideoPage] = useState(1);
    const [tweetPage, setTweetPage] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [hasMoreVideos, setHasMoreVideos] = useState(true);
    const [hasMoreTweets, setHasMoreTweets] = useState(true);
    const [openDeletePopup, setDeletePopup] = useState(false);
    const [openTweetPopup, setTweetPopup] = useState(false);
    const [deleteVideoProps, setdeleteVideoProps] = useState({
      thumbnail:"",
      id:""
    })
    const [deleteTweetProps, setdeleteTweetProps] = useState({
      id:""
    })
    const deleteVideoPopup = async (id: any, thumbnail:any) => {
      setDeletePopup(true)
      setdeleteVideoProps({thumbnail:thumbnail, id:id});
    } 
    const deleteTweetPopup = async (id: any) => {
      setTweetPopup(true)
      setdeleteTweetProps({id:id});
    } 
    const fetchUser = async (obj:any) => {
      try{
        const res = await getUserById(obj);
        setUser(res.data);
      }catch(err){
        console.log(err);
      }
    }
    const getUserVideo = async (pageNum: number) => {
      if(user?._id && hasMoreVideos){
        try{
          setIsLoading(true);
          const res = await getVideoOfUser(user._id, pageNum);
          setVideos((prevVideos:any) => [...prevVideos, ...res.data.data]);
          setHasMoreVideos(res.data.data.length > 0);
        }catch(err){
          console.log(err);
        }finally{
          setIsLoading(false);
        }
      }
    }

    const getUserTweets = async (pageNum: number) => {
      if(user?._id && hasMoreTweets){
        try{
          setIsLoading(true);
          const res = await getUserTweetService(user._id, pageNum);
          setTweets((prevTweets:any) => [...prevTweets, ...res.data]);
          setHasMoreTweets(res.data.length > 0);
        }catch(err){
          console.log(err);
        }finally{
          setIsLoading(false);
        }
      }
    }

    const loadMore = () => {
      if(!isLoading){
        if (tab === 'videos' && hasMoreVideos) {
          setVideoPage(prev => prev + 1);
        } else if (tab === 'tweets' && hasMoreTweets) {
          setTweetPage(prev => prev + 1);
        }
      }
    }

    useEffect(() => {
      if (user?._id) {
        if (videos.length === 0) {
          getUserVideo(1);
        }
      }
    }, [user?._id])

    useEffect(() => {
      if (videoPage > 1) {
        getUserVideo(videoPage);
      }
    }, [videoPage])

    useEffect(() => {
      if (tweetPage > 1) {
        getUserTweets(tweetPage);
      }
    }, [tweetPage])

    useEffect(() => {
      if (tab === 'tweets' && tweets.length === 0 && user?._id) {
        getUserTweets(1);
      }
    }, [tab, user?._id])
    useEffect(() => {
      if(!user){
        fetchUser(params.id);
      }
    },[user])
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Profile header */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
            <div className="px-4 py-5 sm:px-6 flex items-center">
              <div className="h-16 w-16 rounded-full overflow-hidden mr-4">
                {
                    !user?
                    <div className=" w-64 h-64 bg-gray-300 animate-pulse">
                    </div>:
                    <img
                    src={user?.avatar || "/default-avatar.png"}
                    alt={user?.fullName}
                    width={64}
                    height={64}
                    className="h-full w-full object-cover"
                    />
                }
              </div>
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">{user?.fullName}</h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">{user?.email}</p>
              </div>
            </div>
          </div>
          <DeleteVideoPopup 
            open = {openDeletePopup} 
            closePopup={() =>{
              setDeletePopup(false)
            }} 
            setVideos={setVideos}
            thumbnail={deleteVideoProps.thumbnail}
            id={deleteVideoProps.id}
          />
          <DeleteTweetPopup 
            open = {openTweetPopup} 
            closePopup={() =>{
              setTweetPopup(false)
            }} 
            setTweets={setTweets}
            id={deleteTweetProps.id}
          />
          {/* Tabs */}
          <div className="border-b border-gray-200 mb-8">
            <nav className="-mb-px flex">
              <button
                onClick={() => setTab('videos')}
                className={`${
                  tab === 'videos'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm mr-8`}
              >
                Videos
              </button>
              <button
                onClick={() => setTab('tweets')}
                className={`${
                  tab === 'tweets'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Tweets
              </button>
            </nav>
          </div>

          {/* Content */}
        {   
          <InfiniteScroll loadMore={loadMore} hasMore={tab === 'videos' ? hasMoreVideos : hasMoreTweets} isLoading={isLoading}>
            {tab === 'videos' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {videos.map((el:any) => (
                  <div key={el._id} className="bg-white border rounded-lg overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105 cursor-pointer">
                    <div  onClick={() => router.replace(`/video/${el._id}`)}>
                      <img
                        src={el.thumbnail}
                        alt={el.title}
                        className="w-full h-48 object-cover"
                      />
                      <div className="p-4">
                        <h2 className="font-bold text-xl mb-2 truncate">{el.title}</h2>
                        <p className="text-gray-700 text-sm line-clamp-3">{el.description}</p>
                      </div>
                    </div>
                    {rootUser && rootUser._id == user._id && <button className="text-white font-bold bg-red-500 h-10 w-full items-center text-center transition-all duration-300 hover:bg-red-900" onClick={()=>deleteVideoPopup(el._id, el.thumbnail)} >Delete</button>}
                  </div>
                ))}
                {isLoading && [1].map((el, ind) => 
                    (<div key={ind}  className="bg-white border rounded-lg overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105 cursor-pointer">
                        <div className=" w-full h-48 bg-gray-200 animate-pulse">
                        </div>
                        <div className="p-4">
                            <h2 className="font-bold text-xl mb-2 truncate bg-gray-200 w-full h-4 rounded-full"></h2>
                            <h2 className="font-bold text-xl mb-2 truncate bg-gray-200 w-full h-4 rounded-full"></h2>
                        </div>
                    </div>)
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {tweets.map((tweet:any) => (
                  <div key={tweet._id} className="(bg-white border rounded-lg p-4 shadow">
                    <p className="text-gray-800">{tweet.content}</p>
                    <div className=" flex justify-between items-center">
                      <p className="text-sm text-gray-500 mt-2">{new Date(tweet.createdAt).toLocaleDateString()}</p>
                      {
                        rootUser && rootUser._id == user._id && 
                      <div onClick={() => {
                        deleteTweetPopup(tweet._id);
                      }} className="hover:text-red-500">
                        <MdDelete />
                      </div>
                      }
                    </div>
                  </div>
                ))}
                {isLoading && [1].map((el:any, ind:any) => (
                    <div key={el} className="bg-white border rounded-lg p-4 shadow">
                        <div className="bg-gray-300 w-full rounded-full animate-pulse h-8"></div>
                        <div className="bg-gray-200 w-16 mt-2  animate-pulse h-4 rounded-full"></div>
                    </div>
                ))}
              </div>
            )}
            
            
          </InfiniteScroll>
        }
      </div>
    )
}

export default AddUser(Profile);