'use client'
import { IoIosAdd } from "react-icons/io";
import { RiVideoUploadFill } from "react-icons/ri";
import { MdMessage } from "react-icons/md";
import dynamic from 'next/dynamic';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link'
const DropdownMenu = dynamic(() => import('../components/ui/dropdown-menu').then(mod => mod.DropdownMenu), { ssr: false });
const DropdownMenuTrigger = dynamic(() => import('../components/ui/dropdown-menu').then(mod => mod.DropdownMenuTrigger), { ssr: false });
const DropdownMenuContent = dynamic(() => import('../components/ui/dropdown-menu').then(mod => mod.DropdownMenuContent), { ssr: false });
const DropdownMenuItem = dynamic(() => import('../components/ui/dropdown-menu').then(mod => mod.DropdownMenuItem), { ssr: false });
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
    <div className="w-full" ref={dropdownRef}>
      <DropdownMenu>
        <DropdownMenuTrigger className=' focus:outline-none' asChild>
          <button
            className="flex items-center ">
            <div className=' flex size-8 bg-accent p-2 rounded-full transition-all delay-100 text-primary hover:bg-primary hover:text-secondary'>
              <IoIosAdd/>
            </div>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent >
          <DropdownMenuItem>
            <Link href={`/upload`} className=' flex flex-row items-center' >
              <RiVideoUploadFill/>
              <span className=' ml-2'>
                  Video
              </span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <div onClick={() => SetPopup(true)} className=' flex flex-row items-center'>
              <MdMessage/>
              <span className='ml-2'>
                  Tweet
              </span>
              {/* <TweetPopup
                  isOpen = {popUp}
                  onClose ={()=>SetPopup(false)}
                  submitButtonText="Tweet"
              /> */}
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
        
      </DropdownMenu>
    </div>
  );
};

export default VideoUploadDropDown;