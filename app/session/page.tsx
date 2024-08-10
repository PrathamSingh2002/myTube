"use client"
import { jwtDecode } from 'jwt-decode';
import React, { useEffect, useState } from 'react'
import { refreshTokenService } from '@/services/user';

export default function Session() {
  const [status, setStatus] = useState('Checking session...');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [canRegenerateToken, setCanRegenerateToken] = useState(false);

  const checkAccessExpiry = () => {
    const accessToken = window.localStorage.getItem('accessToken');
    if(accessToken){
      try{
        const decodedToken = jwtDecode(JSON.parse(accessToken));
        const currentTime = Date.now() / 1000;
        if(!decodedToken.exp){
          return false;
        }else{
          return decodedToken.exp > currentTime;
        }
      }
      catch(err){
        return false;
      }
    }else return false;
  }

  const checkRefreshExpiry = () => {
    const refreshToken = window.localStorage.getItem('refreshToken');
    if(refreshToken){
      try{
        const decodedToken = jwtDecode(JSON.parse(refreshToken));
        const currentTime = Date.now() / 1000;
        if(!decodedToken.exp){
          return false;
        }else{
          return decodedToken.exp > currentTime;
        }
      }
      catch(err){
        return false;
      }
    }else return false;
  }

  const regenerateToken = async () => {
    setStatus('Regenerating token...');
    try {
      const response = await refreshTokenService({});
      if (response?.data) {
        window.localStorage.setItem('accessToken', JSON.stringify(response.data.accessToken));
        window.localStorage.setItem('refreshToken', JSON.stringify(response.data.accessToken));
        setStatus('Token regenerated successfully');
        setCanRegenerateToken(false);
      } else {
        setStatus('Failed to regenerate token');
        setIsLoggedIn(false);
      }
    } catch (error) {
      setStatus('Error regenerating token');
      setIsLoggedIn(false);
    }
  }

  useEffect(() => {
    if(checkAccessExpiry()){
      setStatus('Logged in');
      setIsLoggedIn(true);
    }else{
      if(checkRefreshExpiry()){
        setStatus('Access token expired. Click to regenerate.');
        setCanRegenerateToken(true);
      }else{
        setStatus('Session expired. Please log in again.');
        setIsLoggedIn(false);
      }
    }
  },[])  

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-100">
      <div className="p-8 max-w-md w-full bg-white rounded-xl shadow-lg space-y-6">
        <h1 className="text-3xl font-bold text-center text-gray-800">Session Status</h1>
        <p className="text-center text-lg text-gray-600">{status}</p>
        <div className="flex justify-center">
          {!isLoggedIn && (
            <button 
              onClick={() => window.location.href = '/login'}
              className="px-6 py-3 bg-blue-500 text-white text-lg font-semibold rounded-lg hover:bg-blue-600 transition duration-300 w-full"
            >
              Login
            </button>
          )}
          {canRegenerateToken && (
            <button 
              onClick={regenerateToken}
              className="px-6 py-3 bg-green-500 text-white text-lg font-semibold rounded-lg hover:bg-green-600 transition duration-300 w-full"
            >
              Regenerate Token
            </button>
          )}
        </div>
      </div>
    </div>
  )
}