'use client'

import { setUser } from "@/app/store/userSlice"
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux"

export default function AddUser(WrappedComponent:any) {
    return (props:any) => {
        const dispatch = useDispatch();
        const user = useSelector((state:any) => state.video.user);
        const router = useRouter()
        useEffect(()=>{
            const data = window.localStorage.getItem('user');
            if(data){
                if(!user){
                    dispatch(setUser(JSON.parse(data)));
                }
            }else{
                router.replace('/login')
            }
        },[])
        return <WrappedComponent {...props}/>
    }
}
