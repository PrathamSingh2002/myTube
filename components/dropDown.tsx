'use client'
import dynamic from 'next/dynamic';

import AddUser from './addUser';
import Link from 'next/link';
// Dynamically import icons from react-icons
const FaUser = dynamic(() => import('react-icons/fa').then(mod => mod.FaUser), { ssr: false });
const FaCog = dynamic(() => import('react-icons/fa').then(mod => mod.FaCog), { ssr: false });
const FaSignOutAlt = dynamic(() => import('react-icons/fa').then(mod => mod.FaSignOutAlt), { ssr: false });
const FaHistory = dynamic(() => import('react-icons/fa').then(mod => mod.FaHistory), { ssr: false });

// Dynamically import components and functions
const DropdownMenu = dynamic(() => import('../components/ui/dropdown-menu').then(mod => mod.DropdownMenu), { ssr: false });
const DropdownMenuTrigger = dynamic(() => import('../components/ui/dropdown-menu').then(mod => mod.DropdownMenuTrigger), { ssr: false });
const DropdownMenuContent = dynamic(() => import('../components/ui/dropdown-menu').then(mod => mod.DropdownMenuContent), { ssr: false });
const DropdownMenuLabel = dynamic(() => import('../components/ui/dropdown-menu').then(mod => mod.DropdownMenuLabel), { ssr: false });
const DropdownMenuSeparator = dynamic(() => import('../components/ui/dropdown-menu').then(mod => mod.DropdownMenuSeparator), { ssr: false });
const DropdownMenuItem = dynamic(() => import('../components/ui/dropdown-menu').then(mod => mod.DropdownMenuItem), { ssr: false });

// Hooks and other functions
import { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { setUser } from '@/app/store/userSlice';

const DropDown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter()
  const dropdownRef = useRef<any>(null);
  const user = useSelector((state: any)=>state.user.userInfo);
  const dispatch = useDispatch();
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
  const logOut = () => {
    window.localStorage.removeItem('user');
    window.localStorage.removeItem('accessToken');
    window.localStorage.removeItem('refreshToken');
    dispatch(setUser(null))
    router.replace('/');
  }
  return (
    <div className=' w-full'  ref={dropdownRef}>
      <DropdownMenu>
        <DropdownMenuTrigger className=' focus:outline-none' asChild>
        <button
          className="flex items-center">
          <div className=' bg-muted p-2 rounded-full sz-8 text-primary transition-all delay-150 hover:bg-primary hover:text-secondary' >
            <FaUser/>
          </div>
        </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <Link href={`/profile/${user?.username}`}>
            <DropdownMenuItem>Profile</DropdownMenuItem>
          </Link>
          <Link href={`/settings`}>
            <DropdownMenuItem>Change profile</DropdownMenuItem>
          </Link>
          <Link href={'/history'}>
            <DropdownMenuItem>History</DropdownMenuItem>
          </Link>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <span className=' flex flex-row items-center space-x-2'>
              <FaSignOutAlt  />
              <span>Log out</span>
            </span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {/* {isOpen && (
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
          <button  onClick={() => {
            logOut()
          }} className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
            <FaSignOutAlt  />
            <span className='ml-3'>
                Logout
            </span>
          </button>
        </div>
      )} */}
    </div>
  );
};

export default AddUser(DropDown);