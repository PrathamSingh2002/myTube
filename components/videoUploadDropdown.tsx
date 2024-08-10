'use client'
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import { RiVideoUploadFill } from 'react-icons/ri';
import { MdMessage } from 'react-icons/md';
import dynamic from 'next/dynamic';
import { FaUpload } from 'react-icons/fa';
const TweetPopup = dynamic(()=>import('./tweetPopUp'), {ssr:false});

const VideoUploadDropDown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [popUp, SetPopup] = useState(false);

  const dropdownRef = useRef<any>(null);
  useEffect(() => {
    const handleClickOutside = (event:any) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  return (
    <div className="relative z-20" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center text-sm font-medium"
      >
        <span className="sr-only">Open user menu</span>
        <div className=' flex text-sm text-gray-500 hover:text-gray-800 transition duration-150 ease-in-out'>
            <span className='mr-2'>
                <FaUpload/>
            </span>
            <span>
                Upload
            </span>
        </div>
      </button>

      {isOpen && (
        <div className=" absolute   mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
          <Link href={`/upload`} className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
          <RiVideoUploadFill />
            <span className='ml-3'>
                Video
            </span>
          </Link>
          <div className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => SetPopup(true)}>
            <MdMessage />
            <span className='ml-3'>
                Tweet
            </span>
            <TweetPopup
                isOpen = {popUp}
                onClose ={()=>SetPopup(false)}
                submitButtonText="Tweet"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoUploadDropDown;