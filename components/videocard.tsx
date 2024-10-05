'use client'
import CustomImage from "./Image";

export default function VideoCard({videoData}:{videoData:any}) {
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

    return (
    <div >
        <div className=" mb-4 relative group hover:rounded-none hover:scale-[1.01] transition-all delay-300">
            <CustomImage
                src={videoData.thumbnail}
                className="aspect-video rounded-md hover:rounded-none"
            />
            <div className="absolute rounded-sm right-1 bottom-1  bg-black bg-opacity-60 text-white text-[14px] font-medium p-[1px] pl-[4px] pr-[4px] group-hover:opacity-0 group-hover:transition-all delay-300">{formatDuration(videoData.duration)}</div>
        </div>
        <div className=" flex flex-row gap-2">
            <div className=" flex flex-col justify-start size-12 w-12 flex-shrink-0">
                <CustomImage className=" aspect-square rounded-full size-12" src={videoData?.owner?.avatar?videoData?.owner?.avatar:videoData?.owner?.[0]?.avatar} />
            </div>
            <div className=" flex flex-col justify-center overflow-hidden">
                <div className=" text-sm font-semibold">{videoData.title}</div>
                <div className=" text-xs text-muted-foreground font-medium">{videoData?.owner?.username?videoData?.owner?.username:videoData?.owner?.[0]?.username}</div>
                <div className=" flex flex-row text-xs text-muted-foreground font-medium">
                    <div className="">{formatViews(videoData.views) +" views"}</div>
                    <div className="ml-1 mr-1">{" · "}</div>
                    <div className="">{timeAgo(videoData.createdAt)}</div>
                </div>
            </div>
        </div>
    </div>
  )
}
