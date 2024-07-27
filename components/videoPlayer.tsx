// components/VideoPlayer.tsx

'use client';

import React, { useRef, useState } from 'react';
import { FaThumbsUp, FaEye, FaPlay, FaPause, FaComment, FaUserCircle } from 'react-icons/fa';

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
    subscribersCount: number;
    owner: {
      _id: string;
      username: string;
      fullName: string;
      avatar: string;
    };
    views?: number; // Added this as it wasn't in the provided structure
  };
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ video }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [newComment, setNewComment] = useState('');

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
    <div className="max-w-4xl mx-auto p-6 bg-gray-100 rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold mb-4 text-gray-800">{video.title}</h1>
      <div className="relative">
        <video
          ref={videoRef}
          poster={video.thumbnail}
          className="w-full rounded-lg shadow-md"
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
      <div className="mt-4 flex items-center justify-between text-gray-600">
        <div className="flex items-center space-x-4">
          <span className="flex items-center">
            <span className="mr-2"><FaThumbsUp /></span> {video.likesCount}
          </span>
          <span className="flex items-center">
            <span className="mr-2"><FaEye /></span> {video.views || 0}
          </span>
          <span>{formatDuration(video.duration)}</span>
        </div>
        <div className="flex items-center">
          <img src={video.owner.avatar} alt={video.owner.fullName} className="w-10 h-10 rounded-full mr-2" />
          <div>
            <p className="font-semibold">{video.owner.fullName}</p>
            <p className="text-sm">{video.subscribersCount} subscribers</p>
          </div>
        </div>
      </div>
      <p className="mt-4 text-gray-700">{video.description}</p>
      <div className="mt-6">
        <h2 className="text-2xl font-semibold mb-4 flex items-center">
          <span className="mr-2"><FaComment /></span> Comments ({video.commentsCount})
        </h2>
        <form onSubmit={handleCommentSubmit} className="mb-4">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="w-full p-2 border rounded-lg resize-none"
            rows={3}
            placeholder="Add a comment..."
          />
          <button
            type="submit"
            className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Post Comment
          </button>
        </form>
        {/* Since we don't have actual comments in the new structure, I've removed the comment list */}
      </div>
    </div>
  );
};

export default VideoPlayer;