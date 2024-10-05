"use client"

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

export default function Home() {
  const router = useRouter();
  useEffect(()=>{
    if (typeof window !== "undefined" && "IntersectionObserver" in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if(entry.isIntersecting){
            entry.target.classList.add('show')
          }
        })
      })
      const el = document.getElementsByClassName('animateScroll');
      for(var i=0;i<el.length;i++){
        observer.observe(el[i]);
      }
    }
  },[])
  return (
    <div className=" grid grid-cols-1 font-bold pl-8 pr-8">
      <div className=" opacity-0 animateScroll h-screen  items-center grid grid-cols-1  lg:grid lg:grid-cols-2">
        <div className=" max-lg:text-4xl lg:text-6xl ">
          {/* <div className="mb-4">
            <span className=" text-blue-600">
              H
            </span>
            <span>Video</span>
          </div> */}
            Unleash Your Creativity with <span className=" text-blue-500">Seamless </span>Video Hosting
        </div>
        <img className=" relative opacity-0  rounded shadow-2xl shadow-blue-500  aspect-video " src={'img1.jpg'}>
        </img>
      </div>
      <div className=" opacity-0 animateScroll grid  lg:grid-cols-2   items-center  h-screen">
        <div className=" max-lg:text-4xl lg:text-6xl ">Focus on <span className="text-green-500">Content</span>, Not Ads</div>
        <img className=" opacity-0  rounded shadow-2xl shadow-green-500  aspect-video " src={'img2.jpg'}>
        </img>
      </div>
      <div className=" opacity-0 animateScroll grid grid-cols-1 lg:grid-cols-2  items-center h-screen ">
        <div className="max-lg:text-4xl lg:text-6xl ">
          <div>
            Build, Share, and <span className=" text-amber-500">Grow</span> with Like-Minded Creators
          </div>
          <Button size={'lg'}  className=" font-semibold text-xl" onClick={()=>router.push('/login')}>Start Using</Button>
        </div>
        <img className=" opacity-0   rounded shadow-2xl shadow-amber-500  aspect-video " src={'img3.jpg'}>
        </img>
      </div>
    </div>
  );
}
