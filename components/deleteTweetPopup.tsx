import { deleteTweetById } from '@/services/tweets';
import React, { useState } from 'react'

export default function DeleteTweetPopup({closePopup, open, setTweets, id }:{open:boolean, closePopup:any, setTweets:any, id:any}) {
    const [loading, setLoading] =useState(false);
    const deleteTweet = async  () => {
        try{
            setLoading(true);
            await deleteTweetById(id);
            setTweets((prev:any) => {
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
            <div className=' font-bold text-xl mb-4'>Are you sure you want to delete this tweet?</div>
            <button disabled={loading} className=' w-full  text-white p-2 rounded items-center bg-blue-500 hover:bg-blue-600 mb-4' onClick={() => deleteTweet()} >{!loading?"Confirm":"Deleting"}</button>
            <button disabled={loading} className=' w-full  text-white p-2 rounded items-center bg-blue-500 hover:bg-blue-600' onClick={() => closePopup()} >Cancel</button>
        </div>
    </div>
  )
}
