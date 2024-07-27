'use client'

import { setUser } from "@/app/store/userSlice"
import { useEffect } from "react";
import { useDispatch } from "react-redux"

export default function AddUser(WrappedComponent:any) {
    return (props:any) => {
        const dispatch = useDispatch();
        useEffect(()=>{
            const data = window.localStorage.getItem('user');
            if(data){
                dispatch(setUser(JSON.parse(data)));
            }
        })
        return <WrappedComponent {...props}/>
    }
}
