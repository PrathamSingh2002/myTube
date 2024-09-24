"use client"
import { useEffect, useState, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import withAuth from "@/components/auth";
import AddUser from "@/components/addUser";
import { searchVideo } from "@/services/video";
import { getRecommendedVideos } from "@/services/home";
import { setRecommendedVideos, setSearchQuery, setVideoPage, setVideos } from "../store/videoSlice";
import { useRouter } from "next/navigation";
import VideoCard from "@/components/videocard";

function Home() {
    const user = useSelector((state:any) => state.user.userInfo);
    const videoData = useSelector((state:any) => state.video.videos);
    const videoPage  = useSelector((state:any) => state.video.videoPage);
    const searchQuery = useSelector((state:any) => state.video.searchQuery)
    const recommendedVideos  = useSelector((state:any) => state.video.recommendedVideos);
    const [channelPage, setChannelPage] = useState(1);
    const [isVideoLoading, setIsVideoLoading] = useState(false);
    const [hasMoreVideos, setHasMoreVideos] = useState(true);
    const dispatch = useDispatch();
    const router = useRouter();
    const videoObserver = useRef<IntersectionObserver | null>(null);
    
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

    function formatDuration(seconds:number) {
        // Convert float to integer by flooring the value
        seconds = Math.floor(seconds);
    
        // Calculate hours, minutes, and seconds
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
    
        // Format minutes and seconds to always be two digits
        const formattedMins = String(mins).padStart(2, '0');
        const formattedSecs = String(secs).padStart(2, '0');
    
        // If hours are greater than 0, return hh:mm:ss
        if (hrs > 0) {
            const formattedHrs = String(hrs).padStart(2, '0');
            return `${formattedHrs}:${formattedMins}:${formattedSecs}`;
        }
        
        // If minutes are greater than 0, return mm:ss
        if (mins > 0) {
            return `${formattedMins}:${formattedSecs}`;
        }
        
        // Otherwise, return ss
        return `0:${formattedSecs}`;
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
                dispatch(setRecommendedVideos([...recommendedVideos, ...res.data.videos]));
            } else {
                setHasMoreVideos(false);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsVideoLoading(false);
        }
    }

    useEffect(() => {
        if (user && user._id) {
            // fetchChannels(channelPage);
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
            dispatch(setVideoPage(videoPage+1));
        }
    }

    return (
        <div className=" ml-8 mr-8">
            <div className="mb-4">
                <div className="grid grid-cols-1  lg:grid-cols-2 xl:grid-cols-3 gap-x-4 gap-y-8">
                    {(searchQuery ? videoData : recommendedVideos).map((el: any, indx: number) => (
                        <div key={indx} 
                            ref={indx === (searchQuery ? videoData : recommendedVideos).length - 1 ? lastVideoElementRef : null}
                            className="" 
                            onClick={() => router.replace(`/video/${el._id}?from=home`)}>
                            <VideoCard videoData={el} />
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