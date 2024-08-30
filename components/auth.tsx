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
                            return false;
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
        const validCheckAndMove = async () => {
            const valid = await checkAuth();
            if(!valid){
                router.push('/login');
                setIsAuthenticated('false');
            }else{
                setIsAuthenticated('true');
            }
        }
        useEffect(() => {
            validCheckAndMove();
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