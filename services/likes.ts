import axios from "axios";
import { accessTokenHeader } from "./user";
const base_url =  process.env.NEXT_PUBLIC_API_URL+"like/";
export const likesVideo = async (obj:any)=>{
    try{
        if(obj){
            const res = await axios.post(base_url+"/toggle/video/"+obj,{}, accessTokenHeader());
            return res.data;
        }
    }catch(err:any){
        if(err?.response?.status == 401){
            window.location.href = '/session';
        }
        throw new Error("error in getting users videos");
    }
}