'use client'
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { FaUser, FaCog, FaSignOutAlt, FaHistory } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import AddUser from './addUser';
import { IoReorderThree } from 'react-icons/io5';

const DropDown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<any>(null);
  const user = useSelector((state: any)=>state.user.userInfo);
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
    <div className="relative " ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center text-sm font-medium"
      >
        <span className="sr-only">Open user menu</span>
        <div className=' text-xl text-gray-500 hover:text-gray-800 transition duration-150 ease-in-out'>
          <IoReorderThree />
        </div>
      </button>

      {isOpen && (
        <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-20">
          <Link href={`/profile/${user?.username}`} className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setIsOpen(!isOpen)}
        >
            <FaUser/>
            <span className='ml-3'>
                Profile
            </span>
          </Link>
          <Link href="/settings" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setIsOpen(!isOpen)}
        >
            <FaCog  />
            <span className='ml-3'>
                Change profile
            </span>
          </Link>
          <Link onClick={() => setIsOpen(!isOpen)}
         href="/history" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
            <FaHistory  />
            <span className='ml-3'>
                Watch History
            </span>
          </Link>
          <button  onClick={() => {/* Implement logout logic */}} className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
            <FaSignOutAlt  />
            <span className='ml-3'>
                Logout
            </span>
          </button>
        </div>
      )}
    </div>
  );
};

export default AddUser(DropDown);