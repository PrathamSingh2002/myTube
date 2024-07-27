// User.tsx
'use client'
import Link from 'next/link'
import React from 'react'
import { useSelector } from 'react-redux'
import { FaUser, FaSignInAlt } from 'react-icons/fa'

export default function User() {
  const user = useSelector((state:any) => state.user.isAuthenticated)  
  return (
    <div>
      {!user ? (
        <Link href="/login" className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out">
          <div className="mr-2" >
            <FaSignInAlt />
          </div>
          Login
        </Link>
      ) : (
        <Link href="/profile" className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-600 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out">
          <div className="mr-2">
            <FaUser  />
          </div>
          Profile
        </Link>
      )}
    </div>
  )
}