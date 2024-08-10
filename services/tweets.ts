import axios from "axios";
import { accessTokenHeader } from "./user";
const base_url =  process.env.NEXT_PUBLIC_API_URL+"tweet/";
export const getUserTweetService = async (obj:any, page:any)=>{
    try{
        if(obj){
            const res = await axios.get(base_url+"/get-user-tweet/"+obj+"?page="+page+"&limit=5", accessTokenHeader());
            return res.data;
        }
    }catch(err:any){
        if(err?.response?.status == 401){
            window.location.href = '/session';
        }
        throw new Error("Error in getting user tweets");
    }
}
export const createNewTweet = async (tweet:any)=>{
    try{
        if(tweet){
            const res = await axios.post(base_url+"/create-tweet", {tweetData:tweet}, accessTokenHeader());
            return res.data;
        }
    }catch(err:any){
        if(err?.response?.status == 401){
            window.location.href = '/session';
        }
        throw new Error("Error in getting user tweets");
    }
}

export const deleteTweetById = async (tweet:any)=>{
    try{
        if(tweet){
            const res = await axios.delete(base_url+"/delete-tweet/"+tweet, accessTokenHeader());
            return res.data;
        }
    }catch(err:any){
        if(err?.response?.status == 401){
            window.location.href = '/session';
        }
        throw new Error("Error in getting user tweets");
    }
}
