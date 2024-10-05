import axios from "axios";
import { accessTokenHeader } from "./user";
const base_url =  process.env.NEXT_PUBLIC_API_URL+"comment/";
export const getCommentsService = async (obj:any, page:number)=>{
    try{
        if(obj){
            const res = await axios.get(base_url+"/video/"+obj+'?page='+page+"&limit=5");
            return res.data;
        }
    }catch(err:any){
        throw new Error("error in getting comments");
    }
};

export const addCommentService = async (obj:any, data:any)=>{
    try{
        if(obj){
            const res = await axios.post(base_url+"/video/"+obj, data, accessTokenHeader());
            return res.data;
        }
    }catch(err:any){
        throw new Error("error in adding comments");
    }
};