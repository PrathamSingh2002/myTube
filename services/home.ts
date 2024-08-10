import axios from "axios";
import { accessTokenHeader } from "./user";
const base_url =  process.env.NEXT_PUBLIC_API_URL+"home/";
export const getRecommendedVideos = async (page:any)=>{
    try{
        if(page){
            const res = await axios.get(base_url+"get-mostViewed-videos?page="+page, accessTokenHeader());
            return res.data;
        }
    }catch(err:any){
        if(err?.response?.status == 401){
            window.location.href = '/session';
        }
        throw new Error("error in getting users videos");
    }
}