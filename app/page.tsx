"use client";

import { useEffect } from "react";

export default function HomeClient() {
  useEffect(() => {
    if (typeof window !== "undefined" && "IntersectionObserver" in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("show");
            observer.unobserve(entry.target);
          }
        });
      });

      const elements = document.getElementsByClassName("animateScroll");
      for (let i = 0; i < elements.length; i++) {
        observer.observe(elements[i]);
      }

      return () => {
        for (let i = 0; i < elements.length; i++) {
          observer.unobserve(elements[i]);
        }
      };
    } else {
      console.warn("IntersectionObserver is not supported in this browser.");
    }
  }, []);

  return (
    <div className="grid grid-cols-1 text-6xl font-bold pl-8 pr-8">
      <div className="animateScroll grid grid-cols-1 gap-x-10 lg:grid-cols-2 items-center h-screen relative">
        <div className="text-6xl relative">
          Unleash Your Creativity with <span className="text-blue-500">Seamless </span>Video Hosting
        </div>
        <img className="border-[16px] rounded border-blue-500 aspect-video" src={"img1.jpg"} alt="Video Hosting" />
      </div>
      <div className="animateScroll grid grid-cols-1 lg:grid-cols-2 items-center h-screen">
        <div className="text-6xl">
          Focus on <span className="text-green-500">Content</span>, Not Ads
        </div>
        <img className="border-[16px] rounded border-green-500 aspect-video" src={"img2.jpg"} alt="Content Focus" />
      </div>
      <div className="animateScroll grid grid-cols-1 lg:grid-cols-2 items-center h-screen">
        <div className="text-6xl">
          Build, Share, and <span className="text-amber-500">Grow</span> with Like-Minded Creators
        </div>
        <img className="border-[16px] rounded border-blue-500 aspect-video" src={"img3.jpg"} alt="Creators Community" />
      </div>
    </div>
  );
}
