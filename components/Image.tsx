"use client"
import { useState } from 'react'
import { Skeleton } from './ui/skeleton';

export default function CustomImage({src, className}:{src:string, className:string}) {
    const [loading, setLoading] = useState(true);
    const disableLoading = () => {
    setLoading(false);
    }
    return (
        <>
            <img className={` ${loading && "hidden"} ${className}`} src = {src} onLoad={disableLoading}></img>
            <Skeleton className={` ${!loading && "hidden"} ${className}`}></Skeleton>
        </>
    )
}
