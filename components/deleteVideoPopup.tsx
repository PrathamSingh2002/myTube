import { deleteVideoById } from '@/services/video';
import React, { useState } from 'react'

export default function DeleteVideoPopup({closePopup, open, setVideos, id, thumbnail }:{open:boolean, closePopup:any, setVideos:any, thumbnail:any, id:any}) {
    const [loading, setLoading] =useState(false);
    const deleteVideo = async  () => {
        try{
            setLoading(true);
            await deleteVideoById(id);
            setVideos((prev:any) => {
                return prev.filter((el:any) =>{
                    return el._id != id;
                })
            })
            closePopup();
        }catch(err){
            console.log(err);
        }finally{
            setLoading(false);
        }
        
    }
    return (
    open &&
    <div className=' z-10 fixed inset-0 flex justify-center items-center rounded-full'>
        <div className=' bg-white rounded w-80 p-4 '>
            <div className=' font-bold text-xl mb-4'>Are you sure you want to delete ?</div>
            <img className=' w-full h-20 mb-4 ' src={thumbnail}></img>
            <button disabled={loading} className=' w-full  text-white p-2 rounded items-center bg-blue-500 hover:bg-blue-600 mb-4' onClick={() => deleteVideo()} >{!loading?"Confirm":"Deleting"}</button>
            <button disabled={loading} className=' w-full  text-white p-2 rounded items-center bg-blue-500 hover:bg-blue-600' onClick={() => closePopup()} >Cancel</button>
        </div>
    </div>
  )
}
