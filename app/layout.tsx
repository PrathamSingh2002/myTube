'use client'
import "./globals.css";
import Link from "next/link";
import { Provider, useDispatch, useSelector } from "react-redux";
import { store } from "./store/store";
import { FiSearch } from "react-icons/fi";
import { setVideoPage, setVideos, setRecommendedVideos, setSearchQuery } from "./store/videoSlice";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
const DropDown = dynamic(() => import('@/components/dropDown'), { ssr: false });
const VideoUploadDropDown = dynamic(() => import('@/components/videoUploadDropdown'), { ssr: false });
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  return (
    <html lang="en">
      <Provider store={store}>
        <NavBarAndPage children = {children}/>
      </Provider>
    </html>
  );
}
const NavBarAndPage = (props:any) =>{
  const user = useSelector((state:any) =>(state.user.userInfo));
  const [inputVideo, setInputVideo] = useState("");
  const router = useRouter();
  const dispatch = useDispatch();
  const searchQuery = useSelector((state:any) => state.video.searchQuery);
  
  return (
    <body >
      <nav>
        <div className="w-full">
          <div className="flex  flex-row pl-8 pr-8 mb-4 pt-2 pb-2 w-full justify-between items-center">
            <div className=" flex flex-row w-full items-centSubscribeder">
              <div className=" mr-4 text-blue-600 flex-row items-center justify-center">
                <Link href="/home" className=" text-2xl font-bold max-sm:hidden">HVideo</Link>
                <Link href="/home" className=" text-2xl font-bold sm:hidden">HV</Link>
              </div>
              <div className="flex flex-row w-full items-center justify-center" >
                  <Input disabled = {!user}  placeholder="search" className="rounded-full pr-8 h-8" onChange={(ev)=>{
                    setInputVideo(ev.target.value)
                  }}/>
                  <div className=" size-8  relative right-8 bg-accent  text-primary rounded-r-full transition-all duration-150 hover:bg-primary hover:text-secondary" onClick={() => {
                      if(inputVideo != searchQuery && inputVideo != ""){
                        dispatch(setVideos([]));
                        dispatch(setRecommendedVideos([]));
                        dispatch(setVideoPage(1));
                        dispatch(setSearchQuery(inputVideo));
                        router.replace('/home');
                      }
                      }}>
                    <FiSearch className="p-2  size-8 " />
                  </div>
              </div>
            </div>
            <div className=" flex flex-row items-center">
              <div className=" mr-4" >
                {user ? <VideoUploadDropDown/>:<Button size={'sm'} variant={'outline'} onClick={()=>router.push('login')}> Login</Button>}
              </div>
              <div className="">
                {user && <DropDown />}
              </div>
            </div>
          </div>
        </div>
      </nav>
      <main>
        {props.children}
      </main>
    </body>
  )
} 