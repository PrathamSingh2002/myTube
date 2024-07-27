"use client"
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from "jwt-decode";
import Error from 'next/error';
import { refreshTokenService } from '@/services/user';
const withAuth = (WrappedComponent:any) => {
    return (props:any) => {
        const [isAuthenticated, setIsAuthenticated] = useState("loading")
        const router = useRouter();
        const regenerateAccessToken = async () => {
            try{
                const res = await refreshTokenService({});
                if(res.data && res.data.accessToken && res.data.refreshToken){
                    window.localStorage.setItem('accessToken', JSON.stringify(res.data.accessToken));
                    window.localStorage.setItem('refreshToken', JSON.stringify(res.data.refreshToken));
                    return true;
                }else {
                    return false;
                }
            }catch(err){
                return false;
            }
        }
        const checkAuth = async () => {
            const data = window.localStorage.getItem('accessToken');
            if(!data){
                return false;
            }else{
                try{
                    const decodedToken = jwtDecode(JSON.parse(data));
                    const currentTime = Date.now() / 1000;
                    if(!decodedToken.exp){
                        return false;
                    }else{
                        if(decodedToken.exp < currentTime){
                            const res = await regenerateAccessToken();
                            return res;
                        }else{
                            return true;
                        };
                    }
                }
                catch(err){
                    return false;
                }
            }
        }
        useEffect(() => {
            const valid = checkAuth();
            if(!valid){
                router.push('/login');
                setIsAuthenticated('false');
            }else{
                setIsAuthenticated('true');
            }
        }, [router]);

        if(isAuthenticated == 'loading'){
            return <div>Loading ... </div>
        }else if(isAuthenticated == 'true'){
            return <WrappedComponent {...props}/>
        }
        else {
            return <Error statusCode={404}/>
        }
    };
};

export default withAuth;