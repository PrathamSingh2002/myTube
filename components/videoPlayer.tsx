'use client';

import { likesVideo } from '@/services/likes';
import { subscribeChannel } from '@/services/subscription';
import React, { useEffect, useRef, useState } from 'react';
import { FaThumbsUp, FaEye, FaPlay, FaPause, FaComment, FaUserCircle, FaBell, FaRegThumbsUp, FaRegBellSlash } from 'react-icons/fa';
import AddUser from './addUser';
import CustomImage from './Image';
import { Button } from './ui/button';
import { Input } from './ui/input';

interface VideoPlayerProps {
  video: {
    _id: string;
    videoFile: string;
    thumbnail: string;
    title: string;
    description: string;
    duration: number;
    isPublished: boolean;
    isSubscribed: boolean;
    createdAt: string;
    updatedAt: string;
    likes: any[];
    likesCount: number;
    commentsCount: number;
    isLikedByUser: boolean;
    subscribersCount: number;
    owner: {
      _id: string;
      username: string;
      fullName: string;
      avatar: string;
    };
    views?: number;
  };
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ video }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [updatingLikes, setUpdatingLikes] = useState(false);
  const [togglingSubscribe, setTogglingSubscribe] = useState(false);
  const [subscribersCount, setSubscriberCount] = useState(video.subscribersCount);
  const [isSubscribed, setIsSubscribed] = useState(video.isSubscribed);
  const [isLiked, setIsLiked] = useState(video.isLikedByUser);
  const [likesCount, setLikesCount] = useState<any>(video.likesCount);
  const [isPlaying, setIsPlaying] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [commentText,setCommentText] = useState('');

  const increaseLike = async () => {
    setUpdatingLikes(true);
    try {
      const res = await likesVideo(video._id);
      setLikesCount((prev: any) => (isLiked ? prev - 1 : prev + 1));
      setIsLiked((prev) => !prev);
    } catch (err) {
      console.log(err);
    }finally{
      setUpdatingLikes(false);
    }
  };
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
  const toggleSubscribe = async () => {
    setTogglingSubscribe(true);
    try {
      await subscribeChannel(video.owner.username);
      setSubscriberCount((prev) => (isSubscribed ? prev - 1 : prev + 1));
      setIsSubscribed((prev) => !prev);
    } catch (err) {
      console.log(err);
    }finally{
      setTogglingSubscribe(false);
    }
  };

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  const formatDuration = (duration: number) => {
    const minutes = Math.floor(duration / 60);
    const seconds = Math.floor(duration % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('New comment:', newComment);
    setNewComment('');
  };

  return (
    <div className='w-full flex flex-col '>
      <div className='w-full pl-8 pr-8 grid grid-cols-1 gap-4 md:grid-cols-[2fr_1fr]'>
        <div className=' w-full'>
          <div className=' w-full mb-2'>
            <video
              ref={videoRef}
              poster={video.thumbnail}
              className="w-full aspect-video rounded-md box-border"
              controls
              autoPlay
            >
              <source src={video.videoFile} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
          <div className='mb-1 overflow-hidden'>
            <div className=" text-lg font-semibold">{video.title}</div>
          </div>
          <div className=' flex items-ceter flex-col sm:flex-row'>
            <div className=" flex flex-row gap-1 items-center mr-8 max-sm:mb-2">
                <div className=" flex flex-col justify-start flex-shrink-0 ">
                    <CustomImage className=" shadow aspect-square rounded-full size-12" src={video.owner.avatar} />
                </div>
                <div className=" overflow-hidden max-w-24 ">
                    <div className=" text-sm font-semibold truncate">{video.owner.username}dddddsdsdsd</div>
                    <div className=" text-xs text-muted-foreground">{formatViews(video.subscribersCount) + " subscribers"}</div>
                </div>
            </div>
            <div className=' flex flex-row gap-1 items-center'>
              <Button disabled = {togglingSubscribe} size={'sm'} className={` font-semibold rounded-full ${isSubscribed && "bg-muted text-primary hover:bg-gray-300 border-[1px] border-primary"} `} onClick={toggleSubscribe}>
                <FaRegBellSlash className= {` mr-1 ${!isSubscribed && "hidden"}`} />
                <div className={ `font-semibold ${isSubscribed && "text-primary"}`}>
                  {isSubscribed?"subscribed":'subscribe'}
                </div>
              </Button>
              <Button disabled = {updatingLikes} size={'sm'} className='rounded-full bg-muted border-[1px] border-primary hover:bg-gray-300' onClick={increaseLike}>
                <FaThumbsUp className={`mr-1 text-primary ${!isLiked && 'hidden'}`} />
                <FaRegThumbsUp className={`mr-1 text-primary ${isLiked && 'hidden'}`} />
                <div className=' text-primary font-semibold'>{formatViews(likesCount)}</div>
              </Button>
            </div>
          </div>
        </div>
        <div className=' flex items-center flex-col gap-2'>
          <div>
            <div className='font-semibold'>{video.commentsCount} comments</div>
          </div>
          <div className=' w-full flex flex-row gap-2'>
            <Input placeholder='Add comment...' onChange={(ev)=>{
              setCommentText(ev.target.value)
            }}></Input>
            <Button disabled = {commentText === ''}  variant={'ghost'}>Submit</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddUser(VideoPlayer);
