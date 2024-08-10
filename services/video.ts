import axios from "axios";
import { accessTokenHeader } from "./user";
const base_url =  process.env.NEXT_PUBLIC_API_URL+"video/";

export const searchVideo = async (obj:string, page:number)=>{
    try{
        if(obj){
            const res = await axios.get(base_url+`get-searched-videos?query=${obj}&page=${page}&limit=5`, accessTokenHeader());
            return res.data;
        }
    }catch(err:any){
        if(err?.response?.status == 401){
            window.location.href = '/session';
        }
        throw new Error("error in searching video");
    }
}
export const publishVideo = async (obj:any)=>{
    try{
        if(obj){
            const res = await axios.post(base_url+"upload-video", obj, accessTokenHeader());
            return res.data;
        }
    }catch(err:any){
        if(err?.response?.status == 401){
            window.location.href = '/session';
        }
        throw new Error("error in publishing video");
    }
}
export const getVideoById = async (obj:any, from:any)=>{
    try{
        if(obj){
            const res = await axios.get(base_url+"get-video/"+obj+"?from="+from, accessTokenHeader());
            return res.data;
        }
    }catch(err:any){
        if(err?.response?.status == 401){
            window.location.href = '/session';
        }
        throw new Error("error in getting video");
    }
}
export const deleteVideoById = async (obj:any)=>{
    try{
        if(obj){
            const res = await axios.delete(base_url+"/delete-video/"+obj,accessTokenHeader());
            return res.data;
        }
    }catch(err:any){
        if(err?.response?.status == 401){
            window.location.href = '/session';
        }
        throw new Error("error in getting video");
    }
}
export const getVideoOfUser = async (obj:any, page:any)=>{
    try{
        if(obj){
            const res = await axios.get(base_url+"get-all-user-videos?userId="+obj+"&page="+page+"&limit=5", accessTokenHeader());
            return res.data;
        }
    }catch(err:any){
        if(err?.response?.status == 401){
            window.location.href = '/session';
        }
        throw new Error("error in getting users videos");
    }
}