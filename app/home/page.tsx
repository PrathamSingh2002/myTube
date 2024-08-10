"use client"
import { useEffect, useState, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import withAuth from "@/components/auth";
import AddUser from "@/components/addUser";
import { searchVideo } from "@/services/video";
import { getRecommendedVideos } from "@/services/home";
import { setVideos } from "../store/videoSlice";
import { useRouter } from "next/navigation";
import { getSubscribedChannels } from "@/services/subscription";
import { FiChevronLeft, FiChevronRight, FiSearch, FiPlay } from 'react-icons/fi';

function Home() {
    const user = useSelector((state:any) => state.user.userInfo);
    const videoData = useSelector((state:any) => state.video.videos);
    const [videoPage, setVideoPage] = useState(1);
    const [channelPage, setChannelPage] = useState(1);
    const [isVideoLoading, setIsVideoLoading] = useState(false);
    const [isChannelLoading, setIsChannelLoading] = useState(false);
    const [hasMoreVideos, setHasMoreVideos] = useState(true);
    const [hasMoreChannels, setHasMoreChannels] = useState(true);
    const [inputVideo, setInputVideo] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [channels, setChannels] = useState<any>([]);
    const [recommendedVideos, setRecommendedVideos] = useState<any>([]);
    const dispatch = useDispatch();
    const router = useRouter();
    const channelsRef = useRef<HTMLDivElement>(null);
    const videoObserver = useRef<IntersectionObserver | null>(null);
    const channelObserver = useRef<IntersectionObserver | null>(null);

    function formatViews(num:number) {
        if(!num) return;
        if (num >= 1e9) {
            return (num / 1e9).toFixed(1) + 'B';
        } else if (num >= 1e6) {
            return (num / 1e6).toFixed(1) + 'M';
        } else if (num >= 1e3) {
            return (num / 1e3).toFixed(1) + 'K';
        } else {
            return num.toString();
        }
    }

    function timeAgo(dbDate: string): string {
        const date = new Date(dbDate);
        const now = new Date();
        const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
        const intervals: { [key: string]: number } = {
            year: 31536000,
            month: 2592000,
            week: 604800,
            day: 86400,
            hour: 3600,
            minute: 60,
            second: 1
        };
    
        for (const [key, value] of Object.entries(intervals)) {
            const interval = Math.floor(seconds / value);
            if (interval > 1) {
                return `${interval} ${key}s ago`;
            } else if (interval === 1) {
                return `1 ${key} ago`;
            }
        }
    
        return "just now";
    }

    const lastVideoElementRef = useCallback((node: HTMLDivElement) => {
        if (isVideoLoading) return;
        if (videoObserver.current) videoObserver.current.disconnect();
        videoObserver.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMoreVideos) {
                loadMoreVideos();
            }
        });
        if (node) videoObserver.current.observe(node);
    }, [isVideoLoading, hasMoreVideos]);

    const lastChannelElementRef = useCallback((node: HTMLDivElement) => {
        if (isChannelLoading) return;
        if (channelObserver.current) channelObserver.current.disconnect();
        channelObserver.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMoreChannels) {
                loadMoreChannels();
            }
        });
        if (node) channelObserver.current.observe(node);
    }, [isChannelLoading, hasMoreChannels]);

    const fetchVideos = async (query: string, page: number) => {
        try {
            setIsVideoLoading(true);
            const res = await searchVideo(query, page);
            if (res?.data?.data) {
                setHasMoreVideos((res.data.data.length === 5));
                dispatch(setVideos(page === 1 ? res.data.data : [...videoData, ...res.data.data]));
            } else {
                setHasMoreVideos(false);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsVideoLoading(false);
        }
    }

    const fetchRecommendedVideos = async (page:any) => {
        try {
            setIsVideoLoading(true);
            const res = await getRecommendedVideos(page);
            if (res?.data?.videos) {
                setHasMoreVideos(res.data.videos.length === 5);
                setRecommendedVideos((prevVideos:any) => ([...prevVideos, ...res.data.videos]));
            } else {
                setHasMoreVideos(false);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsVideoLoading(false);
        }
    }

    const fetchChannels = async (page: number) => {
        try {
            setIsChannelLoading(true);
            const res = await getSubscribedChannels(user._id, page);
            if (res && res.data) {
                setHasMoreChannels(res.data.length === 5);
                setChannels((prevChannels:any) => [...prevChannels, ...res.data]);
            } else {
                setHasMoreChannels(false);
            }
        } catch (err) {
            setHasMoreChannels(false);
            console.error(err);
        } finally {
            setIsChannelLoading(false);
        }
    }

    useEffect(() => {
        if (user && user._id) {
            fetchChannels(channelPage);
        }
    }, [user?._id, channelPage])

    useEffect(() => {
        if (!searchQuery) {
            fetchRecommendedVideos(videoPage);
        } else {
            fetchVideos(searchQuery, videoPage);
        }
    }, [videoPage, searchQuery])

    const loadMoreVideos = () => {
        if (hasMoreVideos && !isVideoLoading) {
            setVideoPage(prev => prev + 1);
        }
    }

    const loadMoreChannels = () => {
        if (hasMoreChannels && !isChannelLoading) {
            setChannelPage(prev => prev + 1);
        }
    }

    const goToProfile = (username:string) => {
        router.replace('profile/'+username);
    }

    const scrollChannels = (direction: 'left' | 'right') => {
        if (channelsRef.current) {
            const scrollAmount = channelsRef.current.offsetWidth;
            channelsRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    }

    return (
        <div className="container mx-auto px-4 py-8 bg-gray-100">
            <div className="flex flex-col md:flex-row mb-8">
                <div className="relative flex-grow mb-4 md:mb-0 md:mr-4">
                    <input 
                        className="w-full p-4 pr-12 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300" 
                        onChange={(ev) => setInputVideo(ev.target.value)}
                        placeholder="Search videos..."
                    />
                    <div className="h-6 w-6 text-gray-400 absolute right-4 top-1/2 transform -translate-y-1/2" >
                        <FiSearch size={24} />
                    </div>
                </div>
                <button 
                    className="px-8 py-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-md"
                    onClick={() => {
                        dispatch(setVideos([]));
                        setRecommendedVideos([]);
                        setVideoPage(1);
                        setSearchQuery(inputVideo);
                    }}
                >
                    Search
                </button>
            </div>
            <div className="mb-4 relative">
                <h2 className="text-3xl font-bold mb-8 text-gray-800">Subscribed Channels</h2>
                <div className="flex items-center">
                    <button 
                        onClick={() => scrollChannels('left')}
                        className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white p-3 rounded-full shadow-lg z-10 focus:outline-none hover:bg-gray-100 transition-colors duration-300"
                        aria-label="Scroll left"
                    >   <div className="text-gray-600">
                            <FiChevronLeft size={24}  />
                        </div>
                    </button>
                    <div 
                        ref={channelsRef}
                        className="flex overflow-x-auto scrollbar-hide pb-6 space-x-6 px-12" 
                    >
                        {channels.map((el: any, i: number) => (
                            <div 
                                className="flex-shrink-0 hover:cursor-pointer transition-transform duration-300" 
                                key={i} 
                                ref={i === channels.length - 1 ? lastChannelElementRef : null} 
                                onClick={() => goToProfile(el?.channelsSubscribedTo?.[0]?.username)}
                            >
                                <div className="w-28 h-28 relative group">
                                    <img 
                                        className="w-full h-full rounded-full object-cover transition-all duration-300 group-hover:shadow-xl" 
                                        src={`${el?.channelsSubscribedTo?.[0]?.avatar}`} 
                                        alt={`${el?.channelsSubscribedTo?.[0]?.username}'s avatar`}
                                    />
                                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 rounded-full transition-all duration-300 flex items-center justify-center">
                                        <span className="text-white text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300">View Profile</span>
                                    </div>
                                </div>
                                <p className="mt-3 text-center text-sm font-medium text-gray-700 truncate max-w-[112px]">
                                    {el?.channelsSubscribedTo?.[0]?.username}
                                </p>
                            </div>
                        ))}
                        {isChannelLoading && 
                            Array(1).fill(0).map((_, index) => (
                                <div key={`skeleton-${index}`} className="flex-shrink-0 w-28 animate-pulse">
                                    <div className="w-28 h-28 bg-gray-200 rounded-full"></div>
                                    <div className="mt-3 h-4 bg-gray-200 rounded w-20 mx-auto"></div>
                                </div>
                            ))
                        }
                    </div>
                    <button 
                        onClick={() => scrollChannels('right')}
                        className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white p-3 rounded-full shadow-lg z-10 focus:outline-none hover:bg-gray-100 transition-colors duration-300"
                        aria-label="Scroll right"
                    >
                        <div className="text-gray-600">
                            <FiChevronRight size={24} />
                        </div>
                    </button>
                </div>
            </div>
            <div className="mb-4">
                <h1 className="text-4xl font-bold mb-8 text-gray-800">
                    {searchQuery ? "Search Results" : "Recommended Videos"}
                </h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {(searchQuery ? videoData : recommendedVideos).map((el: any, indx: number) => (
                        <div 
                            key={indx} 
                            ref={indx === (searchQuery ? videoData : recommendedVideos).length - 1 ? lastVideoElementRef : null}
                            className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer" 
                            onClick={() => router.replace(`/video/${el._id}?from=home`)}
                        >
                            <div className="relative pb-[56.25%]">
                                <img
                                    src={el.thumbnail}
                                    alt={el.title}
                                    className="absolute inset-0 w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                                    <div className="text-white text-4xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" >
                                        <FiPlay size={48} />
                                    </div>
                                </div>
                            </div>
                            <div className="p-6">
                                <h2 className="font-bold text-xl mb-3 text-gray-800 line-clamp-2">{el.title}</h2>
                                <div className=" flex items-center mb-2">
                                    <img className="w-10 h-10 rounded-full mr-2" src={searchQuery ? el?.owner?.[0]?.avatar : el?.owner?.avatar} />
                                    <div className=" flex-col justify-between items-center">
                                        <div className="text-gray-600 text-sm font-bold">{searchQuery ? el?.owner?.[0]?.username : el?.owner?.username}</div>
                                        <div className=" flex items-center">
                                            <div className="mr-1 text-gray-600 text-xs">{formatViews(el.views) +" views"}</div>
                                            <div className="mr-1 text-gray-600  text-lg">{" · "}</div>
                                            <div className=" text-gray-600 text-xs">{timeAgo(el.createdAt)}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                {isVideoLoading && 
                    <div className="flex justify-center items-center mt-8">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                }
            </div>
        </div>
    );
}

export default withAuth(AddUser(Home));