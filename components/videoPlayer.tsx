'use client';

import { likesVideo } from '@/services/likes';
import { subscribeChannel } from '@/services/subscription';
import React, { useEffect, useRef, useState } from 'react';
import { FaThumbsUp, FaEye, FaPlay, FaPause, FaComment, FaUserCircle, FaBell } from 'react-icons/fa';

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
  const [subscribersCount, setSubscriberCount] = useState(video.subscribersCount);
  const [isSubscribed, setIsSubscribed] = useState(video.isSubscribed);
  const [isLiked, setIsLiked] = useState(video.isLikedByUser);
  const [likesCount, setLikesCount] = useState<any>(video.likesCount);
  const [isPlaying, setIsPlaying] = useState(false);
  const [newComment, setNewComment] = useState('');

  const increaseLike = async () => {
    try {
      const res = await likesVideo(video._id);
      setLikesCount((prev: any) => (isLiked ? prev - 1 : prev + 1));
      setIsLiked((prev) => !prev);
    } catch (err) {
      console.log(err);
    }
  };

  const toggleSubscribe = async () => {
    try {
      await subscribeChannel(video.owner.username);
      setSubscriberCount((prev) => (isSubscribed ? prev - 1 : prev + 1));
      setIsSubscribed((prev) => !prev);
    } catch (err) {
      console.log(err);
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
    <div className="min-h-screen flex flex-col bg-gray-100">
      <div className="flex-grow container mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="relative pb-[56.25%]"> {/* 16:9 Aspect Ratio */}
            <video
              ref={videoRef}
              poster={video.thumbnail}
              className="absolute top-0 left-0 w-full h-full object-cover"
              controls
            >
              <source src={video.videoFile} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <button
              onClick={handlePlayPause}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-4 rounded-full hover:bg-opacity-75 transition-all"
            >
              {isPlaying ? <FaPause size={24} /> : <FaPlay size={24} />}
            </button>
          </div>
          <div className="p-6">
            <h1 className="text-3xl font-bold mb-4 text-gray-800">{video.title}</h1>
            <div className="flex items-center justify-between text-gray-600 mb-4 flex-wrap">
              <div className="flex items-center space-x-6">
                <button 
                  onClick={increaseLike} 
                  className={`flex items-center space-x-1 ${isLiked ? 'text-blue-500' : ''}`}
                >
                  <FaThumbsUp /> <span>{likesCount}</span>
                </button>
                <span className="flex items-center space-x-1">
                  <FaEye /> <span>{video.views || 0}</span>
                </span>
                <span>{formatDuration(video.duration)}</span>
              </div>
              <div className="flex items-center space-x-4 mt-4 md:mt-0">
                <img src={video.owner.avatar} alt={video.owner.fullName} className="w-12 h-12 rounded-full" />
                <div>
                  <p className="font-semibold">{video.owner.fullName}</p>
                  <p className="text-sm">{subscribersCount} subscribers</p>
                </div>
                <button
                  onClick={toggleSubscribe}
                  className={`px-4 py-2 rounded-full text-sm font-medium ${
                    isSubscribed 
                      ? 'bg-gray-200 text-gray-800 hover:bg-gray-300' 
                      : 'bg-red-600 text-white hover:bg-red-700'
                  }`}
                >
                  {isSubscribed ? 'Subscribed' : 'Subscribe'}
                </button>
              </div>
            </div>
            <p className="text-gray-700 mb-6">{video.description}</p>
            <div className="border-t pt-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <FaComment /> Comments ({video.commentsCount})
              </h2>
              <form onSubmit={handleCommentSubmit} className="mb-6">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="w-full p-3 border rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  placeholder="Add a comment..."
                />
                <button
                  type="submit"
                  className="mt-2 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Post Comment
                </button>
              </form>
              {/* Placeholder for comments list */}
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 text-gray-400">
                    <FaUserCircle />
                  </div>
                  <div>
                    <p className="font-semibold">John Doe</p>
                    <p className="text-gray-600">Great video! Thanks for sharing.</p>
                  </div>
                </div>
                {/* Add more placeholder comments as needed */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
